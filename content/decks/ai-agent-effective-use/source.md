# Effective AI Agent Use - 대본 소스

이 파일은 `docs/ai-agent-effective-use/index.html` 슬라이드의 원본 대본입니다.
화면 텍스트는 슬라이드에 들어가는 짧은 문장이고, 배경지식은 발표자가 말할 내용입니다.
시각 자료와 Mermaid 구성은 현재 `index.html`에 반영되어 있고, 남은 이미지 메모는 `visual-assets.md`에 정리했습니다.

## 1. 제목

화면 텍스트:

> Effective AI Agent Use
> From Chat Q&A to Executable Analysis Loops
> Agent workflow seminar

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
> Chat → Tool Calling → MCP → Skills
> PART 01

배경지식 / 발표 멘트:

첫 파트에서는 Agent를 바로 정의하지 않습니다. 먼저 우리가 AI를 chat으로만 쓰던 방식, tool calling이 바꾼 점, MCP가 표준화한 연결 지점, 그리고 Skill이 반복 작업을 루틴화하는 방식을 순서대로 정리합니다. 이 기본 개념이 정리된 뒤에야 Agent Workflow를 설명하는 것이 자연스럽습니다.

시각 자료: 없음. 섹션 구분 슬라이드.
## 2. Chat-Only AI Use

화면 텍스트:

> Chat-style workflow
> Chat-Only AI Use
> AI answers. Human operates tools.
> AI as Advisor: ask, explain, suggest.
> Human Runs Tools: IDE · shell · JADX
> ADB · Frida
> Manual Context Transfer: paste logs back.

배경지식 / 발표 멘트:

Chat AI만 쓰던 시기에는 AI가 조언자 역할을 했고, 실제 도구 사용은 사람이 했습니다. 예를 들어 AI가 "jadx로 `addJavascriptInterface`를 검색하세요", "`adb logcat`으로 실행 로그를 보세요", "Frida로 이 method를 hook해 보세요"라고 답하면, 사람은 그 명령을 터미널이나 리버싱 도구에서 직접 실행하고 결과를 다시 AI에게 붙여넣었습니다. 이 방식은 유용하지만, AI가 직접 대상 상태를 보거나 도구 실행 결과를 안정적으로 관리하지는 못합니다.

시각 자료: `before-manual-orchestration.png`와 `chat-ai-tools.png`를 before/after 비교로 묶어 삽입 완료.
## 3. Tool Calling Changes the Direction

화면 텍스트:

> Direction change
> Tool Calling Changes the Direction
> Human: goal, target, boundary.
> AI: tool call + args.
> Host: policy check, execute, return.

배경지식 / 발표 멘트:

Tool calling이 들어오면 방향이 바뀝니다. AI가 사람에게 "이 명령을 실행해 보세요"라고 말하는 대신, 모델이 필요한 도구 호출을 제안하고 Host나 Harness가 실제 실행을 담당합니다. 사람은 목표, 대상, 권한, 금지 조건을 정하고, AI는 허용된 도구 결과를 읽어 다음 판단을 합니다. 중요한 점은 AI가 마음대로 모든 것을 실행하는 것이 아니라, 애플리케이션이 제공한 도구 목록과 정책 안에서 실행된다는 것입니다.

시각 자료: Model 밖에서 Web / Files / Shell / Test 결과가 들어오는 그림
## 4. Tool Calling

화면 텍스트:

> Tool calling
> Model Selects Tool Host Executes
> Model Selects Tool
> Host Executes
> Prompt → tool call → result → interpretation

배경지식 / 발표 멘트:

Tool calling은 모델과 애플리케이션 사이의 실행 계약입니다. 애플리케이션은 `manifest_extract`, `jadx_search`, `adb_shell`, `frida_trace` 같은 도구를 모델에게 노출합니다. 모델은 작업 중 필요한 도구 호출을 제안하고, Host는 권한과 입력을 검사한 뒤 실제 도구를 실행합니다. 실행 결과는 다시 모델의 context로 들어가고, 모델은 그 결과를 해석해 다음 응답이나 다음 tool call을 만듭니다. [R2]

시각 자료: Prompt → Tool Call → Android Tool/MCP → Structured Result → Answer 시퀀스
## 5. Mobile Audit Tool Calls

화면 텍스트:

> Security audit example
> Mobile Audit Tool Calls
> manifest_extract: components · permissions
> jadx_search: source hits · methods
> adb_shell: launch · logcat
> frida_trace: runtime traces · bridge calls

배경지식 / 발표 멘트:

예시는 모바일 보안 감사로 들 수 있습니다. `manifest_extract(app.apk)`는 exported component와 permission을 구조화하고, `jadx_search(query)`는 decompiled source에서 source evidence를 찾습니다. `adb_shell(command)`은 승인된 디바이스 범위에서 앱 실행이나 logcat 수집을 하고, `frida_trace(package, method_list)`는 runtime 호출을 관찰합니다. 사용자는 이제 "이 도구들을 써서 확인해"라고 지시할 수 있고, 시스템은 도구 실행 결과를 다시 AI에게 제공합니다.

시각 자료: 5단계 rail 레이아웃. 본문에 도구 호출 rail 레이아웃으로 반영.
## 6. Tool Result as Context

화면 텍스트:

> Result handling
> Tool Result as Context
> Structured result. No pasted logs.

배경지식 / 발표 멘트:

Tool calling의 실질적인 변화는 실행 결과가 대화의 공식 context가 된다는 점입니다. 사람이 긴 터미널 로그를 복사해서 붙여넣는 대신, 도구가 JSON, 로그 파일, source location, command metadata를 구조화해서 반환합니다. 모델은 이 결과를 읽고 다음 질문, 다음 도구 호출, 또는 evidence-backed summary를 만듭니다. 이 구조가 다음에 설명할 MCP와 Skill의 출발점입니다.

시각 자료: Mermaid flowchart. 본문에 Mermaid 흐름도로 반영.
## 7. MCP

화면 텍스트:

> MCP
> Standard connector for AI tools

배경지식 / 발표 멘트:

MCP는 AI 애플리케이션과 외부 시스템을 연결하기 위한 오픈 표준입니다. 공식 문서는 MCP를 AI 애플리케이션이 파일, 데이터베이스, 검색 엔진, 계산기, 워크플로에 연결되는 표준 방식으로 설명합니다. 핵심은 "각 도구를 매번 커스텀 연동하지 말고, 표준 방식으로 연결하자"입니다. [R1]

시각 자료: 플러그 / 어댑터 / 표준 포트 이미지
## 8. MCP Architecture

화면 텍스트:

> MCP structure
> Model Decision Client Connection
> Model Decision
> Client Connection

배경지식 / 발표 멘트:

MCP 호출은 서버가 먼저 시작하는 구조가 아닙니다. Host 안의 AI model이 작업 중 필요한 도구를 판단하고 tool call을 제안하면, Host가 해당 요청을 MCP client를 통해 적절한 MCP server로 보냅니다. 모바일 보안 감사에서는 IDE, audit harness, reverse engineering UI가 각각 Manifest/Source server, JADX/APK server, Frida/Device server, Ghidra/IDA server로 연결될 수 있습니다. MCP 서버는 Tools, Resources, Prompts를 노출할 수 있고, Host는 컨텍스트와 권한 경계를 관리합니다. [R1][R2]

시각 자료: AI Model → Host → 여러 MCP Client → 여러 MCP Server → Tools/Resources/Prompts 구조도
## 9. MCP Before / After

화면 텍스트:

> Before and after
> MCP Before / After
> Before: Without MCP
> User acts as an intermediary
>
> After: With MCP
> MCP connects AI with tools

배경지식 / 발표 멘트:

그림의 위쪽은 MCP가 없을 때의 흐름입니다. AI Chat은 답변을 주지만 Internet, IDE, Document 같은 실제 도구를 쓰는 중간 역할은 사람이 합니다. 사람이 검색하고, 코드를 작성·수정·실행하고, 문서를 읽고 편집한 뒤 결과를 다시 AI에게 넘깁니다. 아래쪽은 MCP가 붙은 흐름입니다. AI Chat과 도구 사이에 표준 연결 지점이 생기고, AI는 Host가 허용한 MCP tool을 통해 Internet, VS Code, Document 같은 외부 도구와 연결됩니다. 사용자는 모든 결과를 직접 복사해 오가는 대신, AI가 도구 결과를 context로 받아 작업하도록 지시할 수 있습니다. [R1]

시각 자료: `mcp-before-after.png` 삽입 완료. Before는 user-mediated tool use, After는 MCP connection 구조.
## 10. From Repeated Prompt to Skill

화면 텍스트:

> From prompt to skill
> From Repeated Prompt to Skill
> Procedure: manifest → source → risk
> Tool Set: parser · jadx · adb · Frida
> Rules: package · device · FP criteria
> Output Schema: risk · evidence · command
> Prompt → Skill

배경지식 / 발표 멘트:

Tool calling과 MCP가 있어도 매번 긴 지시를 손으로 쓰는 것은 불편합니다. exported component 감사라면 "merged manifest에서 시작할 것", "jadx source evidence를 component별로 연결할 것", "`adb` 검증은 승인된 package에만 할 것", "component, risk, evidence, caveat 형식으로 보고할 것" 같은 규칙이 반복됩니다. 이 반복 절차를 파일로 패키징하고 필요할 때 자동으로 꺼내 쓰는 형태가 Skill입니다.

시각 자료: 반복 요청 → 주의사항/순서/툴/출력 형식 → Skill 패키지.
## 11. Skills

화면 텍스트:

> Skills
> Reusable routine over tools

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
## 11-2. Tool / MCP / Skill

화면 텍스트:

> Tool · MCP · Skill
> Capability vs Procedure
> Tool
> Action primitive
>
> MCP
> Standard connector
>
> Skill
> Routine package

배경지식 / 발표 멘트:

가장 중요한 구분은 실행 능력, 연결 방식, 업무 절차의 차이입니다. `bash`, `read_file`, `jadx`, `adb`, `frida`는 실행 가능한 도구입니다. MCP는 이런 도구와 외부 데이터를 표준 방식으로 연결하는 프로토콜입니다. Skill은 그 도구들을 어떤 순서로 사용하고, 어떤 입력과 출력 형식을 지킬지 정한 reusable routine입니다. 짧게 말하면 Tool은 action primitive, MCP는 connector, Skill은 routine package입니다. [R1][R2][R10]

시각 자료: Tool / MCP / Skill 3분할 비교.
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

시각 자료: Skill template 카드. 현재 본문에 텍스트 카드로 반영.
## 11-5. MCP ≠ Agent

화면 텍스트:

> Basic concepts recap
> MCP ≠ Agent
> Tool: executable capability
> MCP: standard connection
> Skill: reusable routine
> Agent: execution loop

배경지식 / 발표 멘트:

여기까지는 Agent를 만들기 위한 기본 재료입니다. Tool은 실행 능력이고, MCP는 그 실행 능력을 표준 방식으로 연결하는 프로토콜이며, Skill은 반복되는 tool-use 절차를 루틴화한 패키지입니다. 하지만 이것만으로 Agent가 되는 것은 아닙니다. Agent가 되려면 목표를 이해하고, 계획하고, 도구를 호출하고, 결과를 관찰하고, 필요하면 수정해서 다시 실행하는 loop가 필요합니다. 다음 파트부터는 이 Agent 관련 내용을 한 덩어리로 봅니다.

시각 자료: Tool / MCP / Skill이 Agent Loop로 들어가는 전환 다이어그램.
## 12. Agent Workflow

화면 텍스트:

> Part 02
> Agent Workflow
> From reusable tools to execution loops

배경지식 / 발표 멘트:

여기서부터 Agent 관련 내용을 한 덩어리로 봅니다. 앞에서 본 Tool, MCP, Skill은 각각 실행 능력, 연결 표준, 반복 절차입니다. Agent는 이 재료들을 사용해 목표를 세우고, 도구를 호출하고, 결과를 관찰하고, 필요하면 다시 시도하는 실행 루프입니다. 코딩, 디버깅, 모바일 보안 감사 모두 이 루프가 작업 품질을 좌우합니다. [R5]

시각 자료: User task → Skill 절차 → Plan/Act/Observe/Revise 루프, Act 단계에 MCP tools가 연결되고 evidence report로 닫히는 다이어그램. Mermaid로 반영 완료.
## 12-1. Agent Definition

화면 텍스트:

> Agent definition
> Agent = Model + Context + Tools + Verification

배경지식 / 발표 멘트:

여기서 Agent 정의가 나옵니다. 에이전트는 단순 챗봇이 아니라 모델, 작업 대상 컨텍스트, MCP로 연결된 외부 도구, Skill로 정의한 절차, 검증 증거가 결합된 실행 루프입니다. 모바일 보안 감사에서는 Android 앱 컨텍스트, 파일과 shell, ADB와 Frida 같은 도구, 그리고 결과를 확인하는 evidence가 필요합니다. OpenAI의 도구 문서도 모델이 도구 호출을 제안하고 애플리케이션이 실행 결과를 다시 모델에 전달하는 흐름을 설명합니다. [R2][R7]

시각 자료: Model + Context + Tools + Skill + Verification이 Agent loop로 합쳐지는 다이어그램. Mermaid로 반영 완료.
## 12-2. From Program DAG to Agent Loop

화면 텍스트:

> Runtime shape
> From Program DAG to Agent Loop
> LLM chooses the next call.
> Traditional program: Predefined DAG
> Agent runtime: LLM Dispatcher

배경지식 / 발표 멘트:

전통적인 프로그램은 control flow가 코드나 DAG 안에 미리 정의되어 있습니다. 어떤 도구를 언제 호출할지, 실패하면 어디로 돌아갈지, 언제 멈출지가 정해져 있습니다. Agent runtime에서는 이 결정 지점이 LLM으로 이동합니다. LLM이 event, context, tool result를 읽고 다음 호출을 고릅니다. 유연성은 커지지만, 흐름 제어가 확률적 판단에 더 많이 의존하게 됩니다.

시각 자료: Traditional program과 Agent runtime 2열 비교 카드.
## 12-3. DAG-Free Agent Loop

화면 텍스트:

> LLM-controlled loop
> DAG-Free Agent Loop
> Model controls runtime decisions.

배경지식 / 발표 멘트:

이 그림은 agent loop의 본질을 잘 보여줍니다. event와 이전 result, context가 들어오면 LLM이 다음 단계를 결정하고, API를 호출하거나 다른 작업을 kick off합니다. 결과는 다시 loop로 돌아옵니다. 작은 작업에서는 이 구조가 매우 강력하지만, 전체 workflow를 LLM 하나의 next-step 판단에 계속 맡기면 흐름이 길어질수록 불안정해질 수 있습니다.

시각 자료: `agent-loop-animation.gif` 삽입 완료. 출처: humanlayer/12-factor-agents.
## 12-4. Agent Loop Drift Risk

화면 텍스트:

> Scaling risk
> Agent Loop Drift Risk
> Tool sprawl.
> Context overload.
> Goal drift.

배경지식 / 발표 멘트:

문제는 도구 수가 늘고, multi-turn이 길어지고, context가 커질 때 나타납니다. 비슷한 도구가 많으면 다음 호출 선택이 흔들리고, 루프가 길어질수록 작은 해석 오류가 누적됩니다. context가 커지면 중요한 제약과 오래된 정보가 섞이고, LLM은 원래 목표보다 눈앞의 local step을 최적화할 수 있습니다. 그래서 agent loop 자체를 부정하는 것이 아니라, loop의 범위를 작게 관리해야 합니다.

시각 자료: Tool Sprawl / Multi-Turn Length / Context Overload / Goal Drift 4개 risk 카드.
## 12-5. Micro-Agent DAG

화면 텍스트:

> Coordination pattern
> Micro-Agent DAG
> Local judgment.
> Explicit orchestration.

배경지식 / 발표 멘트:

Micro-agent 방식은 큰 agent loop 하나에 모든 판단을 맡기지 않습니다. 전체 흐름은 사람이 설계한 DAG나 harness가 잡고, 각 노드 안에서만 작은 LLM loop를 허용합니다. 예를 들어 summarize, classify, validate 같은 bounded task를 각각 micro-agent로 만들고, 각 micro-agent는 제한된 context와 도구, typed output을 갖습니다. 이렇게 하면 LLM의 판단은 살리면서 전체 orchestration은 명시적으로 유지할 수 있습니다.

시각 자료: `micro-agent-dag.png` 삽입 완료. 출처: humanlayer/12-factor-agents.
## 12-6. Small Loop Explicit Contract

화면 텍스트:

> Micro-agent boundary
> Small Loop Explicit Contract
> One bounded judgment per agent.
> Small Goal / Small Tool Set
> Small Context / Typed Output / Stop Rule

배경지식 / 발표 멘트:

Micro-agent를 쓰려면 각 agent의 계약이 작고 분명해야 합니다. 하나의 agent는 하나의 판단만 담당하고, 필요한 도구만 받으며, 전체 대화가 아니라 집중된 facts만 봅니다. 출력은 다음 DAG 노드가 읽을 수 있는 structured result여야 하고, 완료, 재시도, escalation, failure 기준이 있어야 합니다. 이 구조가 길고 자유로운 agent loop가 엉뚱한 방향으로 가는 문제를 줄여줍니다.

시각 자료: 5개 contract 카드.

## 12-7. Mobile Audit Harness Extension

화면 텍스트:

> Security extension
> Mobile Audit Harness
> Static / Dynamic / Native / Reference

배경지식 / 발표 멘트:

모바일 보안 감사에서는 일반 코딩 도구에 Android와 분석 도구가 더 붙습니다. 그림처럼 Static 영역에는 jadx, apktool, aapt, Semgrep이 있고, Dynamic 영역에는 adb, Frida, objection, logcat이 있습니다. Native 분석은 Ghidra와 IDA Pro가 맡고, Reference 영역은 Android permissions, protected broadcasts, internal policy 같은 판단 기준을 제공합니다. 중요한 점은 도구를 많이 붙이는 것이 아니라, 도구를 역할에 맞게 제한하고 Harness가 실행 관리, 결과 분석, 정책 기반 판단을 일관되게 묶는 것입니다.

시각 자료: `mobile-audit-harness.png` 삽입 완료.
## 12-8. Free Search vs Deterministic + AI

화면 텍스트:

> Agent drift example
> Free Search vs Deterministic + AI

배경지식 / 발표 멘트:

Agent에게 "정적 분석해서 문제 탐색해줘"라고만 요청하면 그림 왼쪽처럼 매번 다른 경로로 갈 수 있습니다. AI가 임의로 keyword를 고르고, `rg`, `jadx`, `AndroidManifest.xml` 탐색 사이를 오가며, 초기에 잘못된 단서가 선택되면 불필요한 파일 탐색으로 토큰을 많이 씁니다. 반대로 오른쪽 구조는 먼저 deterministic block을 둡니다. `manifest_extract`, `aapt cross-check`, `jadx evidence index`가 component-facts.json과 source-evidence.json을 만들고, AI는 그 구조화된 증거를 바탕으로 위험도와 근거를 판단합니다. 이 방식이 결과 일관성과 재현성을 높입니다.

시각 자료: `deterministic-vs-free-search.png` 삽입 완료.
## 12-9. Evidence-Based Completion

화면 텍스트:

> Done report
> Evidence-Based Completion

```text
Finding: LoginDeepLinkActivity is exported by intent-filter.

Evidence:
- merged-manifest.json: exported=true
- AndroidManifest.xml: intent-filter VIEW/BROWSABLE
- source: reads token from deep link parameter

Risk:
- external app can trigger login flow

Residual risk:
- dynamic validation on device is still required
```

배경지식 / 발표 멘트:

에이전트의 완료 보고는 "찾았습니다"가 아니라 검증 증거여야 합니다. component 이름, exported 이유, permission, source evidence, 실행한 명령, 남은 리스크가 있어야 사람이 빠르게 리뷰할 수 있습니다. 이 구조가 있어야 에이전트 작업을 팀 보안 감사 프로세스 안으로 넣을 수 있습니다.

시각 자료: 터미널 실행 결과 카드. 현재 본문에 텍스트 카드로 반영.
## 13. Instruction and Harness Design

화면 텍스트:

> Instruction and
> Harness Design
>
> Higher accuracy. Smaller token budget.

배경지식 / 발표 멘트:

AI에게 효과적으로 지시한다는 것은 말을 길게 쓰는 것이 아닙니다. 모델이 해야 할 일을 좁히고, 필요한 컨텍스트만 제공하고, 정해진 도구와 루프 안에서 실행하게 만드는 것입니다. 좋은 Harness일수록 불필요한 토큰을 줄이고, 잘못된 파일이나 도구를 보는 확률을 낮추고, 여러 번 돌려도 비슷한 결과를 만듭니다.

시각 자료: 없음. 섹션 구분 슬라이드.
## 13-1. Instruction vs Runtime Hook

화면 텍스트:

> Guardrail boundary
> Runtime Guardrails
> Prompt guard vs runtime block.
> Prompt-Level Denial
> Runtime Policy Block

배경지식 / 발표 멘트:

도구를 붙이면 새로운 문제가 생깁니다. "위험한 명령은 실행하지 마", "승인되지 않은 앱은 건드리지 마" 같은 프롬프트 지시는 모델이 따르도록 유도하는 확률적 가드입니다. 보통은 잘 따르지만, 컨텍스트가 길어지거나 목표가 충돌하거나 tool call이 복잡해지면 실패할 수 있습니다. 반대로 Hook이나 runtime policy는 실행 직전에 tool call을 가로채고 allowlist, 권한, 경로, package, device scope, 로그, 종료 조건을 검사합니다. 금지된 명령은 모델이 어떻게 요청했든 실행되지 않습니다. 그래서 안전과 재현성은 "하지 마"라는 말보다 Harness의 결정적 차단 지점에서 나옵니다.

시각 자료: Prompt guard와 Runtime hook 비교 카드.
## 13-2. Harnessed Audit Workflow

화면 텍스트:

> Harness job
> Harnessed Audit Workflow
> User request
> → Audit spec
> → Extract / Judge / Verify loop
> → Evidence report

배경지식 / 발표 멘트:

사용자의 요청을 그대로 모델에 던지면 결과가 흔들립니다. Harness는 먼저 요청을 구조화된 audit spec으로 바꿉니다. 그 다음 사용할 도구와 device 권한을 제한하고, facts 추출, AI 판단, 검증 루프 안에서 작업하게 합니다. 마지막은 자연어 요약이 아니라 증거 보고로 끝나야 합니다.

시각 자료: Mermaid로 반영 완료. Harness 작업 흐름.
## 13-3. Deterministic Harness Output

화면 텍스트:

> Deterministic output
> Deterministic Harness Output
> Code agent only: find AndroidManifest + rg
> Miss risk. Latency. Cost.
> Structured extractor: merged manifest → JSON
> Facts first. Judgment second.

배경지식 / 발표 멘트:

예를 들어 open components는 결정적인 output을 만들 수 있는 사안입니다. Code agent에게만 맡기면 `find AndroidManifest`와 `rg`로 대체로 맞는 결과를 만들 수 있지만, merged manifest, alias, library manifest를 놓칠 수 있고 시간과 AI 호출 비용이 듭니다. 이런 경우에는 코드로 manifest를 parse해 structured JSON을 만들고, AI에게는 위험 판단과 설명만 맡기는 것이 옳습니다.

시각 자료: 정보 funnel 다이어그램.
## 13-4. Harness Stop Conditions

화면 텍스트:

> Stop conditions
> Harness Stop Conditions
> pass → Done: report evidence
> known failure → Revise within scope
> unclear → Ask user to choose
> budget exceeded → Stop with findings

배경지식 / 발표 멘트:

에이전트가 끝없이 반복하는 것을 막으려면 종료 조건이 필요합니다. 검증 명령과 evidence check가 통과하면 증거를 보고하고 끝냅니다. 원인이 분명한 실패면 정해진 범위 안에서 다시 확인합니다. 불명확하면 사용자에게 선택지를 제시합니다. 반복 횟수나 시간, 토큰 예산을 넘으면 현재까지의 발견을 보고하고 멈춰야 합니다.

시각 자료: Mermaid로 반영 완료. 종료 조건 분기.
## 13-5. Ambiguity Gate

화면 텍스트:

> Ambiguous input
> Ambiguity Gate
> Bad
> Find mobile app vulnerabilities
> No target. No scope. No validation.
>
> Better
> Scoped Audit Output
> Pick audit category early.

배경지식 / 발표 멘트:

사용자 입력이 불명확하면 바로 실행하지 않는 것이 좋습니다. Harness는 내부적으로 요청을 분해하고, open components, WebView, storage, crypto처럼 가능한 감사 항목을 몇 개로 좁힌 뒤 사용자에게 선택지를 줍니다. 모델의 긴 추론 과정을 그대로 보여줄 필요는 없지만, 결과적으로 "이 APK의 어떤 범위를 볼까요"처럼 사용자가 스스로 구체화할 수 있게 해야 합니다.

시각 자료: Bad request vs Better request 비교.
## 13-6. Tool-Backed Validation

화면 텍스트:

> Tool-backed verification
> Tool-Backed Validation

```text
Request: WebView vulnerability review

Harness plan:
1. Candidates: JS bridge / file access / mixed content / allowlist
2. Static: Manifest + WebView settings + bridge hits
3. Dynamic: ADB launch + Frida trace
4. Tools: jadx / adb / Frida
5. Exit: evidence or caveat
```

배경지식 / 발표 멘트:

좋은 Harness는 "무엇을 체크할지"만 알려주지 않고, 확인할 수 있는 도구를 제공합니다. 웹뷰 보안에서는 jadx로 `addJavascriptInterface`와 WebView 설정을 찾고, ADB로 Activity를 실행하고, Frida로 bridge 호출이나 allowlist 우회 여부를 관찰할 수 있습니다. 도구가 facts와 증거를 만들고, AI는 그 결과가 실제 취약점인지 판단하게 해야 합니다.

시각 자료: 도구 기반 검증 카드. 현재 본문에 텍스트 카드로 반영.
## 14. APK Analyzer

화면 텍스트:

> APK Analyzer
> Reproducible APK artifacts.

배경지식 / 발표 멘트:

지금까지 바람직한 Harness가 어떤 구조여야 하는지 봤습니다. 이제 그 구조를 우리가 만든 APK Analyzer에 어떻게 적용했는지 소개합니다. 핵심은 "LLM에게 APK를 다 읽고 판단하라"가 아니라, deterministic 분석 파이프라인이 먼저 사실을 만들고, LLM은 제한된 tool loop 안에서 탐색, 우선순위화, 요약, 시나리오 리뷰를 맡는 구조입니다.

시각 자료: APK Analyzer 파이프라인 로고/개념 이미지
## 14-1. APK Analyzer Pipeline

화면 텍스트:

> APK Analyzer Pipeline

배경지식 / 발표 멘트:

APK Analyzer는 APK 업로드나 CLI 입력을 받아 workspace를 만들고 fingerprint를 고정합니다. 그 다음 decompile, manifest analysis, network security analysis, certificate analysis, Semgrep source scan, SBOM inventory 같은 결정적 분석을 먼저 수행합니다. 결과는 XML report, JSON model, source evidence, 저장소 artifact로 남고, LLM은 이 산출물 위에서 요약, 위험도 평가, 권고 사항, 근거 인용을 수행합니다. 핵심 메시지는 LLM이 APK를 처음부터 다 읽는 것이 아니라, 분석 파이프라인이 만든 artifact 위에서 판단한다는 점입니다.

시각 자료: `apk-analyzer-process.png` 삽입 완료.
## 14-2. Deterministic Facts

화면 텍스트:

> Deterministic first
> Deterministic Facts
> LLM only: Direct File Reading
> Path / policy memory errors.
> APK Analyzer: Artifact-Backed Facts
> JSON/XML facts.

배경지식 / 발표 멘트:

재현성을 높이기 위해 deterministic하게 처리할 수 있는 부분은 backend toolchain이 맡습니다. manifest component inventory, exported flag, permission attribute, provider authority, deep link intent filter, network security config, signing certificate, Semgrep rule hit, source line evidence는 먼저 artifact로 남깁니다. LLM의 최종 응답이 바로 finding이 되는 것이 아니라, artifact와 validation을 통과한 evidence-backed result만 보고서에 들어가야 합니다.

시각 자료: LLM-only와 APK Analyzer 비교 카드
## 14-3. Tool Loop

화면 텍스트:

> Harness loop
> Tool Loop
> Audit task → API Harness → LLM plan next tool
> Safe tools: rg · read_file · lookup
> Evidence ledger → schema output
> Local validation

배경지식 / 발표 멘트:

API Harness는 단일 호출이 아니라 반복 구조로 동작합니다. 사용자 task와 context가 들어오면 모델은 `rg`, `read_file`, Android reference lookup 같은 allowlist된 도구 호출을 제안합니다. Harness는 실제 도구를 실행하고 결과를 evidence ledger에 저장한 뒤 다음 모델 호출에 다시 넣습니다. 충분한 근거가 쌓이면 finalization 호출로 넘어가고, 최종 출력은 provider structured output과 local schema/evidence validation을 모두 통과해야 합니다.

시각 자료: Tool loop와 evidence ledger 다이어그램
## 14-4. Finding-Type Validation Harnesses

화면 텍스트:

> Dynamic validation
> Finding-Type Validation Harnesses
> ADB: launch · deeplink · logcat
> Frida: hook · trace · observe
> WebView: console · marker URL
> Ghidra: entrypoint · JNI flow
> Predefined validation functions.

배경지식 / 발표 멘트:

정적 분석만으로 true positive와 false positive를 완전히 가르기 어렵습니다. 그래서 finding type별 dynamic validation harness를 준비하고 있습니다. ADB는 Activity, deep link, broadcast 실행과 logcat evidence에 필요합니다. Frida는 runtime hook, method trace, WebView 관찰성을 높이는 데 씁니다. WebView DevTools는 console probe, marker URL 도달성 확인에 유용합니다. Ghidra는 native entrypoint와 JNI 흐름 검증을 보조합니다. 중요한 방향은 모델이 임의 명령을 만드는 것이 아니라, 승인된 대상에서 사전 정의된 validation function을 호출하게 하는 것입니다.

시각 자료: ADB / Frida / WebView / Ghidra 4개 카드
## 14-5. Report-Level Review

화면 텍스트:

> Report-level review
> Report-Level Review

배경지식 / 발표 멘트:

APK Analyzer는 개별 finding follow-up만 하는 것이 아닙니다. Report summary는 XML report와 기존 follow-up 결과, workspace evidence preview를 함께 보고 우선순위와 caveat를 정리합니다. Autonomous review는 attack surface를 deterministic하게 추출하고, candidate pool을 만들고, 반복 review를 거친 뒤 final synthesis를 candidate judge로 사용합니다. 마지막 final merge는 backend가 수행합니다. Scenario review는 여러 finding을 연결해서 실제 공격 시나리오가 성립하는지 봅니다. 예를 들어 exported deep link가 WebView로 이어지고, 그 WebView가 bridge를 갖고 있으면 단일 finding보다 위험한 chain이 될 수 있습니다.

시각 자료: `report-delivery.png` 삽입 완료.
## 15. Conclusion

화면 텍스트:

> Harnessed Work AI Judgment Human Decision
> Harnessed Work
> AI Judgment
> Human Decision
>
> Automation
> Triage
> Decision

배경지식 / 발표 멘트:

AI 에이전트 활용의 핵심은 사람을 무조건 빼는 것이 아니라, 사람의 일을 올바른 위치로 옮기는 것입니다. 귀찮고 결정적인 반복 작업은 Tool, MCP, Skill, Harness로 루틴화하고, AI는 제한된 context와 evidence 위에서 분석과 triage를 맡습니다. 사람은 재현 가능한 evidence를 기반으로 최종 판단과 후속 조치를 결정합니다.

시각 자료: Harness + AI judgment + Human follow-up 최종 요약 이미지
## Backup. 표준화의 효과

화면 텍스트:

> Standardization
> Shared Tools Across Clients and Models
> BACKUP

배경지식 / 발표 멘트:

AI 생태계에서 중요한 변화는 "모델만 바꾸는 것"이 아니라 "도구를 연결하는 방식이 재사용 가능해지는 것"입니다. MCP가 USB-C 비유로 설명되는 이유도 이 표준 포트 역할 때문입니다. [R1]

시각 자료: Client × Model × Tool 매트릭스
## Backup. Mobile Security MCP

화면 텍스트:

> MCP directory
> Mobile Security MCP
> AI-callable servers for analysis tools
> Static: jadx · apktool · aapt
> Dynamic: adb · Frida · objection
> Native: Ghidra · IDA Pro
> Tools execute, AI interprets results.

배경지식 / 발표 멘트:

모바일 보안 감사에서 제공할 MCP 도구는 세 부류로 나눌 수 있습니다. Static 도구는 jadx, apktool, aapt처럼 APK와 DEX, Manifest를 해석합니다. Dynamic 도구는 adb, Frida, objection처럼 기기에서 실제 동작을 확인합니다. Native 도구는 Ghidra, IDA Pro처럼 `.so` 파일과 native 호출 경로를 분석합니다. 중요한 점은 AI가 도구 자체를 흉내 내는 것이 아니라, 도구가 만든 결과를 해석하게 하는 것입니다.

시각 자료: Static / Dynamic / Native 3분할 카드

## Backup. APK 분석 예제

화면 텍스트:

> APK analysis example
> APK Analysis Routing
> APK attachment + "Find issues in this app"
> AI Host / MCP Client
> Static tools / Dynamic tools
> Evidence bundle → AI triage

배경지식 / 발표 멘트:

Mobile Security MCP를 붙이면 사용자는 APK를 첨부하고 "이 앱의 이슈 찾아봐"처럼 요청할 수 있습니다. Host는 이 요청을 정적 분석 경로와 동적 분석 경로로 나눕니다. 정적 경로에서는 JADX/apktool decompile, manifest/source/config read, Semgrep/rule/parser 기반 정적 테스트, Ghidra native 분석을 호출합니다. 동적 경로에서는 adb install, adb shell/logcat, intent/deeplink/WebView 동적 테스트를 호출합니다. 각 도구는 evidence bundle을 만들고, AI는 그 결과를 triage해서 후보 finding과 caveat를 정리합니다.

시각 자료: APK 요청 → AI Host/MCP Client → Static MCP tools / Dynamic MCP tools → evidence bundle → AI triage 다이어그램. Mermaid로 반영 완료.

## Backup. 반복되는 지시는 Skill로 형식화합니다

화면 텍스트:

> Reusable audit procedure
> Reusable Audit Procedure
> Reusable Audit
> Procedure
> Reusable workflow. No repeated paste.

배경지식 / 발표 멘트:

Skill은 모델을 새로 학습시키는 fine-tuning이 아닙니다. 매번 적던 절차, 체크리스트, 스타일 가이드, 팀 규칙, 검증 명령을 파일로 패키징하는 방식입니다. 즉 "목표, 범위, 제약, 검증" 같은 좋은 지시 형식을 팀의 표준 workflow로 만들어두는 것입니다. [R10]

시각 자료: 반복 prompt → reusable workflow 변환.
## Backup. Mobile Security Audit Agents

화면 텍스트:

> Coding harness
> Mobile Security Audit Agents
> Codex
> repo · manifest exploration
> Claude Code
> plan · script · report
> Gemini CLI
> ReAct + MCP analysis

배경지식 / 발표 멘트:

Mobile Security Audit Agents는 단순 모델이 아닙니다. 모델을 Android 분석 작업에 맞게 실행하는 harness입니다. 파일 시스템, 터미널, 검색, manifest parser, jadx, adb, Frida 같은 도구가 붙습니다. Codex CLI나 Claude Code 같은 코딩 에이전트는 repo와 명령 실행을 다룰 수 있고, 여기에 모바일 분석 도구를 MCP로 붙이면 감사 작업으로 확장됩니다. [R3][R4][R5]

시각 자료: 터미널 위에서 동작하는 AI 에이전트 이미지
## Backup. Production-Grade Audit Tools

화면 텍스트:

> What matters
> Production-Grade Audit Tools
> Very important
> parser · jadx · aapt · adb · frida · logs
>
> Boosters
> Ghidra · IDA · call graph · taint rules

배경지식 / 발표 멘트:

실제 성능 차이를 만드는 것은 fancy UI나 chat 스타일보다 추출, 실행, 검증 루프 품질입니다. 매우 중요한 것은 manifest parser, jadx, aapt, adb, Frida, evidence log입니다. 여기에 Ghidra, IDA Pro, call graph, taint rule, structured extractor가 붙으면 성능이 크게 올라갑니다.

시각 자료: 핵심 도구와 성능 booster 비교.
## Backup. 에이전트 작업 방식

화면 텍스트:

> Agent workflow
> Human Work Augmentation
> Human work → Tool / Harness
> collect · parse · run
> AI judgment: analysis · PoC · diagnosis
> Evidence report → Human decision

배경지식 / 발표 멘트:

감사 Harness는 사람이 하던 반복 작업을 도구 실행과 증거 수집으로 옮깁니다. Tool/Harness가 collect, parse, run을 맡고, AI는 그 위에서 분석, PoC 시도, 취약점 진단을 수행합니다. 마지막 산출물은 사람이 최종 분석과 follow-up에 쓸 수 있는 evidence report입니다. 중요한 차이는 사람이 복사해서 오가는 흐름을 줄이고, 사람의 판단 위치를 마지막 검토와 조치로 옮긴다는 점입니다. [R4]

시각 자료: CI/CD 파이프라인처럼 이어지는 작업 흐름
## Backup. Harness Components

화면 텍스트:

> Required parts
> Harness Components
> Human Workflow Map
> security audit task decomposition
> Tool / Harness
> deterministic routine automation
> Android App Context
> Manifest, Gradle, API policy inputs
> AI Judgment Boundary
> analysis · PoC · diagnosis
> Stop Conditions
> success · failure · ask · stop
> Human Follow-up
> final analysis, action, ticket, patch

배경지식 / 발표 멘트:

필수 요소는 여섯 가지입니다. 첫째, 사람의 보안 감사 업무를 분해하는 Human Workflow Map. 둘째, 반복 실행을 결정적으로 처리하는 Tool / Harness. 셋째, Manifest, Gradle, API 정책 같은 Android App Context. 넷째, AI가 어디까지 판단할지 정하는 AI Judgment Boundary. 다섯째, 성공, 실패, 질문, 예산 초과를 다루는 Stop Conditions. 여섯째, 사람이 최종 분석과 조치로 이어갈 Human Follow-up입니다.

시각 자료: 6개 블록 체크리스트.
## Backup. Scenario Review

화면 텍스트:

> Scenario review
> current-app findings / report summary
> cross-app vulnerability candidate lookup
> scenario context
> Scenario Review LLM
> validation plan / caveat
> scenario-review artifact

배경지식 / 발표 멘트:

Scenario Review는 현재 앱 안의 finding만 보지 않고, 자체 DB에서 다른 앱의 유사 취약점 후보를 함께 조회합니다. package, component, deeplink, WebView, permission 같은 유사도를 기준으로 관련 후보를 가져오고, 현재 앱 후보와 다른 앱 후보 source를 묶어 scenario context를 만듭니다. LLM은 이 context에서 실제 공격 시나리오 후보를 고르고 validation plan과 caveat를 정리합니다.

시각 자료: Scenario Review 다이어그램.
## Backup. Skill 보안

화면 텍스트:

> Safety
> Skill Supply Chain
> Review: review files and scripts
> Least: minimal tools and MCP permissions
> Manual: manual device / hook / report actions
> Log: retain execution evidence

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
