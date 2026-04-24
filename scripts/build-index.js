import fs from "fs";
import path from "path";
import { outputRoot, repoName } from "./site-config.js";
import { copyPublicAssets } from "./copy-public.js";

// Keep static TOC metadata section-oriented instead of page-number-oriented.
// These two decks are still changing, so the index should summarize the flow
// without claiming exact slide counts or page ranges.
const decks = [
  {
    name: "Semgrep CE Local Rules for Android",
    path: "semgrep-android-local/",
    description: "Semgrep CE CLI와 로컬 룰만으로 Android 보안 후보를 찾는 운영 방식",
    toc: [
      "도입: 발표 범위와 로컬 실행 구조",
      "예시 1 묶음: PendingIntent 토큰 성격, mutable red flag, 문제 코드, 검출 결과, AI 분류, AI 검토 입력",
      "예시 2 묶음: weak hash 점검, 문제 코드, 규칙, 검출 결과, AI 분류, AI 검토 입력",
      "마무리: 정리"
    ]
  },
  {
    name: "Indirect Prompt Injection과 Lethal Trifecta",
    path: "indirect-prompt-injection/",
    description: "Agentic AI에서 prompt injection을 구조적으로 제한하는 설계 원칙과 방어 패턴",
    toc: [
      "도입: 문제 제기, Indirect Prompt Injection 정의, Lethal Trifecta",
      "위협 전개: 공격 흐름과 프롬프트 방어의 한계",
      "설계 원칙: Rule of Two와 capability 분리",
      "구조 패턴: CaMeL 개념과 아키텍처",
      "실무 적용: 방어 패턴, 운영 레이어, 필드 사례",
      "마무리: 결론과 참고 자료"
    ]
  },
  {
    name: "LLM 기반 Windows 애플리케이션 보안감사 운영 구조",
    path: "windows-audit-design/",
    description: "LLM 기반 운영 구조, 에이전트 역할, 검증 게이트, 증적 보고 체계",
    toc: [
      "1p 표지와 발표 범위",
      "2p 문제 정의",
      "3p 핵심 설계 원칙",
      "4p 작업 구조도",
      "5p 에이전트 관계도",
      "6p Reviewer / Verifier 게이트",
      "7p 폴더 구조와 상태 관리",
      "8p 체크리스트 순차 실행 방식",
      "9p Tool / MCP 계층",
      "10p 에이전트와 MCP 보안 통제",
      "11p 증적과 보고서 구조",
      "12p 대안 비교와 선택 기준",
      "13p 단계별 프롬프트 예시",
      "14p 도입 로드맵",
      "15p 참고 출처"
    ]
  },
  {
    name: "Windows 환경에서 MCP로 구성하는 AI 기반 모바일 앱 보안 감사",
    path: "mobile-audit-mcp-windows/",
    description: "Windows 기반 Android 앱 감사용 MCP 도구체인, Skill 운영, 증거 기반 보고 구조",
    toc: [
      "발표 목표와 범위",
      "Agent, MCP, Tool, Skill 구분",
      "Windows 테스트 랩 구성",
      "전체 아키텍처",
      "Android MCP 적용",
      "JADX와 정적 분석",
      "Frida와 런타임 검증",
      "Ghidra와 네이티브 분석",
      "WebView, 브라우저, 네트워크 분석",
      "자동 스캐닝과 초벌 분류",
      "AI Mobile Audit Orchestrator 흐름",
      "Skill과 Evidence Bundle",
      "운영 통제",
      "결론과 Q&A",
      "참고 자료"
    ]
  },
  {
    name: "Windows 환경에서 MCP로 구성하는 AI 기반 모바일 앱 보안 감사 - Extended",
    path: "mobile-audit-mcp-windows-extended/",
    description: "원문 흐름에 가깝게 확장한 상세 버전. 개념, 설정, 도구별 적용, 시스템 설계, 통제를 더 자세히 설명",
    toc: [
      "목표와 범위",
      "모바일 앱 감사의 작업 구조",
      "AI Agent와 Tool Calling",
      "MCP 구조와 개념 구분",
      "Skill 역할과 기본 도구 vs MCP 도구",
      "MASVS 정렬",
      "Windows 랩과 Client 설정",
      "전체 아키텍처와 승인 게이트",
      "Android MCP 3장",
      "JADX 3장",
      "Frida 3장",
      "Ghidra 2장",
      "WebView와 네트워크 도구",
      "스캔 스택",
      "Orchestrator와 Finding",
      "Skill 설계와 Evidence Bundle",
      "리스크와 통제",
      "결론과 참고 자료"
    ]
  },
  {
    name: "MCP로 구성하는 AI 기반 모바일 앱 보안 감사",
    path: "mobile-audit-mcp-origin/",
    description: "원본 슬라이드 흐름에 가깝게 정리한 상세 deck. 특정 OS 언급을 줄이고 모바일 앱 감사 구조 중심으로 재구성",
    toc: [
      "기본 지식 10장",
      "구축 4장",
      "Android MCP 3장",
      "JADX 3장",
      "Frida 3장",
      "Ghidra 3장",
      "WebView와 브라우저 3장",
      "스캔 도구 3장",
      "네트워크와 운영 확장 3장",
      "감사 시스템 5장",
      "Skill 설계 4장",
      "운영 통제와 결론 5장"
    ]
  }
];

fs.mkdirSync(outputRoot, { recursive: true });
copyPublicAssets();

const html = `<!doctype html>
<html lang="ko" data-palette="slate-gray">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Presentation Index</title>
  <script src="./palette.js"></script>
  <style>
    @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

    :root {
      color-scheme: light;
      --bg: #f8fafc;
      --panel: #ffffff;
      --panel-soft: #f1f5f9;
      --text: #1e293b;
      --muted: #64748b;
      --border: #e2e8f0;
      --shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
      --accent: #475569;
      --accent-soft: #e2e8f0;
    }

    html[data-palette="warm-gray"] {
      --bg: #f7f7f5;
      --panel: #ffffff;
      --panel-soft: #f1f1ee;
      --text: #2f3437;
      --muted: #737373;
      --border: #e7e5e4;
      --accent: #78716c;
      --accent-soft: #e7e5e4;
    }

    html[data-palette="slate-gray"] {
      --bg: #f8fafc;
      --panel: #ffffff;
      --panel-soft: #f1f5f9;
      --text: #1e293b;
      --muted: #64748b;
      --border: #e2e8f0;
      --accent: #475569;
      --accent-soft: #e2e8f0;
    }

    html[data-palette="graphite"] {
      --bg: #f4f4f2;
      --panel: #fbfbfa;
      --panel-soft: #ececea;
      --text: #27272a;
      --muted: #71717a;
      --border: #d4d4d8;
      --accent: #52525b;
      --accent-soft: #e4e4e7;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
      color: var(--text);
      background: var(--bg);
      transition: background-color 180ms ease, color 180ms ease;
    }

    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 72px 24px 96px;
    }

    .hero {
      margin-bottom: 28px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    h1 {
      margin: 18px 0 12px;
      font-size: clamp(40px, 6vw, 72px);
      line-height: 0.94;
      letter-spacing: -0.04em;
    }

    .lead {
      max-width: 760px;
      margin: 0;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.7;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-top: 28px;
      margin-bottom: 36px;
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--panel);
      box-shadow: var(--shadow);
    }

    .toolbar-label {
      font-size: 14px;
      font-weight: 700;
      color: var(--muted);
      margin-right: 4px;
    }

    .palette-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .palette-btn {
      appearance: none;
      border: 1px solid var(--border);
      background: var(--panel-soft);
      color: var(--text);
      border-radius: 999px;
      padding: 10px 14px;
      cursor: pointer;
      font: inherit;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
    }

    .palette-btn:hover,
    .palette-btn:focus-visible {
      transform: translateY(-1px);
      border-color: var(--accent);
      outline: none;
    }

    .palette-btn.active {
      background: var(--accent-soft);
      border-color: var(--accent);
      color: var(--accent);
    }

    .swatches {
      display: inline-flex;
      gap: 4px;
    }

    .swatch {
      width: 14px;
      height: 14px;
      border-radius: 999px;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .palette-preview {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 28px;
    }

    .palette-card {
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--panel);
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: transform 160ms ease, border-color 160ms ease;
    }

    .palette-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent);
    }

    .palette-card-top {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      height: 68px;
    }

    .palette-card-body {
      padding: 14px 16px 16px;
    }

    .palette-card strong {
      display: block;
      font-size: 15px;
      margin-bottom: 6px;
    }

    .palette-card span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }

    .deck-list {
      display: grid;
      gap: 18px;
      margin-top: 20px;
    }

    .deck {
      border: 1px solid var(--border);
      border-radius: 24px;
      background: var(--panel);
      box-shadow: var(--shadow);
      padding: 24px;
      transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
    }

    .deck:hover,
    .deck:focus-within {
      transform: translateY(-3px);
      border-color: var(--accent);
      box-shadow: 0 24px 56px rgba(15, 23, 42, 0.1);
    }

    .deck-header {
      display: flex;
      gap: 18px;
      align-items: flex-start;
      justify-content: space-between;
    }

    .deck-copy {
      min-width: 0;
    }

    .deck-copy strong {
      display: block;
      font-size: 24px;
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .deck-copy span {
      display: block;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.6;
    }

    .deck-link {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0 16px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--panel-soft);
      color: var(--accent);
      text-decoration: none;
      font-weight: 700;
      white-space: nowrap;
    }

    .deck-link:hover,
    .deck-link:focus-visible {
      border-color: var(--accent);
      outline: none;
    }

    .deck-toc {
      margin-top: 18px;
      border-top: 1px solid var(--border);
      padding-top: 16px;
    }

    .deck-toc summary {
      cursor: pointer;
      list-style: none;
      font-weight: 700;
      color: var(--accent);
      user-select: none;
    }

    .deck-toc summary::-webkit-details-marker {
      display: none;
    }

    .deck-toc summary::before {
      content: "▸";
      display: inline-block;
      margin-right: 8px;
      transition: transform 160ms ease;
    }

    .deck-toc[open] summary::before {
      transform: rotate(90deg);
    }

    .deck-toc ul {
      margin: 14px 0 0;
      padding-left: 20px;
      display: grid;
      gap: 8px;
      color: var(--text);
      line-height: 1.6;
    }

    @media (max-width: 900px) {
      .palette-preview {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      main {
        padding-top: 56px;
      }

      .deck {
        padding: 20px;
      }

      .deck-header {
        flex-direction: column;
      }

      .toolbar {
        padding: 14px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="eyebrow">Slidev Static Site</div>
      <h1>Presentation Index</h1>
      <p class="lead">GitHub Pages에서 정적으로 제공되는 Slidev deck 목록입니다. 현재 build base는 <code>${repoName}</code> 저장소 이름을 기준으로 계산됩니다.</p>
    </section>

    <section class="toolbar" aria-label="Palette picker">
      <div class="toolbar-label">Palette</div>
      <div class="palette-picker">
        <button class="palette-btn" data-palette-option="warm-gray" type="button">
          <span class="swatches"><span class="swatch" style="background:#f7f7f5"></span><span class="swatch" style="background:#2f3437"></span><span class="swatch" style="background:#78716c"></span></span>
          Warm Gray
        </button>
        <button class="palette-btn" data-palette-option="slate-gray" type="button">
          <span class="swatches"><span class="swatch" style="background:#f8fafc"></span><span class="swatch" style="background:#1e293b"></span><span class="swatch" style="background:#475569"></span></span>
          Slate Gray
        </button>
        <button class="palette-btn" data-palette-option="graphite" type="button">
          <span class="swatches"><span class="swatch" style="background:#f4f4f2"></span><span class="swatch" style="background:#27272a"></span><span class="swatch" style="background:#52525b"></span></span>
          Graphite
        </button>
      </div>
    </section>

    <section class="palette-preview" aria-label="Palette preview cards">
      <div class="palette-card">
        <div class="palette-card-top">
          <div style="background:#f7f7f5"></div>
          <div style="background:#ffffff"></div>
          <div style="background:#f1f1ee"></div>
          <div style="background:#78716c"></div>
        </div>
        <div class="palette-card-body">
          <strong>Warm Gray</strong>
          <span>가장 마일드한 보고서 톤, 컨설팅 문서 느낌에 잘 맞음</span>
        </div>
      </div>
      <div class="palette-card">
        <div class="palette-card-top">
          <div style="background:#f8fafc"></div>
          <div style="background:#ffffff"></div>
          <div style="background:#f1f5f9"></div>
          <div style="background:#475569"></div>
        </div>
        <div class="palette-card-body">
          <strong>Slate Gray</strong>
          <span>보안, 아키텍처, 엔지니어링 발표에 가장 무난한 기본 선택</span>
        </div>
      </div>
      <div class="palette-card">
        <div class="palette-card-top">
          <div style="background:#f4f4f2"></div>
          <div style="background:#fbfbfa"></div>
          <div style="background:#ececea"></div>
          <div style="background:#52525b"></div>
        </div>
        <div class="palette-card-body">
          <strong>Graphite</strong>
          <span>조금 더 차분하고 무게감 있는 고급스러운 무채색 톤</span>
        </div>
      </div>
    </section>

    <section class="deck-list" aria-label="Presentation decks">
      ${decks
        .map(
          (deck) => `<article class="deck">
        <div class="deck-header">
          <div class="deck-copy">
            <strong>${deck.name}</strong>
            <span>${deck.description}</span>
          </div>
          <a class="deck-link" href="./${deck.path}">Open deck</a>
        </div>
        <details class="deck-toc">
          <summary>목차 펼치기</summary>
          <ul>
            ${deck.toc.map((item) => `<li>${item}</li>`).join("\n            ")}
          </ul>
        </details>
      </article>`
        )
        .join("\n")}
    </section>
  </main>
  <script>
    const picker = document.querySelectorAll('[data-palette-option]');
    const paletteApi = window.__presentAnythingPalette;

    const syncActive = () => {
      const current = paletteApi?.current?.() || 'slate-gray';
      picker.forEach((button) => {
        button.classList.toggle('active', button.dataset.paletteOption === current);
      });
    };

    picker.forEach((button) => {
      button.addEventListener('click', () => {
        paletteApi?.apply?.(button.dataset.paletteOption);
        syncActive();
      });
    });

    syncActive();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(outputRoot, "index.html"), html);
fs.writeFileSync(path.join(outputRoot, ".nojekyll"), "");
