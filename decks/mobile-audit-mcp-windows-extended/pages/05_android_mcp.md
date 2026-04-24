---
layout: section
---

# 5. Android MCP

---

# Android MCP의 역할

- 디바이스 정보 조회
- 스크린샷 수집
- UI Layout XML 수집
- Logcat 수집과 필터링
- 패키지 정보 및 권한 조회
- 파일 pull, push 같은 증거 보조 작업

| 대표 Tool | 감사 활용 |
|---|---|
| `get_device_info` | 디바이스 기준선 확보 |
| `get_screenshot` | 현재 화면 증거 수집 |
| `get_uilayout` | UI 요소 구조 분석 |
| `get_logcat` | 인증, 오류, 보안 이벤트 확인 |
| `get_package_info` | 패키지와 권한 확인 |

---

# 적용 포인트

```powershell
adb devices
adb shell getprop ro.product.model
adb shell pm list packages
```

- ADB 연결 안정화가 먼저다
- 디바이스가 여러 개면 serial 지정이 필요하다
- 설치, 삭제, shell 실행은 승인 게이트 뒤에 두는 편이 안전하다
- 로그인 화면 캡처, 버튼 좌표 계산, 인증 로그 수집 같은 반복 작업에 특히 유용하다
