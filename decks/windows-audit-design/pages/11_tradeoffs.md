---
layout: section
---

# 11. 더 좋은 대안이 있을 수 있는 경우

---

# 현재 구조가 가장 잘 맞는 경우

- 감사 범위가 넓음
- installer / updater / service / IPC / ACL / runtime이 모두 포함됨
- 병렬 조사 가치가 높음
- 증적 저장과 나중 검토가 중요함
- GitHub 기반 협업을 사용함
- 에이전트가 읽을 문서와 체크리스트를 저장소에 유지할 수 있음

---

# 대안 비교

| 대안 | 더 나은 경우 | 단점 |
|---|---|---|
| Single agent + skills + reviewer | 범위가 작고 병렬성이 낮음 | 복잡한 감사에서 컨텍스트 혼잡 |
| Custom workflow / orchestrator-worker | 규제·감사상 상태기계가 필요 | 구현과 유지보수 비용 증가 |
| Repo-centric scanner 보강 | 코드 저장소 중심 취약점 탐지가 핵심 | runtime/host inspection 커버리지 약함 |
| Full multi-agent | 병렬 분석이 많고 도메인이 명확히 분리 | 비용, 지연, 조정 복잡도 증가 |

---

# 설계 선택 기준

```mermaid
flowchart TD
    A[감사 범위 평가] --> B{도구/표면이 많은가?}
    B -->|No| C[Single Agent + Skills]
    B -->|Yes| D{병렬 조사 가치가 높은가?}
    D -->|No| E[Coordinator + Skills + Reviewer]
    D -->|Yes| F{감사 추적성과 증적이 중요한가?}
    F -->|Yes| G[Coordinator + Auditors + Reviewer/Verifier]
    F -->|No| H[경량 Multi-agent]
```
