import { describe, it, expect } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('rate limiter', () => {
  it('limit 초과 시 거부, 시간 지나면 허용', () => {
    let t = 0;
    const rl = createRateLimiter(2, 60_000, () => t);
    expect(rl.check('ip')).toBe(true);
    expect(rl.check('ip')).toBe(true);
    expect(rl.check('ip')).toBe(false);
    expect(rl.check('other')).toBe(true);
    t = 60_001;
    expect(rl.check('ip')).toBe(true);
  });
});
