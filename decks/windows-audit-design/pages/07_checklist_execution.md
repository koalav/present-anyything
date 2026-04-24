---
layout: section
---

# 7. 체크리스트를 순차적으로 실행하는 방식

---

# 실행 단위

체크리스트는 한 번에 모두 실행하지 않습니다.

<div class="mt-8 grid grid-cols-2 gap-8">
<div>

## 도메인 단위

- UAC / privilege
- DLL loading
- service / IPC
- ACL
- installer / updater
- signing / supply chain
- logging / privacy

</div>
<div>

## 자산 단위

- main executable
- updater
- installer
- service binary
- helper process
- plugin folder
- registry key
- named pipe

</div>
</div>

---

# 항목별 실행 포맷

```text
[Checklist Item]
ID: WIN-DLL-001
Asset: Updater.exe
Hypothesis: Updater.exe가 사용자 쓰기 가능 경로에서 DLL을 로드할 수 있다.
Method: Procmon + static import/path review
Evidence:
  - raw: docs/evidence/<run-id>/raw/procmon-updater.pml
  - normalized: docs/evidence/<run-id>/normalized/dll-loads.csv
Auditor Result: FAIL candidate
Reviewer Result: Pending
Verifier Result: Pending
Final Status: In Review
```

---

# 순차 실행 원칙

1. 가설 1문장 작성
2. 테스트 방법 명시
3. raw evidence 저장
4. normalized summary 생성
5. Auditor candidate 작성
6. Reviewer가 논리 검토
7. Verifier가 증거 검증
8. Coordinator가 상태 확정
9. Verified 항목만 보고서에 반영
