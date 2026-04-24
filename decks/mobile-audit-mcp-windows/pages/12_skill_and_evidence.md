---
layout: section
---

# 12. Skill과 Evidence Bundle

---
layout: two-cols
---

# Skill이 담당하는 것

- 단계별 도구 선택 기준
- 승인 필요 작업 정의
- 체크리스트와 판단 기준 정리
- Finding 템플릿과 보고서 형식 제공
- 증거 저장 규칙 통일

::right::

# Evidence Bundle이 담당하는 것

- 스크린샷
- Logcat
- HTTP 요청과 응답
- 코드 위치와 클래스명
- 동적 후킹 로그
- MASVS 매핑 근거

---

# 표준 저장 구조 예시

```text
evidence/{app}/{date}/
  01_device/
  02_static/
  03_dynamic/
  04_native/
  05_network/
  06_findings/
```

- 증거가 표준화되어야 재검증이 쉬워진다
- Finding에는 증거 경로와 재현 절차가 함께 있어야 한다
- AI는 초안을 쓰고, 사람은 영향도와 확정 여부를 판단한다
