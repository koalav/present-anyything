---
layout: section
---

# 4. Tool Calling의 동작 방식

---

# 기본 흐름

1. Tool 정의 등록
2. 사용자 요청 해석
3. 실행할 Tool 선택
4. 파라미터 생성
5. Tool 실행
6. 실행 결과 수신
7. 결과를 보고서나 요약으로 통합

---

# 보안 감사 예시

```json
{
  "tool": "get_device_info",
  "arguments": {
    "device_id": "R5CR123ABC4"
  }
}
```

- 사용자가 디바이스 상태를 묻는다
- Agent가 적절한 Tool을 고른다
- 런타임이 실행한다
- 결과를 앱 버전, 권한, 화면 상태로 정리한다

<div class="mt-8 text-lg">
중요한 점은 모델이 모든 것을 할 수 있는 것이 아니라,
<b>등록된 Tool 범위 안에서만 움직인다는 것</b>이다.
</div>
