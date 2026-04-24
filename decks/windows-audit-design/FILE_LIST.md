# Slidev Markdown 파일 리스트

이 폴더는 Slidev에서 바로 사용할 수 있는 Markdown 기반 발표자료 구조입니다.

## Entry 파일

| 파일 | 용도 |
|---|---|
| `slides.md` | Slidev 엔트리 파일. 전역 frontmatter와 각 섹션 파일 import를 포함합니다. |

## Slide 섹션 파일

| 순서 | 파일 | 내용 |
|---:|---|---|
| 01 | `pages/01_problem.md` | Windows 앱 보안감사의 문제 정의와 운영 목표 |
| 02 | `pages/02_core_design.md` | 핵심 설계 원칙: AGENTS.md, docs, skills, subagents |
| 03 | `pages/03_workflow_structure.md` | 전체 작업 구조도와 단계별 산출물 |
| 04 | `pages/04_agent_model.md` | Coordinator, Auditors, Reviewer, Verifier 관계도 |
| 05 | `pages/05_verification_gate.md` | Reviewer/Verifier 이중 검증 게이트와 상태 머신 |
| 06 | `pages/06_folder_state_model.md` | 폴더 구조와 GitHub Projects 상태 필드 |
| 07 | `pages/07_checklist_execution.md` | 체크리스트 순차 실행 방식과 항목별 포맷 |
| 08 | `pages/08_tool_and_mcp_layer.md` | Windows 도구, MCP, raw evidence 흐름 |
| 09 | `pages/09_security_controls.md` | 에이전트/MCP 보안 통제와 권한 모델 |
| 10 | `pages/10_evidence_reporting.md` | Evidence bundle과 finding/report 템플릿 |
| 11 | `pages/11_tradeoffs.md` | 현재 구조가 적합한 경우와 대안 비교 |
| 12 | `pages/12_prompt_examples.md` | Coordinator, Auditor, Reviewer, Verifier, Report Writer 프롬프트 예시 |
| 13 | `pages/13_implementation_plan.md` | 4주 도입 로드맵 |
| 14 | `pages/14_sources.md` | 참고 출처 목록 |

## 사용 방법

```bash
npm init slidev@latest
# 생성된 프로젝트에 이 폴더의 slides.md와 pages/를 복사
npx slidev slides.md
```

또는 기존 Slidev 프로젝트에서 `slides.md`와 `pages/`만 교체해서 사용하시면 됩니다.

## 참고

Slidev는 `slides.md`를 기본 엔트리로 사용하고, `---`로 슬라이드를 분리하며, `src: ./pages/file.md` frontmatter로 외부 Markdown 슬라이드를 import할 수 있습니다.
