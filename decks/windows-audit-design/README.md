# LLM 기반 Windows 애플리케이션 보안감사 운영 구조 - Slidev Deck

이 자료는 Windows 애플리케이션 보안감사를 LLM 기반으로 운영할 때 사용할 수 있는 작업 구조, 에이전트 관계, 체크리스트 실행, 증적/보고 체계를 설명하는 Slidev용 Markdown 자료입니다.

## 포함 파일

- `slides.md`: Slidev 엔트리 파일
- `pages/*.md`: 섹션별 슬라이드 파일
- `FILE_LIST.md`: 파일 목록과 용도

## 실행 예시

```bash
npm init slidev@latest
cp slides.md <slidev-project>/slides.md
cp -r pages <slidev-project>/pages
cd <slidev-project>
npx slidev slides.md
```

## 구조 요약

- Coordinator는 계획과 오케스트레이션만 담당합니다.
- Auditor는 도메인별 점검과 raw evidence 수집을 담당합니다.
- Reviewer는 보안 논리와 영향도를 검토합니다.
- Verifier는 증거와 재현 가능성을 검증합니다.
- Verified finding만 보고서에 반영합니다.
