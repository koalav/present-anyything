---
layout: section
---

# 5. Reviewer / Verifier 게이트

---
class: diagram-slide
---

# 승인 흐름

```mermaid
%%{init: {'themeVariables': {'fontSize': '12px'}, 'flowchart': {'nodeSpacing': 18, 'rankSpacing': 26, 'diagramPadding': 6, 'curve': 'linear'}}}%%
flowchart LR
    A[Assignment] --> B[Auditor]
    B --> C[Candidate + Evidence]
    C --> D[Reviewer]
    C --> E[Verifier]
    D --> F{논리 타당?}
    E --> G{증거 충분?}
    F -->|Yes| H[Review Pass]
    G -->|Yes| I[Verify Pass]
    F -->|No| J[Needs Rework]
    G -->|No| K[Evidence Gap]
    H --> L{둘 다 통과?}
    I --> L
    L -->|Yes| M[Verified]
    L -->|No| J
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
class: diagram-slide
---

# 상태 머신

```mermaid
%%{init: {'themeVariables': {'fontSize': '12px'}, 'flowchart': {'nodeSpacing': 18, 'rankSpacing': 26, 'diagramPadding': 6, 'curve': 'linear'}}}%%
flowchart LR
    A[Planned] --> B[In Progress]
    B --> C[Audit Complete]
    C --> D[In Review]
    D -->|Reviewer 반려| E[Needs Rework]
    D -->|Verifier 반려| F[Evidence Gap]
    E --> B
    F --> B
    D -->|둘 다 통과| G[Verified]
    G --> H[Reported]
    H --> I[Closed]
```
