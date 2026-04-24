---
layout: section
---

# 1. 문제 정의

---
layout: two-cols
---

# Windows 앱 보안감사의 난점

- 감사 표면이 넓음
  - EXE / DLL / MSI / MSIX
  - 서비스, scheduled task, COM, shell extension
  - installer / updater / helper process
- 증적이 흩어져 있음
  - 파일, 레지스트리, 이벤트 로그, 프로세스 트레이스
- LLM 단독 판단은 재현성과 감사성이 약함
- 체크리스트만으로는 실행 상태 추적이 어려움

::right::

# 운영 목표

- 프로젝트 현황을 먼저 파악
- 체크리스트를 자산별 작업으로 분해
- Auditor가 증적 기반 후보 finding 생성
- Reviewer와 Verifier가 독립 검증
- Coordinator가 검증 통과 결과만 채택
- 최종 보고서에는 Verified finding만 반영

---

# 핵심 설계 질문

<div class="text-xl mt-8">
어떻게 하면 LLM을 사용하면서도 보안감사의 <b>재현성, 추적성, 증거성, 권한 통제</b>를 유지할 수 있는가?
</div>

<div class="mt-10 grid grid-cols-2 gap-6">
<div>

## 피해야 할 구조

- 단일 LLM이 모든 판단 수행
- raw evidence 없이 결론 도출
- 체크리스트와 실행 상태 혼합
- MCP에 과도한 실행 권한 부여
- reviewer 없이 finding 확정

</div>
<div>

## 지향할 구조

- 짧은 지침 + 분리된 문서
- skill 기반 반복 절차
- 좁은 subagent 역할
- deterministic tool이 1차 증거 생산
- reviewer / verifier gate

</div>
</div>
