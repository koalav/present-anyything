---
layout: section
---

# 12. 단계별 프롬프트 예시

---

# Coordinator: 시작 프롬프트

- 먼저 프로젝트 스냅샷을 갱신합니다.
- Project Mapper와 Binary Inventory로 구조, 바이너리, 서비스, updater, installer, scheduled task, COM, IPC 표면을 정리합니다.
- 그다음 trust boundary를 작성하고 체크리스트를 자산별 작업으로 나눕니다.
- 코드 수정은 하지 않고, 산출물은 `docs/status`, `docs/scope`, `docs/plans`에 저장합니다.

---

# Auditor: 공통 프롬프트

- 할당된 범위만 점검합니다.
- 각 항목은 가설 1문장으로 시작하고 raw evidence를 먼저 저장합니다.
- 그다음 normalized summary를 작성하고 결과는 `candidate` 상태로만 남깁니다.
- 대상 자산, 버전, 경로, 명령, 출력, 재현 절차를 명확히 적고 최종 판정은 하지 않습니다.

---

# Reviewer: 검토 프롬프트

- Auditor의 finding candidate를 반박 관점에서 검토합니다.
- 영향 범위, 악용 가능성, severity, remediation이 과장되지 않았는지 확인합니다.
- 오탐 가능성이 있으면 `Needs Rework`로 되돌리고, 결론의 논리와 보안 타당성을 중심으로 봅니다.

---

# Verifier: 검증 프롬프트

- finding candidate의 증거가 주장과 직접 연결되는지 검증합니다.
- raw evidence, normalized summary, 경로, 버전, 대상 자산 식별, 재현 절차가 다시 실행 가능한지 확인합니다.
- 증거가 부족하면 `Evidence Gap`으로 반려하고 severity 판단은 Reviewer에게 맡깁니다.

---

# Report Writer: 보고 프롬프트

- `Verified` finding만 사용해 보고서를 작성합니다.
- `Draft`, `Needs Rework`, `Evidence Gap`은 본문에 섞지 않고 부록으로 분리합니다.
- 보고서에는 경영 요약, 기술 상세, 증적 경로, 재현 절차, 남은 blocker, 다음 액션을 포함합니다.
