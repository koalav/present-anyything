# 발표 근거 프로젝트 구조 맵

이 문서는 발표 원고의 각 주장과 현재 repository 구조를 연결하기 위한 참고 자료다.

## Monorepo 개요

- Root README: `README.md`
  - APK 업로드/CLI 입력, 정적 분석 pipeline, XML report, JSON read model, UI, AI review provider 구조를 설명한다.
- Backend README: `apps/backend/README.md`
  - backend CLI, worker, API harness 설정, live schema smoke, Codex provider 설정을 설명한다.
- Backend source root: `apps/backend/src/apk_analysis/`
  - 분석 pipeline, adapters, application contracts, domain models가 들어 있다.
- Skills root: `skills/`
  - finding type별 정적 review skill과 dynamic validation skill이 있다.

## 정적 분석 Pipeline

관련 경로:

- `apps/backend/src/apk_analysis/services/stage_services/`
- `apps/backend/src/apk_analysis/adapters/report_xml.py`
- `apps/backend/src/apk_analysis/schemas/apk-analysis-report.xsd`
- `apps/backend/docs/functions/`
- `apps/backend/docs/specs/`

발표에서 말할 수 있는 내용:

- fingerprint, feature extraction, decompile, manifest, network security, certificate, Semgrep, tracker, SBOM 분석이 backend stage로 분리되어 있다.
- LLM 호출 전에 report와 artifact가 먼저 생성된다.
- XML report와 XSD validation이 deterministic output contract 역할을 한다.

## API Harness

관련 경로:

- `apps/backend/src/apk_analysis/adapters/llm_harness/runtime_adapter.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/cli.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/orchestrator.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/llm/openai_responses.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/llm/openai_compatible_chat.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/tool_registry.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/tools/`
- `apps/backend/src/apk_analysis/adapters/llm_harness/evidence.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/validators.py`

발표에서 말할 수 있는 내용:

- 기존 LLM runner는 `LlmInvocationSpec`을 만들고, `HarnessRuntimeAdapter`가 harness request JSON과 CLI invocation을 만든다.
- orchestrator는 initial context, tool call loop, tool result append, finalization, output validation을 수행한다.
- tool registry는 `repo_map`, `rg`, `read_file`, `list_dir`, `run_readonly_cmd`, Android reference lookup tools를 등록한다.
- final output은 provider structured output과 local schema/evidence validation을 모두 통과해야 한다.

## LLM Runtime 공통 계약

관련 경로:

- `apps/backend/src/apk_analysis/application/llm_runtime.py`
- `apps/backend/src/apk_analysis/adapters/llm_cli.py`
- `apps/backend/src/apk_analysis/adapters/llm_invocation_runner.py`
- `apps/backend/src/apk_analysis/application/llm_invocation_specs.py`

발표에서 말할 수 있는 내용:

- provider-neutral runtime port가 있고, `codex`와 `api_harness`를 같은 invocation runner 경로로 실행한다.
- `codex exec` 경로는 유지된다.
- `api_harness`는 CLI shim을 통해 기존 timeout, artifact, output path 흐름과 연결된다.

## Android Reference Lookup

관련 경로:

- `apps/backend/data/system_permissions.jsonl`
- `apps/backend/data/protected-broadcast.jsonl`
- `apps/backend/src/apk_analysis/security_data/system_permissions.py`
- `apps/backend/src/apk_analysis/security_data/protected_broadcasts.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/tools/android_reference.py`

발표에서 말할 수 있는 내용:

- Android system permission protection level과 protected broadcast 여부를 repo-local reference로 조회한다.
- LLM 기억에 의존하지 않고 permission/protected broadcast 판단을 재현 가능한 lookup으로 처리한다.
- receiver/component false positive triage에 직접 활용할 수 있다.

## Skill 기반 Finding Review

관련 경로:

- `skills/android-webview-finding/SKILL.md`
- `skills/android-webview-dynamic-validation/SKILL.md`
- `skills/android-component-dynamic-validation/SKILL.md`
- `skills/android-deeplink-dynamic-validation/SKILL.md`
- `skills/android-debug-exposure-dynamic-validation/SKILL.md`
- `apps/backend/src/apk_analysis/adapters/llm_harness/skills.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/skill_context.py`
- `apps/backend/src/apk_analysis/adapters/llm_harness/tool_registry.py`

발표에서 말할 수 있는 내용:

- skill은 Markdown 기반 분석 지침이다.
- skill은 reference file과 tool capability request를 제안할 수 있지만, 실제 grant는 base task tool policy와 registry가 결정한다.
- dynamic validation skill들은 실행 전 authorization gate를 요구한다.

## Autonomous Security Review

관련 경로:

- `docs/guides/AUTONOMOUS_SECURITY_REVIEW_RUN.md`
- `apps/backend/src/apk_analysis/adapters/autonomous_security_review.py`
- `apps/backend/src/apk_analysis/adapters/attack_surface_extractor.py`
- `apps/backend/src/apk_analysis/application/schemas/autonomous_security_review.py`
- `skills/android-autonomous-security-review/SKILL.md`

발표에서 말할 수 있는 내용:

- ASR은 final call 하나에 의존하지 않는다.
- `attack-surface.json`, `candidate-pool.json`, recursive review, final synthesis as judge, deterministic final merge 구조를 사용한다.
- 최종 finding은 candidate evidence와 triggerability gate를 통과해야 한다.

## Report Exploration / Scenario Review

관련 경로:

- `apps/backend/src/apk_analysis/adapters/report_exploration.py`
- `apps/backend/src/apk_analysis/adapters/report_scenario_review.py`
- `skills/android-report-scenario-review/SKILL.md`
- `docs/guides/FINDING_VERIFICATION_PLAYBOOK.md`

발표에서 말할 수 있는 내용:

- report exploration은 XML report, follow-up output, workspace evidence preview를 보고 executive summary와 priority candidate를 만든다.
- scenario review는 여러 finding을 연결해 실제 공격 시나리오가 성립하는지 검토한다.
- dynamic validation이 필요한 계획은 ADB, browser, intent, Frida 같은 키워드로 별도 validation plan에 연결될 수 있다.

## 테스트 근거

관련 경로:

- `apps/backend/tests/test_llm_harness_orchestrator.py`
- `apps/backend/tests/test_llm_harness_tools.py`
- `apps/backend/tests/test_llm_harness_provider_adapters.py`
- `apps/backend/tests/test_llm_harness_output_enforcement.py`
- `apps/backend/tests/test_llm_harness_schema_smoke.py`
- `apps/backend/tests/fixtures/harness_repos/`
- `apps/backend/tests/fixtures/harness_skills/`

발표에서 말할 수 있는 내용:

- real API 없이 scripted LLM client와 fake transport로 tool loop와 output enforcement를 테스트한다.
- `llm-schema-smoke`는 실제 OpenAI-compatible endpoint가 task별 schema를 받는지 짧게 확인한다.
- path escape, symlink escape, tool output truncation, strict schema payload 같은 harness 안전장치를 테스트한다.

