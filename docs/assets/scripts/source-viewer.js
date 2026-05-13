const target = document.getElementById('content');
const rawLink = document.getElementById('rawLink');
const sourcePath = document.body.dataset.source;

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function inline(value) {
  let result = escapeHtml(value);
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  result = result.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
  return result;
}

function isTableStart(lines, index) {
  return lines[index]?.trim().startsWith('|') && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1] || '');
}

function renderTable(lines, start) {
  const rows = [];
  let index = start;
  while (index < lines.length && lines[index].trim().startsWith('|')) {
    if (index !== start + 1) {
      rows.push(lines[index].trim().replace(/^\||\|$/g, '').split('|').map(cell => inline(cell.trim())));
    }
    index += 1;
  }

  const head = rows.shift() || [];
  const body = rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
  const html = `<table><thead><tr>${head.map(cell => `<th>${cell}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>`;
  return { html, next: index };
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output = [];
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    output.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph();
      const lang = trimmed.slice(3).trim();
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      output.push(`<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (isTableStart(lines, index)) {
      flushParagraph();
      const table = renderTable(lines, index);
      output.push(table.html);
      index = table.next - 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      output.push(`<h1>${inline(trimmed.slice(2))}</h1>`);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      output.push(`<h2>${inline(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph();
      output.push(`<h3>${inline(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      const quotes = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quotes.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      index -= 1;
      output.push(`<blockquote><p>${quotes.map(item => inline(item)).join('<br>')}</p></blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }
      index -= 1;
      output.push(`<ul>${items.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }
      index -= 1;
      output.push(`<ol>${items.map(item => `<li>${inline(item)}</li>`).join('')}</ol>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  return output.join('\n');
}

async function main() {
  rawLink.href = sourcePath;
  const response = await fetch(sourcePath, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Failed to load ${sourcePath}: ${response.status}`);
  const buffer = await response.arrayBuffer();
  const text = new TextDecoder('utf-8').decode(buffer);
  target.innerHTML = renderMarkdown(text);
}

main().catch(error => {
  target.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
});
