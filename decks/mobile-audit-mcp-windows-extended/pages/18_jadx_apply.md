---
layout: section
---

# 18. JADX MCP 적용 방법

---

# 적용 흐름

1. JADX 설치
2. JADX AI MCP 플러그인 설치
3. APK를 JADX에서 로드
4. MCP 서버 실행
5. Client에 서버 등록
6. 현재 클래스, 메서드, Manifest를 Agent가 읽도록 연결

---

# 주의점

- APK가 실제로 열려 있어야 한다
- 난독화된 코드 요약은 직접 검증해야 한다
- 민감 APK는 외부 전송 정책을 먼저 확인해야 한다
