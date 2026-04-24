# Codex와 Android Deeplink Audit 연동 구조

## Slide 01. 제목
- Codex와 Android Deeplink Audit 연동 구조
- CLI 설치, repo 셋업, Codex 활용 흐름

## Slide 02. 이 발표에서 답할 질문
- CLI는 어떻게 설치하나
- 대상 repo에는 무엇이 셋업되나
- Codex는 셋업된 도구를 어떻게 활용하나
- Skill과 plugin은 실제로 어떤 식으로 동작하나

## Slide 03. 전체 구조 한눈에 보기
- CLI는 분석 실행기
- init은 대상 repo 셋업 단계
- Codex는 설치된 skill과 plugin을 읽고 흐름을 조율
- 결과는 report와 evidence로 남음

## Slide 04. 먼저 설치되는 것
- Python 패키지 설치
- 실행 명령 두 개 제공
- android-security-analyzer
- deeplink-audit alias

## Slide 05. 엔트리포인트 구조
- pyproject.toml의 console script 연결
- 실제 진입점은 deeplink_audit_cli.main:main
- 이름은 바뀌었지만 내부 메인은 하나

## Slide 06. init 명령의 역할
- 대상 Android repo에 도구 세트 복사
- Codex용 설정 복사
- local plugin 설치
- marketplace 등록

## Slide 07. 대상 repo에 생기는 구조
- tools/security/android-security-analyzer/
- .codex/
- plugins/android-security-analyzer/
- .agents/plugins/marketplace.json
- AGENTS.md와 registry

## Slide 08. tools 폴더에는 무엇이 들어가나
- bin
- scripts
- semgrep 룰
- docs
- web harness
- 패키지 리소스

## Slide 09. Codex 설정은 왜 필요한가
- repo 안에서 Codex가 local plugin과 skill을 인식하게 함
- 프로젝트별 설정을 분리
- 설치된 감사 도구를 해당 repo 문맥에 연결

## Slide 10. local plugin 등록 방식
- plugins/android-security-analyzer 경로 사용
- marketplace.json에 local source로 등록
- Codex는 이를 repo 로컬 plugin으로 인식

## Slide 11. Skill은 무엇을 하나
- 어떤 순서로 볼지 정함
- inventory부터 report까지 흐름 고정
- 판단 기준과 산출물 형식 제공

## Slide 12. plugin은 무엇을 하나
- Codex가 접근할 도구 묶음을 알려줌
- 어떤 기능을 쓸 수 있는지 연결
- 결과적으로 CLI와 산출물을 활용하게 함

## Slide 13. 실제 분석 엔진은 무엇인가
- 핵심 실행은 CLI가 담당
- static
- semgrep
- dynamic
- report
- analyze

## Slide 14. Codex는 실제로 어떻게 활용하나
- 대상 repo에서 Codex 실행
- 설치된 config, plugin, registry를 읽음
- 필요한 CLI 실행
- 산출물 읽기
- 다음 단계 판단

## Slide 15. Codex 안에서 기대하는 사용 흐름
- 딥링크 inventory 요청
- validation과 sink 확인 요청
- 동적 검증 요청
- 보고서 초안 생성 요청

## Slide 16. 한 번에 실행되는 예시 흐름
- doctor
- static
- semgrep
- dynamic optional
- report
- final summary

## Slide 17. 주요 산출물
- static-report.json
- semgrep-report.json
- deeplink-tests.generated.json
- dynamic-report.json
- final-report.md

## Slide 18. 사용자가 얻게 되는 것
- 반복 가능한 감사 절차
- evidence 기반 결과 정리
- Codex가 문맥을 이어서 분석
- 사람이 최종 판단하기 쉬운 보고서 초안

## Slide 19. CLI만 쓸 때와 차이
- CLI만 쓰면 직접 명령과 결과를 관리
- Codex를 붙이면 흐름 조율과 결과 해석이 쉬워짐
- skill이 감사 절차를 표준화함

## Slide 20. 결론
- CLI는 실행기
- init은 셋업 단계
- plugin은 연결점
- skill은 절차
- Codex는 이를 읽고 감사 흐름을 오케스트레이션함
