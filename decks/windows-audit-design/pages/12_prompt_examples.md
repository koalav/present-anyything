---
layout: section
---

# 12. 단계별 프롬프트 예시

---

# Coordinator: 시작 프롬프트

```text
현재 프로젝트 상태를 먼저 파악하고 스냅샷을 갱신하십시오.
Project Mapper와 Binary Inventory를 사용해 구조, 바이너리, 서비스, updater,
installer, scheduled task, COM, IPC 표면을 정리하십시오.

그 다음 trust boundary를 작성하고,
체크리스트를 자산별/도메인별 작업으로 분해하십시오.

코드 수정은 금지합니다.
산출물은 docs/status, docs/scope, docs/plans에 저장하십시오.
```

---

# Auditor: 공통 프롬프트

```text
할당된 범위만 점검하십시오.
각 항목은 가설 1문장으로 시작하고,
raw evidence를 먼저 저장한 뒤 normalized summary를 작성하십시오.

결론은 candidate 상태로만 남기십시오.
Reviewer와 Verifier가 검토할 수 있도록
대상 자산, 버전, 경로, 명령, 출력, 재현 절차를 명확히 적으십시오.

최종 판정은 하지 마십시오.
```

---

# Reviewer: 검토 프롬프트

```text
Auditor의 finding candidate를 반박 관점에서 검토하십시오.
영향 범위, 악용 가능성, severity, remediation이 과장되었는지 확인하십시오.
false positive 가능성이 있으면 Needs Rework로 되돌리십시오.

증거 자체의 충분성보다는 결론의 논리와 보안적 타당성을 검토하십시오.
```

---

# Verifier: 검증 프롬프트

```text
Finding candidate의 증거가 주장과 직접 연결되는지 검증하십시오.
raw evidence, normalized summary, 경로, 버전, 대상 자산 식별,
재현 절차가 독립적으로 다시 실행 가능한지 확인하십시오.

증거가 부족하면 Evidence Gap으로 반려하십시오.
severity 판단은 Reviewer에게 맡기십시오.
```

---

# Report Writer: 보고 프롬프트

```text
Verified finding만 사용해 보고서를 작성하십시오.
Draft, Needs Rework, Evidence Gap 항목은 본문에 섞지 말고 별도 부록으로 분리하십시오.

보고서에는 경영 요약, 기술 상세, 증적 경로, 재현 절차,
남은 blocker, 다음 액션을 포함하십시오.
```
