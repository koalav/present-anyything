---
layout: section
---

# 24. Ghidra MCP 적용 방법

---

# 적용 흐름

1. Ghidra 설치
2. JDK 준비
3. APK에서 `.so` 추출
4. Ghidra 프로젝트에 로드
5. Auto Analysis 실행
6. Ghidra MCP 플러그인과 Bridge 연결
7. Client에서 서버 등록

---

# 주의점

- 파일이 실제로 열려 있어야 한다
- 포트 충돌 확인
- 자동 리네이밍은 제안으로만 쓰고 사람이 검토한다
