# Effective AI Agent Use - 대본 소스

이 파일은 `docs/ai-agent-effective-use/index.html` 슬라이드의 원본 대본입니다.
화면 텍스트는 슬라이드에 들어가는 짧은 문장이고, 배경지식은 발표자가 말할 내용입니다.
시각 자료와 Mermaid 구성은 현재 `index.html`에 반영되어 있고, 남은 이미지 메모는 `visual-assets.md`에 정리했습니다.

## 1. 제목

화면 텍스트:

> Effective AI Agent Use
> 채팅 Q&A에서 실행 가능한 분석 루프로
> 에이전트 워크플로 세미나

배경지식 / 발표 멘트:

오늘은 곧바로 Harness나 Agent 정의에서 시작하지 않습니다. 먼저 우리가 일반 채팅형 AI로 일할 때 실제로 어떤 식으로 작업하는지부터 봅니다. 질문하고, 답을 받고, 사람이 복사해서 터미널이나 브라우저나 IDE에 붙이고, 실행 결과를 다시 AI에게 붙여넣는 방식입니다. 이 흐름의 불편함과 한계를 확인한 뒤, 왜 도구와 실행 루프가 필요한지로 넘어갑니다.

시각 자료: 없음. 표지는 제목과 부제만 사용합니다.
## 1-1. Agenda

화면 텍스트:

> Agenda
> 1. Chat-Only AI Use
> 2. Tool Calling
> 3. MCP
> 4. Skills
> 5. Agent Workflow
> 6. Audit Harness / APK Analyzer

배경지식 / 발표 멘트:

오늘 흐름은 먼저 일반적인 AI 사용 방식의 변화에서 시작합니다. Chat AI만 쓰던 때에는 사람이 IDE, 터미널, 브라우저, 분석 도구를 직접 사용하고, AI에게는 질문과 해석만 맡겼습니다. 그 다음 tool calling이 나오면서 사람이 목표와 경계를 주면 AI가 허용된 도구 호출을 제안하고, Host나 Harness가 실행 결과를 다시 AI에게 전달할 수 있게 됐습니다. MCP는 이런 tool calling 연결을 표준화한 프로토콜이고, Skill은 반복되는 도구 사용 절차를 편하게 루틴화한 패키지입니다. 여기까지가 기본 개념입니다. 그 다음에는 이 재료들이 Agent Workflow, Audit Harness, APK Analyzer로 확장되는 구조를 봅니다.

시각 자료: 없음. 텍스트 목차 슬라이드로 충분합니다.
## 1-2. Part 01: Basic Concepts

화면 텍스트:

> Basic Concepts
> 채팅 → 도구 호출 → MCP → Skill
> PART 01

배경지식 / 발표 멘트:

첫 파트에서는 Agent를 바로 정의하지 않습니다. 먼저 우리가 AI를 chat으로만 쓰던 방식, tool calling이 바꾼 점, MCP가 표준화한 연결 지점, 그리고 Skill이 반복 작업을 루틴화하는 방식을 순서대로 정리합니다. 이 기본 개념이 정리된 뒤에야 Agent Workflow를 설명하는 것이 자연스럽습니다.

시각 자료: 없음. 섹션 구분 슬라이드.
## 2. Chat-Only AI Use

화면 텍스트:

> `chat-style-workflow.png` 그림 전체 표시

배경지식 / 발표 멘트:

Chat AI만 쓰던 시기에는 AI가 조언자 역할을 했고, 실제 도구 사용은 사람이 했습니다. 예를 들어 AI가 "jadx로 `addJavascriptInterface`를 검색하세요", "`adb logcat`으로 실행 로그를 보세요", "Frida로 이 method를 hook해 보세요"라고 답하면, 사람은 그 명령을 터미널이나 리버싱 도구에서 직접 실행하고 결과를 다시 AI에게 붙여넣었습니다. 이 방식은 유용하지만, AI가 직접 대상 상태를 보거나 도구 실행 결과를 안정적으로 관리하지는 못합니다.

시각 자료: `chat-style-workflow.png` 삽입 완료. 기존 카드형 설명 대신 그림 전체를 사용.
## 3. Tool Calling Changes the Direction

화면 텍스트:

> Direction change
> Tool Calling Changes the Direction
> 모델 지식만으로는 현재 대상을 볼 수 없고, 컨텍스트가 루프에 들어와야 합니다.
> 텍스트 질문 → LLM 내재 지식 → 텍스트 답변
> 외부 컨텍스트: 파일 · 로그 · 도구 · 런타임
> Host: 정책 + 실행

배경지식 / 발표 멘트:

LLM은 기본적으로 text를 받아 text를 만드는 언어 모델입니다. 이 구조만으로도 설명과 요약은 잘하지만, 모델 내부의 parametric knowledge만으로는 지금 보고 있는 저장소, 디바이스 상태, 최신 로그, 실행 결과를 알 수 없습니다. 그래서 다음 단계는 "더 똑똑한 답변"이 아니라, 현재 작업에 필요한 외부 context를 모델 루프 안으로 안전하게 넣는 것입니다. Tool calling은 이 context를 사람이 복사해 붙여넣는 방식에서 Host가 정책을 검사하고 실행 결과를 돌려주는 방식으로 바꿉니다.

시각 자료: 텍스트 질문 → LLM 내재 지식 → 텍스트 답변 흐름에 외부 컨텍스트와 Host 실행이 붙는 다이어그램.
## 4. Tool Calling

화면 텍스트:

> Tool calling
> Prompt + Tool Schema Tool Result Loop
> Host → Model: 사용자 프롬프트 + tool schema
> Model → Host: tool_call schema(name, args)
> Host → Tool: tool 실행
> Host → Model: tool_result(JSON)

배경지식 / 발표 멘트:

Tool calling을 가장 단순하게 보면, Host가 사용자 프롬프트와 사용할 수 있는 tool schema를 함께 모델에 전달하는 구조입니다. 모델은 자연어 답변이 아니라 `tool_call` schema, 예를 들어 `manifest_extract({apk_path:"app.apk", include:["components","links"]})` 같은 구조화된 호출 요청을 반환할 수 있습니다. Host는 모델 응답이 tool schema인지 검사하고, 맞으면 실제 `manifest_extract` 도구를 실행한 뒤 `tool_result`를 다시 모델에 전달합니다. 모델은 이 실행 결과를 context로 받아 근거 기반 최종 답변을 만듭니다. [R2]

시각 자료: User → Host/App → Model → Tool/MCP sequence diagram. Host가 사용자 프롬프트와 tool schema를 함께 보내고, 모델 응답이 tool_call schema이면 도구를 실행해 결과를 다시 모델에 전달하는 루프를 표시.
## 6. MCP

화면 텍스트:

> MCP
> AI 도구를 위한 표준 연결

배경지식 / 발표 멘트:

MCP는 AI 애플리케이션과 외부 시스템을 연결하기 위한 오픈 표준입니다. 공식 문서는 MCP를 AI 애플리케이션이 파일, 데이터베이스, 검색 엔진, 계산기, 워크플로에 연결되는 표준 방식으로 설명합니다. 핵심은 "각 도구를 매번 커스텀 연동하지 말고, 표준 방식으로 연결하자"입니다. [R1]

시각 자료: 플러그 / 어댑터 / 표준 포트 이미지
## 9. MCP Before / After

화면 텍스트:

> MCP Before / After
> Before: Without MCP
> User acts as an intermediary
>
> After: With MCP
> MCP connects AI with tools

배경지식 / 발표 멘트:

그림의 위쪽은 MCP가 없을 때의 흐름입니다. AI Chat은 답변을 주지만 Internet, IDE, Document 같은 실제 도구를 쓰는 중간 역할은 사람이 합니다. 사람이 검색하고, 코드를 작성·수정·실행하고, 문서를 읽고 편집한 뒤 결과를 다시 AI에게 넘깁니다. 아래쪽은 MCP가 붙은 흐름입니다. AI Chat과 도구 사이에 표준 연결 지점이 생기고, AI는 Host가 허용한 MCP tool을 통해 Internet, VS Code, Document 같은 외부 도구와 연결됩니다. 사용자는 모든 결과를 직접 복사해 오가는 대신, AI가 도구 결과를 context로 받아 작업하도록 지시할 수 있습니다. [R1]

시각 자료: `mcp-before-after.png` 삽입 완료. Before는 user-mediated tool use, After는 MCP connection 구조.
## 10. Mobile Security MCP Tools

화면 텍스트:

> MCP directory
> Mobile Security MCP Tools
> 보안 감사에서 AI가 호출할 수 있는 도구 서버
> Static: APK · DEX · Manifest 분석: jadx · apktool · aapt · Semgrep
> Dynamic: 기기 실행 · 로그 · 후킹: adb · logcat · Frida · objection
> Native: `.so` 분석 · 호출 흐름: Ghidra · IDA Pro · radare2
> Host 권한 안에서 실행하고 AI가 결과를 해석합니다.

배경지식 / 발표 멘트:

모바일 보안 감사에서 MCP는 모델이 직접 도구를 흉내 내게 하는 장치가 아니라, 분석 도구를 표준 인터페이스로 묶는 실행 경계입니다. Static 도구는 APK, DEX, Manifest, source evidence를 만듭니다. Dynamic 도구는 실제 기기 실행, 로그, 후킹 관찰을 담당합니다. Native 도구는 `.so` 파일과 native 호출 경로를 분석합니다. 핵심은 도구 실행은 Host 권한 안에서 통제하고, AI는 그 결과를 해석해 finding 후보와 caveat를 정리한다는 점입니다.

시각 자료: Static / Dynamic / Native 3분할 MCP 도구 리스트 카드.
## 11. Skills

화면 텍스트:

> Skills
> 도구 위의 재사용 절차

배경지식 / 발표 멘트:

Skill은 모델을 새로 학습시키는 것이 아니라, 자주 쓰는 업무 절차를 에이전트가 읽을 수 있는 형태로 패키징하는 방식입니다. 권한 검토, WebView 점검, exported component 감사, 취약점 triage처럼 반복되는 작업은 매번 같은 절차와 출력 형식을 요구합니다. Skill은 이 절차를 팀 단위로 관리하고, 필요한 작업에서만 로드하게 해줍니다. [R10]

시각 자료: 없음. 섹션 구분 슬라이드.
## 11-1. Skill as Procedure Package

화면 텍스트:

> Skill as Procedure Package

```text
my-skill/
├── SKILL.md      # metadata + instructions
├── scripts/      # optional executable code
├── references/   # policies, API specs, checklists
└── assets/       # templates, examples, static files
```

배경지식 / 발표 멘트:

Agent Skills 표준에서 skill은 최소한 `SKILL.md`를 포함하는 폴더입니다. `SKILL.md`에는 `name`, `description`, 에이전트가 따라야 할 지시문이 들어가고, 필요하면 `scripts/`, `references/`, `assets/` 같은 보조 파일을 둘 수 있습니다. Codex와 Claude 문서도 같은 구조를 사용합니다. [R10]

시각 자료: Skill folder tree. 현재 본문에 텍스트 카드로 반영.
## 11-3. Skill Progressive Disclosure

화면 텍스트:

> Progressive disclosure
> On-Demand Context Loading
> Discovery
> Activation
> Execution

배경지식 / 발표 멘트:

Skill의 핵심은 progressive disclosure입니다. 시작 시점에는 skill의 `name`과 `description` 정도만 보고, 사용자 요청이 description과 맞을 때 전체 `SKILL.md`를 읽습니다. 그 뒤에 필요할 때만 `references/`, `scripts/`, `assets/`를 읽거나 실행합니다. 그래서 긴 사내 정책이나 API 명세를 항상 system prompt에 넣지 않고, 필요한 작업에서만 꺼내 쓸 수 있습니다. [R10]

시각 자료: name/description → SKILL.md → references/scripts/assets → tool 실행 흐름. Mermaid로 반영 완료.
## 11-4. Skill Runbook Example

화면 텍스트:

> Skill Runbook Template

```markdown
---
name: android-open-components
description: exported Android component, deep link, missing permission 감사에 사용.
---

목표: 외부에서 접근 가능한 Android component 찾기.
입력: merged-manifest.json, jadx source map, references/android-component-policy.md
절차:
1. manifest를 구조화된 component record로 파싱.
2. 각 component에 source와 permission context 연결.
3. 모델에는 사실 재탐색이 아니라 위험 판단만 맡김.
출력: component table, evidence, risk, validation command.
```

배경지식 / 발표 멘트:

좋은 Skill은 설명문이 아니라 작업 지시서에 가깝습니다. 하나의 skill은 하나의 일에 집중시키고, `description`에는 언제 자동으로 쓰면 되는지 구체적으로 적습니다. 본문에는 입력, 절차, 검증 명령, 출력 형식을 명령형으로 둡니다. 긴 정책은 `references/`로 분리하고, grep이나 schema validation처럼 결정적인 반복 처리는 `scripts/`에 둡니다. [R10]

시각 자료: Skill template 카드. 현재 본문에 텍스트 카드로 반영.
## 12. Agent Workflow

화면 텍스트:

> Part 02
> Agent Workflow

배경지식 / 발표 멘트:

여기서부터 Agent 관련 내용을 한 덩어리로 봅니다. 앞에서 본 Tool, MCP, Skill은 각각 실행 능력, 연결 표준, 반복 절차입니다. Agent는 이 재료들을 사용해 목표를 세우고, 도구를 호출하고, 결과를 관찰하고, 필요하면 다시 시도하는 실행 루프입니다. 코딩, 디버깅, 모바일 보안 감사 모두 이 루프가 작업 품질을 좌우합니다. [R5]

시각 자료: 파트 도입부. 제목만 표시.
## 12-1. Tool / MCP / Skill / Agent Stack

화면 텍스트:

> Agent basic stack
> Tool → MCP → Skill → Agent
> Tool: 실행 능력
> MCP: 표준 연결
> Skill: 반복 절차
> Agent: 실행 루프

배경지식 / 발표 멘트:

Agent를 이해하기 전에 네 층을 분리해서 보면 쉽습니다. Tool은 `jadx`, `adb`, `frida`, `read_file`처럼 실제 작업을 수행하는 기능입니다. MCP는 AI client와 tool server를 표준 방식으로 연결하는 프로토콜입니다. Skill은 특정 목표를 위해 어떤 도구를 어떤 순서로 쓰고 어떤 형식으로 보고할지 정한 반복 절차입니다. Agent는 이 재료들을 사용해 계획하고, 실행하고, 관찰하고, 수정하는 루프를 스스로 반복하는 실행 구조입니다.

시각 자료: Tool / MCP / Skill / Agent 4단 stack 다이어그램.
## 12-2. From Program DAG to Agent Loop

화면 텍스트:

> From Program DAG to Agent Loop

배경지식 / 발표 멘트:

전통적인 프로그램은 control flow가 코드나 DAG 안에 미리 정의되어 있습니다. 어떤 도구를 언제 호출할지, 실패하면 어디로 돌아갈지, 언제 멈출지가 정해져 있습니다. Agent runtime에서는 이 결정 지점이 LLM으로 이동합니다. LLM이 event, context, tool result를 읽고 다음 action을 고르고, 실행 결과가 다시 루프의 입력으로 돌아옵니다. 유연성은 커지지만, 흐름 제어가 확률적 판단에 더 많이 의존하게 됩니다.

시각 자료: `agent-loop-animation.gif` 루프 애니메이션. 주변 설명 텍스트 없이 그림을 화면 안에 맞춰 표시.
## 12-3. Agent Loop Drift Risk

화면 텍스트:

> Scaling risk
> Agent Loop Drift Risk
> 도구 확산.
> 컨텍스트 과부하.
> 목표 이탈.

배경지식 / 발표 멘트:

문제는 도구 수가 늘고, multi-turn이 길어지고, context가 커질 때 나타납니다. 비슷한 도구가 많으면 다음 호출 선택이 흔들리고, 루프가 길어질수록 작은 해석 오류가 누적됩니다. context가 커지면 중요한 제약과 오래된 정보가 섞이고, LLM은 원래 목표보다 눈앞의 local step을 최적화할 수 있습니다. 그래서 agent loop 자체를 부정하는 것이 아니라, loop의 범위를 작게 관리해야 합니다.

시각 자료: Tool Sprawl / Multi-Turn Length / Context Overload / Goal Drift 4개 risk 카드.
## 12-4. Micro-Agent DAG

화면 텍스트:

> Micro-Agent DAG

배경지식 / 발표 멘트:

Micro-agent 방식은 큰 agent loop 하나에 모든 판단을 맡기지 않습니다. 전체 흐름은 사람이 설계한 DAG나 harness가 잡고, 각 노드 안에서만 작은 LLM loop를 허용합니다. 각 micro-agent는 작은 목표, 제한된 도구, 집중된 컨텍스트, 형식화된 출력, 명확한 완료 규칙을 가져야 합니다. 이렇게 하면 LLM의 판단은 살리면서 전체 조율은 명시적으로 유지할 수 있습니다.

시각 자료: `micro-agent-dag.png` 삽입 완료. 주변 설명 텍스트 없이 그림을 크게 표시.

## 13-1. Tool Loop

화면 텍스트:

> Harness loop
> Tool Loop
> 감사 작업 → API Harness → LLM 다음 도구 계획
> 허용된 도구: rg · read_file · lookup
> 증거 원장 → 스키마 출력
> 로컬 검증

배경지식 / 발표 멘트:

API Harness는 단일 호출이 아니라 반복 구조로 동작합니다. 사용자 task와 context가 들어오면 모델은 `rg`, `read_file`, Android reference lookup 같은 allowlist된 도구 호출을 제안합니다. Harness는 실제 도구를 실행하고 결과를 evidence ledger에 저장한 뒤 다음 모델 호출에 다시 넣습니다. 충분한 근거가 쌓이면 finalization 호출로 넘어가고, 최종 출력은 provider structured output과 local schema/evidence validation을 모두 통과해야 합니다.

시각 자료: Tool loop와 evidence ledger 다이어그램.
## 13-2. Deterministic Facts and Scope Gate

화면 텍스트:

> Harness boundary
> Deterministic Facts
> Scope Gate
> 먼저 사실을 고정하고, 애매한 요청은 실행 전에 좁힙니다.
> Deterministic facts: merged manifest → JSON
> Scope gate: Find vulnerabilities → audit category

배경지식 / 발표 멘트:

사용자의 요청을 그대로 모델에 던지면 결과가 흔들립니다. Harness는 먼저 코드로 확정할 수 있는 사실을 구조화된 artifact로 만들고, AI에게는 위험 판단과 설명을 맡깁니다. 동시에 요청이 불명확하면 open components, WebView, storage, crypto처럼 가능한 감사 항목을 몇 개로 좁힌 뒤 루프를 시작해야 합니다. 이렇게 해야 누락 위험, 토큰 비용, 목표 이탈을 함께 줄일 수 있습니다.

시각 자료: Deterministic facts / Scope gate 2열 비교 카드.
## 13-3. Tool-Backed Validation

화면 텍스트:

> Tool-backed verification
> Tool-Backed Validation

```text
요청: WebView 취약점 검토

Harness 계획:
1. 후보: JS bridge / file access / mixed content / allowlist
2. 정적: Manifest + WebView settings + bridge hits
3. 동적: ADB launch + Frida trace
4. 도구: jadx / adb / Frida
5. 종료: 증거 또는 주의점
```

배경지식 / 발표 멘트:

좋은 Harness는 "무엇을 체크할지"만 알려주지 않고, 확인할 수 있는 도구를 제공합니다. 웹뷰 보안에서는 jadx로 `addJavascriptInterface`와 WebView 설정을 찾고, ADB로 Activity를 실행하고, Frida로 bridge 호출이나 allowlist 우회 여부를 관찰할 수 있습니다. 도구가 facts와 증거를 만들고, AI는 그 결과가 실제 취약점인지 판단하게 해야 합니다.

시각 자료: 도구 기반 검증 카드. 현재 본문에 텍스트 카드로 반영.
## 14. APK Analyzer

화면 텍스트:

> APK Analyzer
> 재현 가능한 APK 산출물.

배경지식 / 발표 멘트:

지금까지 바람직한 Harness가 어떤 구조여야 하는지 봤습니다. 이제 그 구조를 우리가 만든 APK Analyzer에 어떻게 적용했는지 소개합니다. 핵심은 "LLM에게 APK를 다 읽고 판단하라"가 아니라, deterministic 분석 파이프라인이 먼저 사실을 만들고, LLM은 제한된 tool loop 안에서 탐색, 우선순위화, 요약, 시나리오 리뷰를 맡는 구조입니다.

시각 자료: APK Analyzer 파이프라인 로고/개념 이미지
## 14-1. Free Search vs Deterministic + AI

화면 텍스트:

> Agent drift example
> Free Search vs Deterministic + AI

배경지식 / 발표 멘트:

Agent에게 "정적 분석해서 문제 탐색해줘"라고만 요청하면 그림 왼쪽처럼 매번 다른 경로로 갈 수 있습니다. AI가 임의로 keyword를 고르고, `rg`, `jadx`, `AndroidManifest.xml` 탐색 사이를 오가며, 초기에 잘못된 단서가 선택되면 불필요한 파일 탐색으로 토큰을 많이 씁니다. 반대로 오른쪽 구조는 먼저 deterministic block을 둡니다. `manifest_extract`, `aapt cross-check`, `jadx evidence index`가 component-facts.json과 source-evidence.json을 만들고, AI는 그 구조화된 증거를 바탕으로 위험도와 근거를 판단합니다. 이 방식이 결과 일관성과 재현성을 높입니다.

시각 자료: `deterministic-vs-free-search.png` 삽입 완료.
## 14-2. Mobile Audit Harness Extension

화면 텍스트:

> Security extension
> Mobile Audit Harness
> Static / Dynamic / Native / Reference

배경지식 / 발표 멘트:

모바일 보안 감사에서는 일반 코딩 도구에 Android와 분석 도구가 더 붙습니다. 그림처럼 Static 영역에는 jadx, apktool, aapt, Semgrep이 있고, Dynamic 영역에는 adb, Frida, objection, logcat이 있습니다. Native 분석은 Ghidra와 IDA Pro가 맡고, Reference 영역은 Android permissions, protected broadcasts, internal policy 같은 판단 기준을 제공합니다. 중요한 점은 도구를 많이 붙이는 것이 아니라, 도구를 역할에 맞게 제한하고 Harness가 실행 관리, 결과 분석, 정책 기반 판단을 일관되게 묶는 것입니다.

시각 자료: `mobile-audit-harness.png` 삽입 완료.
## 14-3. APK Analyzer Pipeline

화면 텍스트:

> APK Analyzer Pipeline

배경지식 / 발표 멘트:

APK Analyzer는 APK 업로드나 CLI 입력을 받아 workspace를 만들고 fingerprint를 고정합니다. 그 다음 decompile, manifest analysis, network security analysis, certificate analysis, Semgrep source scan, SBOM inventory 같은 결정적 분석을 먼저 수행합니다. 결과는 XML report, JSON model, source evidence, 저장소 artifact로 남고, LLM은 이 산출물 위에서 요약, 위험도 평가, 권고 사항, 근거 인용을 수행합니다. 핵심 메시지는 LLM이 APK를 처음부터 다 읽는 것이 아니라, 분석 파이프라인이 만든 artifact 위에서 판단한다는 점입니다.

시각 자료: `apk-analyzer-process.png` 삽입 완료.
## 15. Conclusion

화면 텍스트:

> THE END

배경지식 / 발표 멘트:

마지막 장은 발표 종료를 알리는 단순한 closing slide입니다.

시각 자료: 없음. 단순 closing 문구.
## Backup. 표준화의 효과

화면 텍스트:

> Standardization
> Shared Tools Across Clients and Models
> BACKUP

배경지식 / 발표 멘트:

AI 생태계에서 중요한 변화는 "모델만 바꾸는 것"이 아니라 "도구를 연결하는 방식이 재사용 가능해지는 것"입니다. MCP가 USB-C 비유로 설명되는 이유도 이 표준 포트 역할 때문입니다. [R1]

시각 자료: Client × Model × Tool 매트릭스
## Backup. APK 분석 예제

화면 텍스트:

> APK analysis example
> APK Analysis Routing
> APK 첨부 + "이 앱의 이슈 찾기"
> AI Host / MCP Client
> Static 도구 / Dynamic 도구
> 증거 묶음 → AI triage

배경지식 / 발표 멘트:

Mobile Security MCP를 붙이면 사용자는 APK를 첨부하고 "이 앱의 이슈 찾아봐"처럼 요청할 수 있습니다. Host는 이 요청을 정적 분석 경로와 동적 분석 경로로 나눕니다. 정적 경로에서는 JADX/apktool 디컴파일, manifest/source/config 읽기, Semgrep/rule/parser 기반 정적 테스트, Ghidra native 분석을 호출합니다. 동적 경로에서는 adb install, adb shell/logcat, intent/deeplink/WebView 동적 테스트를 호출합니다. 각 도구는 증거 묶음을 만들고, AI는 그 결과를 triage해서 후보 finding과 주의점을 정리합니다.

시각 자료: APK 요청 → AI Host/MCP Client → Static MCP tools / Dynamic MCP tools → evidence bundle → AI triage 다이어그램. Mermaid로 반영 완료.

## Backup. 반복되는 지시는 Skill로 형식화합니다

화면 텍스트:

> Reusable audit procedure
> Reusable Audit Procedure
> Reusable Audit
> Procedure
> 재사용 워크플로 · 반복 붙여넣기 없음

배경지식 / 발표 멘트:

Skill은 모델을 새로 학습시키는 fine-tuning이 아닙니다. 매번 적던 절차, 체크리스트, 스타일 가이드, 팀 규칙, 검증 명령을 파일로 패키징하는 방식입니다. 즉 "목표, 범위, 제약, 검증" 같은 좋은 지시 형식을 팀의 표준 workflow로 만들어두는 것입니다. [R10]

시각 자료: 반복 prompt → reusable workflow 변환.
## Backup. Mobile Security Audit Agents

화면 텍스트:

> Coding harness
> Mobile Security Audit Agents
> Codex
> 저장소 · 매니페스트 탐색
> Claude Code
> 계획 · 스크립트 · 보고
> Gemini CLI
> ReAct · MCP 분석

배경지식 / 발표 멘트:

Mobile Security Audit Agents는 단순 모델이 아닙니다. 모델을 Android 분석 작업에 맞게 실행하는 harness입니다. 파일 시스템, 터미널, 검색, manifest parser, jadx, adb, Frida 같은 도구가 붙습니다. Codex CLI나 Claude Code 같은 코딩 에이전트는 repo와 명령 실행을 다룰 수 있고, 여기에 모바일 분석 도구를 MCP로 붙이면 감사 작업으로 확장됩니다. [R3][R4][R5]

시각 자료: 터미널 위에서 동작하는 AI 에이전트 이미지
## Backup. Production-Grade Audit Tools

화면 텍스트:

> What matters
> Production-Grade Audit Tools
> 핵심
> parser · jadx · aapt · adb · frida · logs
>
> 보강
> Ghidra · IDA · call graph · taint rules

배경지식 / 발표 멘트:

실제 성능 차이를 만드는 것은 fancy UI나 chat 스타일보다 추출, 실행, 검증 루프 품질입니다. 매우 중요한 것은 manifest parser, jadx, aapt, adb, Frida, evidence log입니다. 여기에 Ghidra, IDA Pro, call graph, taint rule, structured extractor가 붙으면 성능이 크게 올라갑니다.

시각 자료: 핵심 도구와 성능 booster 비교.
## Backup. 에이전트 작업 방식

화면 텍스트:

> Agent workflow
> Human Work Augmentation
> 사람 작업 → Tool / Harness
> 수집 · 파싱 · 실행
> AI 판단: 분석 · PoC · 진단
> 증거 보고 → 사람 결정

배경지식 / 발표 멘트:

감사 Harness는 사람이 하던 반복 작업을 도구 실행과 증거 수집으로 옮깁니다. Tool/Harness가 collect, parse, run을 맡고, AI는 그 위에서 분석, PoC 시도, 취약점 진단을 수행합니다. 마지막 산출물은 사람이 최종 분석과 follow-up에 쓸 수 있는 evidence report입니다. 중요한 차이는 사람이 복사해서 오가는 흐름을 줄이고, 사람의 판단 위치를 마지막 검토와 조치로 옮긴다는 점입니다. [R4]

시각 자료: CI/CD 파이프라인처럼 이어지는 작업 흐름
## Backup. Harness Components

화면 텍스트:

> Required parts
> Harness Components
> Human Workflow Map
> 보안 감사 작업 분해
> Tool / Harness
> 결정적 반복 작업 자동화
> Android App Context
> Manifest · Gradle · API 정책 입력
> AI Judgment Boundary
> 분석 · PoC · 진단
> Human Follow-up
> 최종 분석 · 조치 · 티켓 · 패치

배경지식 / 발표 멘트:

필수 요소는 다섯 가지입니다. 첫째, 사람의 보안 감사 업무를 분해하는 Human Workflow Map. 둘째, 반복 실행을 결정적으로 처리하는 Tool / Harness. 셋째, Manifest, Gradle, API 정책 같은 Android App Context. 넷째, AI가 어디까지 판단할지 정하는 AI Judgment Boundary. 다섯째, 사람이 최종 분석과 조치로 이어갈 Human Follow-up입니다.

시각 자료: 5개 블록 체크리스트.
## Backup. Scenario Review

화면 텍스트:

> Scenario review
> 현재 앱 finding / 보고서 요약
> 앱 간 취약점 후보 조회
> 시나리오 컨텍스트
> Scenario Review LLM 호출
> 검증 계획 / 주의점
> scenario-review 산출물

배경지식 / 발표 멘트:

Scenario Review는 현재 앱 안의 finding만 보지 않고, 자체 DB에서 다른 앱의 유사 취약점 후보를 함께 조회합니다. package, component, deeplink, WebView, permission 같은 유사도를 기준으로 관련 후보를 가져오고, 현재 앱 후보와 다른 앱 후보 source를 묶어 scenario context를 만듭니다. LLM은 이 context에서 실제 공격 시나리오 후보를 고르고 validation plan과 caveat를 정리합니다.

시각 자료: Scenario Review 다이어그램.
## Backup. Skill 보안

화면 텍스트:

> Safety
> Skill Supply Chain
> 검토: 파일과 스크립트 검토
> 최소: 최소 도구와 MCP 권한
> 수동: 기기 · 후킹 · 보고 작업은 수동
> 로그: 실행 증거 보관

배경지식 / 발표 멘트:

Skill은 단순 문서가 아니라 instruction과 optional script를 포함할 수 있습니다. 그래서 외부 skill은 설치 전에 전체 파일, 의존성, script, 외부 네트워크 접근 지시를 확인해야 합니다. 기기 설치, Frida attach, report upload, ticket comment처럼 side effect가 있는 workflow는 자동 호출을 막고 사용자가 직접 호출하게 하는 편이 안전합니다. Claude Code 문서도 skill 활성화 중 tool 권한을 사전 승인할 수 있으므로 repository trust 전에 프로젝트 skill을 검토해야 한다고 경고합니다. [R11]

시각 자료: Review / Least privilege / Manual invocation / Log 4개 카드. Backup 슬라이드로 이동 완료.
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
