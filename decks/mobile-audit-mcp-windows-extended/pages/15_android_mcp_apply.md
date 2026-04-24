---
layout: section
---

# 15. Android MCP 적용 방법

---

```powershell
adb devices
adb shell getprop ro.product.model
adb shell pm list packages
```

- ADB 연결 안정화가 먼저다
- 여러 디바이스가 있으면 serial 지정이 필요하다
- shell 실행은 allow-list 기반이 좋다
- 설치, 삭제, 파일 이동은 승인 후 수행한다

---

# 설정 포인트

- Platform-Tools 설치
- USB Debugging 활성화
- 테스트 디바이스 연결
- MCP Client 설정에 android 서버 등록
