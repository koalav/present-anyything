---
layout: section
---

# 6. JADX와 정적 분석

---
layout: two-cols
---

# JADX MCP가 주는 가치

- APK 디컴파일 코드 탐색
- AndroidManifest 분석
- 권한과 exported component 식별
- 하드코딩 Secret 후보 탐지
- WebView, 저장소, 인증 흐름 후보 찾기

::right::

# 함께 쓰기 좋은 도구

- Semgrep
- MobSF
- CodeQL
- 수동 코드 리뷰

---

# 정적 분석 결과는 후보군이다

| 분석 결과 | 바로 Finding인가 |
|---|---|
| 하드코딩 키 문자열 | 아님, 실제 키 성격 검증 필요 |
| Exported Activity | 아님, 인증과 권한 체크 확인 필요 |
| `setJavaScriptEnabled(true)` | 아님, 실제 노출면 확인 필요 |
| 평문 저장 함수 | 아님, 저장 경로와 데이터 성격 확인 필요 |

<div class="mt-8 text-lg">
정적 분석의 역할은 <b>깊게 볼 위치를 좁히는 것</b>이다.
그 다음 단계에서 Android MCP, Frida, Burp 결과와 연결해야 한다.
</div>
