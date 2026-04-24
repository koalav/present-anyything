---
layout: section
---

# 10. 증적과 보고서 구조

---

# Evidence Bundle 구조

```text
docs/evidence/<run-id>/
├─ raw/
│  ├─ binskim.sarif
│  ├─ sigcheck.txt
│  ├─ accesschk.txt
│  ├─ procmon.pml
│  ├─ autoruns.csv
│  └─ eventlog.evtx
├─ normalized/
│  ├─ inventory.csv
│  ├─ binary-hardening.csv
│  ├─ signing-status.csv
│  ├─ acl-summary.csv
│  └─ runtime-observations.md
└─ screenshots/
```

---

# Finding 템플릿

```markdown
# F-001: 사용자 쓰기 가능 경로 기반 DLL 로딩 위험

## 상태
Verified

## 대상
Updater.exe v1.2.3

## 요약
Updater.exe가 일반 사용자 쓰기 가능 경로에서 DLL을 로드한다.

## 영향
로컬 권한 상승 또는 앱 무결성 훼손 가능성.

## 재현 절차
1. 표준 사용자로 실행
2. 지정 경로에 테스트 DLL 배치
3. Procmon으로 DLL load 확인

## 증적
- raw: docs/evidence/<run-id>/raw/procmon-updater.pml
- normalized: docs/evidence/<run-id>/normalized/dll-loads.csv

## 검증 결과
- Reviewer: Pass
- Verifier: Pass
```

---

# 보고서 원칙

- Verified finding만 본문에 포함
- Draft와 Evidence Gap은 별도 부록
- 경영 요약과 기술 상세 분리
- 각 finding에 evidence path 포함
- 남은 blocker와 다음 액션 명확화
- 추후 재검증 가능한 재현 절차 유지
