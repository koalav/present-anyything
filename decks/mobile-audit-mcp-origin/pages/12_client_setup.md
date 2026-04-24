---
layout: section
---

# 12. 구축: MCP Client 설정 구조

---

```json
{
  "mcpServers": {
    "android": {
      "command": "uv",
      "args": ["--directory", "<tool-root>", "run", "server.py"]
    }
  }
}
```

- 서버별 로그와 버전 기록
- 위험 Tool 자동 승인 금지
