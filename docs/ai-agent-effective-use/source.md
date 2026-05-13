# AI 에이전트의 효과적인 활용 - 대본 소스

이 파일은 `docs/ai-agent-effective-use/index.html` 슬라이드의 원본 대본입니다.
화면 텍스트는 슬라이드에 들어가는 짧은 문장이고, 배경지식은 발표자가 말할 내용입니다.
그림은 아직 제작하지 않고 `visual-assets.md`에 따로 모았습니다. Mermaid로 전환하기 좋은 후보는 `mermaid-diagrams.md`에 따로 정리했습니다.

## 1. 제목

화면 텍스트:

> AI 에이전트의 효과적인 활용  
> 질의응답에서 실행 · 검증 루프로

배경지식 / 발표 멘트:

오늘의 핵심은 "AI를 더 잘 질문하는 법"이 아니라, "AI가 도구를 사용해 실제 작업을 수행하게 만들고, 그 결과를 검증 가능하게 만드는 법"입니다.

필요 그림: 어두운 배경의 터미널 + AI 에이전트 느낌의 추상 이미지

## 1-1. 목차

화면 텍스트:

> 오늘의 흐름  
> 1. 기본 정의  
> 2. MCP  
> 3. Coding Agent  
> 4. Skill  
> 5. Effective Instruction  
> 6. 보안 활용

배경지식 / 발표 멘트:

오늘은 먼저 챗봇과 에이전트를 구분하고, 도구 호출과 MCP가 왜 필요한지 봅니다. 그 다음 코딩 에이전트의 실제 작업 방식으로 넘어가고, 반복되는 프롬프트 패턴을 Skill로 표준화하는 방법을 봅니다. 이후 적은 토큰으로 정확한 결과를 내기 위한 지시 방식과 Harness 설계를 정리하고, 마지막에는 보안 활용 사례를 다룹니다.

필요 그림: 없음. 텍스트 목차 슬라이드로 충분합니다.

## 2. 핵심 정의

화면 텍스트:

> AI Agent  
> = Model + Tools + Context + Verification

배경지식 / 발표 멘트:

에이전트는 단순 챗봇이 아닙니다. 모델이 있고, 외부 도구가 있고, 작업에 필요한 컨텍스트가 있고, 마지막으로 결과를 확인하는 검증 루프가 있어야 합니다. OpenAI의 도구 문서도 모델이 도구를 자동 선택할 수 있지만, 도구 접근은 `tools` 설정과 애플리케이션 실행 흐름으로 연결된다고 설명합니다. [R2]

필요 그림: 4개 블록이 하나의 에이전트로 합쳐지는 다이어그램

## 3. 출발점: 답변은 작업의 시작점입니다

화면 텍스트:

> 답변은 작업의 시작점입니다

배경지식 / 발표 멘트:

대부분의 AI 사용은 질문과 답변에서 시작합니다. 요약, 설명, 초안 작성에는 충분히 강력하지만, 코드나 업무 시스템을 실제로 바꾸는 작업에서는 여기서 끝나지 않습니다. 텍스트 답변은 파일을 수정하지 않았고, 명령을 실행하지 않았고, 검증 증거도 만들지 않았습니다. 그래서 답변은 작업 완료가 아니라 작업의 시작점입니다.

필요 그림: 질문 → 텍스트 답변을 중심에 두고, 주변에 파일 미변경 / 실행 결과 없음 / 검증 증거 없음 / 최신 상태 모름을 배치한 다이어그램. Mermaid로 반영 완료.

## 4. 왜 도구가 필요한가

화면 텍스트:

> 도구가 있어야  
> 상태를 확인합니다

배경지식 / 발표 멘트:

모델의 파라메트릭 지식은 오래됐을 수 있고, 내부 시스템 권한이나 사내 정책은 모릅니다. 외부 도구는 최신 정보, 사내 데이터, 파일 상태, 실행 결과를 제공합니다. 도구를 붙이면 답변이 지식 생성에서 작업 실행과 상태 확인으로 이동합니다.

필요 그림: Model 밖에서 Web / Files / Shell / Test 결과가 들어오는 그림

## 5. 도구가 붙은 AI

화면 텍스트:

> 질문 + 도구 = 작업 루프  
> Web / Files / Python / Shell

배경지식 / 발표 멘트:

최근의 AI 사용 환경은 단순 텍스트 생성에서 벗어났습니다. 웹 검색, 파일 검색, 코드 실행, 셸 실행, MCP 같은 도구가 붙습니다. Reasoning은 외부 도구라기보다 모델이 문제를 푸는 방식에 가깝기 때문에 도구 목록과는 구분해서 설명하는 편이 정확합니다. [R2][R7]

필요 그림: AI 중심에 Web, Python, File, Terminal 아이콘이 연결된 그림

## 6. Tool Calling

화면 텍스트:

> 모델이 고른다  
> 앱이 실행한다  
> 모델이 해석한다

배경지식 / 발표 멘트:

Tool calling은 모델이 직접 모든 것을 실행하는 구조가 아닙니다. 모델이 "이 도구를 이런 인자로 호출하자"고 판단하면, 애플리케이션이 실제 실행하고, 결과를 다시 모델에 넘깁니다. OpenAI 문서는 이 흐름을 도구 제공, 모델의 tool call, 애플리케이션 실행, 결과 전달, 최종 응답의 다단계 대화로 설명합니다. [R2]

필요 그림: Prompt → Tool Call → External Tool → Result → Answer 시퀀스

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

MCP 호출은 서버가 먼저 시작하는 구조가 아닙니다. Host 안의 AI model이 작업 중 필요한 도구를 판단하고 tool call을 제안하면, Host가 해당 요청을 MCP client를 통해 적절한 MCP server로 보냅니다. Client도 IDE, 코딩 에이전트, 데스크톱 챗, 워크플로 앱처럼 여러 타입이 있을 수 있고, Server도 파일, 브라우저, 문서 검색, DB, Jira, 사내 API처럼 여러 타입이 있을 수 있습니다. MCP 서버는 Tools, Resources, Prompts를 노출할 수 있고, Host는 컨텍스트와 권한 경계를 관리합니다. [R1][R2]

필요 그림: AI Model → Host → 여러 MCP Client → 여러 MCP Server → Tools/Resources/Prompts 구조도

## 10. MCP 이전과 이후

화면 텍스트:

> Before  
> 앱마다 커스텀 연동  
>
> After  
> 서버 하나, 클라이언트 여러 개

배경지식 / 발표 멘트:

커스텀 와이어링 방식에서는 앱마다 GitHub, 파일 시스템, Drive, Jira 같은 외부 시스템을 각각 붙입니다. 같은 기능도 IDE 에이전트용 어댑터, 데스크톱 챗용 커넥터, 내부 자동화용 래퍼로 반복 구현됩니다. MCP는 이 연결 지점을 Host 안의 MCP Client와 외부 MCP Server로 분리합니다. 모델은 필요한 도구를 판단하고, Host는 해당 MCP Client를 통해 서버에 요청을 보냅니다. 하나의 Filesystem MCP Server나 GitHub MCP Server를 여러 클라이언트에서 재사용할 수 있다는 점이 핵심입니다. [R1]

필요 그림: 왼쪽은 앱별 GitHub/파일/Drive/Jira 커스텀 어댑터, 오른쪽은 여러 Host가 MCP Client를 통해 Filesystem/GitHub/Jira 서버를 공유하는 구조

## 10-1. Filesystem MCP 예시

화면 텍스트:

> 파일 접근도  
> 도구 호출로 제한한다

배경지식 / 발표 멘트:

Filesystem MCP는 가장 이해하기 쉬운 MCP 예시입니다. 에이전트가 직접 임의 파일을 만지는 것이 아니라, Host가 Filesystem MCP Server에 도구 호출을 보내고, 서버는 허용된 디렉터리 안에서만 읽기, 디렉터리 조회, 검색, 파일 수정 같은 작업을 수행합니다. 그래서 "AI에게 파일 권한을 준다"는 말은 실제로는 "허용된 workspace와 허용된 file tool을 제공한다"에 가깝습니다. 이 구조가 있어야 컨텍스트 수집, patch 생성, diff 확인, 테스트 실행 루프가 재현 가능해집니다. [R10]

필요 그림: 요청 → Host/Model → MCP Client → Filesystem MCP Server → allowed roots 검사 → read/list/search/edit → diff/test/review

## 11. 표준화의 효과

화면 텍스트:

> 여러 클라이언트  
> 여러 모델  
> 같은 외부 도구

배경지식 / 발표 멘트:

AI 생태계에서 중요한 변화는 "모델만 바꾸는 것"이 아니라 "도구를 연결하는 방식이 재사용 가능해지는 것"입니다. MCP가 USB-C 비유로 설명되는 이유도 이 표준 포트 역할 때문입니다. [R1]

필요 그림: Client × Model × Tool 매트릭스

## 12. 공개 도구 생태계

화면 텍스트:

> MCP 생태계는 이미  
> 큰 규모입니다  
>
> Servers 14.8k  
> Clients 571  
> Use cases 20

배경지식 / 발표 멘트:

많은 MCP 서버와 외부 도구가 공개되고 있습니다. 2026-05-14 기준 PulseMCP의 서버 디렉터리는 14,820개 서버를 표시하고, 클라이언트 목록은 571개 MCP client를 제목에 표시하며, use case 쇼케이스는 20개 예시를 제공합니다. 이는 생산성 기회이면서 동시에 새로운 공격면입니다. 도구를 붙인다는 것은 AI에게 행동 권한을 준다는 뜻입니다. MCP 보안에서는 토큰 관리, 권한 범위, 감사 로그, Shadow MCP Server 같은 이슈가 중요해집니다. [R6][R9]

필요 그림: Servers / Clients / Use cases 숫자 카드. 현재 본문에 stat 카드로 반영.

## 12-1. PulseMCP 링크

화면 텍스트:

> PulseMCP  
> https://www.pulsemcp.com/

배경지식 / 발표 멘트:

MCP 생태계가 실제로 어느 정도 넓어졌는지 보여줄 때는 PulseMCP를 직접 열어보면 좋습니다. 서버 페이지에서는 Filesystem, Browser, GitHub, DB 같은 MCP server 예시를 볼 수 있고, 클라이언트 페이지에서는 IDE, CLI, 데스크톱 챗 계열 도구를 볼 수 있습니다. 유스케이스 페이지는 "MCP를 어디에 붙이는가"를 설명할 때 쓸 수 있습니다. [R9]

필요 그림: PulseMCP 링크 카드 + Servers / Clients / Use Cases 3분할

## 13. MCP ≠ Agent

화면 텍스트:

> 연결은 시작  
> 실행 루프가 핵심

배경지식 / 발표 멘트:

MCP는 도구 연결 표준입니다. 하지만 에이전트가 되려면 목표를 이해하고, 계획하고, 도구를 호출하고, 결과를 보고, 다시 수정하는 루프가 필요합니다.

필요 그림: 플러그와 실행 루프를 구분하는 이미지

## 14. Agent Loop

화면 텍스트:

> Plan  
> Act  
> Observe  
> Revise

배경지식 / 발표 멘트:

좋은 에이전트는 한 번 답하고 끝나지 않습니다. 계획하고, 실행하고, 관찰하고, 실패하면 수정합니다. 코딩, 디버깅, 취약점 탐색 모두 이 루프가 중요합니다. Gemini CLI 문서도 ReAct 루프와 도구, MCP 서버를 이용해 버그 수정, 기능 개발, 테스트 커버리지 개선을 수행한다고 설명합니다. [R5]

필요 그림: 순환 화살표 루프 다이어그램

## 15. 코딩 에이전트

화면 텍스트:

> Codex  
> Claude Code  
> Gemini CLI  
> = Coding Harness

배경지식 / 발표 멘트:

코딩 에이전트는 단순 모델이 아닙니다. 모델을 코드 작업에 맞게 실행하는 harness입니다. 파일 시스템, 터미널, 검색, 테스트 실행, Git 작업 같은 도구가 붙습니다. Codex CLI는 선택된 디렉터리에서 코드를 읽고, 변경하고, 실행할 수 있으며, Claude Code는 파일 수정과 명령 실행, 커밋 생성까지 수행할 수 있습니다. [R3][R4][R5]

필요 그림: 터미널 위에서 동작하는 AI 에이전트 이미지

## 15-1. 코딩 에이전트의 공통 구조

화면 텍스트:

> LLM  
> Tool layer  
> Planning / Action / Observe / Retry  
> Context management  
> Execution and verification

배경지식 / 발표 멘트:

Claude Code, OpenAI Codex CLI, Gemini CLI, Cursor 같은 계열은 세부 UX는 달라도 구조적으로 비슷합니다. LLM 자체, 도구 호출 레이어, 작업 루프, 컨텍스트 관리, 검증/실행 환경의 조합입니다. 결국 본질은 `LLM + Tool Harness + Execution Loop`입니다.

필요 그림: Mermaid로 반영 완료. 코딩 에이전트 공통 구조.

## 16. 기본 제공 도구

화면 텍스트:

> Read  
> Write  
> Search  
> Shell  
> Test  
> MCP

배경지식 / 발표 멘트:

코딩 에이전트의 기본 도구는 코드 읽기, 파일 수정, 코드 검색, CLI 실행, 테스트 수행입니다. 여기에 MCP 서버를 붙이면 Jira, 문서, 사내 API 같은 외부 시스템까지 확장됩니다. 셸 실행은 강력하지만 위험하므로 샌드박스, allowlist, denylist, 로그가 필요합니다. [R4][R7]

필요 그림: 파일, 검색, 터미널, 테스트 체크 아이콘

## 16-1. 파일 접근과 코드 탐색

화면 텍스트:

> Filesystem  
> read, write, list, patch, diff  
>
> Search  
> rg, fd, grep, git diff  
>
> Symbols  
> LSP, Tree-sitter, ctags

배경지식 / 발표 멘트:

가장 기본은 파일 시스템 접근입니다. 파일 읽기, 쓰기, diff 적용, 파일 검색, 디렉터리 탐색이 있어야 합니다. 초기형은 `rg "authenticate("` 같은 문자열 검색에 가깝지만, 고급형은 LSP, Tree-sitter, ctags, language server 기반으로 함수 정의, 참조, import graph, 클래스 상속을 탐색합니다. 이 기능이 들어가면 정확도가 크게 올라갑니다.

필요 그림: 파일/검색/심볼 탐색 3분할 카드.

## 16-2. Shell 실행

화면 텍스트:

> 실행 결과가 있어야  
> 스스로 고칩니다

```text
pytest
gradlew test
npm test
cargo build
adb shell
git diff
```

배경지식 / 발표 멘트:

실행 도구의 가치는 터미널 자체가 아니라 실행 결과입니다. 에이전트가 코드를 수정하고, 테스트를 실행하고, 에러를 읽고, 다시 수정하는 루프를 돌 수 있게 됩니다. Claude Code 류는 사실상 `LLM + bash harness`에 가깝지만, 이 기능은 위험하기 때문에 권한 제한과 로그가 필수입니다.

필요 그림: 터미널 명령 카드.

## 16-3. 컨텍스트 선택과 압축

화면 텍스트:

> 대형 repo는 다 넣을 수 없습니다  
> 관련 파일만 선택  
> 중요 함수만 추출  
> 최근 수정 파일 우선  
> dependency graph와 summary memory 활용

배경지식 / 발표 멘트:

대형 repository는 전체를 context window에 넣을 수 없습니다. 그래서 관련 파일만 선택하고, 중요 함수만 추출하고, 최근 수정 파일을 우선하고, dependency graph 기반으로 범위를 줄이고, summary memory를 활용해야 합니다. 이 부분이 잘되면 토큰을 줄이고, hallucination을 낮추고, 탐색 속도를 올릴 수 있습니다.

필요 그림: 큰 repo에서 관련 파일만 좁히는 funnel.

## 16-4. 현업 성능을 가르는 진짜 도구

화면 텍스트:

> Very important  
> shell · rg · patch · test · git diff · symbol search  
>
> Boosters  
> LSP · Tree-sitter · code graph · retry loop · planning memory

배경지식 / 발표 멘트:

실제 성능 차이를 만드는 것은 fancy UI나 chat 스타일보다 수정, 실행, 검증 루프 품질입니다. 매우 중요한 것은 shell execution, grep/rg, structured file edit, test execution, git diff, symbol search입니다. 여기에 LSP, Tree-sitter, semantic code graph, retry loop, planning memory가 붙으면 성능이 크게 올라갑니다.

필요 그림: 핵심 도구와 성능 booster 비교.

## 16-5. 보안/리버싱 Harness 확장

화면 텍스트:

```text
LLM
 ├─ rg / read_file / write_file / bash / git
 ├─ jadx / apktool / aapt / adb
 ├─ frida / objection
 ├─ semgrep / androguard
 └─ ghidra bridge / radare2
```

배경지식 / 발표 멘트:

보안이나 리버싱 쪽에서는 일반 코딩 도구에 Android와 분석 도구가 더 붙습니다. 예를 들어 jadx, apktool, aapt, adb, frida, objection, semgrep, androguard, ghidra bridge, radare2 같은 도구입니다. 중요한 점은 도구를 많이 붙이는 것이 아니라, 어떤 도구를 언제 쓰고 어떻게 검증할지 Harness가 정해야 한다는 것입니다.

필요 그림: 보안/리버싱 도구 트리. 현재 본문에 텍스트 카드로 반영.

## 17. 기존 작업 방식

화면 텍스트:

> AI가 코드 제안  
> 사람이 복사  
> 사람이 실행

배경지식 / 발표 멘트:

기존 ChatGPT식 코드 작업은 사람이 오케스트레이터였습니다. AI가 코드를 주면 사람이 붙여넣고 실행하고 에러를 다시 설명해야 했습니다.

필요 그림: 사람을 중심으로 ChatGPT와 IDE가 오가는 흐름

## 18. 에이전트 작업 방식

화면 텍스트:

> 목표 입력  
> 계획  
> 수정  
> 빌드  
> 테스트

배경지식 / 발표 멘트:

Claude Code 같은 도구는 코드베이스를 읽고, 접근 방식을 계획하고, 파일을 수정하고, 명령을 실행하고, 테스트 실패를 보고 다시 수정할 수 있습니다. 중요한 차이는 사람이 복사하는 것이 아니라 에이전트가 작업 루프를 직접 돈다는 점입니다. [R4]

필요 그림: CI/CD 파이프라인처럼 이어지는 작업 흐름

## 18-1. 실제 루틴: 컴파일 에러 수정

화면 텍스트:

> 컴파일 에러를 고치는 루프  
> Build → Error → Locate → Patch → Rebuild → Test → Report

배경지식 / 발표 멘트:

실제 코딩 에이전트 활용은 이런 식입니다. 먼저 `npm run build` 같은 명령을 실행합니다. 실패하면 에러 메시지를 읽고, 관련 파일과 타입 정의를 찾고, 가장 작은 범위로 수정합니다. 다시 빌드하고, 실패하면 같은 루프를 반복합니다. 빌드가 통과하면 관련 테스트까지 돌리고, 마지막에는 무엇을 바꿨고 어떤 명령이 통과했는지 증거를 남겨야 합니다.

필요 그림: Mermaid로 반영 완료. 컴파일 에러 수정 루프.

## 18-2. 실제 요청 예시

화면 텍스트:

> 요청은 이렇게 구체화합니다

```text
목표: npm run build 실패 원인을 찾아 수정하세요.
범위: src/payment/**, tests/payment/** 안에서만 수정하세요.
제약: API 응답 스키마와 DB migration은 바꾸지 마세요.
검증: npm run build && npm test -- payment
보고: 원인, 변경 파일, 실행한 명령, 남은 리스크를 요약하세요.
```

배경지식 / 발표 멘트:

좋은 요청은 자연어 설명으로 끝나지 않습니다. 에이전트가 어디를 봐야 하는지, 어디는 건드리면 안 되는지, 어떤 명령으로 성공을 확인할지까지 같이 줍니다. 이렇게 주면 에이전트가 임의로 큰 리팩터링을 하거나 성공 기준 없이 작업을 마치는 위험을 줄일 수 있습니다.

필요 그림: 터미널 프롬프트 카드. 현재 본문에 텍스트 카드로 반영.

## 18-3. 완료 보고 예시

화면 텍스트:

> 끝은 요약이 아니라 증거입니다

```text
원인: PaymentStatus union에 "cancel_failed"가 빠져 build가 실패했습니다.

변경:
- src/payment/cancel.ts
- tests/payment/cancel.test.ts

검증:
- npm run build: PASS
- npm test -- payment: PASS

남은 리스크:
- PG timeout 재시도 정책은 별도 케이스로 확인 필요
```

배경지식 / 발표 멘트:

에이전트의 완료 보고는 "수정했습니다"가 아니라 검증 증거여야 합니다. 실패 원인, 변경 파일, 실행한 명령, 통과 여부, 남은 리스크가 있어야 사람이 빠르게 리뷰할 수 있습니다. 이 구조가 있어야 에이전트 작업을 팀 프로세스 안으로 넣을 수 있습니다.

필요 그림: 터미널 실행 결과 카드. 현재 본문에 텍스트 카드로 반영.

## 19. 좋은 요청 예시

화면 텍스트:

> "결제 취소 API의  
> 실패 케이스를 추가하고  
> 테스트를 통과시켜주세요."

배경지식 / 발표 멘트:

에이전트에게는 "이 코드 짜줘"보다 "이 목표를 달성해줘"가 더 적합합니다. 단, 범위와 검증 방법을 같이 줘야 합니다.

필요 그림: 터미널 프롬프트 카드

## 19-1. 효과적인 지시와 Harness 설계

화면 텍스트:

> 효과적인 지시와  
> Harness 설계  
>
> 적은 토큰으로 정확한 결과를 만드는 작업 구조

배경지식 / 발표 멘트:

AI에게 효과적으로 지시한다는 것은 말을 길게 쓰는 것이 아닙니다. 모델이 해야 할 일을 좁히고, 필요한 컨텍스트만 제공하고, 정해진 도구와 루프 안에서 실행하게 만드는 것입니다. 좋은 Harness일수록 불필요한 토큰을 줄이고, 잘못된 파일이나 도구를 보는 확률을 낮추고, 여러 번 돌려도 비슷한 결과를 만듭니다.

필요 그림: 없음. 섹션 구분 슬라이드.

## 19-2. AI에게는 일이 아니라 작업 경계를 줍니다

화면 텍스트:

> Goal  
> Context  
> Boundary  
> Verify

배경지식 / 발표 멘트:

AI에게 "잘해줘"라고 말하면 모델은 일반적인 최선 추측으로 움직입니다. 정확도를 높이려면 목표, 참고할 맥락, 수정 가능한 경계, 검증 방법을 분리해서 줘야 합니다. 이 네 가지가 있으면 모델은 탐색 범위를 줄이고, 불필요한 파일을 덜 읽고, 검증 가능한 결과로 닫을 수 있습니다.

필요 그림: Goal / Context / Boundary / Verify 4개 카드. 현재 본문에 steps로 반영.

## 19-3. 정확도는 좋은 선별에서 나옵니다

화면 텍스트:

> 정확도는 넓은 컨텍스트가 아니라  
> 좋은 선별에서 나옵니다

배경지식 / 발표 멘트:

컨텍스트를 많이 넣는다고 항상 정확해지는 것은 아닙니다. 관련 없는 파일과 규칙이 많아지면 tool 선택과 수정 방향도 흔들립니다. 좋은 지시는 사용자 요청을 Task spec으로 바꾸고, 필요한 context만 고르고, 도구 순서를 정하고, 마지막에 검증 명령으로 닫습니다. 이 구조가 토큰 사용량과 오류 가능성을 동시에 줄입니다.

필요 그림: User request → Task spec → minimal context → tool sequence → verification. Mermaid로 반영 완료.

## 19-4. Harness는 작업을 좁히는 장치입니다

화면 텍스트:

> User request  
> → Task spec  
> → Plan / Execute / Verify loop  
> → Evidence report

배경지식 / 발표 멘트:

사용자의 요청을 그대로 모델에 던지면 결과가 흔들립니다. Harness는 먼저 요청을 구조화된 Task spec으로 바꿉니다. 그 다음 사용할 도구와 권한을 제한하고, 계획, 실행, 검증 루프 안에서 작업하게 합니다. 마지막은 자연어 요약이 아니라 증거 보고로 끝나야 합니다.

필요 그림: Mermaid로 반영 완료. Harness 작업 흐름.

## 19-5. 좋은 Harness의 구성 요소

화면 텍스트:

> Task Intake  
> Context Budget  
> Tool Contract  
> Loop Policy  
> Stop Conditions  
> Evidence Report

배경지식 / 발표 멘트:

필수 요소는 여섯 가지입니다. 첫째, 목표와 범위를 구조화하는 Task Intake. 둘째, 필요한 컨텍스트만 넣는 Context Budget. 셋째, 도구 입력, 권한, 로그를 고정하는 Tool Contract. 넷째, 계획, 실행, 관찰, 수정 순서를 정하는 Loop Policy. 다섯째, 언제 끝내고 언제 물어볼지 정하는 Stop Conditions. 여섯째, 실행 증거를 남기는 Evidence Report입니다.

필요 그림: 6개 블록 체크리스트.

## 19-6. 토큰을 줄이는 Harness

화면 텍스트:

> 처음부터 전체 파일을 읽지 않습니다  
> 검색 → 후보 파일 → 필요한 라인만 읽습니다  
> 반복되는 규칙은 체크리스트로 재사용합니다  
> 출력 형식을 고정합니다

배경지식 / 발표 멘트:

토큰을 줄이는 핵심은 필요한 정보에 늦게, 좁게 접근하는 것입니다. 처음부터 전체 파일을 읽지 말고 검색으로 후보를 좁힌 뒤 필요한 라인만 읽습니다. 매번 긴 정책을 붙이지 말고 Harness 내부 체크리스트로 재사용합니다. 출력 형식도 고정하면 모델이 설명을 길게 늘어놓는 비용을 줄일 수 있습니다.

필요 그림: 정보 funnel 다이어그램.

## 19-7. 재현성은 테스트 가능한 도구에서 나옵니다

화면 텍스트:

> Input  
> Tool  
> Env  
> Log

배경지식 / 발표 멘트:

재현성은 모델에게 "잘해줘"라고 말해서 생기지 않습니다. 같은 입력 fixture, 같은 명령어, 같은 환경 버전, 같은 권한, 그리고 실행 로그가 있어야 합니다. Harness는 이 네 가지를 고정해야 합니다. 그래야 여러 번 실행해도 비슷한 결과가 나오고, 사람이 결과를 검토할 수 있습니다.

필요 그림: Input / Tool / Env / Log 4요소 다이어그램.

## 19-8. 종료 조건을 Harness에 박아둡니다

화면 텍스트:

> pass → report  
> known failure → revise  
> unclear → ask  
> budget exceeded → stop

배경지식 / 발표 멘트:

에이전트가 끝없이 수정하는 것을 막으려면 종료 조건이 필요합니다. 테스트가 통과하면 증거를 보고하고 끝냅니다. 원인이 분명한 실패면 정해진 범위 안에서 다시 수정합니다. 불명확하면 사용자에게 선택지를 제시합니다. 반복 횟수나 시간, 토큰 예산을 넘으면 현재까지의 발견을 보고하고 멈춰야 합니다.

필요 그림: Mermaid로 반영 완료. 종료 조건 분기.

## 19-9. 불명확하면 바로 실행하지 않습니다

화면 텍스트:

> Bad  
> 웹뷰 취약점 찾아줘  
>
> Better  
> 후보군을 만들고 선택지를 줍니다

배경지식 / 발표 멘트:

사용자 입력이 불명확하면 바로 실행하지 않는 것이 좋습니다. Harness는 내부적으로 요청을 분해하고, 가능한 해석을 몇 개로 좁힌 뒤 사용자에게 선택지를 줍니다. 모델의 긴 추론 과정을 그대로 보여줄 필요는 없지만, 결과적으로 "이 범위를 볼까요, 저 범위를 볼까요"처럼 사용자가 스스로 구체화할 수 있게 해야 합니다.

필요 그림: Bad request vs Better request 비교.

## 19-10. 웹뷰 취약점 요청을 구조화합니다

화면 텍스트:

> 1. 취약점 후보군 나열  
> 2. manifest / code scan  
> 3. allowlist / bridge 확인  
> 4. 재현 절차와 증거 보고

배경지식 / 발표 멘트:

"웹뷰 취약점 찾아줘"는 너무 큽니다. 먼저 후보군을 나열해야 합니다. 예를 들어 JavaScript bridge 노출, file access, mixed content, allowlist 우회, 외부 URL 로딩 같은 항목입니다. 그 다음 manifest와 WebView 설정, `addJavascriptInterface` 사용 여부를 정적으로 검사합니다. 더 좋은 Harness는 브라우저 또는 디버깅 가능한 WebView에서 allowlist나 네트워크 동작을 확인할 도구까지 제공합니다.

필요 그림: 웹뷰 취약점 점검 프로세스.

## 19-11. 더 좋은 Harness는 확인 도구를 제공합니다

화면 텍스트:

> 후보군  
> 정적 검사  
> 동적 확인  
> 브라우저 디버깅 도구  
> 증거 보고

배경지식 / 발표 멘트:

좋은 Harness는 "무엇을 체크할지"만 알려주지 않고, 확인할 수 있는 도구를 제공합니다. 예를 들어 Chrome DevTools MCP는 AI 에이전트가 Chrome에서 페이지를 직접 디버깅하고, 콘솔, 네트워크, 성능 trace 같은 정보를 확인할 수 있게 해줍니다. 웹뷰 보안에서도 브라우저 또는 디버깅 가능한 WebView로 재현 가능한 부분을 연결해 allowlist가 적용되는지, 의도하지 않은 bridge가 노출되는지 확인하는 방식으로 확장할 수 있습니다. [R8]

필요 그림: 도구 기반 검증 카드. 현재 본문에 텍스트 카드로 반영.

## 20. 작업 지시의 4요소

화면 텍스트:

> 목표  
> 범위  
> 제약  
> 검증 방법

배경지식 / 발표 멘트:

효과적인 에이전트 지시는 네 가지를 포함합니다. 무엇을 달성할지, 어디까지 수정 가능한지, 무엇은 건드리면 안 되는지, 성공 여부를 어떻게 확인할지입니다. 이 네 가지가 없으면 에이전트는 일반적인 최선 추측으로 움직입니다.

필요 그림: 체크리스트 이미지

## 20-1. Skills

화면 텍스트:

> Skills  
> 자주 사용하는 프롬프트 패턴을 형식화하여 지원하는 방식입니다

배경지식 / 발표 멘트:

작업 지시의 4요소는 좋은 요청의 기본형입니다. 그런데 PR 리뷰, 권한 검토, 릴리즈 체크, 취약점 triage처럼 반복되는 작업은 매번 같은 지시를 붙여넣게 됩니다. 이런 자주 쓰는 프롬프트 패턴을 형식화해서 에이전트가 필요할 때 재사용하게 만드는 것이 Skill입니다. [R11]

필요 그림: 없음. 섹션 구분 슬라이드.

## 20-2. 반복되는 지시는 Skill로 형식화합니다

화면 텍스트:

> 반복되는 지시는  
> Skill로 형식화합니다

배경지식 / 발표 멘트:

Skill은 모델을 새로 학습시키는 fine-tuning이 아닙니다. 매번 적던 절차, 체크리스트, 스타일 가이드, 팀 규칙, 검증 명령을 파일로 패키징하는 방식입니다. 즉 "목표, 범위, 제약, 검증" 같은 좋은 지시 형식을 팀의 표준 workflow로 만들어두는 것입니다. [R11]

필요 그림: 반복 prompt → reusable workflow 변환.

## 20-3. Skill은 절차 패키지입니다

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

Agent Skills 표준에서 skill은 최소한 `SKILL.md`를 포함하는 폴더입니다. `SKILL.md`에는 `name`, `description`, 에이전트가 따라야 할 지시문이 들어가고, 필요하면 `scripts/`, `references/`, `assets/` 같은 보조 파일을 둘 수 있습니다. Codex와 Claude 문서도 같은 구조를 사용합니다. [R11]

필요 그림: Skill folder tree. 현재 본문에 텍스트 카드로 반영.

## 20-4. Tool / MCP / Skill 차이

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

가장 중요한 구분은 실행 능력과 업무 절차의 차이입니다. `bash`, `git diff`, `read_file`, GitHub MCP tool은 실행 가능한 도구입니다. MCP는 이런 도구와 외부 데이터를 표준 방식으로 연결하는 프로토콜입니다. Skill은 그 도구들을 어떤 순서로 사용하고, 어떤 기준으로 성공과 실패를 판단할지 정한 runbook입니다. 짧게 말하면 Tool은 action primitive이고, Skill은 그 primitive를 사용하는 reusable procedure입니다. [R1][R2][R11]

필요 그림: Tool / MCP / Skill 3분할 비교.

## 20-5. Skill은 필요한 때만 로드됩니다

화면 텍스트:

> Discovery  
> Activation  
> Execution

배경지식 / 발표 멘트:

Skill의 핵심은 progressive disclosure입니다. 시작 시점에는 skill의 `name`과 `description` 정도만 보고, 사용자 요청이 description과 맞을 때 전체 `SKILL.md`를 읽습니다. 그 뒤에 필요할 때만 `references/`, `scripts/`, `assets/`를 읽거나 실행합니다. 그래서 긴 사내 정책이나 API 명세를 항상 system prompt에 넣지 않고, 필요한 작업에서만 꺼내 쓸 수 있습니다. [R11]

필요 그림: name/description → SKILL.md → references/scripts/assets → tool 실행 흐름. Mermaid로 반영 완료.

## 20-6. Skill 후보

화면 텍스트:

> secure-code-review  
> authz-review  
> release-check

배경지식 / 발표 멘트:

Skill은 단순 질의응답보다 절차가 중요한 작업에 잘 맞습니다. 예를 들어 PR 보안 리뷰는 diff 확인, trust boundary 확인, authn/authz 확인, secrets/logging 확인, 테스트 제안 순서가 중요합니다. 권한 검토는 subject, action, resource, ownership rule을 분리해서 permission matrix와 비교해야 합니다. 릴리즈 체크는 test, build, migration, feature flag, rollback plan, monitoring query가 일정한 순서로 필요합니다.

필요 그림: Skill 후보 카드.

## 20-7. 좋은 Skill 작성 방식

화면 텍스트:

> 좋은 Skill은  
> 작업 지시서처럼 씁니다

```markdown
---
name: authz-review
description: Use when reviewing authorization, role checks, ownership logic, or permission changes.
---

Goal: Find authorization risks in the current change.
Inputs: diff, tests, references/permission-matrix.md
Procedure:
1. Identify subject, action, resource, ownership rule.
2. Compare implementation with the permission matrix.
3. Check negative tests for unauthorized users.
Output: findings, evidence, missing tests, suggested fix.
```

배경지식 / 발표 멘트:

좋은 Skill은 설명문이 아니라 작업 지시서에 가깝습니다. 하나의 skill은 하나의 일에 집중시키고, `description`에는 언제 자동으로 쓰면 되는지 구체적으로 적습니다. 본문에는 입력, 절차, 검증 명령, 출력 형식을 명령형으로 둡니다. 긴 정책은 `references/`로 분리하고, grep이나 schema validation처럼 결정적인 반복 처리는 `scripts/`에 둡니다. [R11]

필요 그림: Skill template 카드. 현재 본문에 텍스트 카드로 반영.

## 20-8. Skill 보안

화면 텍스트:

> Skill도 공급망입니다

배경지식 / 발표 멘트:

Skill은 단순 문서가 아니라 instruction과 optional script를 포함할 수 있습니다. 그래서 외부 skill은 설치 전에 전체 파일, 의존성, script, 외부 네트워크 접근 지시를 확인해야 합니다. 배포, 커밋, PR comment, Slack 전송처럼 side effect가 있는 workflow는 자동 호출을 막고 사용자가 직접 호출하게 하는 편이 안전합니다. Claude Code 문서도 skill 활성화 중 tool 권한을 사전 승인할 수 있으므로 repository trust 전에 프로젝트 skill을 검토해야 한다고 경고합니다. [R12]

필요 그림: Review / Least privilege / Manual invocation / Log 4개 카드.

## 22. Tool Calling 실패 패턴

화면 텍스트:

> Wrong Tool  
> Wrong Args  
> Wrong Order  
> No Verification

배경지식 / 발표 멘트:

도구 호출이 약한 모델은 스키마에 맞지 않는 값을 넣거나, 필요한 도구를 건너뛰거나, 실행 순서를 틀릴 수 있습니다. 그래서 도구 자체보다 검증 루프가 중요합니다.

필요 그림: 깨진 JSON / 실패한 터미널 명령 이미지

## 23. 검증 명령이 성공 기준입니다

화면 텍스트:

> 검증 명령이  
> 성공 기준입니다

배경지식 / 발표 멘트:

테스트는 자연어 목표를 실행 가능한 조건으로 바꿉니다. 예를 들어 `npm test`, `pytest`, `go test ./...`처럼 명확한 검증 명령을 주면 에이전트는 이 명령을 기준으로 스스로 수정 방향을 잡습니다. 셸 도구는 실패 출력도 보존해야 모델이 복구 단서를 읽을 수 있습니다. [R7]

필요 그림: 터미널에서 테스트가 통과되는 화면

## 24. AI는 빠른 프로그래머다

화면 텍스트:

> 빠르다  
> 많이 바꾼다  
> 방향을 잃을 수 있다

배경지식 / 발표 멘트:

AI는 매우 빠르게 작업하지만, 항상 우리가 원하는 방향으로만 움직이지는 않습니다. 그래서 리뷰, 테스트, 변경 범위 제한이 필요합니다.

필요 그림: 빠르게 타이핑하는 개발자 + 흐릿한 모션 효과

## 25. Unit Test First

화면 텍스트:

> 먼저 실패하는 테스트  
> 그 다음 구현

배경지식 / 발표 멘트:

AI 에이전트에는 TDD가 잘 맞습니다. 실패하는 테스트를 먼저 만들면 에이전트가 도달해야 할 목표가 명확해집니다. 이 방식은 프롬프트를 자연어에서 실행 가능한 성공 기준으로 바꾸는 효과가 있습니다.

필요 그림: Red → Green 테스트 상태 전환

## 26. 에이전트 친화적 구조

화면 텍스트:

> Business Logic  
> ≠  
> Infrastructure

배경지식 / 발표 멘트:

비즈니스 로직과 인프라가 분리되어 있으면 AI가 수정 범위를 이해하기 쉽고 테스트도 쉽습니다. 반대로 컨트롤러, DB, 외부 API, 권한 로직이 한 파일에 섞이면 에이전트가 실수하기 쉽습니다.

필요 그림: Layered Architecture 다이어그램

## 27. Context가 품질을 만든다

화면 텍스트:

> README  
> ADR  
> API Contract  
> Permission Matrix

배경지식 / 발표 멘트:

AI에게 "알아서 해"라고 하면 모델의 일반 지식에 의존합니다. 사내 권한 체계, 정책, API 계약, 예외 케이스는 문서로 제공해야 합니다. MCP Resources나 파일 검색은 이런 컨텍스트를 공급하는 방식이 될 수 있습니다. [R1][R2]

필요 그림: 문서 묶음이 AI 컨텍스트로 들어가는 그림

## 28. 효과적인 사용 패턴

화면 텍스트:

> 1. 탐색  
> 2. 계획  
> 3. 제한된 수정  
> 4. 테스트  
> 5. 리뷰

배경지식 / 발표 멘트:

처음부터 수정하게 하지 말고 먼저 분석을 시킵니다. 그 다음 계획을 확인하고, 수정 범위를 제한한 뒤, 테스트 실행과 변경 리뷰까지 묶습니다. Codex와 Claude Code 모두 승인 모드, 권한 설정, 도구 제한을 통해 이 흐름을 통제할 수 있습니다. [R3][R4]

필요 그림: 5단계 프로세스 라인

## 29. 보안 활용

화면 텍스트:

> 취약점 탐색도  
> 에이전트형 작업이다

배경지식 / 발표 멘트:

허가된 코드베이스와 시스템 안에서라면, AI는 공격면 식별, 코드 경로 추적, 테스트 케이스 생성, 회귀 테스트 작성에 유용합니다. 단, 권한과 범위를 명확히 제한해야 합니다. OWASP는 LLM과 agentic 시스템의 보안 리스크를 별도 주제로 다룹니다. [R6]

필요 그림: 방패 + 터미널 + 코드 리뷰 이미지

## 30. AI 취약점 탐색의 필수요소

화면 텍스트:

> 확인 방법  
> 다양한 시도 소스  
> 신뢰 가능한 내부 정보

배경지식 / 발표 멘트:

첫째, 취약 여부를 확인할 방법이 있어야 합니다. 둘째, 다양한 입력, 로그, 라우트, 권한 케이스를 시도할 소스가 있어야 합니다. 셋째, 모델의 일반 지식이 아니라 사내 권한표, 데이터 등급, API 정책 같은 신뢰 가능한 정보를 제공해야 합니다.

필요 그림: Verification / Inputs / Trusted Context 삼각형

## 31. 취약점 탐색 루프

화면 텍스트:

> Surface  
> Hypothesis  
> Test  
> Evidence  
> Fix  
> Regression

배경지식 / 발표 멘트:

AI가 만든 취약점 가설은 반드시 증거로 연결되어야 합니다. 재현 조건, 영향 범위, 수정안, 회귀 테스트가 있어야 실제 보안 작업이 됩니다. NIST SSDF도 취약점 위험 감소, 영향 완화, 재발 방지를 위한 secure development practices를 강조합니다. [R6]

필요 그림: 보안 테스트 워크플로우 다이어그램

## 32. 결론

화면 텍스트:

> 도구로 실행하고  
> 검증으로 닫는다  
>
> 작은 권한  
> 명확한 컨텍스트  
> 재현 가능한 테스트

배경지식 / 발표 멘트:

AI 에이전트 활용의 핵심은 도구를 부정하는 것이 아닙니다. 도구는 실행력을 만들고, 검증은 신뢰를 만듭니다. 그래서 좋은 에이전트 활용은 올바른 컨텍스트로 시작하고, 제한된 권한 안에서 실행하고, 재현 가능한 검증 명령으로 끝나야 합니다.

필요 그림: Model + Tools + Tests + Human Review 최종 요약 이미지

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
OpenAI Shell 문서는 모델이 셸 명령을 실행할 수 있는 환경을 설명하면서, 임의 명령 실행은 위험하므로 샌드박스, allowlist 또는 denylist, 감사 로그가 필요하다고 설명합니다.  
https://developers.openai.com/api/docs/guides/tools-shell

[R8] Chrome DevTools MCP  
Chrome for Developers는 Chrome DevTools MCP가 AI 코딩 에이전트에 브라우저 디버깅 기능을 제공하고, 페이지 실행 결과, 콘솔/네트워크 문제, 성능 trace 등을 확인하는 데 사용할 수 있다고 설명합니다. 공식 GitHub 저장소는 `chrome-devtools-mcp` 서버와 연결 방법을 제공합니다.  
https://developer.chrome.com/blog/chrome-devtools-mcp  
https://github.com/ChromeDevTools/chrome-devtools-mcp

[R9] PulseMCP  
PulseMCP는 MCP 서버, MCP 클라이언트, 유스케이스, 글과 뉴스레터를 모아 보여주는 커뮤니티 디렉터리입니다. 2026-05-14 확인 기준 서버 디렉터리는 14,820개 서버를 표시했고, 클라이언트 페이지는 571개 MCP client, use case 페이지는 20개 예시를 표시했습니다. 서버 예시로 Playwright, Chrome DevTools, Context7, Git, Filesystem, GitHub, Postgres, Jira/Confluence 계열 등을 확인할 수 있고, 클라이언트 예시로 VS Code, OpenCode, Gemini CLI, Zed, Cline, Goose 같은 도구를 확인할 수 있습니다.  
https://www.pulsemcp.com/  
https://www.pulsemcp.com/servers  
https://www.pulsemcp.com/clients  
https://www.pulsemcp.com/use-cases

[R10] Filesystem MCP Server  
Model Context Protocol의 reference servers에는 filesystem server가 포함되어 있습니다. 이 서버는 설정된 허용 디렉터리 안에서 파일 읽기, 쓰기, 수정, 검색, 디렉터리 목록 조회 같은 도구를 제공하는 대표적인 MCP server 예시입니다.  
https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem

[R11] Agent Skills / Codex Skills / Claude Skills  
Agent Skills 표준은 skill을 `SKILL.md`를 포함하는 폴더 형식으로 설명하고, `scripts/`, `references/`, `assets/` 같은 보조 파일을 둘 수 있다고 설명합니다. Codex 문서는 repository/user/admin/system 위치의 skill을 읽고 `.agents/skills`를 사용할 수 있다고 설명합니다. Claude 문서는 progressive disclosure 구조로 metadata, instructions, resources를 단계적으로 로드한다고 설명합니다.  
https://agentskills.io/  
https://agentskills.io/specification  
https://developers.openai.com/codex/skills  
https://code.claude.com/docs/en/skills  
https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

[R12] Skill 보안과 권한  
Anthropic은 skill이 instruction과 code로 새로운 기능을 제공하므로 신뢰할 수 있는 출처의 skill만 설치하고, 덜 신뢰된 출처의 skill은 파일, 의존성, script, 외부 네트워크 접근 지시를 검토하라고 권장합니다. Claude Code 문서는 `allowed-tools`와 `disable-model-invocation` 같은 설정이 skill 호출과 tool 승인에 영향을 준다고 설명합니다.  
https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills  
https://code.claude.com/docs/en/skills
