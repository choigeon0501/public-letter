import { describe, it, expect } from 'vitest';
import { fontOptions, isFontId, DEFAULT_FONT_ID } from './fonts';

describe('fonts', () => {
  it('10종이고 id가 고유하다', () => {
    expect(fontOptions).toHaveLength(10);
    expect(new Set(fontOptions.map((f) => f.id)).size).toBe(10);
  });

  it('isFontId', () => {
    expect(isFontId(DEFAULT_FONT_ID)).toBe(true);
    expect(isFontId('comic-sans')).toBe(false);
  });
});
