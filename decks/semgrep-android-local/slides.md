---
theme: default
title: Semgrep CE Local Rules for Android
info: |
  Semgrep CE CLI와 로컬 룰 2개만으로 Android 보안 후보를 찾고,
  false positive를 AI로 어떻게 줄일지 설명하는 발표 자료입니다.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Semgrep CE로 Android 보안 점검

로컬 룰 2개로 후보를 검출하고, false positive triage를 AI로 보강하는 운영 흐름을 정리합니다.

---

# 이번 발표의 범위

- 사용 범위: `Semgrep Community Edition CLI` + 직접 작성한 로컬 룰
- 제외 범위: Registry, 외부 rule pack, AppSec Platform/Pro, `p/java`, `p/kotlin`, `p/default`
- 이번 발표에서는 룰 `2개`만 다룹니다.
- 각 묶음은 같은 순서로 설명합니다.

```text
문제 설명
→ 위험한 sample 코드
→ Semgrep rule 설명
→ 검출 방식 / output
→ false positive sample
→ AI triage 방법
```

---

# 로컬 실행 구조

```text
android-project/
├── app/src/main/kotlin/com/example/PendingIntentLab.kt
├── app/src/main/java/com/example/LegacyCrypto.java
└── rules/android-local.yml
```

```bash
semgrep scan --metrics=off \
  --config rules/android-local.yml \
  app/src/main
```

- 발표용 룰 파일에는 룰 `2개`만 둡니다.
- 목적은 "정답 탐지기"가 아니라, 후보를 빠르게 추출하고 triage 시간을 줄이는 데 있습니다.

---

# Sample 1: 무엇을 점검하나

## `android-pendingintent-implicit`

- 명시적 `Intent`는 `Intent(context, DetailActivity::class.java)` 또는 `setComponent()` / `setPackage()`로 대상 컴포넌트가 고정됩니다.
- 암시적 `Intent`는 action, data, category만으로 대상을 런타임에 찾습니다.
- `PendingIntent`는 다른 시점이나 다른 프로세스에서 실행될 수 있어, 대상이 불분명하면 리뷰와 통제가 어려워집니다.

```kotlin
// 위험한 예: action만 있고 대상이 고정되지 않음
val riskyIntent = Intent("com.example.ACTION_VIEW_DETAIL")
val riskyPi = PendingIntent.getActivity(
    context, 4412, riskyIntent, PendingIntent.FLAG_UPDATE_CURRENT
)

// 비교적 안전한 예: same-app explicit component + immutable
val safeIntent = Intent(context, DetailActivity::class.java).apply {
    setPackage(context.packageName)
}
val safePi = PendingIntent.getActivity(
    context, 4412, safeIntent,
    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
)
```

- 위험도가 높은 경우:
  - 승인, 결제, 주문 상세, deep link 재진입처럼 민감한 흐름을 암시적 `PendingIntent`로 위임하는 경우
  - exported component가 있을 수 있는 action을 broad하게 열어두는 경우
- 비교적 안전한 경우:
  - same-app explicit component + `FLAG_IMMUTABLE` + 목적이 분명한 requestCode를 함께 쓰는 경우
  - 호출부만 봐도 "어디로 가는지"와 "어떻게 바뀔 수 없는지"가 드러나는 경우

```text
핵심 질문
- 이 PendingIntent는 명시적 대상인가?
- 외부 앱이 가로챌 여지가 있는가?
- 이 호출부만 보면 안전성을 확신할 수 있는가?
```

---
class: text-sm
---

# Sample 1: 위험한 sample 코드

```kotlin
package com.example

class PendingIntentLab {
    fun build(context: Context): PendingIntent {
        val detailIntent = Intent("com.example.ACTION_VIEW_DETAIL").apply {
            putExtra("orderId", "ord-4412")
        }

        return PendingIntent.getActivity(
            context,
            4412,
            detailIntent,
            PendingIntent.FLAG_UPDATE_CURRENT
        )
    }
}
```

- action string만 있고 대상 `Activity`가 명시되지 않았습니다.
- 보안 리뷰 관점에서는 "어느 component로 가는지"가 코드에서 즉시 드러나지 않습니다.
- 주문 상세, 승인, 결제 같은 민감 flow에서는 더 보수적으로 봐야 합니다.

---
class: text-sm
---

# Sample 1: Semgrep rule

```yaml
rules:
  - id: android-pendingintent-implicit
    languages: [java, kotlin]
    severity: ERROR
    message: >
      암시적 Intent를 PendingIntent로 래핑하고 있습니다.
      setComponent() 또는 setPackage()로 명시적 대상을 지정하십시오.
    patterns:
      - pattern: PendingIntent.get$METHOD($CTX, $REQ, $INTENT, $FLAGS)
      - pattern-not-inside: $INTENT.setComponent(...)
      - pattern-not-inside: $INTENT.setPackage(...)
```

- `pattern`: `PendingIntent.getActivity/getBroadcast/getService` 호출을 수집합니다.
- `pattern-not-inside`: 같은 함수 안에서 `setComponent`, `setPackage`가 보이면 제외합니다.
- 이 규칙은 "명시적 대상을 만들었는가"를 보는 구조 기반 룰입니다.

---
class: text-sm
---

# Sample 1: Semgrep이 어떻게 검출하나

```text
탐지 순서
1. PendingIntent.getActivity/getBroadcast/getService 호출을 찾는다.
2. 같은 함수 안에 setComponent() / setPackage()가 있는지 본다.
3. 없으면 "대상이 코드에 드러나지 않는 PendingIntent 후보"로 표시한다.
```

```kotlin
val detailIntent = Intent("com.example.ACTION_VIEW_DETAIL")   // 대상 미고정
return PendingIntent.getActivity(
    context, 4412, detailIntent, PendingIntent.FLAG_UPDATE_CURRENT
)                                                          // 탐지 지점
```

- 이 룰은 "Intent가 어디서 왔는가"보다 "대상이 코드에 명시되어 있는가"를 봅니다.
- 헬퍼 함수 안에서 explicit intent로 바뀌면 호출부만 보고는 오탐이 날 수 있습니다.

---
class: text-sm
---

# Sample 1: Semgrep output

```text
$ semgrep scan --metrics=off \
    --config rules/android-local.yml \
    app/src/main/kotlin/com/example/PendingIntentLab.kt


┌────────────────┐
│ 1 Code Finding │
└────────────────┘

    app/src/main/kotlin/com/example/PendingIntentLab.kt
   ❯❯❱ android-pendingintent-implicit
          암시적 Intent를 PendingIntent로 래핑하고 있습니다.
          setComponent() 또는 setPackage()로 명시적 대상을 지정하십시오.

          9┆ return PendingIntent.getActivity(
```

- 여기서는 분석자가 "실제 대상 component", "민감 action 여부", "명시적 intent로 바꿀 수 있는지"를 바로 확인하면 됩니다.

---
class: text-sm
---

# Sample 1: 오탐 사례

```kotlin
object SecureIntents {
    fun orderDetail(context: Context, orderId: String): Intent =
        Intent(context, DetailActivity::class.java).apply {
            setPackage(context.packageName)
            putExtra("orderId", orderId)
        }
}

class SafeNotificationBuilder {
    fun build(context: Context): PendingIntent {
        val explicitIntent = SecureIntents.orderDetail(context, "ord-4412")
        return PendingIntent.getActivity(
            context,
            4412,
            explicitIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
    }
}
```

- 이 호출부만 보면 `setComponent()` / `setPackage()`가 보이지 않아 룰이 잡을 수 있습니다.
- 하지만 실제로는 헬퍼 함수 내부에서 same-app explicit intent를 만들고 있어 false positive일 수 있습니다.

---
class: text-sm
---

# Sample 1: AI triage 포인트

```text
1. explicitIntent를 만드는 헬퍼 함수 구현을 확인한다.
2. 반환된 Intent가 explicit constructor / setPackage를 쓰는지 확인한다.
3. 반환 뒤에 다시 action-only intent로 덮어쓰지 않는지 확인한다.
4. 실제로 안전하면 "rule false positive"로 분류한다.
5. 반복 패턴이면 sanitizer/wrapper allowlist 후보로 기록한다.
```

---

# Sample 2: 무엇을 점검하나

## `java-android-weak-hash-md1-sha1`

- 점검 대상: `SHA-1`, `MD1`, `HmacSHA1`, `SHA1withRSA` 같은 구식 알고리즘 사용
- 문제 상황: 무결성 검증, 서명 검증, 토큰 서명, 업데이트 검증에 그대로 사용
- 왜 위험한가:
  - 충돌 공격 관점에서 현대 기준에 맞지 않음
  - "레거시라서 그대로" 남아 있는 경우가 많음
  - 보안 결정에 쓰이면 영향이 커짐

```text
핵심 질문
- 이 해시는 보안 의사결정에 쓰이는가?
- 단순 표시/호환용인가, 검증용인가?
- SHA-256 이상으로 바꿀 수 있는가?
```

---
class: text-sm
---

# Sample 2: 위험한 sample 코드

```java
package com.example;

import java.security.MessageDigest;
import java.security.Signature;
import java.util.Arrays;

class LegacyCrypto {
    boolean verifyManifest(byte[] manifest, byte[] expectedDigest) throws Exception {
        byte[] actual = MessageDigest.getInstance("SHA-1").digest(manifest);
        return Arrays.equals(actual, expectedDigest);
    }

    Signature newSigner() throws Exception {
        return Signature.getInstance("SHA1withRSA");
    }
}
```

- `verifyManifest()`에서는 SHA-1 결과를 실제 비교 판단에 사용합니다.
- `newSigner()`는 오래된 서명 알고리즘을 그대로 사용합니다.
- 이런 코드는 "레거시 때문에 유지"되는 경우가 많아, 우선 수집이 중요합니다.

---
class: text-sm
---

# Sample 2: Semgrep rule

```yaml
rules:
  - id: java-android-weak-hash-md1-sha1
    languages: [java]
    severity: ERROR
    message: >
      MD1·SHA-1 계열의 약한 해시 또는 서명 알고리즘 사용입니다.
      SHA-256 이상 또는 최신 권장 알고리즘으로 교체하십시오.
    pattern-either:
      - pattern: MessageDigest.getInstance("MD1")
      - pattern: MessageDigest.getInstance("SHA1")
      - pattern: MessageDigest.getInstance("SHA-1")
      - pattern: Mac.getInstance("HmacSHA1")
      - pattern: Signature.getInstance("SHA1withRSA")
      - pattern: Signature.getInstance("SHA1withDSA")
      - pattern: Signature.getInstance("SHA1withECDSA")
```

- `pattern-either`: 해시, HMAC, 전자서명 초기화 지점을 넓게 수집합니다.
- 장점: 단순하고 빠르게 찾을 수 있습니다.
- 한계: "보안 검증"에 쓰는지, "표시/호환용"인지는 구분하지 못합니다.
- 그래서 이 룰은 AI triage와 특히 궁합이 좋습니다.

---
class: text-sm
---

# Sample 2: Semgrep output

```text
$ semgrep scan --metrics=off \
    --config rules/android-local.yml \
    app/src/main/java/com/example/LegacyCrypto.java


┌────────────────┐
│ 2 Code Findings │
└────────────────┘

    app/src/main/java/com/example/LegacyCrypto.java
   ❯❯❱ java-android-weak-hash-md1-sha1
          MD1·SHA-1 계열의 약한 해시 또는 서명 알고리즘 사용입니다.
          SHA-256 이상 또는 최신 권장 알고리즘으로 교체하십시오.

          8┆ byte[] actual = MessageDigest.getInstance("SHA-1").digest(manifest);

   ❯❯❱ java-android-weak-hash-md1-sha1
         13┆ return Signature.getInstance("SHA1withRSA");
```

- 분석자는 "이 값이 실제 보안 판단에 쓰이는가"를 먼저 봐야 합니다.
- 이 구분을 사람이 직접 하거나 AI에게 맡기면 triage 속도를 높일 수 있습니다.

---
class: text-sm
---

# Sample 2: 오탐 사례와 AI triage

```java
package com.example;

import java.security.MessageDigest;
import java.security.cert.X509Certificate;

class CertificateScreen {
    String legacyFingerprint(X509Certificate cert) throws Exception {
        byte[] fp = MessageDigest.getInstance("SHA-1").digest(cert.getEncoded());
        return Hex.encode(fp);
    }
}
```

- 이 코드는 SHA-1을 쓰지만, 예를 들어 "기존 운영 문서와 맞춰 보기 위한 표시용 fingerprint"라면 보안 의사결정일 수도, 아닐 수도 있습니다.
- Semgrep은 사용 목적을 알 수 없기 때문에 우선 후보로 잡는 편이 맞습니다.

```text
AI triage 포인트
1. 해시 결과가 if/allow/deny/verify로 이어지는지 본다.
2. 결과가 UI 표시, 로그, 마이그레이션 보고서로만 가는지 확인한다.
3. trust decision이 아니라면 low priority 또는 compatibility note로 내린다.
4. trust decision이면 true positive로 분류하고 SHA-256 이상 대체 코드를 제안한다.
```

---
class: text-sm
---

# AI 입력 템플릿

```text
다음 Semgrep finding이 실제 취약점인지, false positive인지 Android 코드리뷰 관점에서 판별해줘.

- check_id: android-pendingintent-implicit
- file: app/src/main/kotlin/com/example/PendingIntentLab.kt:9
- rule_intent: implicit PendingIntent 탐지
- code:
  return PendingIntent.getActivity(
      context, 4412, explicitIntent, PendingIntent.FLAG_IMMUTABLE
  )

추가 요청:
1. true positive / false positive / 추가 확인 필요 중 하나로 분류
2. 그렇게 판단한 근거 3개
3. 더 열어봐야 할 helper / call path
4. 코드리뷰 코멘트 3줄
5. 규칙 튜닝 아이디어 1개
```

- AI는 "설명 생성기"보다 "근거 기반 triage 보조"로 쓰는 편이 더 안정적입니다.
- `check_id`, 호출 코드, 주변 함수, helper 이름까지 함께 주는 것이 중요합니다.

---

# Summary

- 암시적 `PendingIntent`는 대상 컴포넌트가 코드에 드러나지 않아, 민감한 흐름에서는 명시적 대상 지정 여부를 먼저 확인해야 합니다.
- 약한 해시·서명 탐지는 빠르게 후보를 수집하는 데 유용하지만, 실제 보안 의사결정에 쓰이는지는 별도 확인이 필요합니다.
- Semgrep은 구조 기반 후보 추출에 적합하고, 최종 판정은 코드 문맥 확인과 AI/사람 triage를 함께 써야 정확도가 올라갑니다.
