---
layout: section
---

# 3. 감사 작업 구조

---
class: diagram-slide
---

# 전체 감사 흐름

```mermaid
%%{init: {'themeVariables': {'fontSize': '12px'}, 'flowchart': {'nodeSpacing': 18, 'rankSpacing': 26, 'diagramPadding': 6, 'curve': 'linear'}}}%%
flowchart LR
    A[감사 요청] --> B[스냅샷]
    B --> C[인벤토리 · 신뢰 경계]
    C --> D[계획 · 이슈화]
    D --> E[감사 실행<br/>정적 · 동적 · ACL · 업데이트]
    E --> F[증적 정규화]
    F --> G[Finding Candidate]
    G --> H[Reviewer · Verifier]
    H --> I{통과 여부}
    I -->|Yes| J[Verified]
    I -->|No| K[Rework / Gap]
    K --> D
    J --> L[Report]
```

---

# 작업 단계별 산출물

| 단계 | 담당 | 주요 산출물 |
|---|---|---|
| 프로젝트 현황 파악 | Coordinator, Project Mapper | `docs/status/01_project_snapshot.md` |
| 자산 인벤토리 | Binary Inventory | `docs/evidence/<run-id>/normalized/inventory.csv` |
| 신뢰경계 정리 | Coordinator, Project Mapper | `docs/scope/trust_boundaries.md` |
| 계획 수립 | Coordinator | `docs/plans/active/*.md` |
| 체크리스트 실행 | Auditors | raw evidence, normalized summary, finding candidate |
| 검증 | Reviewer, Verifier | review note, verification result |
| 보고 | Report Writer | weekly report, final report |
