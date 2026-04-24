---
layout: section
---

# 6. 폴더 구조와 상태 관리

---

# 권장 폴더 구조

```text
repo/
├─ AGENTS.md
├─ PLANS.md
├─ .agents/
│  └─ skills/
├─ .codex/
│  └─ agents/
├─ docs/
│  ├─ status/
│  ├─ scope/
│  ├─ plans/
│  ├─ checklists/
│  ├─ evidence/
│  ├─ findings/
│  ├─ review/
│  └─ reports/
└─ tools/
   ├─ run_binskim.ps1
   ├─ run_sigcheck.ps1
   ├─ run_accesschk.ps1
   ├─ run_procmon_capture.ps1
   └─ run_autoruns_export.ps1
```

---

# 문서와 실행 상태는 분리

| 위치 | 역할 | 예시 |
|---|---|---|
| `docs/checklists/` | 기준서 | Windows 앱 감사 항목 |
| `docs/plans/active/` | 현재 실행 계획 | phase, owner, gate, stop condition |
| `docs/evidence/<run-id>/raw/` | 원본 증거 | tool output, logs, screenshots |
| `docs/evidence/<run-id>/normalized/` | 요약/정규화 | csv, json, summary |
| `docs/findings/` | 기술 finding | `F-001-dll-search-path.md` |
| `docs/review/` | 리뷰/검증 결과 | reviewer note, verifier note |
| GitHub Issues/Projects | 실행 상태 | assignee, status, blocker, dependency |

---

# GitHub Projects 필드 예시

| Field | 값 예시 |
|---|---|
| Status | Planned / In Progress / In Review / Needs Rework / Verified / Reported |
| Surface | UAC / DLL / ACL / Service / IPC / Installer / Updater / Persistence |
| Asset | `Updater.exe`, `ServiceA`, `MainUI.dll` |
| Evidence Ready | Yes / No |
| Reviewer | 담당자 또는 agent |
| Severity | Info / Low / Medium / High / Critical |
| Run ID | `20260424-001` |
