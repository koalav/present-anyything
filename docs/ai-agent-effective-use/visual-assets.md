# AI 에이전트의 효과적인 활용 - 필요한 그림 / 다이어그램 목록

아직 제작하지 않은 이미지와 다이어그램 목록입니다. 슬라이드는 텍스트 중심으로 먼저 구성했습니다.
Mermaid로 바로 만들기 좋은 후보는 `index.html` 본문에 반영했고, 초안 코드는 `mermaid-diagrams.md`에 따로 정리했습니다.

| Source Item | Type | Description |
| --- | --- | --- |
| 1 | Hero image | 어두운 배경의 터미널 + AI 에이전트 느낌의 추상 이미지 |
| 2 | Diagram | Model, Tools, Context, Verification 4개 블록이 하나의 Agent로 합쳐지는 구조 |
| 3 | Mermaid | 질문 → 텍스트 답변 중심, 주변에 파일 미변경 / 실행 없음 / 검증 없음 / 최신 상태 모름 |
| 4 | Concept | 도구가 최신 정보, 사내 데이터, 파일 상태, 실행 결과를 모델 밖에서 가져오는 구조 |
| 5 | Hub diagram | AI 중심에 Web, Python, File, Terminal 아이콘 연결 |
| 6 | Sequence | Prompt → Tool Call → External Tool → Result → Answer |
| 7 | Compare | Model Memory와 Live Data 대비 |
| 8 | Metaphor | 플러그 / 어댑터 / 표준 포트 이미지 |
| 9 | Architecture | AI Model → Host → 여러 MCP Client → 여러 MCP Server → Tools/Resources/Prompts |
| 10 | Before/After | 앱별 GitHub/파일/Drive/Jira 커스텀 어댑터 vs MCP Client/Server 표준 연결 |
| 10-1 | Architecture | Filesystem MCP Server: allowed roots 검사 후 read/list/search/edit 실행 |
| 11 | Matrix | Client × Model × Tool 매트릭스 |
| 12 | Stat cards | PulseMCP 기준 Servers 14,820 / Clients 571 / Use cases 20 |
| 12-1 | Link slide | PulseMCP 링크 카드와 Servers / Clients / Use Cases 3분할 |
| 13 | Concept | 플러그와 실행 루프 구분 |
| 14 | Loop | Plan → Act → Observe → Revise 순환 화살표 |
| 15 | Hero image | 터미널 위에서 동작하는 코딩 에이전트 |
| 15-1 | Mermaid | 코딩 에이전트 공통 구조 |
| 16-1 | Card | 파일 접근 / 코드 검색 / 심볼 탐색 3분할 |
| 16-2 | Terminal | Shell 실행 명령 카드 |
| 16-3 | Funnel | 대형 repo 컨텍스트 선택과 압축 |
| 16-4 | Compare | 현업 성능을 가르는 진짜 도구 vs booster |
| 16-5 | Text tree | 보안/리버싱 Harness 도구 트리 |
| 19-1 | Section | 효과적인 지시와 Harness 설계 섹션 |
| 19-2 | Card | Goal / Context / Boundary / Verify 4개 지시 요소 |
| 19-3 | Mermaid | User request → Task spec → minimal context → tool sequence → verification |
| 19-4 | Mermaid | Harness 작업 흐름 |
| 19-5 | Checklist | 좋은 Harness 구성 요소 6개 |
| 19-6 | Funnel | 토큰 절약을 위한 검색 → 후보 파일 → 필요한 라인 흐름 |
| 19-7 | Diagram | Input / Tool / Env / Log 재현성 요소 |
| 19-8 | Mermaid | 종료 조건 분기 |
| 19-9 | Compare | 불명확한 입력 vs 구조화된 선택지 |
| 19-10 | Process | 웹뷰 취약점 후보군 → scan → 확인 → 증거 |
| 19-11 | Text card | Chrome DevTools MCP 등 도구 기반 검증 예시 |
| 16 | Icon set | 파일, 검색, 터미널, 테스트 체크 아이콘 |
| 17 | Flow | 사람을 중심으로 ChatGPT와 IDE가 오가는 기존 방식 |
| 18 | Pipeline | 목표 입력 → 계획 → 수정 → 빌드 → 테스트 |
| 18-1 | Mermaid | 컴파일 에러 수정 루프 |
| 18-2 | Text card | 실제 요청 예시 터미널 카드 |
| 18-3 | Text card | 완료 보고와 검증 증거 카드 |
| 19 | Prompt card | 터미널 프롬프트 카드 |
| 20 | Checklist | 목표, 범위, 제약, 검증 방법 체크리스트 |
| 20-1 | Section | Skill 섹션 구분 슬라이드 |
| 20-2 | Flow | 반복 prompt → reusable workflow 변환 |
| 20-3 | Text tree | `SKILL.md`, scripts, references, assets 폴더 구조 |
| 20-4 | Compare | Tool / MCP / Skill 3분할 비교 |
| 20-5 | Mermaid | progressive disclosure: metadata → SKILL.md → resources/scripts → tool execution |
| 20-6 | Card | secure-code-review, authz-review, release-check 후보 카드 |
| 20-7 | Text card | `authz-review` Skill 템플릿 |
| 20-8 | Checklist | Review / Least privilege / Manual invocation / Log 보안 체크 |
| 22 | Error visual | 깨진 JSON / 실패한 터미널 명령 |
| 23 | Terminal | 검증 명령이 성공 기준임을 보여주는 테스트 통과 화면 |
| 24 | Motion image | 빠르게 타이핑하는 개발자 + 모션 효과 |
| 25 | State transition | Red → Green 테스트 상태 전환 |
| 26 | Architecture | Layered Architecture |
| 27 | Context flow | README, ADR, API Contract, Permission Matrix가 AI 컨텍스트로 들어가는 그림 |
| 28 | Process | 탐색 → 계획 → 제한된 수정 → 테스트 → 리뷰 5단계 라인 |
| 29 | Security image | 방패 + 터미널 + 코드 리뷰 |
| 30 | Triangle | Verification / Inputs / Trusted Context 삼각형 |
| 31 | Workflow | Surface → Hypothesis → Test → Evidence → Fix → Regression |
| 32 | Summary | Model + Tools + Tests + Human Review 최종 요약 |

## Mermaid 적용 완료 항목

아래 항목은 이미지 대신 Mermaid 다이어그램으로 본문에 넣었습니다.

| Priority | Current Slide | Reason |
| --- | --- | --- |
| 1 | 5. 답변은 작업의 시작점 | 질의응답만으로 작업이 끝나지 않는 이유를 주변 문구로 보여줌 |
| 2 | 8. Tool Calling | 순서가 중요한 시퀀스라 Mermaid `sequenceDiagram`이 적합 |
| 3 | 11. MCP 구조 | Model 판단, 여러 Client 타입, 여러 Server 타입의 관계가 명확한 아키텍처 다이어그램 |
| 4 | 12. MCP 이전과 이후 | 커스텀 와이어링 중복과 MCP 표준 연결 차이를 보여줌 |
| 5 | 13. Filesystem MCP 예시 | 허용된 workspace 안에서 파일 도구를 호출하는 구조 |
| 6 | 16. Agent Loop | Plan, Act, Observe, Revise 순환 구조 |
| 7 | 27. Harness 작업 흐름 | 요청을 Task spec과 도구 정책으로 좁히는 구조 |
| 8 | 31. 종료 조건 | pass/revise/ask/stop 분기를 명확히 보여줌 |
| 9 | 20. 에이전트 작업 방식 | 목표 입력부터 테스트까지 파이프라인 |
| 10 | 21. 컴파일 에러 수정 루프 | 실제 빌드 실패 복구 루틴을 보여주기 좋음 |
| 11 | 20-5. Skill progressive disclosure | 필요한 순간에만 지시와 리소스를 읽는 구조를 설명하기 좋음 |
| 12 | 19-3. 정확도와 토큰 예산 | context 선별, 도구 순서, 검증의 관계를 설명하기 좋음 |
| 13 | 47. 취약점 탐색 루프 | 보안 업무 흐름을 단계별로 보여주기 좋음 |
