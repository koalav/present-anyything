# WebView + Frida 동적 검증 데모 스크립트

## 목적

이 데모는 WebView 관련 정적 finding이 실제로 재현 가능한지 확인하는 예제 원고다. 구현 스크립트가 아니라 발표자가 데모 흐름을 설명하거나 승인된 테스트 환경에서 수동 재현할 때 참고할 수 있는 절차다.

전제:

- 대상 앱, 단말, 계정, 테스트 페이지가 모두 검증 승인 범위 안에 있어야 한다.
- production credential, 결제, 실사용 외부 서비스 호출은 하지 않는다.
- marker page는 통제 가능한 테스트 서버나 로컬 proxy를 사용한다.
- 목적은 공격 수행이 아니라 static hypothesis 검증이다.

## 시나리오

정적 분석에서 다음 후보가 발견됐다고 가정한다.

- `WebView.addJavascriptInterface(...)` 사용.
- `setJavaScriptEnabled(true)` 사용.
- `Intent` extra 또는 deep link parameter가 `loadUrl(...)`까지 도달.
- 해당 activity가 exported 또는 browsable entrypoint로 열릴 가능성이 있음.

발표 멘트:

이 케이스에서 정적 finding만 보고 바로 high severity라고 판단하면 과탐 가능성이 있습니다. 실제로 외부 입력이 해당 WebView까지 도달하는지, JavaScript가 켜져 있는지, bridge가 페이지에서 호출 가능한지 확인해야 합니다.

## 1. 정적 후보 확인

발표용 명령 예시:

```bash
rg --line-number "addJavascriptInterface|setJavaScriptEnabled|loadUrl|getStringExtra|getDataString" raw/source raw/decompile raw/apktool
rg --line-number "android.intent.action.VIEW|android.intent.category.BROWSABLE" raw/manifest_analysis raw/apktool
```

발표 멘트:

먼저 source와 manifest artifact에서 후보를 확인합니다. 이 단계는 API harness의 `rg`와 `read_file` 도구로 자동화할 수 있는 영역입니다. 중요한 것은 여기서 찾은 line이 evidence ledger에 남고, 이후 final report가 이 ledger를 참조한다는 점입니다.

## 2. ADB로 WebView entrypoint 실행

후보가 extra 기반 activity라면:

```bash
adb shell am force-stop <package.name>
adb shell setprop log.tag.WebView VERBOSE
adb shell setprop log.tag.WebViewClient VERBOSE
adb shell setprop log.tag.chromium VERBOSE

adb shell am start -W -n <package.name>/<.WebViewActivity> \
  --es <actual-extra-key> "https://marker.example.test/webview-probe.html"
```

후보가 deep link 기반이라면:

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://app.example.test/open?url=https%3A%2F%2Fmarker.example.test%2Fwebview-probe.html" \
  <package.name>
```

발표 멘트:

여기서 `<actual-extra-key>`는 예시값이 아닙니다. 정적 분석에서 `getStringExtra`, `Bundle.getString`, `getQueryParameter`로 확인한 실제 key를 써야 합니다. 잘못된 key로 테스트하면 false negative가 됩니다.

## 3. Frida로 WebView debugging 활성화

예시 Frida hook:

```javascript
Java.perform(function () {
  var WebView = Java.use("android.webkit.WebView");
  WebView.setWebContentsDebuggingEnabled(true);

  var loadUrlString = WebView.loadUrl.overload("java.lang.String");
  loadUrlString.implementation = function (url) {
    console.log("[WebView.loadUrl] " + url);
    return loadUrlString.call(this, url);
  };

  var evaluateJavascript = WebView.evaluateJavascript.overload(
    "java.lang.String",
    "android.webkit.ValueCallback"
  );
  evaluateJavascript.implementation = function (script, callback) {
    console.log("[WebView.evaluateJavascript] " + script);
    return evaluateJavascript.call(this, script, callback);
  };
});
```

실행 예시:

```bash
frida -U -f <package.name> -l enable-webview-debugging.js --no-pause
```

또는 이미 실행 중인 앱에 attach:

```bash
frida -U -n <package.name> -l enable-webview-debugging.js
```

발표 멘트:

Frida는 여기서 취약점을 악용하기 위한 도구가 아니라 관찰성을 높이는 도구입니다. WebView debugging을 강제로 켜고, `loadUrl`과 `evaluateJavascript` 호출을 로깅해서 marker URL이 실제 sink까지 도달했는지 확인합니다.

## 4. DevTools 연결 확인

Chrome inspect를 사용할 때:

```text
chrome://inspect/#devices
```

직접 endpoint를 볼 때:

```bash
adb shell cat /proc/net/unix | grep webview_devtools_remote
adb forward tcp:9222 localabstract:webview_devtools_remote_<pid>
curl http://127.0.0.1:9222/json/list
```

발표 멘트:

WebView debugging이 켜지면 DevTools에서 페이지 context를 확인할 수 있습니다. 여기서 console에 benign JavaScript를 넣어 실행 가능 여부를 확인하거나, 현재 URL과 DOM 상태를 확인합니다.

예를 들어 marker page가 `window.__APK_ANALYZER_MARKER__ = "ok"`를 갖고 있다면 console에서 해당 값이 읽히는지 확인합니다. bridge 검증은 marker page가 사전에 정의한 안전한 메서드 호출만 수행하고, 결과를 화면이나 console로 출력하게 합니다.

## 5. 검증할 관찰 포인트

검증 항목:

- `am start -W`가 성공했는가.
- logcat 또는 Frida log에 marker URL이 `loadUrl`로 찍히는가.
- DevTools에서 해당 WebView target이 보이는가.
- console에서 benign JavaScript가 실행되는가.
- marker page가 외부 주소 로드, redirect, bridge response를 관찰 가능한 형태로 보여주는가.
- JS bridge가 존재하더라도 공격자가 도달 가능한 content origin에서 호출 가능한가.

발표 멘트:

이 체크리스트를 통과하면 정적 후보의 confidence가 올라갑니다. 반대로 entrypoint가 내부 전용이거나, 외부 입력이 sanitize되어 marker URL이 도달하지 못하거나, JS가 꺼져 있으면 severity를 낮추거나 false positive로 분류할 수 있습니다.

## 6. Evidence 저장

저장할 증거:

```bash
adb logcat -d -v threadtime chromium:V WebView:V WebViewClient:V <package.name>:V *:S \
  > evidence/webview-logcat.txt

adb shell screencap -p > evidence/webview-screen.png

curl http://127.0.0.1:9222/json/list > evidence/webview-devtools-targets.json
```

Frida stdout도 별도 파일로 저장한다.

```bash
frida -U -n <package.name> -l enable-webview-debugging.js \
  | tee evidence/webview-frida.log
```

발표 멘트:

동적 검증 결과는 "제가 해보니 됐습니다"가 아니라 artifact로 남아야 합니다. logcat, screenshot, DevTools target list, Frida log, marker page 응답을 함께 저장하면 후속 리뷰에서 재현성을 판단할 수 있습니다.

## 7. 결과 분류

분류 예:

- `reproduced`: 외부 entrypoint에서 marker URL이 WebView까지 도달했고, JS 또는 bridge 동작이 관찰됨.
- `not reproduced`: 정적 후보는 있으나 외부 입력이 sink까지 도달하지 않거나 release build에서 비활성.
- `inconclusive`: entrypoint는 있으나 인증, 환경, device 제한 때문에 최종 sink 관찰 실패.
- `manual UI verification needed`: nested Bundle, 복잡한 로그인 플로우 등 ADB 단일 명령으로 재현 불가.
- `out of scope`: 승인 범위 밖의 화면, 계정, 결제, production endpoint가 필요함.

발표 멘트:

이 분류가 중요한 이유는 정적 finding을 무조건 취약점으로 승격하지 않기 위해서입니다. 동적 검증 harness는 LLM의 판단을 대체하는 것이 아니라, LLM이 제안한 hypothesis를 재현 가능한 evidence로 좁히는 장치입니다.

