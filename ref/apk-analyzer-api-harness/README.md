# APK Analyzer API Harness 발표 자료

이 디렉터리는 APK Analyzer와 OpenAI-compatible API harness를 소개하기 위한 발표 스크립트 자료다. 구현 코드가 아니라 발표자가 읽거나 슬라이드 노트로 옮길 수 있는 원고만 담는다.

## 파일 구성

- `01-speaker-script.md`: 전체 발표 흐름과 슬라이드별 멘트.
- `02-webview-frida-demo-script.md`: WebView finding 동적 검증 예제 원고.
- `03-project-source-map.md`: 발표 내용이 현재 프로젝트의 어떤 구조에 근거하는지 정리한 참고표.

## 핵심 메시지

APK Analyzer는 LLM에게 모든 판단과 실행을 맡기는 도구가 아니다. 재현성을 높이기 위해 deterministic하게 처리할 수 있는 부분은 backend toolchain이 먼저 처리하고, LLM은 제한된 도구와 evidence ledger 안에서 탐색, 우선순위화, 요약, 시나리오 리뷰를 맡는다.

발표 흐름은 다음 순서를 권장한다.

1. 바람직한 code-analysis harness 구조.
2. APK Analyzer가 그 구조를 Android 보안 분석에 어떻게 적용했는지.
3. permission/protected broadcast reference와 deterministic gate가 false positive를 줄이는 방식.
4. finding type별 skill과 동적 검증 harness로 넘어가는 반복 구조.
5. ASR, report-level exploration, scenario review가 최종 보고서 품질을 높이는 방식.

