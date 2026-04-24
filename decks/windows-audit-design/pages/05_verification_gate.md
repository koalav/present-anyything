---
layout: section
---

# 5. Reviewer / Verifier 게이트

---

# 승인 흐름

```mermaid
flowchart TD
    A[Coordinator가 작업 할당] --> B[Auditor 실행]
    B --> C[Finding Candidate + Evidence]
    C --> D[Technical Reviewer]
    C --> E[Evidence Verifier]

    D --> F{논리와 영향이 타당한가?}
    E --> G{증거와 재현이 충분한가?}

    F -->|No| H[Needs Rework]
    G -->|No| I[Evidence Gap]

    F -->|Yes| J[Review Pass]
    G -->|Yes| K[Verify Pass]

    J --> L{두 게이트 모두 통과?}
    K --> L
    L -->|Yes| M[Verified Finding]
    L -->|No| H
    M --> N[Report Writer]
```

---

# Reviewer와 Verifier를 분리하는 이유

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

## Reviewer

검토 대상:

- 결론의 보안 논리
- 영향 범위
- 악용 가능성
- severity 과장 여부
- remediation 타당성

</div>
<div>

## Verifier

검토 대상:

- raw evidence 존재 여부
- 경로, 버전, 자산 식별 정확성
- 재현 절차 완결성
- 도구 출력과 주장 연결성
- 문서/OS 동작과의 충돌 여부

</div>
</div>

<div class="mt-8 p-4 border rounded">
<b>규칙:</b> Reviewer와 Verifier가 모두 통과한 항목만 Verified Finding으로 승격합니다.
</div>

---

# 상태 머신

```mermaid
stateDiagram-v2
    [*] --> Planned
    Planned --> InProgress
    InProgress --> AuditComplete
    AuditComplete --> InReview
    InReview --> NeedsRework: Reviewer 반려
    InReview --> EvidenceGap: Verifier 반려
    NeedsRework --> InProgress
    EvidenceGap --> InProgress
    InReview --> Verified: Reviewer + Verifier 통과
    Verified --> Reported
    Reported --> Closed
```
