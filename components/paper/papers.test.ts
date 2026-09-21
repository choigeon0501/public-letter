import { describe, it, expect } from 'vitest';
import { papers, getPaper, DEFAULT_PAPER_ID, PAPER_CATEGORIES } from './papers';

describe('papers', () => {
  it('20종이고 id가 고유하다', () => {
    expect(papers).toHaveLength(20);
    expect(new Set(papers.map((p) => p.id)).size).toBe(20);
  });

  it('maxChars는 500~700', () => {
    for (const p of papers) {
      expect(p.maxChars).toBeGreaterThanOrEqual(500);
      expect(p.maxChars).toBeLessThanOrEqual(700);
    }
  });

  it('textArea는 0~100% 안에 있다', () => {
    for (const p of papers) {
      const { top, left, width, height } = p.textArea;
      expect(top).toBeGreaterThanOrEqual(0);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(top + height).toBeLessThanOrEqual(100);
      expect(left + width).toBeLessThanOrEqual(100);
    }
  });

  it('모든 카테고리에 편지지가 하나 이상', () => {
    for (const c of PAPER_CATEGORIES) expect(papers.some((p) => p.category === c)).toBe(true);
  });

  it('getPaper는 모르는 id면 기본 편지지', () => {
    expect(getPaper('nope').id).toBe(DEFAULT_PAPER_ID);
    expect(getPaper(undefined).id).toBe(DEFAULT_PAPER_ID);
    expect(getPaper('kraft').id).toBe('kraft');
  });
});
