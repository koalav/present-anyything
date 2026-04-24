---
layout: section
---

# 10. Windows 기반 테스트 랩 구성

---

# 기본 구성 요소

- Windows 10 또는 11
- Python 3.10 이상
- Node.js LTS
- Git
- Android SDK Platform-Tools
- JDK
- Android 디바이스 또는 에뮬레이터
- MCP 지원 Client

---

# 운영 전 확인

```powershell
python --version
node --version
git --version
adb version
adb devices
```

- 경로 표준화가 중요하다
- 버전과 장비 정보를 기록해야 한다
- 도구 루트를 정리하면 재설치와 팀 공유가 쉬워진다
