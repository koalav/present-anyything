---
layout: section
---

# 14. Android MCP의 역할

---
layout: two-cols
---

# Android MCP가 다루는 것

- 디바이스 상태 확인
- 현재 화면 캡처
- UI Layout XML 수집
- logcat 수집
- 패키지와 권한 목록 확인
- 앱 실행 상태와 파일 수집

::right::

| 대표 Tool | 용도 |
|---|---|
| `get_device_info` | 디바이스 기준선 |
| `get_screenshot` | 화면 증거 |
| `get_uilayout` | UI 구조 분석 |
| `get_logcat` | 인증, 오류, 보안 이벤트 |
| `get_package_info` | 앱 메타데이터 |
