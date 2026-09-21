import { describe, it, expect } from 'vitest';
import { countChars } from './text';

describe('countChars', () => {
  it('한글과 이모지를 코드포인트로 센다', () => {
    expect(countChars('안녕')).toBe(2);
    expect(countChars('a😀')).toBe(2);
    expect(countChars('')).toBe(0);
  });
});
