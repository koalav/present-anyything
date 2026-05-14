# AI 에이전트의 효과적인 활용 - 대본 소스

이 파일은 `docs/ai-agent-effective-use/index.html` 슬라이드의 원본 대본입니다.
화면 텍스트는 슬라이드에 들어가는 짧은 문장이고, 배경지식은 발표자가 말할 내용입니다.
그림은 아직 제작하지 않고 `visual-assets.md`에 따로 모았습니다. Mermaid로 전환하기 좋은 후보는 `mermaid-diagrams.md`에 따로 정리했습니다.

## 1. 제목

화면 텍스트:

> AI 에이전트의 효과적인 활용
> 채팅형 질의응답에서 실행 가능한 분석 루프로

배경지식 / 발표 멘트:

오늘은 곧바로 Harness나 Agent 정의에서 시작하지 않습니다. 먼저 우리가 일반 채팅형 AI로 일할 때 실제로 어떤 식으로 작업하는지부터 봅니다. 질문하고, 답을 받고, 사람이 복사해서 터미널이나 브라우저나 IDE에 붙이고, 실행 결과를 다시 AI에게 붙여넣는 방식입니다. 이 흐름의 불편함과 한계를 확인한 뒤, 왜 도구와 실행 루프가 필요한지로 넘어갑니다.

필요 그림: `ai-human-report-loop.png` 삽입 완료.
## 1-1. 목차

화면 텍스트:

> 오늘의 흐름
> 1. 채팅형 AI의 한계
> 2. MCP
> 3. Skill
> 4. Agent Workflow
> 5. Effective Instruction
> 6. APK Analyzer

배경지식 / 발표 멘트:

오늘은 먼저 채팅형 AI로 일할 때의 질문, 답변, 복사, 실행 흐름을 봅니다. 그 다음 이 방식이 왜 재현 가능한 감사 결과로 바로 이어지지 않는지 보고, 도구 호출과 MCP가 왜 필요한지로 넘어갑니다. 이후 MCP로 일상 작업을 실행하는 예시를 보고, 반복되는 프롬프트를 Skill로 패키징하는 방식을 정리합니다. 그 다음 Agent Workflow와 Harness 설계를 설명하고, 마지막에는 우리가 만든 APK Analyzer 사례를 다룹니다.

필요 그림: 없음. 텍스트 목차 슬라이드로 충분합니다.

## 1-2. Part 01: 채팅형 AI의 한계

화면 텍스트:

> 채팅형 AI의 한계
> 답변 중심 사용이 왜 실행 가능한 작업 흐름으로 바로 이어지지 않는지 봅니다.

배경지식 / 발표 멘트:

첫 파트는 Agent나 Harness의 결론에서 시작하지 않고, 일반 채팅형 AI 사용 방식의 한계를 먼저 확인합니다. 답변을 받고, 사람이 복사해서 다른 도구에 붙이고, 실행 결과를 다시 가져오는 방식이 왜 보안 감사처럼 상태와 증거가 중요한 작업에서는 부족한지 보는 파트입니다.

필요 그림: 없음. 섹션 구분 슬라이드.

## 2. 일반 채팅형 AI 작업 방식

화면 텍스트:

> 질문 · 답변 · 복사 · 실행
> 결과를 다시 붙여넣고 다음 답변을 받습니다.

배경지식 / 발표 멘트:

일반 채팅형 AI로 일을 시작하면 보통 이 흐름이 됩니다. 먼저 질문을 하고, AI가 텍스트 답변을 줍니다. 사람은 그 답변을 복사해서 IDE, 터미널, 브라우저, 분석 도구에 붙여넣고 실행합니다. 실행 결과가 나오면 다시 복사해서 AI에게 붙여넣습니다. 이 방식은 초안 작성이나 짧은 설명에는 충분하지만, 모바일 보안 감사처럼 대상 상태와 실행 증거가 중요한 일에서는 사람이 계속 오케스트레이션해야 합니다.

필요 그림: `chat-ai-tools.png` 삽입 완료.
## 3. 출발점: 답변은 작업 완료가 아닙니다

화면 텍스트:

> 답변은 작업 완료가 아닙니다

배경지식 / 발표 멘트:

대부분의 AI 사용은 질문과 답변에서 시작합니다. 요약, 설명, 초안 작성에는 충분히 강력하지만, 코드나 업무 시스템을 실제로 바꾸는 작업에서는 여기서 끝나지 않습니다. 텍스트 답변은 파일을 수정하지 않았고, 명령을 실행하지 않았고, 검증 증거도 만들지 않았습니다. 그래서 답변은 작업 완료가 아니라 다음 실행을 위한 시작점입니다.

필요 그림: 질문 → 텍스트 답변을 중심에 두고, 주변에 파일 미변경 / 실행 결과 없음 / 검증 증거 없음 / 최신 상태 모름을 배치한 다이어그램. Mermaid로 반영 완료.
## 4. 왜 도구가 필요한가

화면 텍스트:

> 도구가 붙어야
> 상태가 들어옵니다

배경지식 / 발표 멘트:

모델의 파라메트릭 지식은 오래됐을 수 있고, 대상 앱의 Manifest나 build variant, 사내 보안 정책은 모릅니다. 외부 도구는 AndroidManifest, 디컴파일 코드, 디바이스 상태, 실행 로그를 제공합니다. 도구가 붙어야 AI의 답변에 현재 대상 상태가 들어오고, 작업이 지식 생성에서 실행과 상태 확인으로 이동합니다.

필요 그림: Model 밖에서 Web / Files / Shell / Test 결과가 들어오는 그림

## 6. Tool Calling

화면 텍스트:

> 모델이 고른다
> 앱이 실행한다
> 모델이 해석한다

배경지식 / 발표 멘트:

Tool calling은 모델이 직접 모든 것을 실행하는 구조가 아닙니다. 모델이 "jadx를 실행하자", "manifest parser를 호출하자", "Frida로 이 method를 관찰하자"고 판단하면, 애플리케이션이 실제 실행하고, 결과를 다시 모델에 넘깁니다. OpenAI 문서는 이 흐름을 도구 제공, 모델의 tool call, 애플리케이션 실행, 결과 전달, 최종 응답의 다단계 대화로 설명합니다. [R2]

필요 그림: Prompt → Tool Call → Android Tool/MCP → Structured Result → Answer 시퀀스
## 8. MCP 등장

화면 텍스트:

> MCP
> AI용 표준 커넥터

배경지식 / 발표 멘트:

MCP는 AI 애플리케이션과 외부 시스템을 연결하기 위한 오픈 표준입니다. 공식 문서는 MCP를 AI 애플리케이션이 파일, 데이터베이스, 검색 엔진, 계산기, 워크플로에 연결되는 표준 방식으로 설명합니다. 핵심은 "각 도구를 매번 커스텀 연동하지 말고, 표준 방식으로 연결하자"입니다. [R1]

필요 그림: 플러그 / 어댑터 / 표준 포트 이미지
## 9. MCP 구조

화면 텍스트:

> Model이 판단하고
> Client가 연결한다

배경지식 / 발표 멘트:

MCP 호출은 서버가 먼저 시작하는 구조가 아닙니다. Host 안의 AI model이 작업 중 필요한 도구를 판단하고 tool call을 제안하면, Host가 해당 요청을 MCP client를 통해 적절한 MCP server로 보냅니다. 모바일 보안 감사에서는 IDE, audit harness, reverse engineering UI가 각각 Manifest/Source server, JADX/APK server, Frida/Device server, Ghidra/IDA server로 연결될 수 있습니다. MCP 서버는 Tools, Resources, Prompts를 노출할 수 있고, Host는 컨텍스트와 권한 경계를 관리합니다. [R1][R2]

필요 그림: AI Model → Host → 여러 MCP Client → 여러 MCP Server → Tools/Resources/Prompts 구조도
## 10. MCP 이전과 이후

화면 텍스트:

> Before
> 앱마다 커스텀 연동
>
> After
> 서버 하나, 클라이언트 여러 개

배경지식 / 발표 멘트:

커스텀 와이어링 방식에서는 audit UI마다 rg wrapper, jadx script, frida script, Ghidra bridge를 각각 붙입니다. 같은 기능도 IDE 에이전트용 어댑터, 내부 감사 도구용 wrapper, 리버싱 UI용 bridge로 반복 구현됩니다. MCP는 이 연결 지점을 Host 안의 MCP Client와 외부 MCP Server로 분리합니다. 모델은 필요한 도구를 판단하고, Host는 해당 MCP Client를 통해 서버에 요청을 보냅니다. 하나의 Manifest server나 JADX server를 여러 클라이언트에서 재사용할 수 있다는 점이 핵심입니다. [R1]

필요 그림: 왼쪽은 앱별 rg/jadx/frida/Ghidra 커스텀 어댑터, 오른쪽은 여러 Host가 MCP Client를 통해 Manifest/JADX/Frida/Ghidra 서버를 공유하는 구조
## 10-1. Filesystem MCP 예시

화면 텍스트:

> 파일 접근도
> 도구 호출로 제한한다

배경지식 / 발표 멘트:

Filesystem MCP는 가장 이해하기 쉬운 MCP 예시입니다. 에이전트가 직접 임의 파일을 만지는 것이 아니라, Host가 Filesystem MCP Server에 도구 호출을 보내고, 서버는 허용된 디렉터리 안에서만 AndroidManifest, source, decompiled output을 읽고 검색합니다. 그래서 "AI에게 파일 권한을 준다"는 말은 실제로는 "허용된 workspace와 허용된 file tool을 제공한다"에 가깝습니다. 이 구조가 있어야 context 수집, manifest facts 추출, evidence review가 재현 가능해집니다. [R9]

필요 그림: 요청 → Host/Model → MCP Client → Filesystem MCP Server → allowed roots 검사 → read/list/search/parse → manifest/source/JSON → evidence review
## 11. 표준화의 효과

화면 텍스트:

> 여러 클라이언트
> 여러 모델
> 같은 외부 도구

배경지식 / 발표 멘트:

AI 생태계에서 중요한 변화는 "모델만 바꾸는 것"이 아니라 "도구를 연결하는 방식이 재사용 가능해지는 것"입니다. MCP가 USB-C 비유로 설명되는 이유도 이 표준 포트 역할 때문입니다. [R1]

필요 그림: Client × Model × Tool 매트릭스
## 12-1. Mobile Security MCP

화면 텍스트:

> Mobile Security MCP
> Static / Dynamic / Native

배경지식 / 발표 멘트:

모바일 보안 감사에서 제공할 MCP 도구는 세 부류로 나눌 수 있습니다. Static 도구는 jadx, apktool, aapt처럼 APK와 DEX, Manifest를 해석합니다. Dynamic 도구는 adb, Frida, objection처럼 기기에서 실제 동작을 확인합니다. Native 도구는 Ghidra, IDA Pro처럼 `.so` 파일과 native 호출 경로를 분석합니다. 중요한 점은 AI가 도구 자체를 흉내 내는 것이 아니라, 도구가 만든 결과를 해석하게 하는 것입니다.

필요 그림: Static / Dynamic / Native 3분할 카드
## 13. MCP ≠ Agent

화면 텍스트:

> 연결은 시작
> 실행 루프가 핵심

배경지식 / 발표 멘트:

MCP는 도구 연결 표준입니다. 하지만 에이전트가 되려면 목표를 이해하고, 계획하고, 도구를 호출하고, 결과를 보고, 다시 수정하는 루프가 필요합니다.

필요 그림: 플러그와 실행 루프를 구분하는 이미지
## 14. MCP로 일상 작업을 실행합니다

화면 텍스트:

> MCP로 일상 작업을 실행합니다
> "이 repo에서 exported Activity 찾아줘" → AI가 도구를 선택하고 증거를 모읍니다.

배경지식 / 발표 멘트:

MCP가 붙으면 일상적인 요청이 단순 답변이 아니라 도구 실행 작업이 됩니다. 예를 들어 "이 repo에서 exported Activity 찾아줘"라고 하면 AI는 파일 목록을 보고, AndroidManifest를 읽고, `rg`로 source hit를 찾고, XML parser로 component facts를 정리합니다. 사람은 더 이상 답변을 복사해서 터미널에 붙이는 역할만 하지 않고, AI가 도구를 사용해 만든 evidence summary를 검토합니다.

필요 그림: 요청 → AI → MCP tools → list/read/rg/parse → evidence summary 다이어그램. Mermaid로 반영 완료.
## 15. 반복 작업은 프롬프트 패턴이 됩니다

화면 텍스트:

> 반복 작업은
> 프롬프트 패턴이 됩니다
> 주의사항 / 작업 순서 / 사용 툴 / 출력 형식

배경지식 / 발표 멘트:

같은 일을 여러 번 하다 보면 자연스럽게 최적화된 프롬프트가 생깁니다. exported component 감사라면 "어떤 파일은 건드리지 말 것", "manifest에서 시작해 source hit와 permission을 연결할 것", "read_file, rg, manifest parser, jadx를 사용할 것", "component, risk, evidence, caveat, validation command 형식으로 보고할 것" 같은 규칙이 반복됩니다. 이 반복 프롬프트를 파일로 패키징하고, 팀 안에서 관리하고, 필요할 때만 로드할 수 있게 만든 형태가 Skill입니다.

필요 그림: 반복 요청 → 주의사항/순서/툴/출력 형식 → Skill 패키지.
## 16. Skills

화면 텍스트:

> Skills
> 반복되는 감사 절차를 표준화하는 방식입니다

배경지식 / 발표 멘트:

작업 지시의 4요소는 좋은 요청의 기본형입니다. 그런데 권한 검토, WebView 점검, exported component 감사, 취약점 triage처럼 반복되는 작업은 매번 같은 절차를 되풀이하게 됩니다. 이런 감사 절차를 형식화해서 에이전트가 필요할 때 재사용하게 만드는 것이 Skill입니다. [R10]

필요 그림: 없음. 섹션 구분 슬라이드.
## 16-1. 반복되는 감사 절차는 Skill로 형식화합니다

화면 텍스트:

> 반복되는 감사 절차는
> Skill로 형식화합니다

배경지식 / 발표 멘트:

Skill은 모델을 새로 학습시키는 fine-tuning이 아닙니다. 매번 적던 절차, 체크리스트, 스타일 가이드, 팀 규칙, 검증 명령을 파일로 패키징하는 방식입니다. 즉 "목표, 범위, 제약, 검증" 같은 좋은 지시 형식을 팀의 표준 감사 workflow로 만들어두는 것입니다. [R10]

필요 그림: 반복 감사 절차 → reusable audit workflow 변환.
## 16-2. Skill은 절차 패키지입니다

화면 텍스트:

> Skill은 실행 도구가 아니라
> 절차 패키지입니다

```text
my-skill/
├── SKILL.md      # metadata + instructions
├── scripts/      # optional executable code
├── references/   # policies, API specs, checklists
└── assets/       # templates, examples, static files
```

배경지식 / 발표 멘트:

Agent Skills 표준에서 skill은 최소한 `SKILL.md`를 포함하는 폴더입니다. `SKILL.md`에는 `name`, `description`, 에이전트가 따라야 할 지시문이 들어가고, 필요하면 `scripts/`, `references/`, `assets/` 같은 보조 파일을 둘 수 있습니다. Codex와 Claude 문서도 같은 구조를 사용합니다. [R10]

필요 그림: Skill folder tree. 현재 본문에 텍스트 카드로 반영.
## 16-3. Tool / MCP / Skill 차이

화면 텍스트:

> Tool
> 실행 가능한 기능
>
> MCP
> 외부 도구 연결 표준
>
> Skill
> 도구를 쓰는 업무 절차

배경지식 / 발표 멘트:

가장 중요한 구분은 실행 능력과 업무 절차의 차이입니다. `bash`, `read_file`, `jadx`, `adb`, `frida`는 실행 가능한 도구입니다. MCP는 이런 도구와 외부 데이터를 표준 방식으로 연결하는 프로토콜입니다. Skill은 그 도구들을 어떤 순서로 사용하고, 어떤 기준으로 성공과 실패를 판단할지 정한 runbook입니다. 짧게 말하면 Tool은 action primitive이고, Skill은 그 primitive를 사용하는 reusable procedure입니다. [R1][R2][R10]

필요 그림: Tool / MCP / Skill 3분할 비교.
## 16-4. Skill은 필요한 때만 로드됩니다

화면 텍스트:

> Discovery
> Activation
> Execution

배경지식 / 발표 멘트:

Skill의 핵심은 progressive disclosure입니다. 시작 시점에는 skill의 `name`과 `description` 정도만 보고, 사용자 요청이 description과 맞을 때 전체 `SKILL.md`를 읽습니다. 그 뒤에 필요할 때만 `references/`, `scripts/`, `assets/`를 읽거나 실행합니다. 그래서 긴 사내 정책이나 API 명세를 항상 system prompt에 넣지 않고, 필요한 작업에서만 꺼내 쓸 수 있습니다. [R10]

필요 그림: name/description → SKILL.md → references/scripts/assets → tool 실행 흐름. Mermaid로 반영 완료.
## 16-5. Skill 후보

화면 텍스트:

> android-audit
> webview-audit
> open-components

배경지식 / 발표 멘트:

Skill은 단순 질의응답보다 절차가 중요한 작업에 잘 맞습니다. 예를 들어 Android 보안 감사는 Manifest, storage, network, crypto, logging 점검 순서가 중요합니다. WebView 감사는 bridge, file access, mixed content, 허용 목록을 순서대로 봐야 하고, open components 감사는 exported, permission, intent-filter, deep link를 구조화해서 비교해야 합니다.

필요 그림: Skill 후보 카드.
## 16-6. 좋은 Skill 작성 방식

화면 텍스트:

> 좋은 Skill은
> 작업 지시서처럼 씁니다

```markdown
---
name: android-open-components
description: Use when auditing exported Android components, deep links, and missing permissions.
---

Goal: Find externally reachable Android components.
Inputs: merged-manifest.json, jadx source map, references/android-component-policy.md
Procedure:
1. Parse manifest into structured component records.
2. Join each component with source and permission context.
3. Ask the model to judge risk, not to rediscover facts.
Output: component table, evidence, risk, validation command.
```

배경지식 / 발표 멘트:

좋은 Skill은 설명문이 아니라 작업 지시서에 가깝습니다. 하나의 skill은 하나의 일에 집중시키고, `description`에는 언제 자동으로 쓰면 되는지 구체적으로 적습니다. 본문에는 입력, 절차, 검증 명령, 출력 형식을 명령형으로 둡니다. 긴 정책은 `references/`로 분리하고, grep이나 schema validation처럼 결정적인 반복 처리는 `scripts/`에 둡니다. [R10]

필요 그림: Skill template 카드. 현재 본문에 텍스트 카드로 반영.

## 17. Agent Workflow

화면 텍스트:

> Agent Workflow
> MCP 도구와 Skill 절차를 실행 루프로 연결합니다.

배경지식 / 발표 멘트:

좋은 에이전트는 한 번 답하고 끝나지 않습니다. MCP로 연결된 도구를 사용하고, Skill에 정의된 절차와 주의사항을 따르며, 실행 결과를 관찰한 뒤 실패하면 수정합니다. 코딩, 디버깅, 취약점 탐색 모두 이 루프가 중요합니다. Gemini CLI 문서도 ReAct 루프와 도구, MCP 서버를 이용해 버그 수정, 기능 개발, 테스트 커버리지 개선을 수행한다고 설명합니다. [R5]

필요 그림: User task → Skill 절차 → Plan/Act/Observe/Revise 루프, Act 단계에 MCP tools가 연결되고 evidence report로 닫히는 다이어그램. Mermaid로 반영 완료.

## 17-0. Agent 정의

화면 텍스트:

> Agent = Model + Context + Tools + Verification

배경지식 / 발표 멘트:

여기서 Agent 정의가 나옵니다. 에이전트는 단순 챗봇이 아니라 모델, 작업 대상 컨텍스트, MCP로 연결된 외부 도구, Skill로 정의한 절차, 검증 증거가 결합된 실행 루프입니다. 모바일 보안 감사에서는 Android 앱 컨텍스트, 파일과 shell, ADB와 Frida 같은 도구, 그리고 결과를 확인하는 evidence가 필요합니다. OpenAI의 도구 문서도 모델이 도구 호출을 제안하고 애플리케이션이 실행 결과를 다시 모델에 전달하는 흐름을 설명합니다. [R2][R7]

필요 그림: Model + Context + Tools + Skill + Verification이 Agent loop로 합쳐지는 다이어그램. Mermaid로 반영 완료.

## 17-1. 모바일 보안 감사 에이전트

화면 텍스트:

> Codex
> Claude Code
> Gemini CLI
> = Audit Harness

배경지식 / 발표 멘트:

모바일 보안 감사 에이전트는 단순 모델이 아닙니다. 모델을 Android 분석 작업에 맞게 실행하는 harness입니다. 파일 시스템, 터미널, 검색, manifest parser, jadx, adb, Frida 같은 도구가 붙습니다. Codex CLI나 Claude Code 같은 코딩 에이전트는 repo와 명령 실행을 다룰 수 있고, 여기에 모바일 분석 도구를 MCP로 붙이면 감사 작업으로 확장됩니다. [R3][R4][R5]

필요 그림: 터미널 위에서 동작하는 AI 에이전트 이미지
## 17-2. 코딩 에이전트의 공통 구조

화면 텍스트:

> LLM
> Tool layer
> Planning / Action / Observe / Retry
> Context management
> Execution and verification

배경지식 / 발표 멘트:

Claude Code, OpenAI Codex CLI, Gemini CLI, Cursor 같은 계열은 세부 UX는 달라도 구조적으로 비슷합니다. LLM 자체, 도구 호출 레이어, 작업 루프, 컨텍스트 관리, 검증/실행 환경의 조합입니다. 결국 본질은 `LLM + Tool Harness + Execution Loop`입니다.

필요 그림: Mermaid로 반영 완료. 코딩 에이전트 공통 구조.
## 17-3. 기본 제공 도구

화면 텍스트:

> Read
> Search
> Parse
> ADB
> Frida
> MCP

배경지식 / 발표 멘트:

모바일 보안 감사의 기본 도구는 코드 읽기, manifest 검색, 구조화 parse, ADB 실행, Frida hook, MCP 호출입니다. 여기에 jadx, aapt, Ghidra, IDA Pro 같은 도구를 붙이면 모델이 직접 추측하지 않고 실제 분석 결과를 해석할 수 있습니다. 셸 실행과 device 접근은 강력하지만 위험하므로 샌드박스, 허용 목록, 차단 목록, 로그가 필요합니다. [R4][R7]

필요 그림: Manifest, 검색, 터미널, 증거 체크 아이콘
## 17-4. 파일 접근과 코드 탐색

화면 텍스트:

> Manifest
> exported, permission, intent-filter
>
> Search
> rg, fd, grep, jadx output
>
> Parse
> merged manifest, XML, call graph

배경지식 / 발표 멘트:

가장 기본은 AndroidManifest와 코드 접근입니다. 초기형은 `find . -name AndroidManifest.xml` 후 `rg "exported|intent-filter"`를 돌리는 방식에 가깝습니다. 이 방식도 대체로 맞지만 merged manifest, activity-alias, library manifest, flavor별 manifest를 놓칠 수 있습니다. 고급형은 manifest parser, jadx output, XML parser, call graph를 사용해 facts를 구조화합니다.

필요 그림: 파일/검색/심볼 탐색 3분할 카드.
## 17-5. Shell 실행

화면 텍스트:

> 증거가 있어야
> 진단합니다

```text
./gradlew test
adb shell pm dump
aapt dump xmltree app.apk AndroidManifest.xml
jadx --show-bad-code app.apk
frida -U -f com.example.app
semgrep --config android-audit.yml
```

배경지식 / 발표 멘트:

실행 도구의 가치는 터미널 자체가 아니라 진단 근거입니다. 에이전트가 manifest를 확인하고, APK를 decompile하고, 기기에서 intent를 실행하고, Frida로 runtime 동작을 관찰할 수 있게 됩니다. Claude Code 류는 사실상 `LLM + bash harness`에 가깝지만, 이 기능은 위험하기 때문에 권한 제한과 로그가 필수입니다.

필요 그림: 터미널 명령 카드.
## 17-6. 컨텍스트 선택과 압축

화면 텍스트:

> 대형 repo는 다 넣을 수 없습니다
> 관련 파일만 선택
> 중요 함수만 추출
> 최근 수정 파일 우선
> dependency graph와 summary memory 활용

배경지식 / 발표 멘트:

대형 repository는 전체를 context window에 넣을 수 없습니다. 그래서 관련 파일만 선택하고, 중요 함수만 추출하고, 최근 수정 파일을 우선하고, dependency graph 기반으로 범위를 줄이고, summary memory를 활용해야 합니다. 이 부분이 잘되면 토큰을 줄이고, hallucination을 낮추고, 탐색 속도를 올릴 수 있습니다.

필요 그림: 큰 repo에서 관련 파일만 좁히는 funnel.
## 17-7. 현업 성능을 가르는 진짜 도구

화면 텍스트:

> Very important
> manifest parser · jadx · aapt · adb · frida · evidence log
>
> Boosters
> Ghidra · IDA Pro · call graph · taint rules · structured extractor

배경지식 / 발표 멘트:

실제 성능 차이를 만드는 것은 fancy UI나 chat 스타일보다 추출, 실행, 검증 루프 품질입니다. 매우 중요한 것은 manifest parser, jadx, aapt, adb, Frida, evidence log입니다. 여기에 Ghidra, IDA Pro, call graph, taint rule, structured extractor가 붙으면 성능이 크게 올라갑니다.

필요 그림: 핵심 도구와 성능 booster 비교.
## 17-8. 모바일 보안 감사 Harness 확장

화면 텍스트:

```text
LLM
 ├─ manifest parser / rg / structured extractor
 ├─ jadx / apktool / aapt: APK와 DEX 정적 분석
 ├─ adb / Frida / objection: 기기 실행과 런타임 확인
 ├─ Semgrep / androguard: 규칙 기반 코드 점검
 └─ Ghidra / IDA Pro: native library 분석
```

배경지식 / 발표 멘트:

모바일 보안 감사에서는 일반 코딩 도구에 Android와 분석 도구가 더 붙습니다. jadx는 DEX를 Java/Kotlin에 가까운 형태로 탐색하게 해주고, apktool/aapt는 manifest와 resource를 확인하게 해줍니다. adb와 Frida는 기기에서 실제 동작을 검증하게 해주고, Ghidra와 IDA Pro는 native library 분석에 필요합니다. 중요한 점은 도구를 많이 붙이는 것이 아니라, 어떤 도구를 언제 쓰고 어떻게 검증할지 Harness가 정해야 한다는 것입니다.

필요 그림: 보안/리버싱 도구 트리. 현재 본문에 텍스트 카드로 반영.
## 17-9. 에이전트 작업 방식

화면 텍스트:

> 사람 일을 보조하거나 대체합니다
> Human work
> Tool / Harness
> AI judgment
> Human follow-up

배경지식 / 발표 멘트:

감사 Harness는 사람이 하던 업무 중 귀찮고 결정적인 부분을 대신합니다. APK/source를 로드하고, Manifest와 decompiled code에서 facts를 추출하고, 필요한 명령을 실행합니다. AI는 그 facts를 바탕으로 코드 분석, PoC 시도, 취약점 여부 진단을 수행합니다. 사람은 evidence report를 보고 최종 판단과 후속 조치를 담당합니다. [R4]

필요 그림: Human work → Tool/Harness → AI judgment → Evidence report → Human follow-up 파이프라인
## 17-10. 실제 루틴: Open components 찾기

화면 텍스트:

> Open components를 찾는 루프
> find AndroidManifest → rg → 후보 해석 → structured JSON → AI 판단

배경지식 / 발표 멘트:

예를 들어 "Android open components 찾아줘"라고 하면 일반 code agent는 `find`로 AndroidManifest를 찾고 `rg`로 `exported`나 `intent-filter`를 검색합니다. 대체로 맞는 결과를 낼 수 있지만 merged manifest, activity-alias, library manifest, flavor별 manifest를 놓칠 수 있고, AI가 파일을 많이 읽으면 시간과 비용이 커집니다. 이런 결정적인 output은 코드가 structured JSON으로 뽑고, AI는 그 결과의 위험도와 설명을 판단하게 하는 편이 맞습니다.

필요 그림: Mermaid로 반영 완료. Open components 추출 루프.
## 17-11. 실제 요청 예시

화면 텍스트:

> 요청은 이렇게 구체화합니다

```text
목표: Android 앱의 exported component를 찾아 위험도를 판단하세요.
범위: app 모듈의 merged manifest와 decompiled code만 보세요.
제약: 소스 수정 없이 분석 리포트만 작성하세요.
검증: manifest extractor JSON과 aapt 출력이 일치해야 합니다.
보고: component, exported 이유, permission, evidence, risk를 표로 내세요.
```

배경지식 / 발표 멘트:

좋은 요청은 자연어 설명으로 끝나지 않습니다. 에이전트가 어떤 APK/source를 봐야 하는지, 어떤 build variant와 manifest를 기준으로 삼을지, 어떤 extractor 출력으로 성공을 확인할지까지 같이 줍니다. 이렇게 주면 에이전트가 임의로 파일을 많이 읽거나 추측으로 결과를 마치는 위험을 줄일 수 있습니다.

필요 그림: 터미널 프롬프트 카드. 현재 본문에 텍스트 카드로 반영.
## 17-12. 완료 보고 예시

화면 텍스트:

> 끝은 요약이 아니라 증거입니다

```text
Finding: LoginDeepLinkActivity is exported by intent-filter.

Evidence:
- merged-manifest.json: exported=true
- AndroidManifest.xml: intent-filter VIEW/BROWSABLE
- source: reads token from deep link parameter

Risk:
- external app can trigger login flow

남은 리스크:
- dynamic validation on device is still required
```

배경지식 / 발표 멘트:

에이전트의 완료 보고는 "찾았습니다"가 아니라 검증 증거여야 합니다. component 이름, exported 이유, permission, source evidence, 실행한 명령, 남은 리스크가 있어야 사람이 빠르게 리뷰할 수 있습니다. 이 구조가 있어야 에이전트 작업을 팀 보안 감사 프로세스 안으로 넣을 수 있습니다.

필요 그림: 터미널 실행 결과 카드. 현재 본문에 텍스트 카드로 반영.
## 18. 효과적인 지시와 Harness 설계

화면 텍스트:

> 효과적인 지시와
> Harness 설계
>
> 적은 토큰으로 정확한 결과를 만드는 작업 구조

배경지식 / 발표 멘트:

AI에게 효과적으로 지시한다는 것은 말을 길게 쓰는 것이 아닙니다. 모델이 해야 할 일을 좁히고, 필요한 컨텍스트만 제공하고, 정해진 도구와 루프 안에서 실행하게 만드는 것입니다. 좋은 Harness일수록 불필요한 토큰을 줄이고, 잘못된 파일이나 도구를 보는 확률을 낮추고, 여러 번 돌려도 비슷한 결과를 만듭니다.

필요 그림: 없음. 섹션 구분 슬라이드.

## 18-0. 지시와 Hook의 차이

화면 텍스트:

> 도구만으로는 부족합니다
> "하지 마"는 확률적이고, Hook은 결정적입니다.

배경지식 / 발표 멘트:

도구를 붙이면 새로운 문제가 생깁니다. "위험한 명령은 실행하지 마", "승인되지 않은 앱은 건드리지 마" 같은 프롬프트 지시는 모델이 따르도록 유도하는 확률적 가드입니다. 보통은 잘 따르지만, 컨텍스트가 길어지거나 목표가 충돌하거나 tool call이 복잡해지면 실패할 수 있습니다. 반대로 Hook이나 runtime policy는 실행 직전에 tool call을 가로채고 allowlist, 권한, 경로, package, device scope, 로그, 종료 조건을 검사합니다. 금지된 명령은 모델이 어떻게 요청했든 실행되지 않습니다. 그래서 안전과 재현성은 "하지 마"라는 말보다 Harness의 결정적 차단 지점에서 나옵니다.

필요 그림: Prompt guard와 Runtime hook 비교 카드.

## 18-1. AI에게는 일이 아니라 작업 경계를 줍니다

화면 텍스트:

> Goal
> Android Context
> Boundary
> Evidence

배경지식 / 발표 멘트:

AI에게 "잘해줘"라고 말하면 모델은 일반적인 최선 추측으로 움직입니다. 정확도를 높이려면 목표, Android context, 감사 경계, 증거 기준을 분리해서 줘야 합니다. 이 네 가지가 있으면 모델은 탐색 범위를 줄이고, 불필요한 파일을 덜 읽고, 검증 가능한 결과로 닫을 수 있습니다.

필요 그림: Goal / Context / Boundary / Verify 4개 카드. 현재 본문에 steps로 반영.
## 18-2. 정확도는 좋은 선별에서 나옵니다

화면 텍스트:

> 정확도는 넓은 컨텍스트가 아니라
> 좋은 선별에서 나옵니다

배경지식 / 발표 멘트:

컨텍스트를 많이 넣는다고 항상 정확해지는 것은 아닙니다. 관련 없는 파일과 규칙이 많아지면 tool 선택과 판단 방향도 흔들립니다. 좋은 Harness는 사용자 요청을 audit spec으로 바꾸고, Android facts를 extractor로 뽑고, 필요한 정책 context만 고른 뒤, AI에게 위험 판단을 맡깁니다. 이 구조가 토큰 사용량과 오류 가능성을 동시에 줄입니다.

필요 그림: User request → Audit spec → Android facts → policy context → AI risk judgment. Mermaid로 반영 완료.
## 18-3. Harness는 귀찮은 일을 도구화합니다

화면 텍스트:

> Human audit task
> → Audit spec
> → Harness deterministic collection
> → AI judgment
> → Evidence report
> → Human follow-up

배경지식 / 발표 멘트:

사용자의 요청을 그대로 모델에 던지면 결과가 흔들립니다. Harness는 먼저 사람이 하던 감사 작업을 구조화된 audit spec으로 바꿉니다. 그 다음 사용할 도구와 device 권한을 제한하고, Manifest 파싱, 후보 수집, 명령 실행 같은 결정적인 일을 수행합니다. AI는 그 결과를 근거로 분석, PoC 시도, 취약점 진단을 하고, 사람은 증거 보고를 기반으로 후속 조치를 결정합니다.

필요 그림: Mermaid로 반영 완료. Harness 작업 흐름.
## 18-4. 좋은 Harness의 구성 요소

화면 텍스트:

> Human Workflow Map
> Tool / Harness
> Android App Context
> AI Judgment Boundary
> Stop Conditions
> Human Follow-up

배경지식 / 발표 멘트:

필수 요소는 여섯 가지입니다. 첫째, 사람이 하던 감사 업무를 분해하는 Human Workflow Map. 둘째, 귀찮고 결정적인 처리를 코드화하는 Tool/Harness. 셋째, Manifest, Gradle, API 정책 같은 Android App Context. 넷째, 코드 분석, PoC 시도, 취약점 진단을 AI에게 맡기는 판단 경계. 다섯째, 성공, 실패, 질문, 예산 초과를 정하는 Stop Conditions. 여섯째, 사람이 최종 분석, 조치, 티켓, 패치를 진행하는 Human Follow-up입니다.

필요 그림: 6개 블록 체크리스트.
## 18-5. 귀찮고 결정적인 일은 Harness가 합니다

화면 텍스트:

> Code agent only: find AndroidManifest + rg
> Structured extractor: merged manifest → JSON

배경지식 / 발표 멘트:

예를 들어 open components는 결정적인 output을 만들 수 있는 사안입니다. Code agent에게만 맡기면 사람이 하던 것처럼 `find AndroidManifest`와 `rg`를 반복해서 대체로 맞는 결과를 만들 수 있지만, merged manifest, alias, library manifest를 놓칠 수 있고 시간과 AI 호출 비용이 듭니다. 이런 경우에는 Harness가 manifest를 parse해 structured JSON을 만들고, AI에게는 취약점 여부와 영향 판단만 맡기는 것이 옳습니다.

필요 그림: 정보 funnel 다이어그램.
## 18-6. 재현성은 도구 증거에서 나옵니다

화면 텍스트:

> Input
> Tool
> Env
> Log

배경지식 / 발표 멘트:

재현성은 모델에게 "잘해줘"라고 말해서 생기지 않습니다. 같은 APK/source, 같은 parser와 명령어, 같은 API level과 기기 상태, 그리고 실행 로그와 JSON이 있어야 합니다. Harness는 이 네 가지를 고정해야 합니다. 그래야 여러 번 실행해도 비슷한 결과가 나오고, 사람이 결과를 검토할 수 있습니다.

필요 그림: Input / Tool / Env / Log 4요소 다이어그램.
## 18-7. 종료 조건을 Harness에 박아둡니다

화면 텍스트:

> pass → report
> known failure → revise
> unclear → ask
> budget exceeded → stop

배경지식 / 발표 멘트:

에이전트가 끝없이 반복하는 것을 막으려면 종료 조건이 필요합니다. 검증 명령과 evidence check가 통과하면 증거를 보고하고 끝냅니다. 원인이 분명한 실패면 정해진 범위 안에서 다시 확인합니다. 불명확하면 사용자에게 선택지를 제시합니다. 반복 횟수나 시간, 토큰 예산을 넘으면 현재까지의 발견을 보고하고 멈춰야 합니다.

필요 그림: Mermaid로 반영 완료. 종료 조건 분기.
## 18-8. 불명확하면 바로 실행하지 않습니다

화면 텍스트:

> Bad
> 모바일 앱 취약점 찾아줘
>
> Better
> 감사 범위와 산출물을 좁힙니다

배경지식 / 발표 멘트:

사용자 입력이 불명확하면 바로 실행하지 않는 것이 좋습니다. Harness는 내부적으로 요청을 분해하고, open components, WebView, storage, crypto처럼 가능한 감사 항목을 몇 개로 좁힌 뒤 사용자에게 선택지를 줍니다. 모델의 긴 추론 과정을 그대로 보여줄 필요는 없지만, 결과적으로 "이 APK의 어떤 범위를 볼까요"처럼 사용자가 스스로 구체화할 수 있게 해야 합니다.

필요 그림: Bad request vs Better request 비교.
## 18-9. 웹뷰 취약점 요청을 구조화합니다

화면 텍스트:

> 1. 취약점 후보군 나열
> 2. manifest / jadx scan
> 3. 허용 목록 / bridge 확인
> 4. ADB / Frida 증거 보고

배경지식 / 발표 멘트:

"웹뷰 취약점 찾아줘"는 너무 큽니다. 먼저 후보군을 나열해야 합니다. 예를 들어 JavaScript bridge 노출, file access, mixed content, allowlist 우회, 외부 URL 로딩 같은 항목입니다. 그 다음 manifest와 WebView 설정, `addJavascriptInterface` 사용 여부를 jadx output에서 정적으로 검사합니다. 더 좋은 Harness는 ADB와 Frida로 WebView 실행 경로와 bridge 호출을 확인할 도구까지 제공합니다.

필요 그림: 웹뷰 취약점 점검 프로세스.
## 18-10. 더 좋은 Harness는 확인 도구를 제공합니다

화면 텍스트:

> 후보군
> 정적 검사
> 동적 확인
> ADB / Frida 검증
> 증거 보고

배경지식 / 발표 멘트:

좋은 Harness는 "무엇을 체크할지"만 알려주지 않고, 확인할 수 있는 도구를 제공합니다. 웹뷰 보안에서는 jadx로 `addJavascriptInterface`와 WebView 설정을 찾고, ADB로 Activity를 실행하고, Frida로 bridge 호출이나 allowlist 우회 여부를 관찰할 수 있습니다. 도구가 facts와 증거를 만들고, AI는 그 결과가 실제 취약점인지 판단하게 해야 합니다.

필요 그림: 도구 기반 검증 카드. 현재 본문에 텍스트 카드로 반영.
## 29. APK Analyzer

화면 텍스트:

> APK Analyzer
> 재현 가능한 APK 분석 파이프라인 위에 LLM 탐색 Harness를 얹습니다.

배경지식 / 발표 멘트:

지금까지 바람직한 Harness가 어떤 구조여야 하는지 봤습니다. 이제 그 구조를 우리가 만든 APK Analyzer에 어떻게 적용했는지 소개합니다. 핵심은 "LLM에게 APK를 다 읽고 판단하라"가 아니라, deterministic 분석 파이프라인이 먼저 사실을 만들고, LLM은 제한된 tool loop 안에서 탐색, 우선순위화, 요약, 시나리오 리뷰를 맡는 구조입니다.

필요 그림: APK Analyzer 파이프라인 로고/개념 이미지
## 29-1. 전체 아키텍처

화면 텍스트:

> 전체 아키텍처

배경지식 / 발표 멘트:

전체 흐름은 먼저 APK 업로드나 분석 요청에서 시작하고, job workspace가 만들어진 뒤 로컬 분석 worker가 deterministic artifact를 만듭니다. 그 다음 LLM task queue가 생성되고, 공통 LLM 호출 레이어를 통해 finding별 follow-up을 수행합니다. 마지막 report 종합 분석, scenario review, autonomous 분석은 전체 요약 다이어그램에서는 하나의 review block으로 묶어 보여줍니다. 이 세 단계는 목적은 다르지만 모두 "개별 finding을 넘어서 보고서와 공격 시나리오를 다시 해석하는 단계"이기 때문입니다.

필요 그림: 전체 흐름 요약 다이어그램. Report / Scenario / Autonomous는 하나의 review block으로 축약.
## 29-2. LLM Invocation Layer

화면 텍스트:

> LLM Invocation Layer

배경지식 / 발표 멘트:

LLM 호출은 각 기능이 제각각 직접 실행하지 않고 `LlmInvocationSpec`과 `LlmRuntimePort`를 거쳐 실행됩니다. provider는 `APK_ANALYSIS_LLM_PROVIDER`로 선택하고, 현재는 `codex` 경로와 `api_harness` 경로를 나눠 볼 수 있습니다. Codex 경로는 prompt와 context files를 구성한 뒤 `codex exec --json --ephemeral`을 실행하고 `output.json`, `llm-cli-exec.txt`, metrics를 남깁니다. API Harness 경로는 `harness-request.json`을 만들고 `llm_harness` CLI의 `run-spec`을 실행한 뒤 OpenAI-compatible API를 호출합니다. 이 경로에서는 `rg`, `read_file`, `list_dir`, lookup 같은 tool loop를 거쳐 strict JSON output을 만들고, `output.json`, `tool-trace.jsonl`, metadata를 저장합니다.

필요 그림: LLM Runtime abstraction과 codex/api_harness provider 분기 다이어그램.
## 29-3. Finding별 LLM Follow-up

화면 텍스트:

> finding-1 context.json
> finding-2 context.json
> finding-N context.json
> LLM 호출 레이어
> raw/finding_follow_up
> Report 종합 분석 시작

배경지식 / 발표 멘트:

개별 finding 분석은 finding마다 `context.json`을 만들고 같은 LLM 호출 레이어를 반복 호출합니다. 결과는 각 finding의 summary와 report로 저장되고, raw artifact 아래 follow-up 결과가 남습니다. 이 단계는 "모델이 전체 APK를 다시 읽는 것"이 아니라, 로컬 분석이 만든 finding과 관련 evidence를 좁혀서 추가 해석하는 단계입니다. 이 산출물이 다음 report 종합 분석의 입력이 됩니다.

필요 그림: Finding별 follow-up 다이어그램.
## 29-4. Report 종합 분석

화면 텍스트:

> 기존 findings + follow-up 결과 통합
> evidence preview / summary context
> Report-level LLM audit
> executive summary + priority
> report summary + XML 반영

배경지식 / 발표 멘트:

Report 종합 분석은 finding 하나를 더 보는 단계가 아니라 보고서 전체를 다시 보는 단계입니다. 기존 findings와 follow-up 결과를 통합하고, evidence preview와 summary context를 만든 뒤, report-level LLM audit을 호출합니다. 결과는 executive summary, 우선순위, caveat로 정리되고 report summary로 생성되어 XML report에도 반영됩니다.

필요 그림: Report 종합 분석 다이어그램.
## 29-5. Scenario Review

화면 텍스트:

> 현재 앱 주요 findings / report summary
> 다른 앱 취약점 후보 조회
> scenario context
> Scenario Review LLM
> validation plan / caveat
> scenario-review 산출물

배경지식 / 발표 멘트:

Scenario Review는 현재 앱 안의 finding만 보지 않고, 자체 DB에서 다른 앱의 유사 취약점 후보를 함께 조회합니다. package, component, deeplink, WebView, permission 같은 유사도를 기준으로 관련 후보를 가져오고, 현재 앱 후보와 다른 앱 후보 source를 묶어 scenario context를 만듭니다. LLM은 이 context에서 실제 공격 시나리오 후보를 고르고 validation plan과 caveat를 정리합니다.

필요 그림: Scenario Review 다이어그램.
## 29-6. Autonomous 분석

화면 텍스트:

> attack surface + candidate pool
> 반복 LLM 분석
> candidate merge / memory
> candidate 검증 및 filtering
> autonomous-security-review

배경지식 / 발표 멘트:

Autonomous 분석은 단일 최종 호출이 아니라 반복 구조입니다. 먼저 attack surface와 candidate pool을 초기화하고, LLM 분석을 반복하면서 candidate merge와 memory 갱신을 수행합니다. 마지막에는 후보를 다시 검증하고 filtering해서 autonomous-security-review 산출물을 만듭니다. 핵심은 최종 결과를 모델 응답 하나에 맡기지 않고, 후보 풀과 merge/filter 과정을 backend가 관리한다는 점입니다.

필요 그림: Autonomous 분석 다이어그램.
## 29-7. APK Analyzer Pipeline

화면 텍스트:

> APK Analyzer Pipeline

배경지식 / 발표 멘트:

APK Analyzer는 APK 업로드나 CLI 입력을 받아 fingerprint를 고정하고, decompile, manifest analysis, network security analysis, certificate analysis, Semgrep source scan, SBOM inventory 같은 정적 분석을 수행합니다. 결과는 XML report와 JSON read model로 저장되고, backend API와 frontend UI에서 job history, findings, artifacts, graph, follow-up 결과를 볼 수 있습니다. LLM은 이 산출물 위에서 follow-up, report exploration, scenario review를 수행합니다.

필요 그림: APK 입력 -> 정적 파이프라인 -> API Harness -> Report/UI 흐름
## 29-8. Deterministic Facts

화면 텍스트:

> Deterministic Facts

배경지식 / 발표 멘트:

재현성을 높이기 위해 deterministic하게 처리할 수 있는 부분은 backend toolchain이 맡습니다. manifest component inventory, exported flag, permission attribute, provider authority, deep link intent filter, network security config, signing certificate, Semgrep rule hit, source line evidence는 먼저 artifact로 남깁니다. LLM의 최종 응답이 바로 finding이 되는 것이 아니라, artifact와 validation을 통과한 evidence-backed result만 보고서에 들어가야 합니다.

필요 그림: LLM-only와 APK Analyzer 비교 카드
## 29-9. Tool Loop

화면 텍스트:

> Tool Loop

배경지식 / 발표 멘트:

API Harness는 단일 호출이 아니라 반복 구조로 동작합니다. 사용자 task와 context가 들어오면 모델은 `rg`, `read_file`, Android reference lookup 같은 allowlist된 도구 호출을 제안합니다. Harness는 실제 도구를 실행하고 결과를 evidence ledger에 저장한 뒤 다음 모델 호출에 다시 넣습니다. 충분한 근거가 쌓이면 finalization 호출로 넘어가고, 최종 출력은 provider structured output과 local schema/evidence validation을 모두 통과해야 합니다.

필요 그림: Tool loop와 evidence ledger 다이어그램
## 29-10. Android Reference

화면 텍스트:

> Android Reference

배경지식 / 발표 멘트:

Android 보안 분석에서 false positive가 많이 나오는 지점은 permission과 broadcast입니다. exported receiver가 있어도 action이 Android platform protected broadcast라면 일반 서드파티 앱이 임의로 보낼 수 없습니다. 반대로 exported service가 `normal` permission으로만 보호되어 있으면 보호 장치로 보기 어렵습니다. APK Analyzer는 `system_permissions.jsonl`과 `protected-broadcast.jsonl`을 backend data로 가지고 있고, harness tool에도 `android_permission_lookup`, `protected_broadcast_lookup`을 제공합니다. 모델 기억이 아니라 같은 reference lookup 결과를 근거로 판단하기 때문에 신뢰도가 올라갑니다.

필요 그림: permission/protected broadcast lookup 카드
## 29-11. Static Candidate + Skill 검증

화면 텍스트:

> Static Candidate + Skill 검증

배경지식 / 발표 멘트:

기본 flow는 정적 검색으로 취약점 후보군을 찾고, 후보군별로 정의된 skill을 이용해 검증하는 방식입니다. WebView finding이면 WebView skill이 source와 sink, JavaScript 설정, bridge 노출, loadUrl 흐름을 보게 합니다. exported component, deep link, provider, path traversal도 각각 다른 checklist가 필요합니다. Skill은 임의 코드를 실행하는 플러그인이 아니라 Markdown 기반의 분석 지침입니다. 실제 tool grant는 harness policy가 결정합니다. 이 구조가 LLM의 자유 탐색을 줄이고 false positive를 걸러내는 데 중요합니다.

필요 그림: 정적 후보 -> skill 검증 -> evidence-backed finding 흐름
## 29-12. Finding type별 검증 Harness를 준비하고 있습니다

화면 텍스트:

> ADB
> Frida
> WebView
> Ghidra

배경지식 / 발표 멘트:

정적 분석만으로 true positive와 false positive를 완전히 가르기 어렵습니다. 그래서 finding type별 dynamic validation harness를 준비하고 있습니다. ADB는 Activity, deep link, broadcast 실행과 logcat evidence에 필요합니다. Frida는 runtime hook, method trace, WebView 관찰성을 높이는 데 씁니다. WebView DevTools는 console probe, marker URL 도달성 확인에 유용합니다. Ghidra는 native entrypoint와 JNI 흐름 검증을 보조합니다. 중요한 방향은 모델이 임의 명령을 만드는 것이 아니라, 승인된 대상에서 사전 정의된 validation function을 호출하게 하는 것입니다.

필요 그림: ADB / Frida / WebView / Ghidra 4개 카드
## 29-13. WebView + Frida 예제

화면 텍스트:

> Static WebView 후보
> ADB marker URL 실행
> Frida debugging 활성화
> DevTools console probe
> Evidence 저장

배경지식 / 발표 멘트:

예를 들어 정적 분석에서 `addJavascriptInterface`, `setJavaScriptEnabled(true)`, 외부 입력이 `loadUrl`로 들어가는 흐름이 발견됐다고 가정합니다. 먼저 ADB로 승인된 테스트 marker URL을 후보 Activity나 deep link로 실행합니다. 그 다음 Frida로 대상 프로세스에 attach해서 `WebView.setWebContentsDebuggingEnabled(true)`를 호출하고, `loadUrl`과 `evaluateJavascript` 호출을 로깅합니다. WebView debugging이 활성화되면 DevTools console에서 benign JavaScript가 실행 가능한지 확인하고, marker page가 외부 주소 로드나 bridge 도달성을 보여주는지 봅니다. 결과는 logcat, screenshot, DevTools target list, Frida stdout으로 저장합니다. 목적은 공격 수행이 아니라 static hypothesis를 재현 가능한 evidence로 좁히는 것입니다.

필요 그림: WebView dynamic validation sequence
## 29-14. Report-Level Review

화면 텍스트:

> Report-Level Review

배경지식 / 발표 멘트:

APK Analyzer는 개별 finding follow-up만 하는 것이 아닙니다. Report summary는 XML report와 기존 follow-up 결과, workspace evidence preview를 함께 보고 우선순위와 caveat를 정리합니다. Autonomous review는 attack surface를 deterministic하게 추출하고, candidate pool을 만들고, 반복 review를 거친 뒤 final synthesis를 candidate judge로 사용합니다. 마지막 final merge는 backend가 수행합니다. Scenario review는 여러 finding을 연결해서 실제 공격 시나리오가 성립하는지 봅니다. 예를 들어 exported deep link가 WebView로 이어지고, 그 WebView가 bridge를 갖고 있으면 단일 finding보다 위험한 chain이 될 수 있습니다.

필요 그림: `report-delivery.png` 삽입 완료.
## 32. 결론

화면 텍스트:

> Harness가 덜고
> AI가 판단하고
> 사람이 결정한다
>
> 반복 작업 도구화
> 취약점 1차 진단 자동화
> 최종 분석과 후속 조치

배경지식 / 발표 멘트:

AI 에이전트 활용의 핵심은 사람을 무조건 빼는 것이 아니라, 사람의 일을 올바른 위치로 옮기는 것입니다. 귀찮고 결정적인 반복 작업은 Harness로 만들고, 코드 분석, PoC 시도, 취약점 1차 진단은 AI가 맡습니다. 사람은 재현 가능한 evidence를 기반으로 최종 결과를 분석하고 후속 조치를 결정합니다.

필요 그림: Harness + AI judgment + Human follow-up 최종 요약 이미지

## Backup. Skill 보안

화면 텍스트:

> Skill도 공급망입니다

배경지식 / 발표 멘트:

Skill은 단순 문서가 아니라 instruction과 optional script를 포함할 수 있습니다. 그래서 외부 skill은 설치 전에 전체 파일, 의존성, script, 외부 네트워크 접근 지시를 확인해야 합니다. 기기 설치, Frida attach, report upload, ticket comment처럼 side effect가 있는 workflow는 자동 호출을 막고 사용자가 직접 호출하게 하는 편이 안전합니다. Claude Code 문서도 skill 활성화 중 tool 권한을 사전 승인할 수 있으므로 repository trust 전에 프로젝트 skill을 검토해야 한다고 경고합니다. [R11]

필요 그림: Review / Least privilege / Manual invocation / Log 4개 카드. Backup 슬라이드로 이동 완료.

## 참조 정보

[R1] MCP 공식 문서
MCP는 AI 애플리케이션과 외부 시스템을 연결하기 위한 오픈 표준입니다. 공식 아키텍처는 Host, Client, Server 구조를 설명하고, 서버가 Resources, Tools, Prompts를 노출할 수 있다고 설명합니다.
https://modelcontextprotocol.io/docs/getting-started/intro
https://modelcontextprotocol.io/specification/2025-06-18/architecture
https://modelcontextprotocol.io/specification/2025-06-18/server/tools

[R2] OpenAI Tool Calling / Built-in Tools
OpenAI 문서 기준 tool calling은 모델이 도구 호출을 제안하고, 애플리케이션이 실행 결과를 다시 모델에 전달하는 다단계 흐름입니다. OpenAI의 도구 문서에는 function calling, web search, remote MCP, shell, file search 등이 포함됩니다.
https://developers.openai.com/api/docs/guides/function-calling
https://developers.openai.com/api/docs/guides/tools
https://developers.openai.com/api/docs/guides/tools-connectors-mcp

[R3] Codex CLI
Codex CLI는 로컬 터미널에서 실행되는 OpenAI의 코딩 에이전트로, 선택된 디렉터리의 코드를 읽고, 변경하고, 실행할 수 있다고 설명되어 있습니다.
https://developers.openai.com/codex/cli

[R4] Claude Code
Claude Code는 터미널에서 동작하는 Anthropic의 agentic coding tool입니다. 공식 문서는 계획, 코드 작성, 동작 확인, 파일 편집, 명령 실행, MCP 연동을 설명합니다.
https://docs.anthropic.com/en/docs/claude-code/overview
https://docs.anthropic.com/en/docs/claude-code/settings
https://docs.anthropic.com/en/docs/claude-code/security

[R5] Gemini CLI
Google Cloud 문서 기준 Gemini CLI는 터미널에서 Gemini에 접근하는 오픈소스 AI 에이전트이며, ReAct 루프와 내장 도구, 로컬·원격 MCP 서버를 사용해 버그 수정, 기능 개발, 테스트 커버리지 개선 같은 작업을 수행할 수 있습니다.
https://cloud.google.com/gemini/docs/codeassist/gemini-cli

[R6] 보안 기준
OWASP는 LLM 애플리케이션 보안 리스크로 Prompt Injection, Insecure Plugin Design, Excessive Agency 등을 다룹니다. Agentic Security Initiative는 autonomous agents와 multi-step AI workflows의 보안 문제를 다루고, OWASP MCP Top 10은 MCP 서버 권한, 감사, context over-sharing 같은 위험을 다룹니다. NIST SSDF는 취약점 위험을 줄이기 위한 보안 소프트웨어 개발 프레임워크입니다.
https://owasp.org/www-project-top-10-for-large-language-model-applications/
https://genai.owasp.org/initiatives/agentic-security-initiative/
https://owasp.org/www-project-mcp-top-10/
https://csrc.nist.gov/pubs/sp/800/218/final

[R7] OpenAI Shell Tool Safety
OpenAI Shell 문서는 모델이 셸 명령을 실행할 수 있는 환경을 설명하면서, 임의 명령 실행은 위험하므로 샌드박스, 허용 목록 또는 차단 목록, 감사 로그가 필요하다고 설명합니다.
https://developers.openai.com/api/docs/guides/tools-shell

[R9] Filesystem MCP Server
Model Context Protocol의 reference servers에는 filesystem server가 포함되어 있습니다. 이 서버는 설정된 허용 디렉터리 안에서 파일 읽기, 쓰기, 수정, 검색, 디렉터리 목록 조회 같은 도구를 제공하는 대표적인 MCP server 예시입니다.
https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem

[R10] Agent Skills / Codex Skills / Claude Skills
Agent Skills 표준은 skill을 `SKILL.md`를 포함하는 폴더 형식으로 설명하고, `scripts/`, `references/`, `assets/` 같은 보조 파일을 둘 수 있다고 설명합니다. Codex 문서는 repository/user/admin/system 위치의 skill을 읽고 `.agents/skills`를 사용할 수 있다고 설명합니다. Claude 문서는 progressive disclosure 구조로 metadata, instructions, resources를 단계적으로 로드한다고 설명합니다.
https://agentskills.io/
https://agentskills.io/specification
https://developers.openai.com/codex/skills
https://code.claude.com/docs/en/skills
https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

[R11] Skill 보안과 권한
Anthropic은 skill이 instruction과 code로 새로운 기능을 제공하므로 신뢰할 수 있는 출처의 skill만 설치하고, 덜 신뢰된 출처의 skill은 파일, 의존성, script, 외부 네트워크 접근 지시를 검토하라고 권장합니다. Claude Code 문서는 `allowed-tools`와 `disable-model-invocation` 같은 설정이 skill 호출과 tool 승인에 영향을 준다고 설명합니다.
https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
https://code.claude.com/docs/en/skills
