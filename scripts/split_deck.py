#!/usr/bin/env python3
"""Convert a rough Korean/English talk script into starter slide HTML.

Usage:
  python3 scripts/split_deck.py content/script.md content/generated-slides.html

This is a deterministic starter splitter. For high-quality slides, rewrite the
result manually or pass the script to an LLM with the prompt in content/prompt-template.md.
"""
import html
import re
import sys
from pathlib import Path

MAX_BODY = 95


def split_paragraphs(text: str):
    text = text.replace("\r\n", "\n").strip()
    blocks = [b.strip() for b in re.split(r"\n\s*\n", text) if b.strip()]
    return blocks


def clean_sentence(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip(" -\t\n")
    return value


def to_slide(block: str, idx: int):
    lines = [clean_sentence(x) for x in block.splitlines() if clean_sentence(x)]
    if not lines:
        return None

    heading = None
    if lines[0].startswith("#"):
        heading = clean_sentence(lines[0].lstrip("#"))
        lines = lines[1:]

    merged = clean_sentence(" ".join(lines))
    sentences = [clean_sentence(s) for s in re.split(r"(?<=[.!?。！？])\s+", merged) if clean_sentence(s)]

    title = heading or (sentences[0] if sentences else merged[:MAX_BODY])
    if len(title) > MAX_BODY:
        title = title[:MAX_BODY].rstrip() + "..."

    rest = sentences[1:] if not heading else sentences
    bullets = []
    for sentence in rest[:3]:
        if len(sentence) > 64:
            sentence = sentence[:64].rstrip() + "..."
        bullets.append(sentence)

    return title, bullets


def render_slide(title: str, bullets: list[str], idx: int) -> str:
    title_html = html.escape(title)
    if bullets:
        items = "\n".join(f"    <li>{html.escape(item)}</li>" for item in bullets)
        body = f"\n  <ul class=\"list\">\n{items}\n  </ul>"
    else:
        body = ""

    return (
        f"<section class=\"slide surface accent-blue\" data-part=\"Draft {idx:02d}\">\n"
        f"  <h3>Draft {idx:02d}</h3>\n"
        f"  <h2>{title_html}</h2>{body}\n"
        f"</section>"
    )


def main():
    if len(sys.argv) != 3:
        print(__doc__.strip())
        raise SystemExit(2)

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    text = src.read_text(encoding="utf-8")
    slides = []
    for idx, block in enumerate(split_paragraphs(text), 1):
        slide = to_slide(block, idx)
        if slide:
            slides.append(render_slide(slide[0], slide[1], idx))

    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text("\n\n".join(slides) + "\n", encoding="utf-8")
    print(f"wrote {dst} with {len(slides)} slide sections")


if __name__ == "__main__":
    main()
