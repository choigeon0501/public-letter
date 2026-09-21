export type CodeRange = [number, number];

/** "U+AC00-D7A3, U+41, U+4??" 형태를 [시작, 끝] 배열로 */
export function parseUnicodeRange(value: string): CodeRange[] {
  return value
    .split(',')
    .map((part) => part.trim().replace(/^U\+/i, ''))
    .filter(Boolean)
    .map((token) => {
      if (token.includes('?')) {
        return [parseInt(token.replace(/\?/g, '0'), 16), parseInt(token.replace(/\?/g, 'F'), 16)];
      }
      const [start, end] = token.split('-');
      return [parseInt(start, 16), parseInt(end ?? start, 16)];
    });
}

/** 범위가 비어 있으면(unicode-range 미지정) 모든 글자를 덮는 것으로 본다 */
export function rangeCoversText(ranges: CodeRange[], text: string): boolean {
  if (ranges.length === 0) return true;
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (ranges.some(([a, b]) => cp >= a && cp <= b)) return true;
  }
  return false;
}

function familyOf(rule: CSSFontFaceRule): string {
  return rule.style.getPropertyValue('font-family').replace(/["']/g, '').trim();
}

async function toDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * 편지에 실제로 쓰인 글꼴·글자에 해당하는 @font-face 조각만 base64로 인라인한 CSS.
 * html-to-image의 fontEmbedCSS로 넘겨 수백 개 한글 조각을 전부 받는 것을 피한다.
 */
export async function buildFontEmbedCss(element: HTMLElement, text: string): Promise<string> {
  const family = getComputedStyle(element).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const rules: CSSFontFaceRule[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let cssRules: CSSRuleList;
    try {
      cssRules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(cssRules)) {
      if (rule instanceof CSSFontFaceRule && familyOf(rule) === family) rules.push(rule);
    }
  }

  const needed = rules.filter((rule) => rangeCoversText(parseUnicodeRange(rule.style.getPropertyValue('unicode-range')), text));
  const embedded = await Promise.all(
    needed.map(async (rule) => {
      const src = rule.style.getPropertyValue('src');
      const match = src.match(/url\((['"]?)([^'")]+)\1\)/);
      if (!match) return rule.cssText;
      const dataUrl = await toDataUrl(match[2]);
      return rule.cssText.replace(match[2], dataUrl);
    }),
  );
  return embedded.join('\n');
}
