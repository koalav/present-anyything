---
layout: section
---

# 1. 발표 목표와 범위

---
layout: two-cols
---

# 발표 목표

- MCP, Tool, Skill의 차이를 명확히 구분
- Windows 환경에서 모바일 앱 감사용 도구체인 구성
- 정적, 동적, 네이티브, 웹 분석 도구의 연결 지점 설명
- AI 기반 감사 시스템의 운영 구조와 통제 원칙 정리

::right::

# 포함 범위

- Android 앱 보안 감사
- Windows 기반 MCP Host 구성
- Android, JADX, Frida, Ghidra, Chrome DevTools, Burp 계열 도구 연결
- 증거 수집, Finding 초안, 보고서화 흐름

---

# 이 발표의 핵심 메시지

<div class="text-2xl mt-8 leading-relaxed">
AI가 감사를 대체하는 것이 아니라,<br>
<b>MCP로 연결된 도구들을 Skill 기반 절차 안에서 조율해</b><br>
감사의 재현성, 증거성, 보고서 품질을 높이는 것이 목적이다.
</div>

<div class="mt-10 grid grid-cols-2 gap-6">
<div>

## 제외 범위

- 무단 공격 자동화
- 비승인 능동 스캔
- 실제 운영 서비스 대상 위험 검증 자동 실행

</div>
<div>

## 운영 원칙

- 승인된 범위만 테스트
- 사람 검토 전 Finding 확정 금지
- 위험 작업은 승인 후 실행

</div>
</div>
