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

# Finding 템플릿 핵심 필드

<div class="grid grid-cols-2 gap-6 mt-6">
  <div class="box">
    <h3 class="mt-0">본문에 꼭 들어갈 것</h3>
    <ul>
      <li>ID, 상태, 대상 자산과 버전</li>
      <li>한 줄 요약과 영향</li>
      <li>재현 절차 2~3단계</li>
    </ul>
  </div>
  <div class="box">
    <h3 class="mt-0">검증 정보에 꼭 들어갈 것</h3>
    <ul>
      <li>raw evidence 경로</li>
      <li>normalized summary 경로</li>
      <li>Reviewer / Verifier 결과</li>
    </ul>
  </div>
</div>

<div class="mt-8 p-4 border rounded">
핵심은 긴 문서를 쓰는 것이 아니라, <b>주장·재현 절차·증거 경로</b>가 한 화면에서 바로 이어지게 만드는 것입니다.
</div>

---

# 보고서 작성 원칙

- Verified finding만 본문에 포함
- Draft와 Evidence Gap은 별도 부록
- 경영 요약과 기술 상세 분리
- 각 finding에 evidence path 포함
- 남은 blocker와 다음 액션 명확화
- 추후 재검증 가능한 재현 절차 유지
