---
layout: section
---

# 10. 자동 스캐닝과 초벌 분류

---

# MobSF · Semgrep · CodeQL의 위치

- MobSF는 APK 초벌 정적 분석에 강하다
- Semgrep은 반복 가능한 룰 기반 점검에 좋다
- CodeQL은 데이터플로우 기반 검증에 적합하다

| 도구 | 역할 | 주의점 |
|---|---|---|
| MobSF | 초벌 요약, Manifest, 설정 점검 | 결과를 그대로 보고서에 넣지 않기 |
| Semgrep | 커스텀 룰 기반 후보 탐지 | 오탐과 중복 제거 필요 |
| CodeQL | 소스 기반 고급 질의 | 소스와 쿼리 품질 의존 |

---

# 핵심 원칙

<div class="text-xl leading-relaxed">
자동 스캐닝 도구는 <b>Finding 확정 도구가 아니라 후보 생성 도구</b>다.
AI는 이 후보를 요약하고 우선순위를 잡는 데 도움을 준다.
</div>
