# AI 기반 Android 보안 분석 및 검증 Harness

AI 후보 분석과 실제 단말 검증 루프를 결합해 Android 보안 점검의 재현성과 신뢰도를 높이는 취약점 탐지 솔루션

## Slide 01. 제목

# AI 기반 Android 보안 분석 및 검증 Harness

AI 후보 분석과 실제 단말 검증 루프를 결합해 재현성과 신뢰도를 높입니다.

## Slide 02. 왜 Harness가 필요한가

- Android 점검 범위가 넓습니다
  - Manifest, decompiled code, runtime behavior, device state를 함께 봐야 합니다.
- AI 후보는 빠르지만 흔들릴 수 있습니다
  - 동일 입력의 결과 변동, 근거 부족 추론, 사전 조건 누락을 통제해야 합니다.
- 취약점 판단에는 재현 증거가 필요합니다
  - 실제 단말에서 재현되지 않는 후보를 그대로 finding으로 채택하지 않습니다.
- Harness가 분석과 검증을 연결합니다
  - AI 분석 결과를 실행 가능한 ProbeSpec과 evidence 수집 루프로 바꿉니다.

## Slide 03. 과제목표

- AI 기반 Android 보안 점검 자동화
  - 코드, Manifest, 리포트, 실행 흐름을 구조화해 후보 취약점을 빠르게 도출합니다.
- 실제 단말 기반 검증 루프
  - 후보를 ProbeSpec으로 바꾸고 허용된 action 안에서 재현 가능성을 확인합니다.
- Evidence 중심 최종 판단
  - 모델 의견이 아니라 저장된 observation과 oracle rule을 기준으로 판정합니다.

## Slide 04. Mobile Audit Harness 구성

도구는 역할별로 제한하고, Harness가 실행, 수집, 상관분석을 일관되게 관리합니다.

![Mobile Audit Harness 도구 구성과 산출물 흐름](../assets/images/ai-agent-effective-use/mobile-audit-harness.png)

## Slide 05. 관련연구, 벤치마킹 조사 - Ghera

Ghera: 취약 앱 세트로 재현성을 검증

- 벤치마크 성격
  - 취약 동작, 악용 앱, 수정 또는 benign 변형을 함께 둔 Android 보안 벤치마크입니다.
- Harness에 가져올 점 1: 데모 앱 세트를 먼저 고정
  - MVP는 알려진 취약/수정 쌍으로 시작해 Harness 판정이 흔들리지 않는지 봅니다.
- Harness에 가져올 점 2: rule hit와 exploitability를 분리
  - 정적 탐지 후보가 실제 악용 조건까지 만족하는지 별도 observation으로 검증합니다.
- Harness에 가져올 점 3: 회귀 테스트 자산으로 재사용
  - 한 번 검증한 케이스를 oracle rule과 함께 저장해 모델·도구 변경 시 재검증합니다.

Source: Ghera: A Repository of Android App Vulnerability Benchmarks

## Slide 06. 관련연구, 벤치마킹 조사 - COVA / FlowDroid 분석

COVA: 정적 분석 결과를 조건으로 다시 읽기

- 분석 관점
  - FlowDroid가 보고한 taint flow도 사용자 입력, 환경 설정, I/O 조건에 따라 실제 발생 여부가 달라질 수 있습니다.
- Harness에 가져올 점 1: 분석 결과를 가설로 취급
  - AI나 정적 분석의 후보는 finding이 아니라 검증 목표와 필요한 조건 목록으로 변환합니다.
- Harness에 가져올 점 2: 사전 조건을 observation에 포함
  - 사용자 동작, 설정값, 파일/네트워크 상태를 함께 수집해야 재현 실패 원인을 설명할 수 있습니다.
- Harness에 가져올 점 3: Inconclusive 상태를 정식 판정으로 둠
  - 증거가 부족한 후보를 Confirmed나 Refuted로 억지 분류하지 않도록 판정 상태를 분리합니다.

Source: A Qualitative Analysis of Android Taint-Analysis Results

## Slide 07. 관련연구, 벤치마킹 조사 - AndroidWorld

AndroidWorld: 성공 여부는 환경 상태로 판정

- 벤치마크 성격
  - 각 task가 초기화, agent 실행, success checking, tear-down logic을 포함해 반복 가능한 평가 단위로 구성됩니다.
- Harness에 가져올 점 1: 검증 task에 lifecycle을 부여
  - setup, action, observe, cleanup을 하나의 ProbeSpec 실행 단위로 관리합니다.
- Harness에 가져올 점 2: oracle은 화면 설명이 아니라 상태 검사
  - UI, logcat, file, intent result처럼 관찰 가능한 상태를 기준으로 성공 여부를 판단합니다.
- Harness에 가져올 점 3: 실패도 다음 실행을 위한 데이터
  - tear-down, retry limit, audit trail을 남겨 재시도 가능성과 안전성을 함께 확보합니다.

Source: AndroidWorld: A Dynamic Benchmarking Environment for Autonomous Agents

## Slide 08. 과제추진 사항 - Deterministic + AI 추진 방식

AI에게 임의 탐색을 맡기기 전에 결정적 분석 틀과 구조화된 evidence를 먼저 제공합니다.

![free search와 deterministic + AI 방식 비교](../assets/images/ai-agent-effective-use/deterministic-vs-free-search.png)

## Slide 09. 기대효과

- 보안 점검 자동화 수준 향상
  - 분석 후보 생성과 반복 증거 수집을 표준 루프로 묶습니다.
- 실제 단말 기반 재현성 확보
  - 에뮬레이터나 테스트 단말 상태를 기준으로 관찰 결과를 남깁니다.
- false positive 감소
  - 재현 실패, 사전 조건 부족, 증거 부족을 finding 채택 전 분리합니다.
- 복합 시나리오 검증으로 확장
  - 단일 rule hit가 아니라 chain, precondition, observation을 함께 판단합니다.

## Slide 10. 향후계획 - 왜 단일 AI로 끝내지 않는가

분석, 실행, 판정은 실패 원인과 책임 경계가 달라 하나의 AI에 모두 묶으면 통제가 어렵습니다.

```text
사용자 요청
  -> 단일 AI
  -> 분석 / 판단
  -> 계획 / 결정
  -> 실행 (ADB / UI)
  -> 증거 수집 / 판정
  -> 결과 보고
```

문제점

- 목표가 잘못 설정될 수 있음
- 계획과 실행이 흔들릴 수 있음
- 위험한 단말 동작을 선택할 수 있음
- 증거가 부족해도 결론을 만들 수 있음
- 실패 원인과 재현 경로를 추적하기 어려움

## Slide 11. 향후계획 - 역할 분리 기반 검증 구조

```text
분석 산출물
  -> Security AI
  -> ProbeSpec
  -> Harness AI
  -> Observation
  -> Verifier / Oracle
  -> Confirmed / Refuted / Inconclusive
```

- Security AI: 체인 분석, 가설 수립, 검증 목표와 필요 증거 정의
- Harness AI: typed action 선택, 실행 조정, 관찰 수집과 정리
- Verifier / Oracle: 증거 검증, 규칙 기반 평가, Proof State 갱신

## Slide 12. 향후계획 - Security AI

Security AI = 무엇을 검증할지 결정

입력

- Fact Graph
- Decompiled code
- Manifest
- Candidate findings

출력

- Chain Hypothesis
- Verification Goal
- Evidence Requirement
- ProbeSpec

```text
External actor
  -> Mutable Artifact
  -> Privileged Consumer
  -> Sensitive Sink
```

## Slide 13. 향후계획 - Harness AI

Harness AI = 어떻게 증거를 모을지 결정

입력

- ProbeSpec
- Current Proof State
- Previous Results

출력

- Typed Actions
- Observation Summary
- Cleanup / Restore Check

```text
ProbeSpec
  -> write_artifact()
  -> collect_logcat()
  -> check_ui_state()
  -> cleanup()
```

특징

- Allowlisted Action Only
- raw adb/shell 직접 노출 차단
- Bounded Retry
- Full Audit Trail

## Slide 14. 향후계획 - Verifier / Oracle

Verifier = 증거가 충분한지 판단

검증 기준

- Evidence validation
- Rule-based evaluation
- Proof State update

판정 상태

| 상태 | 의미 |
| --- | --- |
| Confirmed | 요구한 evidence와 oracle 조건이 충족됨 |
| Refuted | 관찰 결과가 가설 또는 oracle 조건과 맞지 않음 |
| Inconclusive | 증거가 부족하거나 사전 조건이 충족되지 않음 |

## Slide 15. 피드백 확인 포인트

- 우선 검증할 취약점 유형
  - exported component, WebView bridge, deeplink, storage, network 중 MVP 범위를 정합니다.
- 검증 환경과 단말 범위
  - emulator, real device, OS version, 테스트 계정과 데이터 초기화 기준을 확정합니다.
- finding 채택 기준
  - Confirmed / Refuted / Inconclusive 판정과 보고서 반영 기준을 합의합니다.
- 다음 단계 산출물
  - ProbeSpec schema, evidence bundle, oracle rule, 데모 앱 세트를 먼저 고정합니다.
