import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, buildUserPrompt, draftRequestSchema } from './claude';

describe('prompt', () => {
  it('system에 maxChars와 말투가 들어간다', () => {
    expect(buildSystemPrompt(600, 'formal')).toContain('600자');
    expect(buildSystemPrompt(600, 'formal')).toContain('존댓말');
    expect(buildSystemPrompt(600, 'casual')).toContain('반말');
  });

  it('user 프롬프트에 세 입력이 들어간다', () => {
    const u = buildUserPrompt({ recipient: '할머니', relationship: '손주', intent: '건강 챙기시라는 말', tone: 'formal', maxChars: 600 });
    expect(u).toContain('할머니');
    expect(u).toContain('손주');
    expect(u).toContain('건강 챙기시라는 말');
  });

  it('스키마는 200자 초과와 이상한 tone을 거부', () => {
    const base = { recipient: '할머니', relationship: '손주', intent: '건강', tone: 'formal', maxChars: 600 };
    expect(draftRequestSchema.safeParse(base).success).toBe(true);
    expect(draftRequestSchema.safeParse({ ...base, recipient: 'a'.repeat(201) }).success).toBe(false);
    expect(draftRequestSchema.safeParse({ ...base, tone: 'polite' }).success).toBe(false);
    expect(draftRequestSchema.safeParse({ ...base, maxChars: 5000 }).success).toBe(false);
  });
});
