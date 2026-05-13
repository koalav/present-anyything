#!/usr/bin/env python3
"""Migrate Slidev-style decks into this static HTML presentation scaffold."""

from __future__ import annotations

import html
import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DECKS_DIR = ROOT / "decks"
DOCS_DIR = ROOT / "docs"
CONTENT_DECKS_DIR = ROOT / "content" / "decks"

ACCENTS = {
    "codex-deeplink-audit-guide": "accent-blue",
    "indirect-prompt-injection": "accent-rose",
    "mobile-audit-mcp-origin": "accent-teal",
    "semgrep-android-local": "accent-dev",
    "windows-audit-design": "accent-amber",
}


@dataclass
class Slide:
    meta: dict[str, str]
    markdown: str


@dataclass
class Deck:
    slug: str
    title: str
    description: str
    slides: list[Slide]
    source_markdown: str
    has_mermaid: bool


def split_frontmatter(text: str) -> tuple[dict[str, str], str]:
    lines = text.replace("\r\n", "\n").splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, text

    meta_lines: list[str] = []
    end = None
    for index, line in enumerate(lines[1:], 1):
        if line.strip() == "---":
            end = index
            break
        meta_lines.append(line)

    if end is None:
        return {}, text
    return parse_meta("\n".join(meta_lines)), "\n".join(lines[end + 1 :])


def parse_meta(text: str) -> dict[str, str]:
    meta: dict[str, str] = {}
    current_key: str | None = None
    for raw_line in text.splitlines():
        if not raw_line.strip():
            continue
        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", raw_line)
        if match:
            current_key = match.group(1)
            value = match.group(2).strip()
            if value in {"|", ">"}:
                meta[current_key] = ""
            else:
                meta[current_key] = value.strip("\"'")
            continue
        if current_key and raw_line.startswith((" ", "\t")):
            addition = raw_line.strip()
            if addition:
                meta[current_key] = f"{meta[current_key]}\n{addition}".strip()
    return meta


def is_meta_block(text: str) -> bool:
    lines = [line for line in text.splitlines() if line.strip()]
    if not lines:
        return False
    return all(
        re.match(r"^[A-Za-z0-9_-]+:\s*", line)
        or line.startswith((" ", "\t"))
        for line in lines
    )


def remove_style_blocks(text: str) -> str:
    return re.sub(r"(?is)<style\b[^>]*>.*?</style>", "", text)


def split_slide_blocks(text: str) -> list[str]:
    return re.split(r"(?m)^\s*---\s*$", text)


def expand_slides(path: Path) -> tuple[dict[str, str], list[Slide]]:
    text = path.read_text(encoding="utf-8")
    global_meta, body = split_frontmatter(text)
    body = remove_style_blocks(body)
    blocks = split_slide_blocks(body)

    slides: list[Slide] = []
    pending_meta: dict[str, str] = dict(global_meta) if path.name != "slides.md" else {}
    for block in blocks:
        stripped = block.strip()
        if not stripped:
            continue

        if is_meta_block(stripped):
            meta = parse_meta(stripped)
            src = meta.get("src")
            if src:
                _, included = expand_slides((path.parent / src).resolve())
                slides.extend(included)
            else:
                pending_meta.update(meta)
            continue

        slides.append(Slide(meta=pending_meta, markdown=stripped))
        pending_meta = {}

    return global_meta, slides


def first_heading(markdown: str) -> tuple[str | None, int | None]:
    for index, line in enumerate(markdown.splitlines()):
        match = re.match(r"^\s*#\s+(.+?)\s*$", line)
        if match:
            return clean_inline_text(match.group(1)), index
    return None, None


def first_subheading_after(markdown: str, heading_index: int | None) -> str | None:
    if heading_index is None:
        return None
    for line in markdown.splitlines()[heading_index + 1 :]:
        if not line.strip():
            continue
        match = re.match(r"^\s*##\s+(.+?)\s*$", line)
        if match:
            return clean_inline_text(match.group(1))
        return None
    return None


def clean_inline_text(value: str) -> str:
    value = re.sub(r"<br\s*/?>", " ", value, flags=re.I)
    value = re.sub(r"<[^>]+>", "", value)
    value = re.sub(r"`([^`]+)`", r"\1", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"\1", value)
    return re.sub(r"\s+", " ", value).strip()


def escape_attr(value: str) -> str:
    return html.escape(value, quote=True)


def inline(value: str) -> str:
    placeholders: list[str] = []

    def stash(match: re.Match[str]) -> str:
        placeholders.append(match.group(0))
        return f"\u0000{len(placeholders) - 1}\u0000"

    value = re.sub(r"<br\s*/?>", stash, value, flags=re.I)
    result = html.escape(value, quote=False)
    result = result.replace("&lt;b&gt;", "<strong>").replace("&lt;/b&gt;", "</strong>")
    result = result.replace("&lt;strong&gt;", "<strong>").replace("&lt;/strong&gt;", "</strong>")
    result = re.sub(r"`([^`]+)`", r"<code>\1</code>", result)
    result = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", result)
    result = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", result)
    result = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<a class="inline-link" href="{escape_attr(m.group(2))}">{m.group(1)}</a>',
        result,
    )
    result = re.sub(
        r"(?<![\"'=])(https?://[^\s<]+)",
        lambda m: f'<a class="inline-link" href="{escape_attr(m.group(1))}">{m.group(1)}</a>',
        result,
    )
    for index, tag in enumerate(placeholders):
        result = result.replace(f"\u0000{index}\u0000", tag)
    return result


def is_table_start(lines: list[str], index: int) -> bool:
    return (
        lines[index].strip().startswith("|")
        and index + 1 < len(lines)
        and re.match(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$", lines[index + 1])
        is not None
    )


def render_table(lines: list[str], start: int) -> tuple[str, int]:
    rows: list[list[str]] = []
    index = start
    while index < len(lines) and lines[index].strip().startswith("|"):
        if index != start + 1:
            row = lines[index].strip().strip("|").split("|")
            rows.append([inline(cell.strip()) for cell in row])
        index += 1

    head = rows[0] if rows else []
    body = rows[1:]
    head_html = "".join(f"<th>{cell}</th>" for cell in head)
    body_html = "\n".join(
        "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>"
        for row in body
    )
    return (
        f'<div class="table-wrap"><table><thead><tr>{head_html}</tr></thead><tbody>{body_html}</tbody></table></div>',
        index,
    )


SAFE_HTML_START = re.compile(
    r"^\s*</?(div|span|ul|ol|li|h[1-6]|p|br|small)\b",
    re.I,
)


def is_safe_html_line(line: str) -> bool:
    stripped = line.strip()
    return bool(SAFE_HTML_START.match(stripped) or re.search(r"</(div|span|ul|ol|li|p)>", stripped, re.I))


def render_markdown(markdown: str, heading_offset: int = 0) -> str:
    markdown = markdown.replace("::right::", "")
    lines = markdown.replace("\r\n", "\n").splitlines()
    output: list[str] = []
    paragraph: list[str] = []

    def flush_paragraph() -> None:
        if not paragraph:
            return
        output.append(f"<p>{inline(' '.join(paragraph))}</p>")
        paragraph.clear()

    index = 0
    while index < len(lines):
        line = lines[index]
        stripped = line.strip()

        if not stripped:
            flush_paragraph()
            index += 1
            continue

        if stripped.startswith("```"):
            flush_paragraph()
            lang = stripped[3:].strip()
            code: list[str] = []
            index += 1
            while index < len(lines) and not lines[index].strip().startswith("```"):
                code.append(lines[index])
                index += 1
            code_text = html.escape("\n".join(code), quote=False)
            if lang.lower() == "mermaid":
                output.append(f'<div class="diagram-frame wide"><pre class="mermaid">{code_text}</pre></div>')
            else:
                lang_class = f' language-{escape_attr(lang)}' if lang else ""
                output.append(f'<pre class="terminal-card"><code class="{lang_class.strip()}">{code_text}</code></pre>')
            index += 1
            continue

        if is_table_start(lines, index):
            flush_paragraph()
            table_html, next_index = render_table(lines, index)
            output.append(table_html)
            index = next_index
            continue

        if is_safe_html_line(line):
            flush_paragraph()
            output.append(line)
            index += 1
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", stripped)
        if heading:
            flush_paragraph()
            level = min(6, max(3, len(heading.group(1)) + heading_offset + 2))
            output.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
            index += 1
            continue

        if stripped.startswith(">"):
            flush_paragraph()
            quotes: list[str] = []
            while index < len(lines) and lines[index].strip().startswith(">"):
                quotes.append(lines[index].strip().replace("> ", "", 1).replace(">", "", 1))
                index += 1
            output.append(f"<blockquote><p>{'<br>'.join(inline(item) for item in quotes)}</p></blockquote>")
            continue

        if re.match(r"^[-*]\s+", stripped):
            flush_paragraph()
            items: list[str] = []
            while index < len(lines) and re.match(r"^[-*]\s+", lines[index].strip()):
                items.append(re.sub(r"^[-*]\s+", "", lines[index].strip()))
                index += 1
            output.append("<ul>" + "".join(f"<li>{inline(item)}</li>" for item in items) + "</ul>")
            continue

        if re.match(r"^\d+\.\s+", stripped):
            flush_paragraph()
            items = []
            while index < len(lines) and re.match(r"^\d+\.\s+", lines[index].strip()):
                items.append(re.sub(r"^\d+\.\s+", "", lines[index].strip()))
                index += 1
            output.append("<ol>" + "".join(f"<li>{inline(item)}</li>" for item in items) + "</ol>")
            continue

        paragraph.append(stripped)
        index += 1

    flush_paragraph()
    return "\n".join(output)


def strip_first_title(markdown: str, strip_subheading: bool = False) -> str:
    lines = markdown.splitlines()
    removed_title = False
    removed_sub = False
    kept: list[str] = []
    for line in lines:
        if not removed_title and re.match(r"^\s*#\s+", line):
            removed_title = True
            continue
        if strip_subheading and removed_title and not removed_sub and re.match(r"^\s*##\s+", line):
            removed_sub = True
            continue
        kept.append(line)
    return "\n".join(kept).strip()


def render_two_cols(markdown: str) -> str:
    left, _, right = markdown.partition("::right::")
    return (
        '<div class="generated-two-cols">'
        f"<div>{render_markdown(left)}</div>"
        f"<div>{render_markdown(right)}</div>"
        "</div>"
    )


def render_slide(slide: Slide, deck: Deck, index: int) -> str:
    accent = ACCENTS.get(deck.slug, "accent-blue")
    title, title_index = first_heading(slide.markdown)
    subheading = first_subheading_after(slide.markdown, title_index)
    is_cover = index == 0
    is_section = slide.meta.get("layout") == "section"
    is_two_cols = slide.meta.get("layout") == "two-cols"
    is_compact = slide.meta.get("class") == "text-sm"

    if is_cover:
        cover_title = title or deck.title
        body = strip_first_title(slide.markdown, strip_subheading=True)
        body_html = render_markdown(body) if body else ""
        sub_html = f'  <p class="sub">{inline(subheading or deck.description)}</p>\n' if (subheading or deck.description) else ""
        return (
            f'    <section class="slide cover {accent}" data-part="Opening">\n'
            f"      <h1>{inline(cover_title).replace(' ', '<br />', 1) if len(cover_title) < 32 else inline(cover_title)}</h1>\n"
            f"{sub_html}"
            f'      <div class="deck-body cover-body">{body_html}</div>\n'
            f"    </section>"
        )

    if is_section:
        section_title = title or f"Section {index:02d}"
        body = strip_first_title(slide.markdown, strip_subheading=True)
        body_html = render_markdown(body) if body else ""
        sub_html = f'      <p class="sub">{inline(subheading)}</p>\n' if subheading else ""
        body_block = f'      <div class="deck-body section-body">{body_html}</div>\n' if body_html else ""
        return (
            f'    <section class="slide section {accent}" data-part="{escape_attr(section_title)}">\n'
            f"      <h1>{inline(section_title)}</h1>\n"
            f"{sub_html}"
            f"{body_block}"
            f"    </section>"
        )

    slide_classes = f"slide surface markdown-slide {accent}"
    if is_compact:
        slide_classes += " compact"
    data_part = title or deck.title
    body = strip_first_title(slide.markdown, strip_subheading=bool(subheading))
    if is_two_cols:
        body_html = render_two_cols(body)
    else:
        body_html = render_markdown(body)

    title_html = f"      <h2>{inline(title)}</h2>\n" if title else ""
    sub_html = f'      <p class="sub">{inline(subheading)}</p>\n' if subheading else ""
    return (
        f'    <section class="{slide_classes}" data-part="{escape_attr(data_part)}">\n'
        f"{title_html}"
        f"{sub_html}"
        f'      <div class="deck-body">{body_html}</div>\n'
        f"    </section>"
    )


def source_for(deck: Deck) -> str:
    chunks = [f"# {deck.title}"]
    if deck.description:
        chunks.append(deck.description)
    for index, slide in enumerate(deck.slides, 1):
        chunks.append(f"## Slide {index:02d}\n\n{slide.markdown.strip()}")
    return "\n\n".join(chunks).strip() + "\n"


def html_page(deck: Deck) -> str:
    slides_html = "\n\n".join(render_slide(slide, deck, index) for index, slide in enumerate(deck.slides))
    mermaid_script = ""
    if deck.has_mermaid:
        mermaid_script = """
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.15.0/dist/mermaid.esm.min.mjs';

    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      darkMode: true,
      securityLevel: 'strict',
      flowchart: {
        curve: 'monotoneX',
        htmlLabels: true,
        useMaxWidth: true,
        nodeSpacing: 54,
        rankSpacing: 64,
        padding: 12
      },
      sequence: {
        mirrorActors: false,
        showSequenceNumbers: true,
        actorMargin: 68,
        messageMargin: 48
      },
      themeVariables: {
        background: '#0d0d0d',
        darkMode: true,
        primaryColor: '#111827',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#60a5fa',
        lineColor: '#7dd3fc',
        secondaryColor: '#0f172a',
        tertiaryColor: '#020617',
        nodeBorder: '#60a5fa',
        mainBkg: '#111827',
        secondBkg: '#0f172a',
        tertiaryBkg: '#020617',
        clusterBkg: 'rgba(15, 23, 42, 0.72)',
        clusterBorder: '#334155',
        edgeLabelBackground: '#020617',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        fontSize: '16px',
        actorBkg: '#111827',
        actorBorder: '#60a5fa',
        actorTextColor: '#f8fafc',
        signalColor: '#93c5fd',
        signalTextColor: '#e2e8f0',
        noteBkgColor: '#0f172a',
        noteTextColor: '#f8fafc',
        noteBorderColor: '#334155',
        sequenceNumberColor: '#020617'
      }
    });
  </script>"""

    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>{html.escape(deck.title)}</title>
  <link rel="stylesheet" href="../assets/styles/deck.css" />
</head>
<body data-deck-label="{escape_attr(deck.title)}">
  <div class="part-label" id="partLabel">{html.escape(deck.title)}</div>
  <nav class="deck-links" aria-label="Deck source files">
    <a href="../">Hub</a>
    <a href="./source.html">Source</a>
  </nav>
  <div class="progress" id="progress"></div>

  <main class="slides" id="slides">
{slides_html}
  </main>

  <nav class="nav" aria-label="Slide navigation">
    <button type="button" data-action="prev" aria-label="Previous slide">&#8592;</button>
    <button type="button" data-action="next" aria-label="Next slide">&#8594;</button>
  </nav>
  <div class="page-num" id="pageNum">1 / 1</div>
  <script src="../assets/scripts/deck.js"></script>{mermaid_script}
</body>
</html>
"""


def source_viewer_page(deck: Deck) -> str:
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>소스 - {html.escape(deck.title)}</title>
  <link rel="stylesheet" href="../assets/styles/source-viewer.css" />
</head>
<body data-source="./source.md">
  <main class="shell">
    <nav class="top" aria-label="Document navigation">
      <a href="./">← Presentation</a>
      <div class="links">
        <a id="rawLink" href="./source.md">Raw MD</a>
      </div>
    </nav>
    <p class="meta">Migrated deck source</p>
    <article id="content">Loading...</article>
  </main>
  <script src="../assets/scripts/source-viewer.js"></script>
</body>
</html>
"""


def build_deck(slug: str) -> Deck:
    source_path = DECKS_DIR / slug / "slides.md"
    meta, slides = expand_slides(source_path)
    title = meta.get("title") or first_heading(slides[0].markdown)[0] or slug.replace("-", " ").title()
    description = meta.get("info", "").splitlines()[0].strip() if meta.get("info") else ""
    source_markdown = ""
    deck = Deck(
        slug=slug,
        title=title,
        description=description,
        slides=slides,
        source_markdown=source_markdown,
        has_mermaid=any("```mermaid" in slide.markdown for slide in slides),
    )
    deck.source_markdown = source_for(deck)
    return deck


def write_deck(deck: Deck) -> None:
    docs_target = DOCS_DIR / deck.slug
    content_target = CONTENT_DECKS_DIR / deck.slug
    docs_target.mkdir(parents=True, exist_ok=True)
    content_target.mkdir(parents=True, exist_ok=True)

    (docs_target / "index.html").write_text(html_page(deck), encoding="utf-8")
    (docs_target / "source.html").write_text(source_viewer_page(deck), encoding="utf-8")
    (docs_target / "source.md").write_text(deck.source_markdown, encoding="utf-8")
    (content_target / "source.md").write_text(deck.source_markdown, encoding="utf-8")


def main() -> None:
    if not DECKS_DIR.exists():
        print("no decks/ directory found; nothing to migrate")
        return

    slugs = sorted(path.name for path in DECKS_DIR.iterdir() if (path / "slides.md").exists())
    for slug in slugs:
        deck = build_deck(slug)
        write_deck(deck)
        print(f"{slug}: {len(deck.slides)} slides -> docs/{slug}/")


if __name__ == "__main__":
    main()
