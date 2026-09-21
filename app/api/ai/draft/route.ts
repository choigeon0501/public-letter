import Anthropic from '@anthropic-ai/sdk';
import { draftRequestSchema, streamDraft } from '@/lib/claude';
import { createRateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const limiter = createRateLimiter(5, 60_000);

function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'AI 초안 기능이 아직 설정되지 않았어요. 직접 편지를 써주세요.' }, { status: 503 });
  }
  if (!limiter.check(clientIp(req))) {
    return Response.json({ error: '요청이 너무 잦아요. 1분 뒤에 다시 시도해주세요.' }, { status: 429 });
  }

  const parsed = draftRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: '입력을 확인해주세요. 각 항목은 200자 이내예요.' }, { status: 400 });
  }

  try {
    return new Response(await streamDraft(parsed.data), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: 'AI 초안 기능 설정에 문제가 있어요. 직접 편지를 써주세요.' }, { status: 503 });
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: 'AI가 잠시 응답하지 않아요. 다시 시도해주세요.' }, { status: 502 });
    }
    throw error;
  }
}
