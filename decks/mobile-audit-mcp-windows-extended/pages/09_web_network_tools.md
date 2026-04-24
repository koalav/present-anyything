---
layout: section
---

# 9. WebView · 브라우저 · 네트워크

---

# Chrome DevTools, Playwright, Burp 계열 도구

- WebView DOM 구조 분석
- 로그인과 브라우저 플로우 자동화
- Network 요청, 응답, 헤더, 저장소 확인
- 콘솔 에러, CSP, Mixed Content 확인
- API 요청과 코드 위치를 연결해 해석

---
layout: two-cols
---

# 강점

- WebView와 API 보안을 모바일 감사 흐름에 통합
- Storage, Cookie, LocalStorage 위험을 빠르게 확인
- 로그인 플로우를 재현 가능하게 기록

::right::

# 주의점

- 페이지 콘텐츠를 모델 지시문처럼 신뢰하면 안 된다
- 프롬프트 인젝션 가능성 고려
- 토큰, 쿠키, 개인정보는 마스킹
- 능동 스캔은 승인된 범위만 수행
