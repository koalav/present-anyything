---
theme: default
title: Semgrep CE Local Rules for Android
info: |
  Semgrep Community Edition CLI와 로컬 룰만으로 Android 프로젝트를 점검하고,
  Semgrep 검출 결과를 AI 가이드로 이어가는 발표 자료.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
css: ../../styles.css
---

# Semgrep CE 로 Android 보안 점검

로컬 룰만으로 검출하고, AI 가이드로 triage와 수정까지 연결하는 운영 흐름을 정리합니다.

---

# 발표 구조

1. 범위와 전제: `Semgrep CE CLI` + 로컬 YAML 룰
2. 실제 사용 예제: CLI 명령, 샘플 소스, output 예시
3. Semgrep 검출 이후 AI 가이드: `PendingIntent` 점검 매뉴얼
4. 룰 예시 상세: 규칙별 목적, 핵심 패턴, 튜닝 포인트

---

# 범위와 전제

- 사용 범위: `Semgrep Community Edition CLI` + 직접 작성한 로컬 룰
- 제외 범위: `p/java`, `p/kotlin`, `p/default`, Registry, 외부 rule pack, AppSec Platform/Pro
- 기본 실행: `semgrep scan --metrics=off`
- 분석 대상: Java, Kotlin, 일부 Android 설정 파일
- 목적: Android 앱 리뷰에서 빠르게 후보를 추출하고 수동 리뷰 효율을 높이는 것

---

# 로컬 룰 운영 흐름

```mermaid
flowchart LR
  A[Android 소스] --> B[로컬 rules/android-local.yml]
  B --> C[semgrep scan --metrics=off]
  C --> D[텍스트 / JSON / SARIF]
  D --> E[보안 triage]
  E --> F[AI 가이드]
  F --> G[수정안 / 리뷰 코멘트 / 재검증]
```

- `semgrep ci` 대신 `semgrep scan` 중심으로 단순하게 운용
- 로컬 룰은 재현성과 라이선스 경계가 명확함
- AI는 검출 이후 설명, 위험도 산정, 수정안 정리에 사용

---

# 권장 디렉터리 구조

```text
android-project/
├── app/
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/example/LegacySecurity.java
│       └── kotlin/com/example/PendingIntentLab.kt
├── rules/
│   └── android-local.yml
└── .semgrepignore
```

```text
# .semgrepignore
**/build/
**/.gradle/
**/generated/
**/src/test/
**/src/androidTest/
**/*.png
**/*.jpg
**/*.apk
**/*.aab
```

---

# 실제 사용 명령

```bash
# 설치 확인
semgrep --version

# 전체 로컬 룰 스캔
semgrep scan --metrics=off --config rules/android-local.yml app/src/main

# PendingIntent 중심 빠른 확인
semgrep scan --metrics=off \
  --config rules/android-local.yml \
  app/src/main/kotlin/com/example/PendingIntentLab.kt

# JSON / SARIF 출력
semgrep scan --metrics=off --config rules/android-local.yml \
  --json --output semgrep-android.json app/src/main

semgrep scan --metrics=off --config rules/android-local.yml \
  --sarif --output semgrep-android.sarif app/src/main
```

---
class: text-sm
---

# 샘플 소스 1: PendingIntentLab.kt

```kotlin
package com.example

class PendingIntentLab : Activity() {
    fun build(context: Context) {
        val detailIntent = Intent("com.example.ACTION_VIEW_DETAIL")
        val detailPi = PendingIntent.getActivity(
            context, 100, detailIntent, PendingIntent.FLAG_UPDATE_CURRENT
        )

        val mutablePi = PendingIntent.getBroadcast(
            context, 101, Intent("com.example.ACTION_SYNC"),
            PendingIntent.FLAG_MUTABLE
        )

        val forwarded = intent
        startActivity(forwarded)
    }
}
```

- 기대 검출: `android-pendingintent-implicit`
- 기대 검출: `android-pendingintent-missing-immutable-flag`
- 기대 검출: `android-pendingintent-missing-oneshot`
- 기대 검출: `android-pendingintent-flag-mutable`, `android-insecure-intent-forwarding`

---
class: text-sm
---

# 샘플 소스 2: LegacySecurity.java

```java
package com.example;

class LegacySecurity {
    void run(Context context, File out, BroadcastReceiver receiver) throws Exception {
        pm.installPackage(packageUri, observer, 0, "com.example.app");
        MessageDigest.getInstance("SHA-1");
        Signature.getInstance("SHA1withRSA");
        out.setReadable(true, false);
        context.registerReceiver(receiver, new IntentFilter("com.example.SYNC"));
        context.registerReceiver(receiver,
                new IntentFilter("com.example.ADMIN"),
                "com.example.PRIVATE_PERMISSION",
                null);
    }
}
```

- 기대 검출: `android-dangerous-api-create-install-uninstall`
- 기대 검출: `java-android-weak-hash-md1-sha1`
- 기대 검출: `android-file-owneronly-false`
- 기대 검출: `android-registerreceiver-no-permission`
- 기대 검출: `android-registerreceiver-with-permission`

---
class: text-sm
---

# 예시 Output: 터미널

```text
$ semgrep scan --metrics=off --config rules/android-local.yml app/src/main

app/src/main/kotlin/com/example/PendingIntentLab.kt
  ❯❯❱ android-pendingintent-implicit
        암시적 PendingIntent입니다. setComponent() 또는 setPackage()로
        명시적 컴포넌트를 지정하고 FLAG_IMMUTABLE를 사용하십시오.
       6┆ val detailPi = PendingIntent.getActivity(

  ❯❯❱ android-pendingintent-missing-immutable-flag
       6┆ val detailPi = PendingIntent.getActivity(

  ❯❯❱ android-pendingintent-missing-oneshot
       6┆ val detailPi = PendingIntent.getActivity(

  ❯❯❱ android-pendingintent-flag-mutable
      10┆ val mutablePi = PendingIntent.getBroadcast(

  ❯❯❱ android-insecure-intent-forwarding
      15┆ startActivity(forwarded)

app/src/main/java/com/example/LegacySecurity.java
  ❯❯❱ android-dangerous-api-create-install-uninstall
       5┆ pm.installPackage(packageUri, observer, 0, "com.example.app");

  ❯❯❱ java-android-weak-hash-md1-sha1
       6┆ MessageDigest.getInstance("SHA-1");
```

---
class: text-sm
---

# 예시 Output: JSON / SARIF

```json
{
  "check_id": "android-pendingintent-implicit",
  "path": "app/src/main/kotlin/com/example/PendingIntentLab.kt",
  "start": { "line": 6, "col": 24 },
  "end": { "line": 8, "col": 10 },
  "extra": {
    "severity": "ERROR",
    "message": "암시적 PendingIntent입니다. setComponent() 또는 setPackage()로 명시적 컴포넌트를 지정하고 FLAG_IMMUTABLE를 사용하십시오."
  }
}
```

```text
SARIF 활용 포인트
- Code Scanning 업로드
- CI diff 비교
- 결과 archive 보관
- AI 입력 컨텍스트로 check_id / path / line / snippet 전달
```

---
class: text-sm
---

# Semgrep 검출 이후 AI 입력 예시

```text
다음 Semgrep finding을 Android 보안 코드리뷰 관점에서 분석해줘.

- check_id: android-pendingintent-implicit
- file: app/src/main/kotlin/com/example/PendingIntentLab.kt:6
- code:
  val detailIntent = Intent("com.example.ACTION_VIEW_DETAIL")
  val detailPi = PendingIntent.getActivity(
      context, 100, detailIntent, PendingIntent.FLAG_UPDATE_CURRENT
  )

요구사항:
1. 위험도 상/중/하
2. exploit 전제조건
3. Android 12+ 호환성 이슈
4. 바로 적용 가능한 수정 코드
5. 코드리뷰 코멘트 3줄
```

- AI는 finding 설명기 + fix 초안 생성기로 쓰는 것이 안정적
- 원본 finding, 코드 조각, API 레벨, 앱 컨텍스트를 같이 줘야 품질이 올라감

---
class: text-sm
---

# AI 가이드 예시: 문제 정의

## Android **PendingIntent** 보안 점검 매뉴얼
_(Implicit PendingIntent Hijacking & Replay Attack 대응)_

| 탐지 규칙 ID | 설명 | 위험 |
|--------------|------|------|
| `android-pendingintent-implicit` | 암시적 `PendingIntent` + `FLAG_IMMUTABLE` 부재 | 컴포넌트 하이재킹·브로드캐스트 스푸핑 |
| `android-pendingintent-missing-oneshot` | `FLAG_ONE_SHOT` 미사용 | 재사용(Replay) 공격 |

- Android 12(API 31)+ 에서는 `FLAG_IMMUTABLE` 또는 `FLAG_MUTABLE` 지정이 필수
- 암시적 `PendingIntent` 는 외부 앱이 가로채기 쉬워 민감 액션에서 특히 위험

---
class: text-sm
---

# AI 가이드 예시: 위험 평가 체크리스트

| # | 확인 항목 | 영향 |
|---|-----------|------|
| ① | `setComponent()` / `setPackage()` 호출 여부 | 미호출 시 암시적 인텐트 |
| ② | `FLAG_IMMUTABLE` 지정 여부 | 미지정 시 `send()` 시점 조작 위험 |
| ③ | `FLAG_ONE_SHOT` 필요성 | 토큰·결제·승인 흐름 재사용 여부 |
| ④ | `requestCode` 고유값 | 동일 `PendingIntent` 덮어쓰기 방지 |
| ⑤ | 백그라운드 브로드캐스트 여부 | mutable + implicit 이면 DoS·권한 상승 가능 |
| ⑥ | 대상 API 레벨 | API 31+ 는 mutability 필수 |

```text
위험도 예시
- 높음: implicit + mutable + 민감 액션
- 중간: explicit 또는 immutable 이지만 one-shot 없음
- 낮음: explicit + immutable + one-shot
```

---
class: text-sm
---

# AI 가이드 예시: 권장 가이드라인

| 항목 | 권장 값 |
|------|---------|
| 명시적 인텐트 | `setComponent()` 또는 `setPackage()` |
| 불변성 | `PendingIntent.FLAG_IMMUTABLE` |
| 단일 사용 | 중요 작업은 `FLAG_ONE_SHOT` 추가 |
| 플래그 조합 | `FLAG_IMMUTABLE | FLAG_UPDATE_CURRENT | FLAG_ONE_SHOT` |
| requestCode | 사용자/알람/트랜잭션 ID 기반 고유값 |
| CI 정책 | `ERROR` 는 fail, `WARNING` 은 triage queue |

- 핵심은 `explicit + immutable + oneshot` 기본값화
- mutable 가 정말 필요한 경우만 narrow scope 로 허용

---
class: text-sm
---

# AI 가이드 예시: 코드 개선

```kotlin
// [❌] 암시적 + 재사용
val intent = Intent("com.example.ACTION_VIEW_DETAIL")
val pi = PendingIntent.getActivity(
    context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT
)

// [✅] 명시적 + immutable + oneshot
val intent = Intent(context, DetailActivity::class.java).apply {
    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
}
val pi = PendingIntent.getActivity(
    context, 123, intent,
    PendingIntent.FLAG_IMMUTABLE or
    PendingIntent.FLAG_UPDATE_CURRENT or
    PendingIntent.FLAG_ONE_SHOT
)
```

```java
Intent intent = new Intent("com.example.ACTION_SYNC");
intent.setComponent(new ComponentName(context, SyncReceiver.class));
```

---

# AI 가이드 예시: 실전 검토 절차

```text
1) PendingIntent.get*() 호출부 전체 검색
2) Intent에 setComponent / setPackage 호출 여부 확인
3) FLAG_IMMUTABLE 포함 여부 확인
4) 민감 작업이면 FLAG_ONE_SHOT 필요성 평가
5) requestCode 충돌 여부와 FLAG 조합 확인
6) 위험도 기록 후 수정안과 리뷰 코멘트 작성
```

```text
AI 답변 기대값
- 위험도
- exploit 시나리오
- 수정 코드
- 추가 수동 검토 항목
- 코드리뷰용 한 줄 요약
```

---

# 로컬 룰팩 구성 맵

- Package 관리: `android-dangerous-api-create-install-uninstall`
- Crypto: `java-android-weak-hash-md1-sha1`
- File 권한: `android-file-owneronly-false`
- PendingIntent: `flag-mutable`, `implicit`, `missing-oneshot`, `missing-immutable-flag`, `implicit-intent`
- Intent 전달: `android-insecure-intent-forwarding`
- Broadcast: `android-registerreceiver-no-permission`, `android-registerreceiver-with-permission`

---
class: text-sm
---

# Rule 01: Dangerous API install / uninstall

```yaml
- id: android-dangerous-api-create-install-uninstall
  severity: ERROR
  languages: [java]
  pattern-either:
    - pattern: $OBJ.installPackage(...)
    - pattern: $OBJ.uninstallPackage(...)
```

- 목적: 앱 설치/삭제 API 호출을 빠르게 수집
- 위험: 설치 체인 변조, 강제 삭제, MDM/DO 오용
- 봐야 할 것: 시스템 앱 여부, Device Owner, enterprise updater 컨텍스트
- 튜닝: 사내 설치 wrapper 나 허용 패키지명을 allowlist 처리

---
class: text-sm
---

# Rule 02: Weak hash / signature

```yaml
- id: java-android-weak-hash-md1-sha1
  severity: ERROR
  pattern-either:
    - pattern: MessageDigest.getInstance("SHA-1")
    - pattern: Mac.getInstance("HmacSHA1")
    - pattern: Signature.getInstance("SHA1withRSA")
```

- 목적: 구식 해시와 전자서명 알고리즘 사용 후보 탐지
- 위험: 충돌 공격, 무결성 검증 약화, 서명 신뢰도 저하
- 대체: `SHA-256`, `SHA-384`, `SHA-512`, 최신 HMAC / Signature 조합
- 튜닝: 테스트 코드와 레거시 호환 계층은 별도 분리

---
class: text-sm
---

# Rule 03: Insecure file permissions

```yaml
- id: android-file-owneronly-false
  severity: WARNING
  pattern-either:
    - pattern: $OBJ.setWritable($_, false)
    - pattern: $OBJ.setReadable($_, false)
    - pattern: $OBJ.setExecutable($_, false)
```

- 목적: ownerOnly=`false` 로 권한이 과하게 열리는 호출 탐지
- 위험: 다른 앱/사용자에게 파일 접근 노출
- 확인 포인트: 앱 sandbox 밖 공유 파일인지, world-readable 파일인지
- 수정 기본값: ownerOnly=`true`, 가능하면 `Context.MODE_PRIVATE` 계열 사용

---
class: text-sm
---

# Rule 04: Mutable PendingIntent

```yaml
- id: android-pendingintent-flag-mutable
  severity: ERROR
  patterns:
    - pattern-either:
        - pattern: PendingIntent.get$METHOD(..., PendingIntent.FLAG_MUTABLE)
        - pattern: PendingIntent.get$METHOD(..., $FLAGS)
    - metavariable-regex:
        metavariable: $FLAGS
        regex: ((?i).*FLAG_MUTABLE.*)
```

- 목적: `FLAG_MUTABLE` 사용 지점을 강하게 수집
- 위험: `fillInIntent()` 또는 `send()` 시점 인텐트 조작
- 예외: inline reply, bubbles 처럼 mutable 이 실제로 필요한 경우
- 튜닝: 허용된 use case 는 wrapper 함수로 감싸고 rule 에서 제외

---
class: text-sm
---

# Rule 05: Implicit PendingIntent

```yaml
- id: android-pendingintent-implicit
  severity: ERROR
  patterns:
    - pattern: PendingIntent.get$METHOD($CTX, $REQ, $INTENT, $FLAGS)
    - pattern-not-inside: $INTENT.setComponent(...)
    - pattern-not-inside: $INTENT.setPackage(...)
    - pattern-not: PendingIntent.get$METHOD(..., PendingIntent.FLAG_IMMUTABLE)
```

- 목적: 암시적 인텐트를 그대로 래핑한 `PendingIntent` 탐지
- 위험: hijacking, broadcast spoofing, 민감 액션 가로채기
- 한계: helper 함수 안에서 explicit 화되면 놓칠 수 있음
- 보완: `implicit-intent` taint 룰과 함께 사용

---
class: text-sm
---

# Rule 06: Missing FLAG_ONE_SHOT

```yaml
- id: android-pendingintent-missing-oneshot
  severity: WARNING
  patterns:
    - pattern: PendingIntent.get$METHOD($CTX, $REQ, $INTENT, $FLAGS)
    - pattern-not: PendingIntent.get$METHOD(..., $FLAGS | PendingIntent.FLAG_ONE_SHOT)
```

- 목적: 재사용이 민감한 흐름에서 one-shot 누락 후보 탐지
- 위험: replay attack, 토큰/승인/결제 재사용
- 모든 `PendingIntent` 에 무조건 one-shot 이 필요한 것은 아님
- triage 기준: 민감 액션인지, 같은 이벤트 재전송이 허용되는지

---
class: text-sm
---

# Rule 07: Insecure intent forwarding

```yaml
- id: android-insecure-intent-forwarding
  mode: taint
  pattern-sources:
    - pattern: $INTENT = getIntent()
    - pattern: getIntent()
  pattern-sinks:
    - pattern: startActivity($INTENT)
    - pattern: startService($INTENT)
    - pattern: sendBroadcast($INTENT)
```

- 목적: 받은 `Intent` 를 검증 없이 다른 컴포넌트로 전달하는 흐름 탐지
- 위험: intent redirection, extra/flag 오염, privilege confusion
- sanitizer: `setClass`, `setComponent`, `removeExtra`
- 한계: cross-method / cross-file 전달은 CE 단독으로 놓칠 수 있음

---
class: text-sm
---

# Rule 08: Implicit intent wrapped as PendingIntent

```yaml
- id: android-pendingintent-implicit-intent
  mode: taint
  pattern-sources:
    - pattern: $INTENT = new Intent()
    - pattern: $INTENT = new Intent($ACTION)
  pattern-sinks:
    - pattern: PendingIntent.getActivity($CTX, $REQ, $INTENT, $FLAGS)
    - pattern: PendingIntent.getBroadcast($CTX, $REQ, $INTENT, $FLAGS)
```

- 목적: 암시적 인텐트 생성부터 `PendingIntent` 래핑까지의 흐름 추적
- 위험: fill-in overwrite, 외부 앱에 의한 임의 컴포넌트 실행
- sanitizer: `setClass`, `setComponent`, `setClassName`, `setPackage`
- `android-pendingintent-implicit` 보다 흐름형으로 보강하는 룰

---
class: text-sm
---

# Rule 09: Missing immutable / mutable flag

```yaml
- id: android-pendingintent-missing-immutable-flag
  severity: WARNING
  pattern-either:
    - pattern: PendingIntent.$METH($C, $RC, $INT, 0)
    - pattern: PendingIntent.$METH($C, $RC, $INT, PendingIntent.FLAG_UPDATE_CURRENT)
    - pattern: PendingIntent.$METH($C, $RC, $INT, PendingIntent.FLAG_ONE_SHOT)
```

- 목적: Android 12+ 에서 mutability flag 누락 호출 탐지
- 위험: API 31+ 크래시, 개발자 의도 불명확, 취약 설정 유입
- 이 룰은 보안 + 호환성 둘 다 다룸
- 수정 기본값: 특별한 이유 없으면 `FLAG_IMMUTABLE`

---
class: text-sm
---

# Rule 10: registerReceiver without permission

```yaml
- id: android-registerreceiver-no-permission
  severity: ERROR
  pattern-either:
    - pattern: $CTX.registerReceiver($REC, $FILTER)
    - pattern: $CTX.registerReceiver($REC, $FILTER, null, $HANDLER)
    - pattern: ContextCompat.registerReceiver($CTX, $REC, $FILTER, $FLAGS)
```

- 목적: broadcast permission 없이 receiver 를 등록하는 경우 탐지
- 위험: 외부 앱이 브로드캐스트를 전송하거나 수신 흐름을 오염
- 확인 포인트: exported receiver 인지, 중요 동작 수행 여부
- 수정: 고유 permission 지정, exported 범위 축소, intent action 축소

---
class: text-sm
---

# Rule 11: registerReceiver with permission

```yaml
- id: android-registerreceiver-with-permission
  severity: WARNING
  patterns:
    - pattern-either:
        - pattern: $CTX.registerReceiver($REC, $FILTER, $PERM, $HANDLER)
        - pattern: ContextCompat.registerReceiver($CTX, $REC, $FILTER, $PERM, $HANDLER, $FLAGS)
```

- 목적: permission 을 지정한 receiver 등록 지점을 audit 대상으로 수집
- 성격: 취약점 확정 룰이 아니라 review rule
- 확인 포인트: custom permission 존재 여부, `protectionLevel`, 서명 기반 제어 여부
- 운영: `WARNING` 으로 두고 설계 검토 대상으로 사용

---

# 룰 운영 시 주의점

- `android-pendingintent-implicit` 와 `android-pendingintent-implicit-intent` 는 일부 중복될 수 있음
- `missing-oneshot`, `with-permission` 류는 설계 검토용 `WARNING` 으로 운용하는 편이 안전
- CE taint 는 같은 함수, 같은 파일 흐름에서 가장 잘 동작함
- helper wrapper, DI, builder 패턴이 많으면 sanitizer 와 allowlist 를 추가해야 함
- 룰 도입 순서는 `후보 추출 -> 오탐 제거 -> annotation test 추가` 가 가장 안정적

---

# Takeaways

- Semgrep CE + 로컬 룰만으로도 Android 리뷰에서 충분히 강한 후보 추출이 가능
- 실제 운영은 `scan -> output -> triage -> AI guide -> fix` 흐름으로 잡는 편이 실용적
- PendingIntent 는 `explicit + immutable + oneshot` 기준으로 보면 대부분의 실수를 빠르게 정리할 수 있음
- 로컬 룰은 프로젝트 컨벤션에 맞게 계속 튜닝해야 가치가 커진다
