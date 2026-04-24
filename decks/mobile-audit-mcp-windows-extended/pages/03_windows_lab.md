---
layout: section
---

# 3. Windows 기반 테스트 랩

---
layout: two-cols
---

# 기본 구성

- Windows 10/11
- Python 3.10+
- Node.js LTS
- Git
- Android SDK Platform-Tools
- JDK
- Android 디바이스 또는 에뮬레이터

::right::

# 주요 도구

- JADX
- Frida / frida-server
- Ghidra
- Chrome / Chrome DevTools
- Burp Suite 또는 ZAP
- MobSF / Semgrep / CodeQL

---

# 운영 전 확인 항목

```powershell
python --version
node --version
git --version
adb version
adb devices
```

- Windows에서는 경로 표준화가 중요하다
- 도구 설치 루트를 `C:\\Tools` 아래로 정리하면 관리가 쉽다
- 버전과 테스트 디바이스 정보를 기록해 두어야 재현성이 유지된다
