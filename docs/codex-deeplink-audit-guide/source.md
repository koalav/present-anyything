# Codex와 Android Deeplink Audit 사용자 가이드

CLI 설치, 저장소 초기화, Codex 연동 흐름을 사용자 가이드 형식으로 정리한 발표 자료입니다.

## Slide 01

# Codex와 Android Deeplink Audit 사용자 가이드

## 설치부터 활용까지 한 번에 보기

<div class="mt-8 text-lg opacity-80">
CLI 설치, init 셋업, Codex 활용 흐름, 산출물 확인 방법
</div>

## Slide 02

# 목표

```mermaid
mindmap
  root((목표))
    설치 흐름 이해
    init 셋업 이해
    Codex 활용 방식 이해
    동적 검증 필수화 이해
    Skill 세부 내용 이해
    증거 확보 흐름 이해
```

## Slide 03

# 전체 구조 한눈에 보기

```mermaid
flowchart LR
    A[사용자] --> B[Codex]
    B --> C[Skill]
    B --> D[Local Plugin]
    D --> E[Android Security Analyzer CLI]
    E --> F[정적 분석]
    E --> G[동적 검증]
    F --> H[증거]
    G --> H
    H --> I[Finding과 보고서]
```

- 핵심은 Codex가 직접 분석 엔진이 아니라, 설치된 Skill과 CLI를 조율한다는 점이다.
- 정적 분석만으로 끝내지 않고 동적 검증까지 수행해 증거를 확보한다.

## Slide 04

# 설치 단계

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Shell as Shell
    participant Pip as pip
    participant CLI as android-security-analyzer

    User->>Shell: 프로젝트 디렉터리로 이동
    User->>Pip: pip3 install -e .
    Pip-->>CLI: 실행 명령 설치
    CLI-->>User: android-security-analyzer, deeplink-audit 제공
```

```bash
pip3 install -e .
```

설치 후 사용할 수 있는 명령
- `android-security-analyzer`
- `deeplink-audit`

## Slide 05

# 엔트리포인트 구조

```mermaid
flowchart TB
    A[pyproject.toml] --> B[android-security-analyzer]
    A --> C[deeplink-audit]
    B --> D[deeplink_audit_cli.main:main]
    C --> D
    D --> E[서브커맨드 파서]
    E --> F[doctor]
    E --> G[static]
    E --> H[semgrep]
    E --> I[dynamic]
    E --> J[report]
    E --> K[analyze]
    E --> L[init]
```

- 이름은 두 개지만 내부 진입점은 하나다.
- 그래서 명령 별칭이 달라도 동일한 실행 흐름을 탄다.

## Slide 06

# init 명령의 역할

```mermaid
sequenceDiagram
    participant User as 사용자
    participant CLI as CLI
    participant Repo as 대상 저장소
    participant Codex as Codex 설정
    participant Plugin as Local Plugin

    User->>CLI: init --target <repo> --agent codex
    CLI->>Repo: tools/security/android-security-analyzer 복사
    CLI->>Codex: .codex 설정 복사
    CLI->>Plugin: plugins/android-security-analyzer 설치
    CLI->>Repo: marketplace.json, AGENTS.md, registry 반영
    CLI-->>User: Codex에서 사용할 준비 완료
```

- `init`은 분석을 수행하는 명령이 아니라, 분석을 위한 실행 환경을 대상 저장소에 심는 단계다.

## Slide 07

# 대상 저장소에 생기는 구조

```mermaid
flowchart TB
    A[대상 저장소] --> B[tools/security/android-security-analyzer]
    A --> C[.codex]
    A --> D[plugins/android-security-analyzer]
    A --> E[.agents/plugins/marketplace.json]
    A --> F[AGENTS.md]
    A --> G[agent-skill-registry.yml]
```

```text
tools/security/android-security-analyzer/
.codex/
plugins/android-security-analyzer/
.agents/plugins/marketplace.json
AGENTS.md
agent-skill-registry.yml
```

## Slide 08

# tools 폴더의 실제 역할

```mermaid
flowchart LR
    A[tools/security/android-security-analyzer] --> B[bin]
    A --> C[scripts]
    A --> D[semgrep]
    A --> E[docs]
    A --> F[web-harness]
    A --> G[resources]

    B --> B1[실행 진입점]
    C --> C1[정적 추출, 동적 검증]
    D --> D1[룰 기반 검사]
    E --> E1[가이드와 아키텍처]
    F --> F1[브라우저 클릭 재현]
    G --> G1[배포용 템플릿]
```

- 이 폴더는 Codex가 간접적으로 쓰는 실제 분석 자산 모음이다.

## Slide 09

# Codex 설정은 왜 필요한가

```mermaid
sequenceDiagram
    participant Repo as 대상 저장소
    participant Config as .codex 설정
    participant Codex as Codex 세션
    participant Plugin as Local Plugin

    Repo->>Config: 저장소 전용 설정 저장
    Config->>Codex: 로컬 plugin과 skill 위치 제공
    Codex->>Plugin: 설치된 plugin 로드
    Plugin-->>Codex: 사용 가능한 분석 흐름 노출
```

- Codex는 이 설정을 보고 저장소별 도구를 인식한다.
- 이 단계가 없으면 일반 파일 편집 세션으로만 동작한다.

## Slide 10

# 로컬 plugin 등록 방식

```mermaid
flowchart LR
    A[plugins/android-security-analyzer] --> B[marketplace.json]
    B --> C[local source path 등록]
    C --> D[Codex가 저장소 로컬 plugin으로 인식]
```

- plugin은 “분석 기능이 여기 있다”는 연결점이다.
- 실제 실행 엔진은 여전히 CLI 쪽에 있다.

## Slide 11

# Skill이 하는 일

```mermaid
flowchart TB
    A[Skill] --> B[언제 이 흐름을 쓸지 정의]
    A --> C[단계별 실행 순서 정의]
    A --> D[승인 필요 작업 구분]
    A --> E[증거 수집 위치 정의]
    A --> F[Finding 템플릿 정의]
    A --> G[최종 보고서 구조 정의]
```

구체적으로 Skill에 들어가야 할 내용
- 대상 입력값 형식
- 정적 분석에서 확인할 항목
- 동적 검증에서 반드시 확인할 항목
- 증거 저장 규칙
- finding 제목과 severity 형식
- MASVS나 내부 기준 매핑 방식

핵심 메시지
- Skill은 단순 설명문이 아니라, Codex가 따라야 할 감사 절차서다.

## Slide 12

# plugin이 하는 일

```mermaid
sequenceDiagram
    participant Codex as Codex
    participant Plugin as Local Plugin
    participant CLI as CLI
    participant Files as 보고서와 증거

    Codex->>Plugin: 사용 가능한 기능 조회
    Plugin->>CLI: 적절한 명령 실행 유도
    CLI-->>Files: 보고서와 증거 생성
    Files-->>Codex: 결과 읽기
```

- plugin은 Codex와 CLI 사이의 연결점이다.
- plugin이 분석 로직을 대신 구현하는 것은 아니다.

## Slide 13

# 실제 분석 엔진은 CLI다

```mermaid
flowchart LR
    A[doctor] --> B[static]
    B --> C[semgrep]
    C --> D[동적 검증 필수]
    D --> E[report]
    E --> F[analyze 전체 실행]
```

각 단계 설명
- `doctor`: 도구와 환경 준비 상태 확인
- `static`: manifest와 소스에서 딥링크 엔트리 추출
- `semgrep`: validation, sink, 위험 패턴 탐지
- `dynamic`: 실제 호출로 증거 확보, 결과 검증
- `report`: 증거를 묶어 finding과 보고서 생성

중요
- 여기서는 동적 검증을 선택 기능이 아니라 필수 증거 확보 단계로 본다.

## Slide 14

# Codex가 실제로 활용하는 흐름

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Codex as Codex
    participant Skill as Skill
    participant CLI as CLI
    participant Evidence as 증거
    participant Report as 보고서

    User->>Codex: 딥링크 감사 요청
    Codex->>Skill: 절차와 기준 확인
    Codex->>CLI: doctor 실행
    Codex->>CLI: static 실행
    Codex->>CLI: semgrep 실행
    Codex->>CLI: dynamic 실행
    CLI-->>Evidence: 정적, 동적 증거 저장
    Codex->>CLI: report 실행
    CLI-->>Report: finding 초안과 최종 보고서 생성
    Codex-->>User: 결과 요약과 후속 검토 포인트 제시
```

## Slide 15

# 사용자는 어떻게 요청하면 좋은가

```mermaid
flowchart TB
    A[사용자 요청] --> B[딥링크 inventory 해줘]
    A --> C[validation과 sink 확인해줘]
    A --> D[동적 검증까지 수행해 증거 확보해줘]
    A --> E[보고서 초안 만들어줘]
```

권장 요청 방식
- 대상 앱과 범위를 먼저 명시
- 동적 검증까지 포함한다고 분명히 말하기
- 최종 산출물 형식도 같이 지정하기

## Slide 16

# 권장 실행 흐름

```mermaid
sequenceDiagram
    participant Codex as Codex
    participant Doctor as doctor
    participant Static as static
    participant Semgrep as semgrep
    participant Dynamic as dynamic
    participant Report as report

    Codex->>Doctor: 환경 점검
    Codex->>Static: 엔트리 추출과 테스트 케이스 생성
    Codex->>Semgrep: 위험 패턴 확인
    Codex->>Dynamic: 실제 딥링크 호출과 증거 확보
    Codex->>Report: 결과 종합과 finding 작성
```

이 흐름을 권장하는 이유
- 정적 분석만으로는 실제 재현 가능성을 확정하기 어렵다.
- 동적 검증까지 해야 증거가 살아난다.

## Slide 17

# 주요 산출물과 확인 포인트

```mermaid
flowchart LR
    A[static-report.json] --> Z[최종 검토]
    B[semgrep-report.json] --> Z
    C[deeplink-tests.generated.json] --> Z
    D[dynamic-report.json] --> Z
    E[final-report.md] --> Z
```

각 파일의 의미
- `static-report.json`: 엔트리포인트와 manifest 중심 정적 결과
- `semgrep-report.json`: 코드 패턴과 위험 후보
- `deeplink-tests.generated.json`: 동적 검증에서 재사용할 테스트 입력
- `dynamic-report.json`: 실제 실행 기반 증거
- `final-report.md`: 보고서 초안

## Slide 18

# 사용자가 얻는 실제 가치

```mermaid
flowchart TB
    A[반복 가능한 절차] --> D[감사 품질 안정화]
    B[동적 증거 확보] --> D
    C[Codex의 문맥 연결] --> D
    D --> E[검토하기 쉬운 보고서 초안]
```

- 단순 자동화가 아니라, 증거 기반 감사 흐름을 반복 가능하게 만든다.

## Slide 19

# CLI 단독 사용과 Codex 연동의 차이

```mermaid
flowchart LR
    A[CLI 단독] --> A1[명령 직접 실행]
    A --> A2[산출물 직접 해석]
    A --> A3[흐름 관리 수동]

    B[Codex + Skill + Plugin] --> B1[절차 자동 조율]
    B --> B2[결과 해석 보조]
    B --> B3[증거와 보고서 연결]
```

- CLI만으로도 실행할 수 있지만, Codex를 연동하면 절차 관리와 결과 해석 부담이 줄어든다.

## Slide 20

# 결론

```mermaid
flowchart LR
    A[CLI] --> B[실행]
    C[init] --> D[셋업]
    E[plugin] --> F[연결]
    G[skill] --> H[절차]
    I[dynamic] --> J[증거 확보 필수]
    J --> K[신뢰할 수 있는 보고서]
```

정리
- CLI는 분석 엔진이다.
- init은 Codex가 그 엔진을 쓰게 만드는 셋업 단계다.
- plugin은 연결점이고, skill은 절차다.
- 정적 분석만으로 끝내지 않고 동적 검증까지 수행해야 증거를 확보할 수 있다.
