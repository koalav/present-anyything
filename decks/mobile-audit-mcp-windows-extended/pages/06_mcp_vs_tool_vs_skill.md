---
layout: section
---

# 6. MCP, Tool, Skill을 섞지 않기

---

| 구분 | 의미 | 예시 |
|---|---|---|
| Tool | AI가 호출하는 단일 실행 기능 | `get_screenshot`, `run_script` |
| MCP Server | 여러 Tool을 묶은 서버 | Android MCP, Burp MCP |
| MCP | Client와 Server가 통신하는 규격 | JSON-RPC 기반 프로토콜 |
| Skill | 절차와 판단 기준을 담은 플레이북 | Mobile Audit Skill |

---

# 용어를 이렇게 쓰는 편이 정확하다

- 부정확: MCP로 스크린샷을 찍는다
- 정확: Android MCP Server의 스크린샷 Tool을 호출한다

- 부정확: MCP가 보고서를 쓴다
- 정확: Agent가 Skill 기준으로 여러 Tool 결과를 정리한다
