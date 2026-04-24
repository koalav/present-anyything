---
layout: section
---

# 11. MCP Client 설정 구조

---

# 설정 예시

```json
{
  "mcpServers": {
    "android": {
      "command": "uv",
      "args": ["--directory", "C:\\Tools\\android-mcp", "run", "server.py"]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

---

# 운영 팁

- Windows 경로 이스케이프 주의
- 서버별 로그와 버전 기록
- 위험 Tool 자동 승인 금지
- 설치 경로를 짧고 일관되게 잡으면 관리가 쉬움
