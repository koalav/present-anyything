# GitHub Pages Presentation Scaffold

정적 HTML/CSS/JS만으로 동작하는 발표자료 모음 사이트입니다.
레퍼런스인 `presentation-scaffold`처럼 루트 허브에서 대상별 발표 덱으로 이동하는 구조입니다.
GitHub Pages에서 `main` 브랜치의 `/docs` 폴더를 publish source로 지정하면 됩니다.

## 구조

```text
docs/
  .nojekyll
  index.html                 # 발표자료 허브
  ai-agent-effective-use/
    index.html               # AI 에이전트 활용 발표
    source.md                # 공개용 대본 소스
    visual-assets.md         # 필요한 그림/다이어그램 목록
  codex-deeplink-audit-guide/
    index.html               # 마이그레이션된 정적 HTML 덱
    source.md                # 공개용 소스
  indirect-prompt-injection/
  mobile-audit-mcp-origin/
  semgrep-android-local/
  windows-audit-design/
  non-dev-seminar/
    index.html               # 비개발 대상 발표 템플릿
  dev-seminar/
    index.html               # 개발자 대상 발표 템플릿
  leadership-hands-on/
    index.html               # 리더진 핸즈온 템플릿
  controller-seminar/
    index.html               # 팀 내부 공유 템플릿
  assets/
    styles/
      hub.css
      deck.css
    scripts/
      deck.js
    images/
    videos/
    labs/
    data/
scripts/
  split_deck.py
  migrate_decks.py           # 외부 Slidev 자료를 가져올 때 쓰는 변환 스크립트
content/
  decks/
    ai-agent-effective-use/
      source.md              # 작업용 대본 소스
      visual-assets.md       # 작업용 비주얼 목록
    <deck-name>/
      source.md              # 마이그레이션된 작업용 소스
  deck-outline-template.md
  prompt-template.md
```

## 로컬 확인

```bash
cd docs
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다.

## GitHub Pages 배포

1. 이 폴더 내용을 GitHub repository에 push합니다.
2. Repository Settings -> Pages로 이동합니다.
3. Source를 `Deploy from a branch`로 설정합니다.
4. Branch는 `main`, folder는 `/docs`를 선택합니다.
5. 저장 후 `https://<user>.github.io/<repo>/`에서 확인합니다.

## 콘텐츠 수정

각 발표자료는 독립된 HTML 파일입니다.

- 허브 카드: `docs/index.html`
- 발표 화면 공통 스타일: `docs/assets/styles/deck.css`
- 슬라이드 이동 로직: `docs/assets/scripts/deck.js`
- 발표별 슬라이드: `docs/<deck-name>/index.html`
- 발표별 대본 소스: `docs/<deck-name>/source.md`
- 발표별 그림 목록: `docs/<deck-name>/visual-assets.md`

작업용 원본은 `content/decks/<deck-name>/source.md`에 두고, 공개용 사본은 `docs/<deck-name>/source.md`에 둡니다.

슬라이드는 다음 형태로 추가합니다.

```html
<section class="slide surface accent-blue" data-part="Section 01 · 제목">
  <h3>Sub topic</h3>
  <h2>슬라이드 제목</h2>
  <p class="sub">핵심 설명을 짧게 작성합니다.</p>
</section>
```

제목 아래에 4~5개 핵심 항목과 선택형 부연 설명을 넣을 때는 다음 형태를 사용합니다.

```html
<section class="slide surface key-list-slide accent-teal" data-part="핵심 정리">
  <h2>제목은 상단에 둡니다</h2>
  <ul class="key-list">
    <li>
      <span class="key-list-title">첫 번째 큰 항목</span>
      <small>필요할 때만 짧은 부연 설명을 붙입니다.</small>
    </li>
    <li><span class="key-list-title">두 번째 큰 항목</span></li>
    <li><span class="key-list-title">세 번째 큰 항목</span></li>
  </ul>
</section>
```

키보드 방향키, PageUp/PageDown, Space, Home/End로 이동할 수 있고 `F`로 전체화면을 전환합니다.

각 발표 페이지 우측 상단의 `PPTX` 버튼을 누르면 현재 덱을 16:9 PowerPoint 파일로 내보냅니다.
덱에 `window.createEditablePptxDeck` 정의가 있으면 PowerPoint에서 편집 가능한 텍스트, 도형, 표 중심으로 생성하고, 정의가 없는 덱은 브라우저에서 각 슬라이드를 1920x1080 이미지로 캡처하는 fallback 방식을 사용합니다.
신규 보고서형 덱은 루트의 `agent.md` 규칙에 맞춰 native PPTX export 정의를 우선 작성합니다.
로컬에서는 `python3 -m http.server` 같은 HTTP 서버로 열어야 이미지와 CDN 라이브러리가 안정적으로 로드됩니다.

## 작성 시작

`content/deck-outline-template.md`에 발표 흐름을 먼저 정리한 뒤, 대상에 맞는 `docs/<deck-name>/index.html`을 복사해서 내용을 채우면 됩니다.
