/**
 * 인메모리 슬라이딩 윈도우. 서버리스 인스턴스마다 따로 초기화되므로
 * 정확한 한도가 아니라 키 남용을 늦추는 용도다.
 */
export function createRateLimiter(limit: number, windowMs: number, now: () => number = () => Date.now()) {
  const hits = new Map<string, number[]>();

  return {
    check(key: string): boolean {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((ts) => t - ts < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }

      recent.push(t);
      hits.set(key, recent);
      return true;
    },
  };
}
