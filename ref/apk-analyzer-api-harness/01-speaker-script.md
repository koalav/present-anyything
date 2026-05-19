# APK Analyzer API Harness 발표 스크립트

## 0. 발표 전제

이 발표는 "LLM으로 APK를 분석한다"가 아니라 "재현 가능한 APK 분석 파이프라인 위에 LLM 탐색 harness를 얹는다"는 이야기다. 핵심은 deterministic한 처리는 도구가 맡고, LLM은 제한된 탐색과 판단에 집중하게 만드는 것이다.

권장 시간은 15-20분이다. 각 페이지는 그대로 슬라이드 제목과 speaker note로 쓸 수 있다.

## 1. 제목

슬라이드 제목:

`Deterministic APK Analyzer + OpenAI-Compatible Code Analysis Harness`

발표 멘트:

오늘 소개할 내용은 APK Analyzer와 API harness 구조입니다. 일반적인 LLM 분석 도구처럼 프롬프트 하나로 결과를 생성하는 방식이 아니라, 정적 분석 파이프라인, 안전한 코드 탐색 도구, evidence ledger, strict output schema를 결합해서 재현성을 높이는 방식입니다.

뒤에서는 먼저 바람직한 harness 구조를 설명하고, 그 다음 현재 APK Analyzer가 어떤 분석과 리뷰 기능을 갖고 있는지, 마지막으로 finding별 동적 검증 harness를 어떻게 준비하고 있는지 설명하겠습니다.

## 2. 문제 정의

슬라이드 제목:

`왜 LLM 단독 분석으로는 부족한가`

발표 멘트:

APK 보안 분석에서는 "그럴듯한 설명"보다 "같은 입력에서 다시 확인 가능한 근거"가 중요합니다. LLM이 직접 파일을 훑고 판단하게만 두면 세 가지 문제가 생깁니다.

첫째, 경로나 라인 번호를 잘못 말할 수 있습니다. 둘째, Android permission이나 protected broadcast 같은 플랫폼 규칙을 일반화해서 false positive를 만들 수 있습니다. 셋째, 최종 JSON이나 XML이 schema를 벗어나면 후속 자동화가 깨집니다.

그래서 이 프로젝트의 방향은 LLM을 제거하는 것이 아니라, LLM이 움직일 수 있는 공간을 좁히는 것입니다. 도구가 파일 접근, 검색, reference lookup, 출력 검증을 통제하고 LLM은 그 안에서 탐색 계획과 판단을 수행합니다.

## 3. 바람직한 Harness 구조

슬라이드 제목:

`LLM Controller + Safe Tools + Evidence Ledger + Strict Schema`

발표 멘트:

바람직한 harness는 네 층으로 나눌 수 있습니다.

첫 번째는 LLM controller입니다. 사용자 prompt와 초기 context를 받고, 다음에 어떤 파일을 검색하거나 읽을지 결정합니다.

두 번째는 safe tool executor입니다. 모델에게 shell 전체를 주지 않고, `repo_map`, `rg`, `read_file`, `list_dir`, 제한된 `run_readonly_cmd` 같은 함수형 도구만 제공합니다.

세 번째는 evidence ledger입니다. 도구 실행 결과를 `toolRunId`, tool name, args, stdout preview, path, line range, truncation 여부와 함께 저장합니다.

네 번째는 strict final schema입니다. 최종 출력은 prompt로만 "JSON으로 답해"라고 요구하지 않고, provider 요청 단계에서 structured output schema를 넣고, 로컬 validation으로 다시 검증합니다.

## 4. 반복 구조

슬라이드 제목:

`탐색은 반복 호출로 돈다`

발표 멘트:

실행 흐름은 단일 호출이 아닙니다.

사용자 task와 context가 들어오면 harness가 첫 API 호출을 보냅니다. 이때 모델은 바로 최종 보고서를 만들 수도 있지만, 보통은 tool call을 반환합니다. 예를 들어 `rg`로 `addJavascriptInterface`를 찾거나, manifest의 exported component를 검색합니다.

harness는 그 tool call을 실제로 실행하고, 결과를 evidence ledger에 저장한 뒤, `function_call_output` 형태로 다음 모델 호출에 다시 넣습니다. 모델은 그 결과를 보고 `read_file`로 주변 라인을 읽거나, Android permission lookup을 요청할 수 있습니다.

이 과정을 `maxToolRounds` 안에서 반복하고, 더 이상 tool call이 없거나 충분한 evidence가 쌓이면 finalization 호출로 넘어갑니다. 최종 호출은 evidence ledger와 schema를 기준으로 strict JSON 하나를 생성합니다.

## 5. APK Analyzer 소개

슬라이드 제목:

`APK Analyzer: Android 보안 분석 파이프라인`

발표 멘트:

이제 이 harness가 얹히는 대상인 APK Analyzer를 보겠습니다.

APK Analyzer는 APK 업로드나 CLI 입력을 받아 fingerprint, feature extraction, decompile, manifest analysis, network security analysis, certificate analysis, Semgrep source scan, tracker analysis, SBOM inventory를 수행합니다.

결과는 XML report와 JSON read model로 저장되고, backend API와 frontend UI에서 job history, findings, artifacts, graph, follow-up 결과를 볼 수 있습니다.

즉 LLM 이전에 이미 deterministic한 분석 파이프라인이 있고, LLM은 이 산출물을 바탕으로 follow-up, report exploration, scenario review, autonomous security review를 수행합니다.

## 6. Deterministic 부분을 툴이 맡는다

슬라이드 제목:

`재현 가능한 사실은 Backend가 만든다`

발표 멘트:

이 프로젝트에서 중요한 원칙은 deterministic하게 계산 가능한 것은 LLM에게 맡기지 않는다는 것입니다.

예를 들어 manifest component inventory, exported flag, permission attribute, provider authority, deep link intent filter, network security config, signing certificate, Semgrep rule hit, source line evidence는 backend 분석 단계에서 먼저 추출합니다.

Autonomous Security Review에서도 `attack-surface.json`을 먼저 만들고, 후보를 `candidate-pool.json`에 누적합니다. 최종 LLM 응답이 바로 finding이 되는 것이 아니라, deterministic final merge와 final finding gate를 통과해야 최종 결과로 승격됩니다.

이 구조 덕분에 LLM이 누락하거나 과장해도 backend artifact와 validation이 안전장치 역할을 합니다.

## 7. API Harness 소개

슬라이드 제목:

`OpenAI-Compatible API Harness`

발표 멘트:

현재 LLM runtime은 provider-neutral하게 구성되어 있습니다. `codex exec` 경로는 유지하고, 기본 provider는 `api_harness`로 전환할 수 있습니다.

`api_harness`는 OpenAI Responses API 또는 OpenAI-compatible Chat Completions endpoint를 호출합니다. backend의 기존 LLM invocation runner와 맞추기 위해 CLI shim 형태로 동작합니다. 즉 기존 runner는 request JSON을 만들고, harness CLI가 그 request를 읽어서 tool loop와 finalization을 수행한 뒤 output JSON을 씁니다.

모델에게 제공되는 도구는 allowlist된 함수형 도구입니다. `rg`는 실제 ripgrep 호출입니다. `read_file`은 shell이 아니라 Python으로 line range를 제한해서 파일 일부만 읽습니다. `run_readonly_cmd`도 argv 배열과 profile allowlist가 맞을 때만 실행됩니다.

## 8. Strict Output Enforcement

슬라이드 제목:

`출력은 Prompt가 아니라 Schema로 강제한다`

발표 멘트:

이 harness에서 중요한 점은 final output을 prompt로만 통제하지 않는다는 것입니다.

finalization 호출에는 task별 JSON schema가 provider request에 들어갑니다. Responses API mode에서는 `text.format`의 `json_schema`를 사용하고, Chat Completions mode에서는 `response_format`의 `json_schema`를 사용합니다.

그리고 여기서 끝나지 않습니다. provider가 JSON을 반환한 뒤에도 backend가 같은 schema로 로컬 검증을 수행하고, evidence validator가 존재하지 않는 path, path escape, 잘못된 line range를 거부합니다.

따라서 "모델이 JSON처럼 보이는 문자열을 줬다"가 아니라 "API-level structured output과 local validation을 모두 통과했다"가 acceptance 기준입니다.

## 9. Android Reference로 신뢰도 높이기

슬라이드 제목:

`Permissions / Protected Broadcast Lookup`

발표 멘트:

Android 보안 분석에서 false positive가 많이 나오는 지점은 permission과 broadcast입니다.

예를 들어 exported receiver가 있다고 해도 그 action이 Android platform protected broadcast라면 일반 서드파티 앱이 임의로 보낼 수 없습니다. 반대로 exported service가 `normal` permission으로만 보호되어 있으면 사실상 외부 앱 접근을 막는 보호 장치로 보기 어렵습니다.

APK Analyzer는 `system_permissions.jsonl`과 `protected-broadcast.jsonl`을 backend data로 가지고 있고, harness tool에도 `android_permission_lookup`, `protected_broadcast_lookup`을 제공합니다.

이 reference lookup은 LLM의 기억에 의존하지 않고, 같은 입력에 대해 같은 판단 근거를 제공합니다. 그래서 report exploration과 ASR에서 위험도를 조정하거나 false positive를 걸러낼 때 신뢰도가 올라갑니다.

## 10. Finding Type별 Skill과 반복 검증

슬라이드 제목:

`정적 후보 -> Skill 기반 검증 -> False Positive 제거`

발표 멘트:

기본 flow는 정적 검색으로 취약점 후보를 찾고, finding type별 skill을 이용해 검증하는 방식입니다.

예를 들어 WebView finding이면 `android-webview-finding` skill이 어떤 source와 sink를 봐야 하는지 안내합니다. exported component면 component skill, deep link면 deeplink skill, provider나 path traversal이면 각각의 skill로 context가 달라집니다.

Skill은 임의 코드를 실행하는 플러그인이 아닙니다. Markdown 기반의 분석 지침과 reference 파일이고, 필요 도구를 제안할 수는 있지만 실제 도구 grant는 harness policy가 결정합니다.

이렇게 하면 LLM은 finding category에 맞는 체크리스트를 따라가고, harness는 여전히 path policy, tool allowlist, schema validation을 유지합니다.

## 11. 동적 검증 Harness 준비

슬라이드 제목:

`ADB / Ghidra / Frida / WebView Harness`

발표 멘트:

정적 분석만으로는 true positive와 false positive를 완전히 가르기 어렵습니다. 그래서 finding type별 dynamic validation harness를 준비하고 있습니다.

현재 repo에는 ADB 기반 dynamic validation skill들이 있습니다. component, deeplink, WebView, insecure transport, path traversal, PendingIntent, debug exposure 같은 영역별로 어떤 명령을 실행하고 어떤 evidence를 남겨야 하는지 정의되어 있습니다.

향후 방향은 이 skill들을 ADB, Ghidra, Frida, WebView DevTools 같은 실행 harness와 연결하는 것입니다. 예를 들어 source에서 WebView bridge 후보를 찾으면, 사전 정의된 WebView validation function이 marker URL을 로드하고, logcat과 screenshot, DevTools evidence를 모읍니다.

중요한 제한도 있습니다. 동적 검증은 반드시 승인된 대상 앱, 단말, 계정, 테스트 페이지에서만 실행합니다. destructive operation이나 production service 호출은 기본적으로 차단합니다.

## 12. WebView + Frida 예제

슬라이드 제목:

`예제: WebView Debugging을 켜고 실제 도달성을 확인`

발표 멘트:

한 가지 예를 들어보겠습니다.

정적 분석에서 `addJavascriptInterface`, `setJavaScriptEnabled(true)`, 외부 입력이 `loadUrl`로 들어가는 흐름이 발견됐다고 가정합니다. 이 경우 정적 finding만으로는 실제 취약점인지 알기 어렵습니다. 해당 WebView가 외부에서 도달 가능한지, 어떤 URL을 로드하는지, JavaScript 실행이나 bridge 호출이 실제로 되는지 확인해야 합니다.

동적 검증에서는 먼저 ADB로 후보 activity나 deep link를 marker URL로 실행합니다. 그 다음 Frida로 대상 프로세스에 attach해서 `WebView.setWebContentsDebuggingEnabled(true)`를 호출하거나, `loadUrl` / `evaluateJavascript` 호출을 hook 합니다.

WebView debugging이 활성화되면 `chrome://inspect`나 forwarded DevTools endpoint에서 해당 WebView를 볼 수 있습니다. 콘솔에서 benign JavaScript를 실행해 페이지 context가 제어 가능한지 확인하고, marker page가 외부 주소 로드나 JS bridge 응답을 보여주면 evidence로 저장합니다.

이 예제의 목적은 공격을 수행하는 것이 아니라 static hypothesis를 검증하는 것입니다. "외부 입력이 실제 WebView까지 도달한다", "JS가 실제 활성화되어 있다", "bridge 호출 결과가 관찰된다" 같은 사실을 evidence로 남기는 과정입니다.

## 13. Report Exploration과 Autonomous Review

슬라이드 제목:

`Report-Level Review`

발표 멘트:

APK Analyzer는 개별 finding follow-up만 하는 것이 아닙니다.

Report exploration은 생성된 XML report, 기존 follow-up 결과, bounded workspace evidence preview를 함께 보고 보고서 수준의 audit를 수행합니다. 여기서는 executive summary, priority candidate, caveat, coverage note를 만들 수 있습니다.

Autonomous Security Review는 더 구조화된 흐름입니다. attack surface를 deterministic하게 추출하고, candidate pool을 만들고, 반복 review를 거친 뒤 final synthesis를 candidate judge로 사용합니다. final merge는 backend가 수행합니다.

Scenario review는 여러 finding을 연결해서 공격 시나리오가 성립하는지 봅니다. 예를 들어 exported deep link가 WebView로 이어지고, 그 WebView가 bridge를 갖고 있고, debug exposure가 결합되면 단일 finding보다 위험한 chain이 될 수 있습니다.

## 14. 차별점 정리

슬라이드 제목:

`무엇이 다른가`

발표 멘트:

정리하면 APK Analyzer의 방향은 세 가지입니다.

첫째, deterministic fact는 toolchain이 만든다. manifest, permission, protected broadcast, source hit, evidence path는 LLM의 기억이 아니라 backend artifact에서 나온다.

둘째, LLM 탐색은 제한된 반복 구조로 돈다. 도구는 allowlist되고, 결과는 ledger에 남고, 최종 output은 strict schema와 local validation을 통과해야 한다.

셋째, finding은 정적 후보에서 끝나지 않는다. skill 기반 review, reference lookup, dynamic validation harness, report-level autonomous/scenario review를 거치며 false positive를 줄이고 실제 위험 우선순위를 정한다.

이 구조의 목표는 "LLM이 분석했다"가 아니라 "LLM이 참여한 분석을 다시 검증할 수 있다"입니다.

## 15. 마무리

슬라이드 제목:

`다음 단계`

발표 멘트:

현재는 API harness와 Codex provider를 모두 사용할 수 있고, Android reference lookup과 skill 기반 review가 연결되어 있습니다.

다음 단계는 finding type별 dynamic validation harness를 더 자동화하는 것입니다. ADB 기반 검증은 이미 skill과 command checklist가 있고, 여기에 Frida, Ghidra, WebView DevTools 같은 실행 harness를 연결하면 static 후보를 실제 재현 evidence로 좁히는 흐름이 강화됩니다.

결국 목표는 반복 가능한 APK 보안 분석입니다. 분석 파이프라인이 사실을 만들고, LLM은 그 사실 위에서 탐색과 요약을 수행하고, backend가 마지막 검증을 책임지는 구조입니다.

