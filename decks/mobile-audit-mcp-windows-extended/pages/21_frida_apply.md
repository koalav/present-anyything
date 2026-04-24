---
layout: section
---

# 21. Frida MCP 적용 방법

---

```powershell
pip install frida-tools
frida-ps -U
```

```powershell
adb push frida-server /data/local/tmp/frida-server
adb shell "chmod 755 /data/local/tmp/frida-server"
adb shell "/data/local/tmp/frida-server &"
frida-ps -U
```

---

# 적용 시 주의점

- Frida와 frida-server 버전 일치
- spawn 방식이 필요한 후킹 구분
- 테스트 계정만 사용
- 함수명과 클래스명을 먼저 검토
