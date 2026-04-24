---
layout: section
---

# 2. Agent · MCP · Tool · Skill

---

# 개념을 섞지 않고 보는 것이 중요하다

| 계층 | 역할 | 예시 |
|---|---|---|
| Agent | 목표 해석, 도구 선택, 결과 요약 | Claude Code, Codex CLI, Cursor |
| MCP | Client와 Server를 잇는 연결 규격 | JSON-RPC 기반 MCP |
| MCP Server | 여러 Tool을 노출하는 도구 묶음 | Android MCP, Frida MCP |
| Tool | 실제 실행 단위 | `get_screenshot`, `run_script` |
| Skill | 절차와 판단 기준을 담은 플레이북 | Mobile Audit Skill |

---
class: diagram-slide
---

# 관계 구조

```mermaid
flowchart LR
    U[Auditor] --> A[AI Agent]
    A --> S[Skill]
    A --> C[MCP Client]
    C --> M[MCP Server]
    M --> T[Tools]
    T --> R[Security Tools and Targets]
    R --> E[Evidence]
    E --> A
```

---

# 핵심 구분

- MCP는 도구를 연결하는 방식이다
- Tool은 실제 실행 함수다
- Skill은 어떤 순서로 무엇을 검증할지 정하는 절차다
- Agent는 결과를 읽고 다음 행동을 정하는 오케스트레이터다

<div class="mt-8 p-4 rounded bg-slate-100 text-lg">
표현도 이렇게 맞추는 편이 정확하다.<br>
<b>"MCP로 스크린샷을 찍는다"</b> 보다는<br>
<b>"Android MCP Server의 스크린샷 Tool을 호출한다"</b>
</div>
