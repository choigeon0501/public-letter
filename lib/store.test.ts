import { describe, it, expect, beforeEach } from 'vitest';
import { useLetterStore } from './store';

beforeEach(() => useLetterStore.getState().reset());

describe('letter store', () => {
  it('기본값', () => {
    const s = useLetterStore.getState();
    expect(s.paperId).toBe('plain-cream');
    expect(s.font).toBe('nanum-pen');
    expect(s.body).toBe('');
    expect(s.recipient.name).toBe('');
  });

  it('setPaper는 본문을 지우지 않는다', () => {
    useLetterStore.getState().setText({ body: '안녕' });
    useLetterStore.getState().setPaper('kraft');
    expect(useLetterStore.getState().body).toBe('안녕');
    expect(useLetterStore.getState().paperId).toBe('kraft');
  });

  it('reset은 전부 초기화', () => {
    useLetterStore.getState().setRecipient({ name: '김', zonecode: '12345', address: 'a', detail: 'b' });
    useLetterStore.getState().setText({ to: '할머니께' });
    useLetterStore.getState().reset();
    expect(useLetterStore.getState().recipient.name).toBe('');
    expect(useLetterStore.getState().to).toBe('');
  });
});
