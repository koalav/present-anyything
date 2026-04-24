---
layout: section
---

# 11. AI Mobile Audit Orchestrator

---
class: diagram-slide
---

# 단계별 실행 흐름

```mermaid
flowchart LR
    A[범위 확인] --> B[기본 정보]
    B --> C[정적 분석]
    C --> D[동적 분석]
    D --> E[네이티브 분석]
    E --> F[웹·네트워크]
    F --> G[증거 정리]
    G --> H[MASVS 매핑]
    H --> I[Finding 초안]
```

---

# 단계와 산출물

| 단계 | 주 도구 | 산출물 |
|---|---|---|
| 대상 등록 | Agent, Scope 문서 | 앱 정보, 범위 |
| 기본 정보 수집 | Android MCP | 디바이스, 패키지, 화면 |
| 정적 분석 | JADX, Semgrep, MobSF | 코드 위치, 후보군 |
| 동적 분석 | Frida, Android MCP | 함수 로그, 실행 증거 |
| 네이티브 분석 | Ghidra | JNI, 암호화, 안티디버깅 후보 |
| 웹/API 분석 | Chrome, Burp | 요청/응답, 저장소, 콘솔 |
| 보고서화 | Skill Template | Finding 초안, MASVS 매핑 |
