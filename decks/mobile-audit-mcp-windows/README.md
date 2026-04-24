# Windows 환경에서 MCP로 구성하는 AI 기반 모바일 앱 보안 감사

이 deck은 Windows 기반 모바일 앱 보안 감사 환경에서 MCP, Tool, Skill, Evidence 구조를 어떻게 설계하고 운영할지 설명하는 Slidev 발표 자료입니다.

## 구성 의도

원본 초안은 48장 분량의 상세 발표 구조였고, 이 deck에서는 `present-anything` 프로젝트의 기존 스타일에 맞춰 약 15장 내외의 발표 흐름으로 재구성했습니다.

핵심 흐름:
- 발표 목표와 범위
- Agent, MCP, Tool, Skill 개념 구분
- Windows 테스트 랩 구성
- 전체 아키텍처
- Android, JADX, Frida, Ghidra, Web/Network 도구 적용
- 자동 스캐닝 도구의 위치
- AI Mobile Audit Orchestrator 흐름
- Skill과 Evidence Bundle
- 운영 통제와 결론

## 실행

```bash
npm run dev:mobile-audit-mcp
```

## 정적 빌드

```bash
npm run build:mobile-audit-mcp
```

## 파일 구조

```text
mobile-audit-mcp-windows/
  slides.md
  pages/
    01_intro_and_scope.md
    ...
    15_sources.md
```

## 편집 메모

- 내부 파일 경로나 구현 세부를 과도하게 드러내지 않도록 발표용 문장으로 정리함
- AI스러운 보고서체보다 설명형 발표 문장으로 다듬음
- 원본의 세부 슬라이드를 모두 보존하지 않고, 실사용 발표 흐름에 맞게 압축함
