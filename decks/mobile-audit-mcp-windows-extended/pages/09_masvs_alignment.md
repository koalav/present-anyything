---
layout: section
---

# 9. 감사 기준은 MASVS와 MASTG에 정렬한다

---

# 왜 기준이 필요한가

- 도구 결과만으로는 Finding이 되지 않는다
- 영향도, 재현 가능성, 기준 매핑이 붙어야 산출물이 된다

| 도구 결과 | 기준 매핑 예시 |
|---|---|
| 하드코딩 비밀값 | 저장소, 암호화 통제 |
| 평문 HTTP 통신 | 네트워크 보안 |
| Exported Component | 플랫폼 상호작용 |
| 위험 WebView 설정 | 플랫폼/API 노출 |

---

# 목표 흐름

```text
Tool Result -> Evidence -> MASVS Mapping -> Finding
```
