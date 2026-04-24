# Slidev Static Presentation Site

GitHub Pages에서 정적 파일로 서빙되는 Slidev 기반 프리젠테이션 프로젝트입니다.

## 요구사항

- Node.js 22+
- npm

## 설치

```bash
npm install
```

## 로컬 실행

```bash
npm run dev:semgrep
npm run dev:indirect-prompt
npm run dev:windows-design
npm run dev:mobile-audit-mcp
npm run dev:codex-deeplink-audit-guide
```

## 발표 소스 Markdown 위치

실제로 수정해야 하는 원본 Markdown은 `docs/`가 아니라 `decks/` 아래에 있습니다.
`docs/`는 빌드 결과물이고, 발표 내용을 고칠 때는 아래 파일들을 수정한 뒤 다시 `npm run build`를 실행하면 됩니다.

- `decks/semgrep-android-local/slides.md`
  - Semgrep 발표는 현재 단일 `slides.md` 파일로 관리합니다.
- `decks/indirect-prompt-injection/slides.md`
  - Indirect Prompt Injection 발표도 단일 `slides.md` 파일로 관리합니다.
- `decks/windows-audit-design/slides.md`
  - deck 엔트리 파일입니다.
- `decks/windows-audit-design/pages/*.md`
  - Windows 감사 발표의 실제 슬라이드 본문 파일입니다.
- `decks/mobile-audit-mcp-origin/slides.md`
  - deck 엔트리 파일입니다.
- `decks/mobile-audit-mcp-origin/pages/*.md`
  - 모바일 MCP 발표의 실제 슬라이드 본문 파일입니다.
- `decks/codex-deeplink-audit-guide/slides.md`
  - deck 엔트리 파일입니다.
- `decks/codex-deeplink-audit-guide/pages/*.md`
  - Codex Deeplink Guide 발표의 실제 슬라이드 본문 파일입니다.

요약하면:

- 단일 파일 deck: `semgrep-android-local`, `indirect-prompt-injection`
- 분리형 deck: `windows-audit-design`, `mobile-audit-mcp-origin`, `codex-deeplink-audit-guide`

## 정적 빌드

```bash
npm run build
```

빌드 결과는 `docs/`에 생성됩니다. 각 deck은 정적 HTML로 출력되고, 같은 과정에서 PDF도 미리 export 되어 `docs/downloads/`에 함께 생성됩니다.
build 시 GitHub Pages base path는 `GITHUB_REPOSITORY`, `GITHUB_PAGES_REPO`, 또는 `git remote origin`에서 repository 이름을 읽어 자동 결정합니다.

각 deck 화면에는 고정형 `PDF 다운로드` 버튼이 표시되며, 이 버튼은 미리 export 된 PDF 파일로 연결됩니다.

## GitHub Pages 배포

이 프로젝트는 `main` 브랜치의 `docs/` 폴더를 GitHub Pages publish source로 사용하는 구성을 전제로 합니다.
워크플로우는 배포를 대신하지 않고, `docs/`가 정상적으로 다시 빌드되는지만 검증합니다.

GitHub 저장소 설정에서 다음을 확인해야 합니다.

1. `Settings -> Pages`
2. Source를 `Deploy from a branch`로 설정
3. Branch를 `main`, Folder를 `/docs`로 설정

## Base Path 주의사항

일반 repository pages는 다음 URL 구조를 사용합니다.

```text
https://{github_user}.github.io/{repository_name}/
```

예를 들어 repository 이름이 `present-anyything`이면 다음 base path를 사용합니다.

```text
/present-anyything/semgrep-android-local/
/present-anyything/indirect-prompt-injection/
/present-anyything/windows-audit-design/
/present-anyything/mobile-audit-mcp-origin/
/present-anyything/codex-deeplink-audit-guide/
/present-anyything/downloads/semgrep-android-local.pdf
```

root pages 저장소인 `{github_user}.github.io`를 사용하는 경우에는 base path를 `/` 기준으로 다시 조정해야 합니다.

## 프로젝트 구조

```text
decks/
  semgrep-android-local/
    slides.md
  indirect-prompt-injection/
    slides.md
  windows-audit-design/
    slides.md
    pages/
  mobile-audit-mcp-origin/
    slides.md
    pages/
  codex-deeplink-audit-guide/
    slides.md
    pages/
scripts/
  build-deck.js
  build-index.js
public/
  images/
  palette.js
.github/
  workflows/
    deploy.yml
docs/
  index.html
  semgrep-android-local/
  indirect-prompt-injection/
  windows-audit-design/
  downloads/
```

## 검증

다음 명령으로 로컬에서 정적 결과를 확인할 수 있습니다.

```bash
npm run build
npx serve docs
```

또는

```bash
python3 -m http.server 8080 -d docs
```
