# AI 에이전트의 효과적인 활용 - 필요한 그림 / 다이어그램 목록

아직 제작하지 않은 이미지와 다이어그램 목록입니다. 슬라이드는 텍스트 중심으로 먼저 구성했습니다.
Mermaid로 바로 만들기 좋은 후보는 `index.html` 본문에 반영했고, 초안 코드는 `mermaid-diagrams.md`에 따로 정리했습니다.

| Source Item | Type | Description |
| --- | --- | --- |
| 1 | Hero image | 어두운 배경의 터미널 + AI 에이전트 느낌의 추상 이미지 |
| 2 | Diagram | Model, Tools, Context, Verification 4개 블록이 하나의 Agent로 합쳐지는 구조 |
| 3 | Mermaid | 질문 → 텍스트 답변 중심, 주변에 파일 미변경 / 실행 없음 / 검증 없음 / 최신 상태 모름 |
| 4 | Concept | 도구가 AndroidManifest, decompiled code, device state, 실행 로그를 모델 밖에서 가져오는 구조 |
| 5 | Hub diagram | AI 중심에 Android Docs, APK, Python, Device 아이콘 연결 |
| 6 | Sequence | Prompt → Tool Call → Android Tool/MCP → Structured Result → Answer |
| 7 | Compare | Model Memory와 Live Data 대비 |
| 8 | Metaphor | 플러그 / 어댑터 / 표준 포트 이미지 |
| 9 | Architecture | AI Model → Host → 여러 MCP Client → 여러 MCP Server → Tools/Resources/Prompts |
| 10 | Image | `mcp-before-after.png`: 사용자가 도구 중간자가 되는 Before와 MCP가 AI-도구 연결을 표준화하는 After 비교 |
| 10-1 | Architecture | Filesystem MCP Server: allowed roots 검사 후 read/list/search/parse 실행 |
| 11 | Matrix | Client × Model × Tool 매트릭스 |
| 12 | Stat cards | PulseMCP 기준 Servers 14,820 / Clients 571 / Use cases 20 |
| 12-1 | Tool cards | Mobile Security MCP: Static / Dynamic / Native 3분할 |
| 13 | Concept | 플러그와 실행 루프 구분 |
| 14 | Loop | Plan → Act → Observe → Revise 순환 화살표 |
| 15 | Hero image | 터미널 위에서 동작하는 모바일 보안 감사 에이전트 |
| 15-1 | Mermaid | 감사 에이전트 공통 구조 |
| 16-1 | Card | Manifest / Search / Parse 3분할 |
| 16-2 | Terminal | Android 분석 명령 카드 |
| 16-3 | Funnel | 대형 repo 컨텍스트 선택과 압축 |
| 16-4 | Compare | 현업 성능을 가르는 진짜 도구 vs booster |
| 16-5 | Image | `mobile-audit-harness.png`: Static / Dynamic / Native / Reference 도구를 Harness가 역할별로 관리하는 구조 |
| 19-1 | Section | 효과적인 지시와 Harness 설계 섹션 |
| 19-2 | Card | Goal / Android Context / Boundary / Evidence 4개 지시 요소 |
| 19-3 | Mermaid | User request → Audit spec → Android facts → policy context → AI risk judgment |
| 19-4 | Mermaid | Harness 작업 흐름 |
| 19-5 | Checklist | 좋은 Harness 구성 요소 6개 |
| 19-6 | Compare | code agent only vs structured extractor |
| 19-7 | Diagram | APK/source / parser / API level / evidence log 재현성 요소 |
| 19-8 | Mermaid | 종료 조건 분기 |
| 19-9 | Compare | 불명확한 입력 vs 구조화된 선택지 |
| 19-10 | Process | 웹뷰 취약점 후보군 → scan → 확인 → 증거 |
| 19-11 | Text card | jadx / adb / Frida MCP 등 도구 기반 검증 예시 |
| 16 | Icon set | Manifest, 검색, 터미널, 증거 체크 아이콘 |
| 17 | Flow | 사람을 중심으로 ChatGPT와 IDE가 오가는 기존 방식 |
| 18 | Pipeline | 목표 입력 → 대상 로드 → facts 추출 → AI 판단 → 증거 리뷰 |
| 18-1 | Image | `deterministic-vs-free-search.png`: free search와 deterministic block + AI judgment 대비 |
| 18-2 | Text card | exported components 요청 예시 터미널 카드 |
| 18-3 | Text card | 완료 보고와 검증 증거 카드 |
| 19 | Prompt card | 터미널 프롬프트 카드 |
| 20 | Checklist | 목표, 범위, 제약, 검증 방법 체크리스트 |
| 20-1 | Section | Skill 섹션 구분 슬라이드 |
| 20-2 | Flow | 반복 prompt → reusable workflow 변환 |
| 20-3 | Text tree | `SKILL.md`, scripts, references, assets 폴더 구조 |
| 20-4 | Compare | Tool / MCP / Skill 3분할 비교 |
| 20-5 | Mermaid | progressive disclosure: metadata → SKILL.md → resources/scripts → tool execution |
| 20-6 | Card | android-audit, webview-audit, open-components 후보 카드 |
| 20-7 | Text card | `android-open-components` Skill 템플릿 |
| 20-8 | Checklist | Review / Least privilege / Manual invocation / Log 보안 체크 |
| 22 | Error visual | 깨진 JSON / 실패한 터미널 명령 |
| 23 | Terminal | 검증 명령과 evidence log가 성공 기준임을 보여주는 화면 |
| 24 | Motion image | 빠르게 타이핑하는 개발자 + 모션 효과 |
| 25 | State transition | 불충분한 증거 → 재검증 → 보고 가능 상태 전환 |
| 26 | Architecture | Layered Architecture |
| 27 | Context flow | AndroidManifest, Build Context, Audit Policy가 AI 컨텍스트로 들어가는 그림 |
| 28 | Process | 대상 수집 → facts 추출 → AI 위험 판단 → 증거 리뷰 |
| 29 | Image | `apk-analyzer-process.png`: APK 입력부터 결정적 분석, 산출물, LLM 분석, 검토, 최종 리포트/UI까지의 전체 파이프라인 |
| 30 | Triangle | Target / Tools / Evidence 삼각형 |
| 31 | Workflow | Attack surface → Structured facts → AI hypothesis → ADB/Frida test → Evidence |
| 32 | Summary | Android context + Tools + Evidence + Human Review 최종 요약 |

## Mermaid 적용 완료 항목

아래 항목은 이미지 대신 Mermaid 다이어그램으로 본문에 넣었습니다.

| Priority | Current Slide | Reason |
| --- | --- | --- |
| 1 | 5. 답변은 작업의 시작점 | 질의응답만으로 작업이 끝나지 않는 이유를 주변 문구로 보여줌 |
| 2 | 8. Tool Calling | 순서가 중요한 시퀀스라 Mermaid `sequenceDiagram`이 적합 |
| 3 | 11. MCP 구조 | Model 판단, 여러 Client 타입, 여러 Server 타입의 관계가 명확한 아키텍처 다이어그램 |
| 4 | 12. MCP 이전과 이후 | `mcp-before-after.png` 이미지로 대체 완료 |
| 5 | 13. Filesystem MCP 예시 | 허용된 workspace 안에서 파일 도구를 호출하는 구조 |
| 6 | 16. Agent Loop | Plan, Act, Observe, Revise 순환 구조 |
| 7 | 27. Harness 작업 흐름 | 요청을 audit spec과 tool/device 정책으로 좁히는 구조 |
| 8 | 31. 종료 조건 | pass/revise/ask/stop 분기를 명확히 보여줌 |
| 9 | 20. 에이전트 작업 방식 | 대상 로드부터 증거 리뷰까지 파이프라인 |
| 10 | 21. Open components 추출 루프 | code agent only와 structured extractor 차이를 보여주기 좋음 |
| 11 | 20-5. Skill progressive disclosure | 필요한 순간에만 지시와 리소스를 읽는 구조를 설명하기 좋음 |
| 12 | 19-3. 정확도와 토큰 예산 | Android facts 추출, policy context, AI 판단의 관계를 설명하기 좋음 |
| 13 | 47. 모바일 앱 보안 분석 루프 | 보안 분석 흐름을 단계별로 보여주기 좋음 |
