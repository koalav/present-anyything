# AGENTS.md

이 프로젝트는 Slidev 기반 발표 자료를 정적 사이트로 빌드해 배포한다.

## Working Map

- 작업 총괄: `docs/TASKS.md`
- Subagent 분담: `docs/SUBAGENTS.md`
- 발표 내용 편집 흐름: `docs/CONTENT_WORKFLOW.md`
- Deck별 요약 문서:
  - `docs/deck-summaries/semgrep-android-local.summary.md`
  - `docs/deck-summaries/windows-audit-design.summary.md`
- Deck별 수정용 소스 문서:
  - `docs/deck-sources/semgrep-android-local.source.md`
  - `docs/deck-sources/windows-audit-design.source.md`

## Current Priority Tasks

1. 팔레트 표시 색상 불일치 버그 수정
2. 팔레트 선택 시 실제 화면이 바뀌지 않는 문제 수정
3. 기본 화면전환 애니메이션 옵션 선택 기능 추가
4. 각 발표의 전체 내용 요약 문서 및 수정용 소스 문서 정리

## Agent Responsibilities

상세 역할 분담은 `docs/SUBAGENTS.md`를 본다.

- UI/Theme Agent: 인덱스, 팔레트, 공통 스타일
- Runtime Agent: palette sync, animation option, build/runtime 동작
- Content Agent: deck summary/source 문서 작성 및 유지
- QA Agent: 수동 검증 체크리스트, 회귀 확인, 배포 전 확인

## Delivery Rule

기능 수정은 가능하면 아래 순서로 묶어서 반영한다.

1. 문서 업데이트 (`docs/TASKS.md`, summary/source 문서)
2. 구현 변경 (`scripts`, `public`, `global.css`, deck source)
3. build 결과 갱신 (`docs/`)
4. 검증 후 commit
