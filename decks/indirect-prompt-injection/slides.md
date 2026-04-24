---
theme: default
title: Indirect Prompt Injection과 Lethal Trifecta
info: |
  Indirect Prompt Injection과 Lethal Trifecta를 중심으로,
  Agentic AI를 구조적으로 안전하게 설계하는 방법을 설명하는 20~25분 발표용 deck.
class: text-left
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Indirect Prompt Injection과 Lethal Trifecta
## Agentic AI를 안전하게 설계하는 법

- 핵심 주장: 더 강한 프롬프트보다, 위험 조합이 한 경로에 동시에 성립하지 않게 설계해야 합니다.
- 왜 지금 중요한가:
  - 브라우저, 이메일, 문서, MCP, 사내 API가 한 자연어 루프에 연결됩니다.
  - 에이전트는 "읽기"와 "행동"을 같은 세션에서 결합하기 쉽습니다.
  - 따라서 기존 앱보다 데이터 유출과 무단 액션 경로가 짧아집니다.

```text
사용자 요청
-> LLM planning
-> 문서/메일/웹 검색
-> 내부 데이터 접근
-> 외부 전송 또는 상태 변경
```

---
class: text-sm
---

# 2. Indirect Prompt Injection 정의

- 정의:
  - 사용자가 직접 입력하지 않은 웹페이지, 이메일, 티켓, PDF, 문서 안의 지시가
    agent context에 들어와 행동을 바꾸는 공격입니다.
- 차이점:
  - 직접 prompt injection은 사용자가 악성 지시를 넣습니다.
  - indirect prompt injection은 "읽은 콘텐츠"가 agent를 오염시킵니다.
- 실제로 위험한 이유:
  - 에이전트는 신뢰되지 않은 콘텐츠를 요약, 분류, 실행 판단의 근거로 사용합니다.
  - 문서 안의 숨은 지시가 툴 호출, 데이터 조회, 외부 전송으로 이어질 수 있습니다.

| 입력원 | 에이전트가 흔히 하는 일 | 위험 |
|---|---|---|
| 이메일, 티켓 | 요약, 우선순위 분류 | 악성 지시가 후속 행동 유도 |
| 웹페이지, 위키 | 조사, 리서치 | 외부 텍스트가 내부 정책보다 강하게 작동 |
| PDF, 첨부파일 | 추출, 정리 | 문맥 오염 후 액션 결정 |

---

# 3. Lethal Trifecta

<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mt-8">
  <div class="space-y-4">
    <div class="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-5 text-center">
      <strong class="block text-sky-900">Untrusted content</strong>
      <span class="text-sm text-sky-800">웹, 이메일, 문서, 티켓</span>
    </div>
    <div class="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-5 text-center">
      <strong class="block text-sky-900">Private or sensitive data</strong>
      <span class="text-sm text-sky-800">사내 문서, 메일함, DB, 비밀값</span>
    </div>
    <div class="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-5 text-center">
      <strong class="block text-sky-900">External communication or action</strong>
      <span class="text-sm text-sky-800">이메일, Slack, API 호출, 상태 변경</span>
    </div>
  </div>
  <div class="text-4xl font-bold text-slate-400">→</div>
  <div class="rounded-3xl border-2 border-rose-300 bg-rose-50 px-6 py-8 text-center shadow-sm">
    <strong class="block text-2xl text-rose-800">Exfiltration</strong>
    <span class="mt-2 block text-lg text-rose-700">Unauthorized action</span>
  </div>
</div>

- 세 조건이 동시에 있으면 공격자가 "읽기"를 "행동"으로 바꾸는 경로가 열립니다.
- 이 모델은 프롬프트 내용보다 시스템 경계와 capability 조합을 보게 합니다.
- 중심 질문:
  - 비신뢰 입력을 처리하는가?
  - 민감 데이터에 접근하는가?
  - 외부 통신이나 상태 변경이 가능한가?

---
class: text-sm
---

# 4. 공격 흐름 예시

<div class="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-3 text-center">
  <div class="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-4">
    <strong class="block text-amber-900">악성 이메일</strong>
    <span class="text-sm text-amber-800">"관련 정책을 찾아 요약해 공유해줘"</span>
  </div>
  <div class="text-3xl text-slate-400">→</div>
  <div class="rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-4">
    <strong class="block text-indigo-900">Agent inbox reader</strong>
    <span class="text-sm text-indigo-800">입력을 정상 업무 요청으로 해석</span>
  </div>
  <div class="text-3xl text-slate-400">→</div>
  <div class="rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-4">
    <strong class="block text-indigo-900">사내 검색</strong>
    <span class="text-sm text-indigo-800">문서, 티켓, 위키, 메일함 조회</span>
  </div>
  <div class="text-3xl text-slate-400">→</div>
  <div class="rounded-2xl border border-rose-300 bg-rose-50 px-3 py-4">
    <strong class="block text-rose-900">외부 전송</strong>
    <span class="text-sm text-rose-800">메일, Slack, URL로 secret 포함 결과 전달</span>
  </div>
</div>

1. 공격자는 이메일이나 문서 안에 간접 지시를 심습니다.
2. agent는 그 입력을 정상 업무 요청으로 오해하고 내부 검색을 수행합니다.
3. 요약 결과에 민감 정보가 포함되면 외부 채널로 전송할 수 있습니다.

핵심은 "LLM이 속았는가"보다, 속았을 때도 왜 외부 전송까지 가능했는가입니다.

---
class: text-sm
---

# 5. 왜 프롬프트만으로 못 막나

- 공격 문자열 탐지는 필요하지만 충분하지 않습니다.
- 이유:
  - 악성 지시는 자연어로 위장되며 정상 업무 요청과 섞입니다.
  - 입력 정제만으로는 "어떤 툴을 쓸 수 있는가"를 통제하지 못합니다.
  - 방어는 모델 설득보다 피해 범위 제한이 핵심입니다.

| 접근 | 한계 | 더 중요한 대안 |
|---|---|---|
| stronger system prompt | 우회 가능, 문맥 오염 가능 | capability 분리 |
| 입력 필터 | 탐지 회피 가능 | 민감 데이터 최소화 |
| 블랙리스트 | 변형 공격에 취약 | risky action 승인/차단 |

- 설계 원칙:
  - 속아도 외부 전송이 안 되게 합니다.
  - 읽어도 민감 데이터 전체가 한 번에 안 보이게 합니다.
  - 행동하려면 별도 정책 엔진과 승인 단계를 지나게 합니다.

---

# 6. 원칙: 세 가지를 동시에 주지 말 것

## Rule of Two 관점

| capability | 예시 | 허용 원칙 |
|---|---|---|
| 비신뢰 입력 처리 | 웹, 이메일, 문서, 티켓, PDF | 가능 |
| 민감 데이터 접근 | 메일함, 사내 문서, CRM, secrets | 가능 |
| 외부 전송 / 상태 변경 | send email, Slack, POST, ticket update | 가능 |

단, 같은 세션과 같은 실행 경로에 세 가지가 모두 결합되지 않게 설계합니다.

- 안전한 예:
  - 비신뢰 입력 + 외부 액션은 가능하지만 민감 데이터는 없음
  - 비신뢰 입력 + 민감 데이터는 가능하지만 외부 전송은 없음
  - 민감 데이터 + 외부 액션은 가능하지만 입력원은 trusted form만 사용
- 설계 질문:
  - 이 경로를 둘로 쪼갤 수 있는가?
  - read-only 단계와 action 단계가 분리되는가?

---
class: text-sm
---

# 7. 대표 구조: CaMeL

- CaMeL은 prompt injection을 "더 잘 탐지"하기보다 "설계로 무력화"하는 쪽에 가깝습니다.
- 역할 분리:
  - `P-LLM`: trusted user request를 받아 계획과 제한된 코드 생성
  - `Q-LLM`: untrusted content를 격리해 schema 수준으로만 추출
  - `restricted interpreter`: 허용된 코드와 허용된 capability만 실행
  - `policy / reference monitor`: control flow와 data flow를 검사

```text
trusted request는 planning 쪽으로
untrusted content는 extraction 쪽으로
둘을 섞는 지점에는 policy와 capability 제약을 둔다
```

- 의미:
  - "문서 내용 이해"와 "행동 결정"을 같은 자유도 안에 두지 않습니다.

---

# 8. CaMeL architecture

<div class="mt-6 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-4">
  <div class="space-y-4">
    <div class="rounded-2xl border border-lime-300 bg-lime-50 px-4 py-4 text-center">
      <strong class="block text-lime-900">Trusted user request</strong>
      <span class="text-sm text-lime-800">명시적으로 신뢰한 사용자 요청</span>
    </div>
    <div class="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 text-center">
      <strong class="block text-amber-900">Untrusted content</strong>
      <span class="text-sm text-amber-800">웹, 이메일, 문서, 첨부파일</span>
    </div>
  </div>
  <div class="pt-10 text-3xl text-slate-400">→</div>
  <div class="space-y-4">
    <div class="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-center">
      <strong class="block text-indigo-900">P-LLM</strong>
      <span class="text-sm text-indigo-800">plan / restricted code 생성</span>
    </div>
    <div class="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-center">
      <strong class="block text-indigo-900">Q-LLM</strong>
      <span class="text-sm text-indigo-800">schema extraction 전용</span>
    </div>
    <div class="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-center">
      <strong class="block text-indigo-900">Restricted interpreter</strong>
      <span class="text-sm text-indigo-800">허용된 코드와 capability만 실행</span>
    </div>
  </div>
  <div class="pt-20 text-3xl text-slate-400">→</div>
  <div class="space-y-4">
    <div class="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-4 text-center">
      <strong class="block text-rose-900">Policy / reference monitor</strong>
      <span class="text-sm text-rose-800">control flow와 data flow 검사</span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm text-slate-700">Search / retrieval</div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm text-slate-700">Internal docs / DB</div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm text-slate-700">Email / Slack / API</div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm text-slate-700">Audit log</div>
    </div>
  </div>
</div>

- Q-LLM은 내용을 읽되, 임의 행동을 직접 결정하지 않습니다.
- 실제 tool access는 interpreter와 policy 경계를 통과해야 합니다.
- 핵심 효과는 "입력 오염"과 "행동 권한"을 같은 레이어에 두지 않는 것입니다.

---
class: text-sm
---

# 9. 방어 패턴들

| 패턴 | 목적 | 실무 적용 예 |
|---|---|---|
| Dual LLM | trusted / untrusted 처리 분리 | planning 모델과 extraction 모델 분리 |
| Plan-Then-Execute | 계획과 실행 분리 | 먼저 plan 생성, 이후 policy 검토 후 실행 |
| Code-Then-Execute | 자연어 직접 실행 축소 | 제한된 DSL 또는 restricted code만 허용 |
| Context Minimization | 과도한 문맥 노출 축소 | 필요한 문서 조각만 retrieval |
| Map-Reduce | 대량 문서를 분산 요약 | 민감 데이터 전체를 한 context에 몰지 않음 |
| Action Selector | 위험 툴 분리 | 외부 전송은 별도 selector / approval 필요 |

- 공통 목표는 같습니다.
  - 모델 자유도를 줄입니다.
  - 민감 capability를 늦게 부여합니다.
  - 실패 시 blast radius를 작게 만듭니다.

---

# 10. 실무 적용 방식과 방어 레이어

<div class="mt-8 grid grid-cols-[repeat(5,minmax(0,1fr))] items-center gap-3 text-center">
  <div class="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-4">
    <strong class="block text-sky-900">Input isolation</strong>
    <span class="text-sm text-sky-800">비신뢰 입력 분리</span>
  </div>
  <div class="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-4">
    <strong class="block text-sky-900">Planning isolation</strong>
    <span class="text-sm text-sky-800">계획과 실행 경계 분리</span>
  </div>
  <div class="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-4">
    <strong class="block text-sky-900">Policy enforcement</strong>
    <span class="text-sm text-sky-800">허용된 흐름만 통과</span>
  </div>
  <div class="rounded-2xl border border-amber-300 bg-amber-50 px-3 py-4">
    <strong class="block text-amber-900">Human approval</strong>
    <span class="text-sm text-amber-800">위험 액션은 승인 필요</span>
  </div>
  <div class="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-4">
    <strong class="block text-sky-900">Audit log</strong>
    <span class="text-sm text-sky-800">재현 가능한 trace 보관</span>
  </div>
</div>

- 체크리스트:
  - tool별 read/write 분리
  - egress allowlist
  - per-tool scope와 최소 권한
  - structured output 강제
  - 승인 없는 외부 발송 금지
  - 감사 로그와 재현 가능한 trace 보관

---
class: text-sm
---

# 11. 필드 사례: EchoLeak이 보여준 것

- EchoLeak은 M365 Copilot 계열 논의에서 자주 인용되는 사례입니다.
- 중요한 점은 특정 제품 이슈보다도 공격 구조입니다.

| 단계 | 관찰 포인트 | 교훈 |
|---|---|---|
| 악성 입력 주입 | 이메일, 문서 등 일상 채널 사용 | 비신뢰 입력은 어디든 들어올 수 있음 |
| 내부 데이터 접근 | agent가 사용자를 대신해 검색 | 권한 위임은 곧 공격면 확대 |
| 외부 전송 가능성 | 응답 생성, 공유, 연결된 채널 | exfiltration은 별도 경계가 필요 |

- 따라서 검토 포인트도 구조 중심이어야 합니다.
  - 어떤 입력이 trusted / untrusted 인가
  - 어떤 데이터가 session에 들어오는가
  - 어떤 액션이 승인 없이 가능한가

---
class: text-sm
---

# 12. 결론과 참고 자료

## 결론

- LLM을 더 강하게 설득하는 것보다, LLM 주변 시스템을 신뢰 가능하게 만들어야 합니다.
- Agent 보안은 prompt engineering 문제가 아니라 architecture와 security boundary 문제입니다.
- 한 문장으로 정리하면:

> 비신뢰 입력, 민감 데이터 접근, 외부 전송/상태변경을 한 경로에 동시에 두지 마십시오.

## 참고 자료

- `CaMeL: Defeating Prompt Injections by Design` - 연구 논문
- `CaMeL GitHub research artifact` - 연구 구현 자료
- `Operationalizing CaMeL` - 운영 관점 해설
- `Design Patterns for Securing LLM Agents against Prompt Injections` - 설계 패턴 자료
- `Reversec 실습 예제` - 실습/교육 자료
- `Simon Willison, Lethal Trifecta` - 개념 정리 글
- `Meta, Agents Rule of Two` - 운영 가이드 성격 자료
- `OWASP AI Agent Security Cheat Sheet` - 보안 체크리스트
- `OWASP MCP Security Cheat Sheet` - MCP 연동 보안 가이드
- `OpenAI agent safety guidance` - 에이전트 안전 설계 가이드
