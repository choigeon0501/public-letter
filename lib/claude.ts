import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export const draftRequestSchema = z.object({
  recipient: z.string().trim().min(1).max(200),
  relationship: z.string().trim().min(1).max(200),
  intent: z.string().trim().min(1).max(200),
  tone: z.enum(['formal', 'casual']),
  maxChars: z.number().int().min(100).max(1000),
});

export type DraftRequest = z.infer<typeof draftRequestSchema>;
export type Tone = DraftRequest['tone'];

export const DEFAULT_MODEL = 'claude-sonnet-5';

export function buildSystemPrompt(maxChars: number, tone: Tone): string {
  const toneLine = tone === 'formal' ? '존댓말로 쓴다.' : '반말로 쓴다.';
  return [
    '너는 한국어 손편지 작가다. 과장하지 않고 담백하게, 실제 사람이 손으로 쓸 법한 문장으로 쓴다.',
    '인사 → 본론 → 마무리 순서로 쓰되 소제목이나 번호를 붙이지 않는다.',
    '이모지, 마크다운, 따옴표, 제목을 쓰지 않는다. 본문 텍스트만 출력한다.',
    '받는 사람 호칭(예: "할머니께")과 끝맺음 서명(예: "민수 올림")은 사용자가 따로 적으므로 넣지 않는다.',
    `${toneLine} 문단은 빈 줄 하나로 나눈다.`,
    `전체 길이는 공백 포함 ${maxChars}자 이내로 한다. 짧아도 괜찮다.`,
  ].join('\n');
}

export function buildUserPrompt(req: DraftRequest): string {
  return [
    `받는 사람: ${req.recipient}`,
    `나는 그 사람에게: ${req.relationship}`,
    `담고 싶은 내용: ${req.intent}`,
  ].join('\n');
}

/**
 * Anthropic 스트림을 텍스트 청크 ReadableStream으로 바꾼다.
 * 첫 이벤트를 먼저 기다려서 인증·요청 오류가 응답 헤더를 보내기 전에 throw 되게 한다.
 */
export async function streamDraft(req: DraftRequest): Promise<ReadableStream<Uint8Array>> {
  const client = new Anthropic();
  const stream = client.messages.stream({
    model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(req.maxChars, req.tone),
    messages: [{ role: 'user', content: buildUserPrompt(req) }],
  });
  const iterator = stream[Symbol.asyncIterator]();
  const first = await iterator.next();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let result = first;
        while (!result.done) {
          const event = result.value;
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
          result = await iterator.next();
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      stream.abort();
    },
  });
}
