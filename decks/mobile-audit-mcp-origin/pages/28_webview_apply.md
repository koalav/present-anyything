# Chrome DevTools / Playwright MCP: 적용 방법

```json
{
  "mcpServers": {
    "chrome-devtools": {"command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"]},
    "playwright": {"command": "npx", "args": ["-y", "@playwright/mcp@latest"]}
  }
}
```

- WebView 디버깅 활성화 확인
- 페이지 콘텐츠를 Agent 지시문으로 신뢰하지 않기
