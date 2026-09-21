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

/** "400", "700", "100 900" 같은 font-weight 선언이 주어진 굵기를 포함하는지. 미지정이면 true */
export function weightMatches(declared: string, weight: number): boolean {
  const nums = declared.trim().split(/\s+/).filter(Boolean).map(Number).filter((n) => !Number.isNaN(n));
  if (nums.length === 0) return true;
  if (nums.length === 1) return nums[0] === weight;
  return weight >= nums[0] && weight <= nums[1];
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

  const weight = parseInt(getComputedStyle(element).fontWeight, 10) || 400;
  const needed = rules.filter(
    (rule) =>
      weightMatches(rule.style.getPropertyValue('font-weight'), weight) &&
      rangeCoversText(parseUnicodeRange(rule.style.getPropertyValue('unicode-range')), text),
  );
  const embedded = await Promise.all(
    needed.map(async (rule) => {
      const src = rule.style.getPropertyValue('src');
      const match = src.match(/url\((['"]?)([^'")]+)\1\)/);
      if (!match) return rule.cssText;
      /** src는 스타일시트 기준 상대 경로("../media/x.woff2")일 수 있다 */
      const absolute = new URL(match[2], rule.parentStyleSheet?.href ?? location.href).href;
      const dataUrl = await toDataUrl(absolute);
      return rule.cssText.replace(match[2], dataUrl);
    }),
  );
  return embedded.join('\n');
}
