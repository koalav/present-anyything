# AI 에이전트의 효과적인 활용 - Mermaid 다이어그램 후보

아래는 슬라이드에 Mermaid를 넣는다면 우선 적용할 위치와 초안입니다.
현재 `docs/ai-agent-effective-use/index.html`에는 Mermaid 렌더러와 아래 다이어그램들이 본문에 들어가 있습니다.
렌더러는 Mermaid 공식 문서의 ESM CDN 방식으로 붙였고, 버전은 재현성을 위해 `11.15.0`으로 고정했습니다.

## 1. Slide 3 - AI Agent 구성

목적: "AI Agent = Model + Tools + Context + Verification"을 구조로 보여줍니다.

```mermaid
flowchart LR
  M[Model]:::input --> A((AI Agent)):::core
  T[Tools]:::input --> A
  C[Context]:::input --> A
  V[Verification]:::input --> A
  A --> O[Verified Work Output]:::success
  classDef input fill:#0f172a,stroke:#475569,color:#e2e8f0,stroke-width:1.5px;
  classDef core fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.5px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 2. Slide 5 - 답변은 작업의 시작점

목적: 질의응답만으로는 파일 변경, 실행, 검증, 최신 상태 확인이 되지 않는다는 점을 한 장에 보여줍니다.

```mermaid
flowchart TB
  Q["질문"]:::input --> A(("텍스트 답변")):::core
  A --> Human["사람이 복사하고 판단"]:::human
  A -.-> F["파일은 그대로"]:::gap
  A -.-> R["실행 결과 없음"]:::gap
  A -.-> V["검증 증거 없음"]:::gap
  A -.-> C["최신/사내 상태 모름"]:::gap
  Human --> Done["작업 완료는 아직 아님"]:::warn
  classDef input fill:#0f172a,stroke:#60a5fa,color:#dbeafe,stroke-width:2px;
  classDef core fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.6px;
  classDef human fill:#111827,stroke:#94a3b8,color:#f8fafc,stroke-width:1.8px;
  classDef gap fill:#3f1d1d,stroke:#fca5a5,color:#fee2e2,stroke-width:1.8px;
  classDef warn fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
```

## 3. Slide 8 - Tool Calling

목적: 모델이 도구를 직접 실행하는 것이 아니라, 앱이 실행하고 결과를 다시 모델에 전달한다는 점을 분명히 보여줍니다.

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant A as App
  participant M as Model
  participant T as External Tool

  U->>A: Prompt
  A->>M: Prompt + tool schemas
  M-->>A: Tool call(name, args)
  A->>T: Execute tool
  T-->>A: Result
  A->>M: Tool result
  Note over A,M: App executes. Model interprets.
  M-->>A: Final answer
  A-->>U: Response
```

## 4. Slide 11 - MCP 구조

목적: AI model이 tool call을 판단하고, Host가 여러 타입의 MCP client를 통해 여러 타입의 MCP server로 연결한다는 구조를 보여줍니다.

```mermaid
flowchart LR
  Model(["AI Model: tool call 판단"]):::model --> Host["Host App: context + policy"]:::host
  Host --> C1["IDE / Coding Client"]:::client
  Host --> C2["Desktop Chat Client"]:::client
  Host --> C3["Workflow Client"]:::client
  C1 --> S1[["Repo / Files Server"]]:::server
  C1 --> S2[["Browser / DevTools Server"]]:::server
  C2 --> S3[["Docs / Search Server"]]:::server
  C3 --> S4[["Jira / DB / API Server"]]:::server
  S1 --> Cap["Tools / Resources / Prompts"]:::cap
  S2 --> Cap
  S3 --> Cap
  S4 --> Cap
  classDef model fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.6px;
  classDef host fill:#0f172a,stroke:#60a5fa,color:#dbeafe,stroke-width:2px;
  classDef client fill:#164e63,stroke:#67e8f9,color:#ecfeff,stroke-width:2px;
  classDef server fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.4px;
  classDef cap fill:#052e2b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 5. Slide 12 - MCP 이전과 이후

목적: 커스텀 연동 복잡도와 표준 서버 재사용의 차이를 대비합니다.

```mermaid
flowchart LR
  subgraph Before["Before: custom wiring"]
    BA["IDE Agent"]:::app --> B1["GitHub adapter"]:::wire --> BT1["GitHub API"]:::external
    BA --> B2["FS wrapper"]:::wire --> BT2["Local files"]:::external
    BB["Desktop Chat"]:::app --> B3["Drive connector"]:::wire --> BT3["Drive API"]:::external
    BB --> B4["Jira connector"]:::wire --> BT4["Jira API"]:::external
  end
  subgraph After["After: MCP standard"]
    HA["IDE Agent"]:::client --> HC1["MCP Client"]:::bridge
    HB["Desktop Chat"]:::client --> HC2["MCP Client"]:::bridge
    HC1 --> HS1[["Filesystem Server"]]:::server
    HC1 --> HS2[["GitHub Server"]]:::server
    HC2 --> HS1
    HC2 --> HS3[["Jira / Drive Server"]]:::server
    HS1 --> HT1["Local files"]:::external
    HS2 --> HT2["GitHub API"]:::external
    HS3 --> HT3["SaaS APIs"]:::external
  end
  classDef app fill:#111827,stroke:#fca5a5,color:#fee2e2,stroke-width:1.8px;
  classDef wire fill:#3f1d1d,stroke:#fb7185,color:#ffe4e6,stroke-width:2px;
  classDef client fill:#0f172a,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef bridge fill:#164e63,stroke:#67e8f9,color:#ecfeff,stroke-width:2px;
  classDef server fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.4px;
  classDef external fill:#1f2937,stroke:#94a3b8,color:#f8fafc,stroke-width:1.5px;
```

## 5-1. Slide 13 - Filesystem MCP 예시

목적: 대표적인 MCP server인 filesystem이 허용된 workspace 안에서 파일 도구를 실행하는 구조를 보여줍니다.

```mermaid
flowchart LR
  Request["요청: config 읽고 테스트 수정"]:::input --> Host["Host / Agent"]:::host
  Host --> Model["AI Model"]:::model
  Model -->|selects tool| Client["MCP Client"]:::client
  Client --> Server[["Filesystem MCP Server"]]:::server
  Server --> Guard{"path in allowed roots?"}:::guard
  Guard -->|no| Denied["blocked"]:::deny
  Guard -->|yes| Ops["read / list / search / edit"]:::tool
  Ops --> Workspace[("Allowed workspace")]:::fs
  Workspace --> Result["content / tree / diff"]:::result
  Result --> Host
  Host --> Verify["git diff / tests / review"]:::success
  classDef input fill:#111827,stroke:#94a3b8,color:#f8fafc,stroke-width:1.5px;
  classDef host fill:#0f172a,stroke:#60a5fa,color:#dbeafe,stroke-width:2px;
  classDef model fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.5px;
  classDef client fill:#164e63,stroke:#67e8f9,color:#ecfeff,stroke-width:2px;
  classDef server fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.4px;
  classDef guard fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef deny fill:#3f1d1d,stroke:#fca5a5,color:#fee2e2,stroke-width:2px;
  classDef tool fill:#052e2b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
  classDef fs fill:#1f2937,stroke:#94a3b8,color:#f8fafc,stroke-width:1.5px;
  classDef result fill:#111827,stroke:#2dd4bf,color:#ccfbf1,stroke-width:1.8px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 6. Slide 16 - Agent Loop

목적: 에이전트가 한 번 답하는 것이 아니라 관찰과 수정 루프를 돈다는 점을 강조합니다.

```mermaid
flowchart LR
  Plan((Plan)):::core --> Act((Act)):::core
  Act --> Observe((Observe)):::core
  Observe -->|failed| Revise((Revise)):::warn
  Revise --> Plan
  Observe -->|verified| Done[Done]:::success
  classDef core fill:#1e3a8a,stroke:#93c5fd,color:#eff6ff,stroke-width:2.4px;
  classDef warn fill:#78350f,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 7. Slide 18 - 코딩 에이전트 공통 구조

목적: Claude Code, Codex CLI, Gemini CLI, Cursor 같은 코딩 에이전트의 공통 구조를 보여줍니다.

```mermaid
flowchart LR
  LLM[LLM]:::core --> Tools[Tool layer]:::tool
  Tools --> Loop[Planning / Action / Observe / Retry]:::loop
  Loop --> Context[Context management]:::context
  Context --> Verify[Execution and verification]:::success
  Verify --> Loop
  classDef core fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.5px;
  classDef tool fill:#111827,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef loop fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.3px;
  classDef context fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 8. Slide 33 - Harness 작업 흐름

목적: 사용자 요청이 그대로 실행되는 것이 아니라 Task spec과 도구 정책을 거쳐 검증 루프로 들어간다는 점을 보여줍니다.

```mermaid
flowchart LR
  User[User request]:::input --> Spec[Task spec]:::core
  Spec --> Loop[Plan / Execute / Verify loop]:::loop
  Loop --> Evidence[Evidence report]:::success
  Spec --> Guard[Tool and permission policy]:::guard
  Guard --> Loop
  classDef input fill:#0f172a,stroke:#64748b,color:#e2e8f0,stroke-width:1.5px;
  classDef core fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.5px;
  classDef loop fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.4px;
  classDef guard fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 9. Slide 37 - 종료 조건

목적: 성공, 알려진 실패, 불명확성, 예산 초과를 다르게 처리하는 종료 정책을 보여줍니다.

```mermaid
flowchart TB
  Verify{Verification result}:::decision
  Verify -->|pass| Done[Done: report evidence]:::success
  Verify -->|known failure| Revise[Revise within scope]:::step
  Verify -->|unclear| Ask[Ask user to choose]:::ask
  Verify -->|budget exceeded| Stop[Stop with findings]:::stop
  Revise --> Verify
  classDef decision fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2.2px;
  classDef step fill:#111827,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef ask fill:#164e63,stroke:#67e8f9,color:#ecfeff,stroke-width:2px;
  classDef stop fill:#3f1d1d,stroke:#fca5a5,color:#fee2e2,stroke-width:2px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 10. Slide 26 - 에이전트 작업 방식

목적: 사람이 복사/실행하던 작업이 에이전트 실행 루프로 들어간다는 점을 보여줍니다.

```mermaid
flowchart LR
  Goal((Goal)):::start --> Read[Read codebase]:::step
  Read --> Plan[Plan]:::step
  Plan --> Edit[Edit files]:::step
  Edit --> Build[Build]:::step
  Build --> Test{Test pass?}:::decision
  Test -->|No| Edit
  Test -->|Yes| Review[Human review]:::success
  classDef start fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.5px;
  classDef step fill:#111827,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef decision fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 11. Slide 27 - 컴파일 에러 수정 루프

목적: 실제 에이전트가 빌드 실패를 읽고, 최소 수정 후 재검증하는 루틴을 보여줍니다.

```mermaid
flowchart LR
  Build[npm run build]:::run --> Error[Read compiler error]:::warn
  Error --> Locate[Find file and type]:::step
  Locate --> Patch[Patch smallest scope]:::step
  Patch --> Rebuild[npm run build again]:::run
  Rebuild -->|Fail| Error
  Rebuild -->|Pass| Test[npm test]:::run
  Test --> Report[Report evidence]:::success
  classDef run fill:#1e3a8a,stroke:#93c5fd,color:#eff6ff,stroke-width:2px;
  classDef warn fill:#7f1d1d,stroke:#fca5a5,color:#fee2e2,stroke-width:2px;
  classDef step fill:#111827,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 12. Slide 31 - 작업 지시의 4요소

목적: 좋은 요청을 구조화된 입력으로 보여줍니다.

```mermaid
flowchart TB
  Task((Agent Task)):::core
  Task --> Goal[Goal: desired outcome]:::item
  Task --> Scope[Scope: files and modules]:::item
  Task --> Rules[Constraints: do not touch]:::item
  Task --> Verify[Verification: command and criteria]:::success
  classDef core fill:#1d4ed8,stroke:#bfdbfe,color:#ffffff,stroke-width:2.5px;
  classDef item fill:#111827,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 13. Slide 37 - Skill progressive disclosure

목적: Skill이 항상 전체 context를 차지하지 않고, 이름/설명에서 시작해 필요한 파일만 단계적으로 로드된다는 점을 보여줍니다.

```mermaid
flowchart LR
  Catalog["name + description"]:::catalog --> Match{"task matches?"}:::decision
  Match -->|no| Skip["do not load"]:::muted
  Match -->|yes| Skill["read SKILL.md"]:::skill
  Skill --> Refs["references/"]:::file
  Skill --> Scripts["scripts/"]:::file
  Skill --> Assets["assets/"]:::file
  Skill --> Tools["use tools / MCP / shell"]:::tool
  Tools --> Evidence["evidence report"]:::success
  classDef catalog fill:#0f172a,stroke:#67e8f9,color:#ecfeff,stroke-width:2px;
  classDef decision fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef muted fill:#1f2937,stroke:#64748b,color:#cbd5e1,stroke-width:1.5px;
  classDef skill fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.5px;
  classDef file fill:#111827,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef tool fill:#1e3a8a,stroke:#93c5fd,color:#eff6ff,stroke-width:2px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 14. Slide 43 - 정확도와 토큰 예산

목적: 적은 토큰과 높은 정확도가 요청 구조화, context 선별, 도구 순서, 검증 루프에서 나온다는 점을 보여줍니다.

```mermaid
flowchart LR
  Request["User request"]:::input --> Spec["Task spec"]:::core
  Spec --> Select["select minimal context"]:::step
  Select --> Tools["choose tool sequence"]:::step
  Tools --> Verify["run verification"]:::success
  Select -.-> Noise["less irrelevant tokens"]:::benefit
  Tools -.-> Accuracy["fewer wrong actions"]:::benefit
  Verify -.-> Trust["evidence-backed result"]:::benefit
  classDef input fill:#0f172a,stroke:#64748b,color:#e2e8f0,stroke-width:1.5px;
  classDef core fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.5px;
  classDef step fill:#111827,stroke:#60a5fa,color:#dbeafe,stroke-width:1.8px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
  classDef benefit fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:1.8px;
```

## 15. Slide 47 - 에이전트 친화적 구조

목적: 비즈니스 로직과 인프라가 분리될수록 테스트와 수정 범위가 명확해지는 것을 보여줍니다.

```mermaid
flowchart TB
  Controller[Controller / Handler]:::edge --> UseCase[Business Logic]:::core
  UseCase --> Port[Interface / Port]:::port
  Port --> Adapter[Infrastructure Adapter]:::infra
  Adapter --> DB[(Database)]:::system
  Adapter --> External[External API]:::system
  Tests[Unit Tests]:::success --> UseCase
  classDef core fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2.5px;
  classDef edge fill:#111827,stroke:#64748b,color:#e2e8f0,stroke-width:1.5px;
  classDef port fill:#1e3a8a,stroke:#93c5fd,color:#eff6ff,stroke-width:2px;
  classDef infra fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef system fill:#1f2937,stroke:#94a3b8,color:#f8fafc,stroke-width:1.5px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```

## 16. Slide 53 - 취약점 탐색 루프

목적: 취약점 가설이 증거, 수정, 회귀 테스트까지 이어져야 실제 보안 작업이 된다는 점을 보여줍니다.

```mermaid
flowchart LR
  Surface[Surface]:::step --> Hypothesis[Hypothesis]:::step
  Hypothesis --> Test[Test]:::run
  Test --> Evidence[Evidence]:::evidence
  Evidence --> Fix[Fix]:::fix
  Fix --> Regression[Regression Test]:::run
  Regression --> Report[Report]:::success
  classDef step fill:#111827,stroke:#fca5a5,color:#fee2e2,stroke-width:1.8px;
  classDef run fill:#1e3a8a,stroke:#93c5fd,color:#eff6ff,stroke-width:2px;
  classDef evidence fill:#422006,stroke:#fbbf24,color:#fffbeb,stroke-width:2px;
  classDef fix fill:#0f766e,stroke:#99f6e4,color:#ffffff,stroke-width:2px;
  classDef success fill:#064e3b,stroke:#5eead4,color:#ecfeff,stroke-width:2px;
```
