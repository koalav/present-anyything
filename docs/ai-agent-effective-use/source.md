# AI 에이전트의 효과적인 활용 - 대본 소스

이 파일은 `docs/ai-agent-effective-use/index.html` 슬라이드의 원본 대본입니다.
화면 텍스트는 슬라이드에 들어가는 짧은 문장이고, 배경지식은 발표자가 말할 내용입니다.
그림은 아직 제작하지 않고 `visual-assets.md`에 따로 모았습니다. Mermaid로 전환하기 좋은 후보는 `mermaid-diagrams.md`에 따로 정리했습니다.

## 1. 제목

화면 텍스트:

> AI 에이전트의 효과적인 활용
> 반복 작업은 Harness로, 판단은 AI로, 결정은 사람에게

배경지식 / 발표 멘트:

오늘의 핵심은 "AI를 더 잘 질문하는 법"이 아니라, 사람이 하던 모바일 보안 감사 업무를 어떤 부분은 대체하고 어떤 부분은 보조하게 만들 것인가입니다. 사람이 하던 귀찮고 결정적인 반복 작업은 tool/harness로 만들고, 코드 분석, 취약점 PoC 시도, 취약점 여부 진단 같은 판단 영역은 AI에게 맡깁니다. 사람은 최종 결과 분석과 후속 조치를 담당합니다.

필요 그림: 어두운 배경의 터미널 + AI 에이전트 느낌의 추상 이미지

## 1-1. 목차

화면 텍스트:

> 오늘의 흐름
> 1. 기본 정의
> 2. MCP
> 3. Audit Agent
> 4. Skill
> 5. Effective Instruction
> 6. AI를 이용한 모바일 앱 보안 분석기

배경지식 / 발표 멘트:

오늘은 먼저 챗봇과 에이전트를 구분하고, 도구 호출과 MCP가 왜 필요한지 봅니다. 그 다음 사람이 하던 모바일 보안 감사 업무를 Harness와 AI 판단으로 나누는 방식을 보고, 반복되는 보안 점검 패턴을 Skill로 표준화하는 방법을 봅니다. 이후 역할 경계와 Harness 설계를 정리하고, 마지막에는 AI를 이용한 모바일 앱 보안 분석기 사례를 다룹니다.

필요 그림: 없음. 텍스트 목차 슬라이드로 충분합니다.

## 2. 핵심 정의

화면 텍스트:

> AI Agent
> = Human Work + Harness + AI Judgment + Human Follow-up

배경지식 / 발표 멘트:

에이전트는 단순 챗봇이 아닙니다. 먼저 사람이 하던 보안 감사 업무를 분해해야 합니다. 반복적이고 결정적인 수집, 파싱, 실행은 Harness가 맡고, 코드 분석, 취약점 PoC 시도, 취약점 여부 진단은 AI가 맡습니다. 사람은 최종 결과를 검토하고 패치, 티켓, 재검증 같은 후속 조치를 결정합니다. [R2]

필요 그림: Human work → Tool/Harness → AI judgment → Human follow-up 다이어그램

## 3. 출발점: 답변은 작업의 시작점입니다

화면 텍스트:

> 답변은 작업의 시작점입니다

배경지식 / 발표 멘트:

대부분의 AI 사용은 질문과 답변에서 시작합니다. 요약, 설명, 초안 작성에는 충분히 강력하지만, 코드나 업무 시스템을 실제로 바꾸는 작업에서는 여기서 끝나지 않습니다. 텍스트 답변만 있으면 사람이 복사하고, 도구를 실행하고, 판단을 다시 정리해야 합니다. 그래서 답변은 사람 업무를 보조하거나 대체하는 구조가 아니라 작업의 시작점입니다.

필요 그림: 질문 → 텍스트 답변을 중심에 두고, 주변에 파일 미변경 / 실행 결과 없음 / 검증 증거 없음 / 최신 상태 모름을 배치한 다이어그램. Mermaid로 반영 완료.

## 4. 왜 도구가 필요한가

화면 텍스트:

> 도구가 있어야
> 상태를 확인합니다

배경지식 / 발표 멘트:

모델의 파라메트릭 지식은 오래됐을 수 있고, 대상 앱의 Manifest나 build variant, 사내 보안 정책은 모릅니다. 외부 도구는 AndroidManifest, 디컴파일 코드, 디바이스 상태, 실행 로그를 제공합니다. 도구를 붙이면 답변이 지식 생성에서 작업 실행과 상태 확인으로 이동합니다.

필요 그림: Model 밖에서 Web / Files / Shell / Test 결과가 들어오는 그림

## 5. 도구가 붙은 AI

화면 텍스트:

> 사람이 하던 일을 세 부분으로 나눕니다
> Harness / AI / Human

배경지식 / 발표 멘트:

최근의 AI 사용 환경은 단순 텍스트 생성에서 벗어났습니다. 목표는 사람이 하던 일을 통째로 모델에게 던지는 것이 아니라, 역할을 나누는 것입니다. Manifest 파싱, 후보 수집, 명령 실행처럼 귀찮고 결정적인 일은 Harness가 합니다. 코드 분석, PoC 시도, 취약점 여부 진단처럼 판단이 필요한 영역은 AI가 맡습니다. 사람은 최종 결과 분석과 후속 조치를 담당합니다. [R2][R7]

필요 그림: Harness / AI / Human 3단 역할 분담 카드

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

## 12. 공개 도구 생태계

화면 텍스트:

> MCP 생태계는 이미
> 큰 규모입니다
>
> Servers 14.8k
> Clients 571
> Use cases 20

배경지식 / 발표 멘트:

많은 MCP 서버와 외부 도구가 공개되고 있습니다. 2026-05-14 기준 PulseMCP의 서버 디렉터리는 14,820개 서버를 표시하고, 클라이언트 목록은 571개 MCP client를 제목에 표시하며, use case 쇼케이스는 20개 예시를 제공합니다. 이는 생산성 기회이면서 동시에 새로운 공격면입니다. 도구를 붙인다는 것은 AI에게 행동 권한을 준다는 뜻입니다. MCP 보안에서는 토큰 관리, 권한 범위, 감사 로그, Shadow MCP Server 같은 이슈가 중요해집니다. [R6][R8]

필요 그림: Servers / Clients / Use cases 숫자 카드. 현재 본문에 stat 카드로 반영.

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

## 14. Agent Loop

화면 텍스트:

> Plan
> Act
> Observe
> Revise

배경지식 / 발표 멘트:

좋은 에이전트는 한 번 답하고 끝나지 않습니다. 계획하고, 실행하고, 관찰하고, 실패하면 수정합니다. 코딩, 디버깅, 취약점 탐색 모두 이 루프가 중요합니다. Gemini CLI 문서도 ReAct 루프와 도구, MCP 서버를 이용해 버그 수정, 기능 개발, 테스트 커버리지 개선을 수행한다고 설명합니다. [R5]

필요 그림: 순환 화살표 루프 다이어그램

## 15. 모바일 보안 감사 에이전트

화면 텍스트:

> Codex
> Claude Code
> Gemini CLI
> = Audit Harness

배경지식 / 발표 멘트:

모바일 보안 감사 에이전트는 단순 모델이 아닙니다. 모델을 Android 분석 작업에 맞게 실행하는 harness입니다. 파일 시스템, 터미널, 검색, manifest parser, jadx, adb, Frida 같은 도구가 붙습니다. Codex CLI나 Claude Code 같은 코딩 에이전트는 repo와 명령 실행을 다룰 수 있고, 여기에 모바일 분석 도구를 MCP로 붙이면 감사 작업으로 확장됩니다. [R3][R4][R5]

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
> Search
> Parse
> ADB
> Frida
> MCP

배경지식 / 발표 멘트:

모바일 보안 감사의 기본 도구는 코드 읽기, manifest 검색, 구조화 parse, ADB 실행, Frida hook, MCP 호출입니다. 여기에 jadx, aapt, Ghidra, IDA Pro 같은 도구를 붙이면 모델이 직접 추측하지 않고 실제 분석 결과를 해석할 수 있습니다. 셸 실행과 device 접근은 강력하지만 위험하므로 샌드박스, 허용 목록, 차단 목록, 로그가 필요합니다. [R4][R7]

필요 그림: Manifest, 검색, 터미널, 증거 체크 아이콘

## 16-1. 파일 접근과 코드 탐색

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

## 16-2. Shell 실행

화면 텍스트:

> 실행 결과가 있어야
> 스스로 고칩니다

```text
./gradlew test
adb shell pm dump
aapt dump xmltree app.apk AndroidManifest.xml
jadx --show-bad-code app.apk
frida -U -f com.example.app
semgrep --config android-audit.yml
```

배경지식 / 발표 멘트:

실행 도구의 가치는 터미널 자체가 아니라 실행 결과입니다. 에이전트가 manifest를 확인하고, APK를 decompile하고, 기기에서 intent를 실행하고, Frida로 runtime 동작을 관찰할 수 있게 됩니다. Claude Code 류는 사실상 `LLM + bash harness`에 가깝지만, 이 기능은 위험하기 때문에 권한 제한과 로그가 필수입니다.

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
> manifest parser · jadx · aapt · adb · frida · evidence log
>
> Boosters
> Ghidra · IDA Pro · call graph · taint rules · structured extractor

배경지식 / 발표 멘트:

실제 성능 차이를 만드는 것은 fancy UI나 chat 스타일보다 추출, 실행, 검증 루프 품질입니다. 매우 중요한 것은 manifest parser, jadx, aapt, adb, Frida, evidence log입니다. 여기에 Ghidra, IDA Pro, call graph, taint rule, structured extractor가 붙으면 성능이 크게 올라갑니다.

필요 그림: 핵심 도구와 성능 booster 비교.

## 16-5. 모바일 보안 감사 Harness 확장

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

## 17. 기존 작업 방식

화면 텍스트:

> 사람이 전부 오케스트레이션
> Manifest와 decompile 결과를 사람이 찾음
> PoC 시도와 취약점 판단도 사람이 반복
> 최종 보고와 후속 조치까지 사람이 처리

배경지식 / 발표 멘트:

기존 ChatGPT식 감사 작업은 사람이 오케스트레이터였습니다. 모델이 체크리스트를 말해주면 사람이 Manifest와 decompile 결과를 찾고, jadx나 adb를 실행하고, PoC를 시도하고, 취약점 여부를 판단하고, 결과를 다시 요약해 모델에 붙여넣어야 했습니다. 이 구조에서는 AI가 사람 일을 실제로 대체하거나 보조하는 범위가 작습니다.

필요 그림: 사람을 중심으로 ChatGPT와 IDE가 오가는 흐름

## 18. 에이전트 작업 방식

화면 텍스트:

> 사람 일을 보조하거나 대체합니다
> Human work
> Tool / Harness
> AI judgment
> Human follow-up

배경지식 / 발표 멘트:

감사 Harness는 사람이 하던 업무 중 귀찮고 결정적인 부분을 대신합니다. APK/source를 로드하고, Manifest와 decompiled code에서 facts를 추출하고, 필요한 명령을 실행합니다. AI는 그 facts를 바탕으로 코드 분석, PoC 시도, 취약점 여부 진단을 수행합니다. 사람은 evidence report를 보고 최종 판단과 후속 조치를 담당합니다. [R4]

필요 그림: Human work → Tool/Harness → AI judgment → Evidence report → Human follow-up 파이프라인

## 18-1. 실제 루틴: Open components 찾기

화면 텍스트:

> Open components를 찾는 루프
> find AndroidManifest → rg → 후보 해석 → structured JSON → AI 판단

배경지식 / 발표 멘트:

예를 들어 "Android open components 찾아줘"라고 하면 일반 code agent는 `find`로 AndroidManifest를 찾고 `rg`로 `exported`나 `intent-filter`를 검색합니다. 대체로 맞는 결과를 낼 수 있지만 merged manifest, activity-alias, library manifest, flavor별 manifest를 놓칠 수 있고, AI가 파일을 많이 읽으면 시간과 비용이 커집니다. 이런 결정적인 output은 코드가 structured JSON으로 뽑고, AI는 그 결과의 위험도와 설명을 판단하게 하는 편이 맞습니다.

필요 그림: Mermaid로 반영 완료. Open components 추출 루프.

## 18-2. 실제 요청 예시

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

## 18-3. 완료 보고 예시

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

## 19. 좋은 요청 예시

화면 텍스트:

> "Android 앱의 exported component를
> 구조화된 결과로 추출하고
> 위험도를 판단해주세요."

배경지식 / 발표 멘트:

에이전트에게는 "취약점 찾아줘"보다 "이 범위에서 facts를 추출하고 이 기준으로 위험도를 판단해줘"가 더 적합합니다. 단, 범위와 검증 방법을 같이 줘야 합니다.

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
> Android Context
> Boundary
> Evidence

배경지식 / 발표 멘트:

AI에게 "잘해줘"라고 말하면 모델은 일반적인 최선 추측으로 움직입니다. 정확도를 높이려면 목표, Android context, 감사 경계, 증거 기준을 분리해서 줘야 합니다. 이 네 가지가 있으면 모델은 탐색 범위를 줄이고, 불필요한 파일을 덜 읽고, 검증 가능한 결과로 닫을 수 있습니다.

필요 그림: Goal / Context / Boundary / Verify 4개 카드. 현재 본문에 steps로 반영.

## 19-3. 정확도는 좋은 선별에서 나옵니다

화면 텍스트:

> 정확도는 넓은 컨텍스트가 아니라
> 좋은 선별에서 나옵니다

배경지식 / 발표 멘트:

컨텍스트를 많이 넣는다고 항상 정확해지는 것은 아닙니다. 관련 없는 파일과 규칙이 많아지면 tool 선택과 판단 방향도 흔들립니다. 좋은 Harness는 사용자 요청을 audit spec으로 바꾸고, Android facts를 extractor로 뽑고, 필요한 정책 context만 고른 뒤, AI에게 위험 판단을 맡깁니다. 이 구조가 토큰 사용량과 오류 가능성을 동시에 줄입니다.

필요 그림: User request → Audit spec → Android facts → policy context → AI risk judgment. Mermaid로 반영 완료.

## 19-4. Harness는 귀찮은 일을 도구화합니다

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

## 19-5. 좋은 Harness의 구성 요소

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

## 19-6. 귀찮고 결정적인 일은 Harness가 합니다

화면 텍스트:

> Code agent only: find AndroidManifest + rg
> Structured extractor: merged manifest → JSON

배경지식 / 발표 멘트:

예를 들어 open components는 결정적인 output을 만들 수 있는 사안입니다. Code agent에게만 맡기면 사람이 하던 것처럼 `find AndroidManifest`와 `rg`를 반복해서 대체로 맞는 결과를 만들 수 있지만, merged manifest, alias, library manifest를 놓칠 수 있고 시간과 AI 호출 비용이 듭니다. 이런 경우에는 Harness가 manifest를 parse해 structured JSON을 만들고, AI에게는 취약점 여부와 영향 판단만 맡기는 것이 옳습니다.

필요 그림: 정보 funnel 다이어그램.

## 19-7. 재현성은 도구 증거에서 나옵니다

화면 텍스트:

> Input
> Tool
> Env
> Log

배경지식 / 발표 멘트:

재현성은 모델에게 "잘해줘"라고 말해서 생기지 않습니다. 같은 APK/source, 같은 parser와 명령어, 같은 API level과 기기 상태, 그리고 실행 로그와 JSON이 있어야 합니다. Harness는 이 네 가지를 고정해야 합니다. 그래야 여러 번 실행해도 비슷한 결과가 나오고, 사람이 결과를 검토할 수 있습니다.

필요 그림: Input / Tool / Env / Log 4요소 다이어그램.

## 19-8. 종료 조건을 Harness에 박아둡니다

화면 텍스트:

> pass → report
> known failure → revise
> unclear → ask
> budget exceeded → stop

배경지식 / 발표 멘트:

에이전트가 끝없이 반복하는 것을 막으려면 종료 조건이 필요합니다. 검증 명령과 evidence check가 통과하면 증거를 보고하고 끝냅니다. 원인이 분명한 실패면 정해진 범위 안에서 다시 확인합니다. 불명확하면 사용자에게 선택지를 제시합니다. 반복 횟수나 시간, 토큰 예산을 넘으면 현재까지의 발견을 보고하고 멈춰야 합니다.

필요 그림: Mermaid로 반영 완료. 종료 조건 분기.

## 19-9. 불명확하면 바로 실행하지 않습니다

화면 텍스트:

> Bad
> 모바일 앱 취약점 찾아줘
>
> Better
> 감사 범위와 산출물을 좁힙니다

배경지식 / 발표 멘트:

사용자 입력이 불명확하면 바로 실행하지 않는 것이 좋습니다. Harness는 내부적으로 요청을 분해하고, open components, WebView, storage, crypto처럼 가능한 감사 항목을 몇 개로 좁힌 뒤 사용자에게 선택지를 줍니다. 모델의 긴 추론 과정을 그대로 보여줄 필요는 없지만, 결과적으로 "이 APK의 어떤 범위를 볼까요"처럼 사용자가 스스로 구체화할 수 있게 해야 합니다.

필요 그림: Bad request vs Better request 비교.

## 19-10. 웹뷰 취약점 요청을 구조화합니다

화면 텍스트:

> 1. 취약점 후보군 나열
> 2. manifest / jadx scan
> 3. 허용 목록 / bridge 확인
> 4. ADB / Frida 증거 보고

배경지식 / 발표 멘트:

"웹뷰 취약점 찾아줘"는 너무 큽니다. 먼저 후보군을 나열해야 합니다. 예를 들어 JavaScript bridge 노출, file access, mixed content, allowlist 우회, 외부 URL 로딩 같은 항목입니다. 그 다음 manifest와 WebView 설정, `addJavascriptInterface` 사용 여부를 jadx output에서 정적으로 검사합니다. 더 좋은 Harness는 ADB와 Frida로 WebView 실행 경로와 bridge 호출을 확인할 도구까지 제공합니다.

필요 그림: 웹뷰 취약점 점검 프로세스.

## 19-11. 더 좋은 Harness는 확인 도구를 제공합니다

화면 텍스트:

> 후보군
> 정적 검사
> 동적 확인
> ADB / Frida 검증
> 증거 보고

배경지식 / 발표 멘트:

좋은 Harness는 "무엇을 체크할지"만 알려주지 않고, 확인할 수 있는 도구를 제공합니다. 웹뷰 보안에서는 jadx로 `addJavascriptInterface`와 WebView 설정을 찾고, ADB로 Activity를 실행하고, Frida로 bridge 호출이나 allowlist 우회 여부를 관찰할 수 있습니다. 도구가 facts와 증거를 만들고, AI는 그 결과가 실제 취약점인지 판단하게 해야 합니다.

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

작업 지시의 4요소는 좋은 요청의 기본형입니다. 그런데 권한 검토, WebView 점검, exported component 감사, 취약점 triage처럼 반복되는 작업은 매번 같은 지시를 붙여넣게 됩니다. 이런 자주 쓰는 프롬프트 패턴을 형식화해서 에이전트가 필요할 때 재사용하게 만드는 것이 Skill입니다. [R10]

필요 그림: 없음. 섹션 구분 슬라이드.

## 20-2. 반복되는 지시는 Skill로 형식화합니다

화면 텍스트:

> 반복되는 지시는
> Skill로 형식화합니다

배경지식 / 발표 멘트:

Skill은 모델을 새로 학습시키는 fine-tuning이 아닙니다. 매번 적던 절차, 체크리스트, 스타일 가이드, 팀 규칙, 검증 명령을 파일로 패키징하는 방식입니다. 즉 "목표, 범위, 제약, 검증" 같은 좋은 지시 형식을 팀의 표준 workflow로 만들어두는 것입니다. [R10]

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

Agent Skills 표준에서 skill은 최소한 `SKILL.md`를 포함하는 폴더입니다. `SKILL.md`에는 `name`, `description`, 에이전트가 따라야 할 지시문이 들어가고, 필요하면 `scripts/`, `references/`, `assets/` 같은 보조 파일을 둘 수 있습니다. Codex와 Claude 문서도 같은 구조를 사용합니다. [R10]

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

가장 중요한 구분은 실행 능력과 업무 절차의 차이입니다. `bash`, `read_file`, `jadx`, `adb`, `frida`는 실행 가능한 도구입니다. MCP는 이런 도구와 외부 데이터를 표준 방식으로 연결하는 프로토콜입니다. Skill은 그 도구들을 어떤 순서로 사용하고, 어떤 기준으로 성공과 실패를 판단할지 정한 runbook입니다. 짧게 말하면 Tool은 action primitive이고, Skill은 그 primitive를 사용하는 reusable procedure입니다. [R1][R2][R10]

필요 그림: Tool / MCP / Skill 3분할 비교.

## 20-5. Skill은 필요한 때만 로드됩니다

화면 텍스트:

> Discovery
> Activation
> Execution

배경지식 / 발표 멘트:

Skill의 핵심은 progressive disclosure입니다. 시작 시점에는 skill의 `name`과 `description` 정도만 보고, 사용자 요청이 description과 맞을 때 전체 `SKILL.md`를 읽습니다. 그 뒤에 필요할 때만 `references/`, `scripts/`, `assets/`를 읽거나 실행합니다. 그래서 긴 사내 정책이나 API 명세를 항상 system prompt에 넣지 않고, 필요한 작업에서만 꺼내 쓸 수 있습니다. [R10]

필요 그림: name/description → SKILL.md → references/scripts/assets → tool 실행 흐름. Mermaid로 반영 완료.

## 20-6. Skill 후보

화면 텍스트:

> android-audit
> webview-audit
> open-components

배경지식 / 발표 멘트:

Skill은 단순 질의응답보다 절차가 중요한 작업에 잘 맞습니다. 예를 들어 Android 보안 감사는 Manifest, storage, network, crypto, logging 점검 순서가 중요합니다. WebView 감사는 bridge, file access, mixed content, 허용 목록을 순서대로 봐야 하고, open components 감사는 exported, permission, intent-filter, deep link를 구조화해서 비교해야 합니다.

필요 그림: Skill 후보 카드.

## 20-7. 좋은 Skill 작성 방식

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

## 20-8. Skill 보안

화면 텍스트:

> Skill도 공급망입니다

배경지식 / 발표 멘트:

Skill은 단순 문서가 아니라 instruction과 optional script를 포함할 수 있습니다. 그래서 외부 skill은 설치 전에 전체 파일, 의존성, script, 외부 네트워크 접근 지시를 확인해야 합니다. 기기 설치, Frida attach, report upload, ticket comment처럼 side effect가 있는 workflow는 자동 호출을 막고 사용자가 직접 호출하게 하는 편이 안전합니다. Claude Code 문서도 skill 활성화 중 tool 권한을 사전 승인할 수 있으므로 repository trust 전에 프로젝트 skill을 검토해야 한다고 경고합니다. [R11]

필요 그림: Review / Least privilege / Manual invocation / Log 4개 카드.

## 29. AI를 이용한 모바일 앱 보안 분석기

화면 텍스트:

> AI를 이용한 모바일 앱 보안 분석기
> 도구가 귀찮은 facts를 만들고, AI가 취약점 여부를 판단하고, 사람은 후속 조치를 결정합니다.
> jadx: DEX를 Java/Kotlin 형태로 탐색
> Frida: 런타임 hook과 동작 검증
> Ghidra: native library 정적 분석
> IDA Pro: 복잡한 native 흐름 추적
> Harness facts → AI 판단 → Human follow-up

배경지식 / 발표 멘트:

모바일 앱 보안 분석기는 APK, source, manifest, 실행 로그를 입력으로 받고, 정적 분석 도구와 동적 확인 도구를 묶어 취약점 후보를 찾습니다. 처음부터 AI에게 모든 파일을 읽히지 말고 먼저 대상 APK/source와 build variant를 고정합니다. 그 다음 parser와 도구로 facts를 추출하고, AI에게 코드 분석, PoC 시도, 취약점 여부 진단을 맡깁니다. 사람은 재현 가능한 증거를 보고 최종 분석과 후속 조치를 결정합니다. jadx는 DEX와 decompiled source를 탐색할 수 있게 하고, Frida는 런타임에서 실제 method 호출과 데이터를 관찰하게 합니다. Ghidra와 IDA Pro는 Java/Kotlin 바깥의 native library 흐름을 볼 때 필요합니다. 이런 도구가 있으면 모델은 추측 대신 도구 결과를 근거로 판단할 수 있습니다. [R6][R7]

필요 그림: jadx / Frida / Ghidra / IDA Pro 4개 카드와 분석 패턴 메타 문구.

## 30. 모바일 앱 보안 분석기의 필수요소

화면 텍스트:

> Harness: 수집 · 파싱 · 실행
> AI: 분석 · PoC · 진단
> Human: 최종 분석 · 후속 조치

배경지식 / 발표 멘트:

첫째, Harness는 APK, source, manifest를 수집하고 파싱하고 필요한 명령을 실행합니다. 둘째, AI는 Harness가 만든 facts를 기반으로 코드 분석, PoC 시도, 취약점 진단을 합니다. 셋째, 사람은 모델의 판단을 그대로 받아쓰지 않고 재현 조건, 로그, 스크린샷, 검증 결과를 보고 최종 분석과 후속 조치를 결정합니다.

필요 그림: Harness / AI / Human 역할 삼각형

## 31. 모바일 앱 보안 분석 루프

화면 텍스트:

> Human audit goal
> Harness facts
> AI code analysis
> AI PoC attempt
> Vulnerability diagnosis
> Evidence report
> Human final analysis
> Follow-up action

배경지식 / 발표 멘트:

모바일 앱 분석 루프는 사람의 감사 목표에서 시작합니다. Harness가 attack surface와 structured facts를 만들고, AI가 코드 분석과 PoC 시도를 통해 취약점 여부를 진단합니다. 그 다음 evidence report를 만들고, 사람은 최종 분석, 패치, 티켓, 재검증 같은 후속 조치를 결정합니다. NIST SSDF도 취약점 위험 감소, 영향 완화, 재발 방지를 위한 secure development practices를 강조합니다. [R6]

필요 그림: 보안 테스트 워크플로우 다이어그램

## 32. 결론

화면 텍스트:

> Harness가 덜고
> AI가 판단하고
> 사람이 결정한다
>
> 반복 작업 도구화
> 취약점 판단 자동화
> 최종 분석과 후속 조치

배경지식 / 발표 멘트:

AI 에이전트 활용의 핵심은 사람을 무조건 빼는 것이 아니라, 사람의 일을 올바른 위치로 옮기는 것입니다. 귀찮고 결정적인 반복 작업은 Harness로 만들고, 코드 분석, PoC 시도, 취약점 여부 진단은 AI가 맡습니다. 사람은 재현 가능한 evidence를 기반으로 최종 결과를 분석하고 후속 조치를 결정합니다.

필요 그림: Harness + AI judgment + Human follow-up 최종 요약 이미지

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

[R8] PulseMCP
PulseMCP는 MCP 서버, MCP 클라이언트, 유스케이스, 글과 뉴스레터를 모아 보여주는 커뮤니티 디렉터리입니다. 2026-05-14 확인 기준 서버 디렉터리는 14,820개 서버를 표시했고, 클라이언트 페이지는 571개 MCP client, use case 페이지는 20개 예시를 표시했습니다. 공개 서버는 범용 개발, 파일 시스템, 데이터베이스, 브라우저, 문서 도구가 많지만 같은 연결 모델을 jadx, Frida, ADB, Ghidra 같은 모바일 분석 도구에도 적용할 수 있습니다.
https://www.pulsemcp.com/
https://www.pulsemcp.com/servers
https://www.pulsemcp.com/clients
https://www.pulsemcp.com/use-cases

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
