import { describe, it, expect } from 'vitest';
import { parseUnicodeRange, rangeCoversText } from './font-embed';

describe('parseUnicodeRange', () => {
  it('단일·구간·와일드카드를 파싱한다', () => {
    expect(parseUnicodeRange('U+AC00-D7A3, U+41')).toEqual([
      [0xac00, 0xd7a3],
      [0x41, 0x41],
    ]);
    expect(parseUnicodeRange('U+4??')).toEqual([[0x400, 0x4ff]]);
  });
});

describe('rangeCoversText', () => {
  it('텍스트 글자가 범위에 하나라도 있으면 true', () => {
    const hangul = parseUnicodeRange('U+AC00-D7A3');
    expect(rangeCoversText(hangul, '안녕 abc')).toBe(true);
    expect(rangeCoversText(hangul, 'abc 123')).toBe(false);
    expect(rangeCoversText([], '안녕')).toBe(true);
  });
});
