---
layout: section
---

# 3. 작업 구조도

---

# 전체 감사 흐름

```mermaid
flowchart TD
    A[감사 요청 접수] --> B[프로젝트 스냅샷 생성]
    B --> C[자산 인벤토리 작성]
    C --> D[신뢰 경계 및 공격면 정리]
    D --> E[감사 계획 수립]
    E --> F[체크리스트 분해]
    F --> G[작업 이슈 생성 및 상태 연결]

    G --> H1[정적 점검]
    G --> H2[동적 점검]
    G --> H3[권한/ACL 점검]
    G --> H4[지속성/설치/업데이트 점검]

    H1 --> I[증적 정규화]
    H2 --> I
    H3 --> I
    H4 --> I

    I --> J[Finding Candidate]
    J --> K[Reviewer / Verifier 검증]
    K --> L{둘 다 통과?}
    L -->|Yes| M[Verified Finding]
    L -->|No| N[재작업 또는 Evidence Gap]
    N --> G
    M --> O[보고서 반영]
```

---

# 작업 단계별 산출물

| 단계 | 담당 | 주요 산출물 |
|---|---|---|
| 프로젝트 파악 | Coordinator, Project Mapper | `docs/status/01_project_snapshot.md` |
| 자산 인벤토리 | Binary Inventory | `docs/evidence/<run-id>/normalized/inventory.csv` |
| 신뢰경계 정리 | Coordinator, Project Mapper | `docs/scope/trust_boundaries.md` |
| 계획 수립 | Coordinator | `docs/plans/active/*.md` |
| 체크리스트 실행 | Auditors | raw evidence, normalized summary, finding candidate |
| 검증 | Reviewer, Verifier | review note, verification result |
| 보고 | Report Writer | weekly/final report |
