---
layout: section
---

# 2. 핵심 설계 원칙

---
layout: two-cols
---

# 권장 운영 구조

- 짧은 `AGENTS.md`
- `PLANS.md` / 실행계획
- `docs/status`, `docs/evidence`, `docs/findings`, `docs/reports`
- 반복 절차는 skills
- 병렬·전문화가 필요한 구간에만 subagents
- Reviewer / Verifier 게이트
- read-only 우선 MCP + allowlist
- GitHub Projects + sub-issues + dependencies
- Windows용 결정론적 검사 도구

::right::

# 이 구조를 권장하는 이유

- LLM 컨텍스트 오염 감소
- 장기 작업 상태 복원 가능
- 절차 재사용성 확보
- 감사 결과의 증거성 강화
- false positive와 evidence gap 축소
- MCP/tool misuse 위험 완화
- 사람이 리뷰 가능한 산출물 유지

---

# 원칙 1: 지침은 짧게, 상태는 문서화

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

## `AGENTS.md`

- 전역 규칙
- 금지 행위
- 산출물 위치
- subagent 사용 규칙
- 검증 게이트 규칙

</div>
<div>

## `docs/`

- 프로젝트 스냅샷
- 실행계획
- 체크리스트
- 증적
- finding
- 리뷰 결과
- 보고서

</div>
</div>

<div class="mt-10 p-4 border rounded">
<b>운영 기준:</b> `AGENTS.md`에는 목차와 원칙만 두고, 실제 감사 상태와 증거는 `docs/`를 source of truth로 관리합니다.
</div>

---

# 원칙 2: Skill 우선, Subagent는 제한적으로

| 구분 | 적합한 사용처 | 예시 |
|---|---|---|
| Skill | 반복 가능한 절차 | 감사 bootstrap, 체크리스트 실행, finding 작성, evidence packaging |
| Subagent | 병렬·전문화 검토 | Static Auditor, ACL Auditor, Runtime Tracer, Reviewer, Verifier |
| MCP | 외부 시스템 관찰 | 파일, 이벤트 로그, 레지스트리, GitHub Projects, CodeQL 결과 |
| Tool script | 결정론적 증거 생성 | BinSkim, Sigcheck, AccessChk, Procmon, Autoruns |

<div class="mt-8">
Subagent 수가 늘수록 관리 비용과 토큰 비용이 함께 증가합니다. 반복 절차는 skill로 고정하고, 실제로 역할 분리가 필요한 구간에만 subagent를 사용합니다.
</div>
