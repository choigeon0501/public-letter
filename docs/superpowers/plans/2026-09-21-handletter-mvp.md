# 손편지 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 편지지 선택 → 작성(AI 초안) → 주소 입력 → 완료의 4단계 손편지 Flow를 Next.js로 동작하게 만든다.

**Architecture:** App Router 페이지 5개(`/`, `/papers`, `/write`, `/address`, `/complete`)가 Zustand+sessionStorage 스토어를 공유한다. `LetterPaper`가 편집/읽기 공용 렌더러이며 8종 편지지는 인라인 SVG/CSS 배경 컴포넌트 + 메타데이터로 정의한다. AI 초안은 `/api/ai/draft` Route Handler가 Anthropic SDK로 스트리밍한다.

**Tech Stack:** Next.js 16.3 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, Zustand 5, zod, @anthropic-ai/sdk, react-daum-postcode, html-to-image, Vitest + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-21-handletter-mvp-design.md`

## Global Constraints

- Next.js 16: `searchParams`/`useSearchParams`는 클라이언트에서 `<Suspense>` 경계 필요. `PageProps`/`LayoutProps`는 전역 타입.
- Tailwind v4: `app/globals.css`의 `@theme`에 토큰 정의. `tailwind.config.js` 없음.
- 모델 기본값 `claude-sonnet-5`, `ANTHROPIC_MODEL`로 교체. 키는 `ANTHROPIC_API_KEY`. `.env*`는 gitignore.
- 글자 수는 코드포인트(`[...s].length`). `textarea maxLength` 사용 금지.
- 편지지 배경은 외부 이미지 파일 없이 인라인 SVG/CSS.
- 커밋 메시지는 `.claude/skills/commit-conventions` 형식(`type(scope): 한국어 요약`).
- 코드 스타일: 함수 사이 빈 줄 1개, 주석은 `/** */`로 코드만 봐서 알 수 없는 사실만.
- 테스트는 로직만(Vitest). UI/스트리밍/Daum/html-to-image는 `npm run build` + 수동 확인.

---

### Task 0: 테스트 환경 + 디자인 토큰 + 폰트

**Files:**
- Create: `vitest.config.ts`, `lib/fonts.ts`
- Modify: `package.json`(scripts), `app/globals.css`, `app/layout.tsx`, `.env.example`

**Produces:** `fonts` 배열 `{ id: FontId; label: string; className: string; variable: string }[]`, `FontId = 'nanum-pen' | 'gaegu' | 'hi-melody'`, CSS 토큰 `--color-cream`, `--color-ink`, `--color-brick`.

- [ ] **Step 1: vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', include: ['**/*.test.{ts,tsx}'], exclude: ['node_modules', '.next'] },
  resolve: { alias: { '@': path.resolve(__dirname) } },
});
```

`package.json` scripts에 `"test": "vitest run"`, `"test:watch": "vitest"` 추가.

- [ ] **Step 2: lib/fonts.ts**

```ts
import { Nanum_Pen_Script, Gaegu, Hi_Melody } from 'next/font/google';

export type FontId = 'nanum-pen' | 'gaegu' | 'hi-melody';

const nanumPen = Nanum_Pen_Script({ weight: '400', subsets: ['latin'], variable: '--font-nanum-pen', display: 'swap' });
const gaegu = Gaegu({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-gaegu', display: 'swap' });
const hiMelody = Hi_Melody({ weight: '400', subsets: ['latin'], variable: '--font-hi-melody', display: 'swap' });

export const fonts: { id: FontId; label: string; className: string; variable: string }[] = [
  { id: 'nanum-pen', label: '나눔 펜', className: nanumPen.className, variable: nanumPen.variable },
  { id: 'gaegu', label: '개구', className: gaegu.className, variable: gaegu.variable },
  { id: 'hi-melody', label: '하이멜로디', className: hiMelody.className, variable: hiMelody.variable },
];

export const fontVariableClass = fonts.map((f) => f.variable).join(' ');

export function fontFamilyOf(id: FontId): string {
  return `var(--font-${id})`;
}
```

- [ ] **Step 3: globals.css 토큰 + layout.tsx**

`globals.css`: `@theme`에 `--color-cream: #faf6ef; --color-ink: #2b2622; --color-brick: #c4553d; --color-paper-line: #d9d2c5;`. body 배경 cream, 텍스트 ink, 폰트 시스템 산세리프. 다크모드 블록 제거.
`layout.tsx`: `lang="ko"`, `<html className={fontVariableClass}>`, metadata title "손편지 — 마음을 손으로 써서 보내드려요".
`.env.example`: `ANTHROPIC_API_KEY=` / `ANTHROPIC_MODEL=claude-sonnet-5`.

- [ ] **Step 4: 확인 후 커밋** — `npm run build` 통과. `chore(setup): vitest, 디자인 토큰, 손글씨 폰트 3종`

---

### Task 1: 편지지 메타데이터 + 텍스트 유틸

**Files:**
- Create: `components/paper/papers.ts`, `components/paper/backgrounds/*.tsx`(8개), `lib/text.ts`, `components/paper/papers.test.ts`, `lib/text.test.ts`

**Produces:**
```ts
type TextArea = { top: number; left: number; width: number; height: number };
type LetterPaper = { id: string; name: string; description: string; tags: string[]; maxChars: number; lineHeight: number; textArea: TextArea; Background: React.ComponentType };
export const papers: LetterPaper[]; export const DEFAULT_PAPER_ID = 'plain-cream';
export function getPaper(id: string | null | undefined): LetterPaper; // 없으면 기본
export function countChars(s: string): number;
```

- [ ] **Step 1: 실패 테스트**

```ts
// components/paper/papers.test.ts
import { describe, it, expect } from 'vitest';
import { papers, getPaper, DEFAULT_PAPER_ID } from './papers';

describe('papers', () => {
  it('8종이고 id가 고유하다', () => {
    expect(papers).toHaveLength(8);
    expect(new Set(papers.map((p) => p.id)).size).toBe(8);
  });
  it('maxChars는 500~700', () => {
    for (const p of papers) expect(p.maxChars).toBeGreaterThanOrEqual(500), expect(p.maxChars).toBeLessThanOrEqual(700);
  });
  it('textArea는 0~100% 안에 있다', () => {
    for (const p of papers) {
      const { top, left, width, height } = p.textArea;
      expect(top + height).toBeLessThanOrEqual(100);
      expect(left + width).toBeLessThanOrEqual(100);
    }
  });
  it('getPaper는 모르는 id면 기본 편지지', () => {
    expect(getPaper('nope').id).toBe(DEFAULT_PAPER_ID);
    expect(getPaper(undefined).id).toBe(DEFAULT_PAPER_ID);
  });
});
```

```ts
// lib/text.test.ts
import { describe, it, expect } from 'vitest';
import { countChars } from './text';

describe('countChars', () => {
  it('한글과 이모지를 코드포인트로 센다', () => {
    expect(countChars('안녕')).toBe(2);
    expect(countChars('a😀')).toBe(2);
    expect(countChars('')).toBe(0);
  });
});
```

- [ ] **Step 2: `npx vitest run` → 모듈 없음으로 FAIL**
- [ ] **Step 3: 구현** — `lib/text.ts`: `export const countChars = (s: string) => [...s].length;`. 배경 8개는 각각 `export default function XBackground()`로 `absolute inset-0` div + 인라인 SVG. `papers.ts`는 배경 import 후 배열 정의(값은 스펙 §5).
- [ ] **Step 4: 테스트 PASS → 커밋** `feat(paper): 편지지 8종 메타데이터·배경, 글자 수 유틸`

---

### Task 2: 스토어

**Files:** `lib/store.ts`, `lib/store.test.ts`

**Produces:**
```ts
type Address = { name: string; zonecode: string; address: string; detail: string; phone?: string };
type LetterState = { paperId: string; font: FontId; to: string; body: string; from: string; recipient: Address; sender: Address };
useLetterStore: hydrated, ...LetterState, setPaper(id), setFont(id), setText(patch: Partial<Pick<LetterState,'to'|'body'|'from'>>), setRecipient(a), setSender(a), reset()
export const emptyAddress: Address;
```

- [ ] **Step 1: 실패 테스트**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useLetterStore } from './store';

beforeEach(() => useLetterStore.getState().reset());

describe('letter store', () => {
  it('기본값', () => {
    const s = useLetterStore.getState();
    expect(s.paperId).toBe('plain-cream');
    expect(s.font).toBe('nanum-pen');
    expect(s.body).toBe('');
  });
  it('setPaper는 본문을 지우지 않는다', () => {
    useLetterStore.getState().setText({ body: '안녕' });
    useLetterStore.getState().setPaper('kraft');
    expect(useLetterStore.getState().body).toBe('안녕');
    expect(useLetterStore.getState().paperId).toBe('kraft');
  });
  it('reset은 전부 초기화', () => {
    useLetterStore.getState().setRecipient({ name: '김', zonecode: '12345', address: 'a', detail: 'b' });
    useLetterStore.getState().reset();
    expect(useLetterStore.getState().recipient.name).toBe('');
  });
});
```

- [ ] **Step 2: FAIL 확인**
- [ ] **Step 3: 구현** — `create<Store>()(persist((set) => ({...}), { name: 'handletter-letter', storage: createJSONStorage(() => sessionStorage), partialize: (s) => ({ paperId, font, to, body, from, recipient, sender }), onRehydrateStorage: () => (state) => state?.setHydrated(true) }))`. `hydrated` 기본 false. 테스트(jsdom)에는 sessionStorage가 있어 그대로 동작.
- [ ] **Step 4: PASS → 커밋** `feat(store): 편지 상태 Zustand 스토어 + sessionStorage 동기화`

---

### Task 3: LetterPaper 렌더러 + StepIndicator

**Files:** `components/paper/LetterPaper.tsx`, `components/StepIndicator.tsx`, `components/paper/LetterPaper.test.tsx`

**Produces:**
```tsx
type LetterPaperProps = { paperId: string; font: FontId; to: string; body: string; from: string;
  mode: 'read' | 'edit'; onChange?: (patch: { to?: string; body?: string; from?: string }) => void; className?: string };
<LetterPaper ... />  // forwardRef 없이 ref는 wrapper div에 ref prop(React 19 ref-as-prop)
<StepIndicator current={1|2|3|4} />
```

- [ ] **Step 1: 실패 테스트(읽기 모드 렌더)**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LetterPaper from './LetterPaper';

describe('LetterPaper', () => {
  it('읽기 모드에서 to/body/from을 보여준다', () => {
    render(<LetterPaper paperId="plain-cream" font="nanum-pen" to="할머니께" body="안녕하세요" from="민수 올림" mode="read" />);
    expect(screen.getByText('할머니께')).toBeTruthy();
    expect(screen.getByText('안녕하세요')).toBeTruthy();
    expect(screen.getByText('민수 올림')).toBeTruthy();
  });
  it('편집 모드에서 textarea가 있다', () => {
    render(<LetterPaper paperId="plain-cream" font="nanum-pen" to="" body="" from="" mode="edit" onChange={() => {}} />);
    expect(screen.getByRole('textbox', { name: '본문' })).toBeTruthy();
  });
});
```

- [ ] **Step 2: FAIL**
- [ ] **Step 3: 구현** — 루트 `relative aspect-[148/210] w-full overflow-hidden rounded-sm shadow` + `style={{ fontFamily: fontFamilyOf(font) }}`. `<Background/>` 아래, 텍스트 레이어 `absolute` + textArea % 좌표, `flex flex-col`. To: input/p, 본문: textarea/`whitespace-pre-wrap` div(`flex-1`, `lineHeight`), From: input/p `text-right`. 편집 컨트롤은 `bg-transparent outline-none resize-none w-full` + `aria-label`. StepIndicator: 4개 점+라벨(편지지/작성/발송 정보/완료), current 강조.
- [ ] **Step 4: PASS → 커밋** `feat(paper): LetterPaper 편집/읽기 공용 렌더러, StepIndicator`

---

### Task 4: 랜딩 + 편지지 선택 페이지

**Files:** `app/page.tsx`, `app/papers/page.tsx`, `components/paper/PaperCard.tsx`, `components/paper/PaperPicker.tsx`(클라이언트)

- [ ] **Step 1: `app/page.tsx`(서버)** — 히어로("마음을 손으로 써서 보내드려요" + 부제), 이용 방법 3단계(편지지 고르기 / 편지 쓰기 / 주소 입력하면 끝), 편지지 4장 `LetterPaper mode="read"` 샘플, CTA `<Link href="/papers">편지 쓰기</Link>`.
- [ ] **Step 2: `PaperCard`** — 썸네일(`LetterPaper` 축소 샘플 또는 Background만), 이름, 태그, 설명, 선택 시 brick 테두리. `PaperPicker`: 상태 `selected`(초기값 스토어 paperId), 그리드(2열/모바일, 3~4열/데스크톱) + 우측 sticky 미리보기(lg 이상) / 모바일 하단 고정 바(선택 이름 + "미리보기" 토글 시트 + CTA). CTA → `setPaper(selected)` 후 `router.push('/write?paper=' + selected)`.
- [ ] **Step 3: `app/papers/page.tsx`** — `<StepIndicator current={1}/>` + `<PaperPicker/>`.
- [ ] **Step 4: `npm run build` PASS → 커밋** `feat(papers): 랜딩 페이지와 편지지 선택 페이지`

---

### Task 5: 작성 페이지

**Files:** `app/write/page.tsx`, `components/write/LetterEditor.tsx`, `components/write/FontPicker.tsx`

- [ ] **Step 1: `FontPicker`** — 3개 버튼, 각 버튼 라벨을 해당 폰트로 렌더. `value`/`onChange`.
- [ ] **Step 2: `LetterEditor`(클라이언트)** — `useSearchParams().get('paper')`가 있으면 마운트 시 `setPaper`. `hydrated` 전엔 스켈레톤. 상단 FontPicker + 글자 수 `${count} / ${maxChars}`(초과 시 `text-brick`). 중앙 `LetterPaper mode="edit"`. 툴바 "✨ AI에게 초안 부탁하기"(본문 비어 있으면 brick 강조) → Task 6의 모달 열기. 하단 "편지지 다시 고르기"(`/papers`) / "작성 완료"(`to`·`body` 비었거나 초과면 disabled, → `/address`).
- [ ] **Step 3: `app/write/page.tsx`** — `<Suspense fallback={...}><LetterEditor/></Suspense>`.
- [ ] **Step 4: build PASS → 커밋** `feat(write): 편지 작성 페이지(에디터, 글꼴, 글자 수)`

---

### Task 6: AI 초안 API + 모달

**Files:** `lib/claude.ts`, `lib/rate-limit.ts`, `app/api/ai/draft/route.ts`, `components/write/AiDraftModal.tsx`, `lib/claude.test.ts`, `lib/rate-limit.test.ts`

**Produces:**
```ts
// lib/claude.ts
export const draftRequestSchema = z.object({ recipient: z.string().trim().min(1).max(200), relationship: z.string().trim().min(1).max(200), intent: z.string().trim().min(1).max(200), tone: z.enum(['formal','casual']), maxChars: z.number().int().min(100).max(1000) });
export type DraftRequest = z.infer<typeof draftRequestSchema>;
export function buildSystemPrompt(maxChars: number, tone: 'formal'|'casual'): string;
export function buildUserPrompt(req: DraftRequest): string;
export function streamDraft(req: DraftRequest): ReadableStream<Uint8Array>; // Anthropic 스트림 → 텍스트 청크
// lib/rate-limit.ts
export function createRateLimiter(limit: number, windowMs: number, now = () => Date.now()): { check(key: string): boolean };
```

- [ ] **Step 1: 실패 테스트**

```ts
// lib/claude.test.ts
import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, buildUserPrompt, draftRequestSchema } from './claude';

describe('prompt', () => {
  it('system에 maxChars와 말투가 들어간다', () => {
    expect(buildSystemPrompt(600, 'formal')).toContain('600자');
    expect(buildSystemPrompt(600, 'formal')).toContain('존댓말');
    expect(buildSystemPrompt(600, 'casual')).toContain('반말');
  });
  it('user 프롬프트에 세 입력이 들어간다', () => {
    const u = buildUserPrompt({ recipient: '할머니', relationship: '손주', intent: '건강', tone: 'formal', maxChars: 600 });
    expect(u).toContain('할머니'); expect(u).toContain('손주'); expect(u).toContain('건강');
  });
  it('스키마는 200자 초과를 거부', () => {
    expect(draftRequestSchema.safeParse({ recipient: 'a'.repeat(201), relationship: 'b', intent: 'c', tone: 'formal', maxChars: 600 }).success).toBe(false);
  });
});
```

```ts
// lib/rate-limit.test.ts
import { describe, it, expect } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('rate limiter', () => {
  it('분당 limit 초과 시 거부, 시간 지나면 허용', () => {
    let t = 0;
    const rl = createRateLimiter(2, 60_000, () => t);
    expect(rl.check('ip')).toBe(true);
    expect(rl.check('ip')).toBe(true);
    expect(rl.check('ip')).toBe(false);
    t = 60_001;
    expect(rl.check('ip')).toBe(true);
  });
});
```

- [ ] **Step 2: FAIL**
- [ ] **Step 3: 구현**

`lib/claude.ts` 핵심:
```ts
import Anthropic from '@anthropic-ai/sdk';
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5';
export function streamDraft(req: DraftRequest): ReadableStream<Uint8Array> {
  const client = new Anthropic();
  const stream = client.messages.stream({ model: MODEL, max_tokens: 1024, system: buildSystemPrompt(req.maxChars, req.tone), messages: [{ role: 'user', content: buildUserPrompt(req) }] });
  const enc = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const ev of stream) {
          if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') controller.enqueue(enc.encode(ev.delta.text));
        }
        controller.close();
      } catch (e) { controller.error(e); }
    },
    cancel() { stream.abort(); },
  });
}
```
`route.ts`: `export const runtime = 'nodejs'`; 키 없으면 503; `x-forwarded-for` 첫 IP로 `limiter.check` → 429; `draftRequestSchema.safeParse(await req.json())` 실패 → 400; 성공 → `new Response(streamDraft(data), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })`. `Anthropic.AuthenticationError` → 503, 기타 `Anthropic.APIError` → 502.

`AiDraftModal` props: `{ open, onClose, maxChars, onInsert(text) , hasBody }`. 단계: 입력 폼(4개) → 생성 중(스트리밍 텍스트 표시) → 결과(편지지에 넣기/다시 생성/닫기). 관계 칩 클릭 시 `tone` 자동: `['친구','연인'].includes(chip) ? 'casual' : 'formal'`. fetch → `res.body.getReader()` + `TextDecoder`로 누적. `hasBody`면 넣기 전 `window.confirm` 대신 인라인 확인 문구(브라우저 다이얼로그 금지). 모바일은 바텀시트(`fixed inset-x-0 bottom-0`), 데스크톱은 중앙 모달.

- [ ] **Step 4: PASS + build → 커밋** `feat(ai): Claude 초안 스트리밍 API와 AI 도움 모달`

---

### Task 7: 주소 페이지

**Files:** `lib/validation.ts`, `lib/validation.test.ts`, `components/address/PostcodeSearch.tsx`, `components/address/AddressForm.tsx`, `app/address/page.tsx`

**Produces:** `addressSchema` (zod, `Address`), `sendFormSchema = z.object({ recipient: addressSchema, sender: addressSchema })`, `type FieldErrors = Record<string, string>`, `validateAddress(a): FieldErrors`.

- [ ] **Step 1: 실패 테스트**

```ts
import { describe, it, expect } from 'vitest';
import { addressSchema } from './validation';
const ok = { name: '김하늘', zonecode: '06236', address: '서울 강남구 테헤란로 1', detail: '101동 101호' };
describe('addressSchema', () => {
  it('정상 통과, phone 없어도 됨', () => expect(addressSchema.safeParse(ok).success).toBe(true));
  it('우편번호 5자리 아니면 실패', () => expect(addressSchema.safeParse({ ...ok, zonecode: '123' }).success).toBe(false));
  it('상세주소 빈 값 실패', () => expect(addressSchema.safeParse({ ...ok, detail: '' }).success).toBe(false));
  it('phone 형식 검사', () => {
    expect(addressSchema.safeParse({ ...ok, phone: '010-1234-5678' }).success).toBe(true);
    expect(addressSchema.safeParse({ ...ok, phone: '12' }).success).toBe(false);
    expect(addressSchema.safeParse({ ...ok, phone: '' }).success).toBe(true);
  });
});
```

- [ ] **Step 2: FAIL**
- [ ] **Step 3: 구현** — phone: `z.string().trim().regex(/^01[016789]-?\d{3,4}-?\d{4}$/).optional().or(z.literal(''))`. `PostcodeSearch`: `dynamic(() => import('react-daum-postcode').then(m => m.DaumPostcodeEmbed), { ssr: false })`, `onComplete(data)` → `{ zonecode: data.zonecode, address: data.roadAddress || data.jibunAddress }`. `AddressForm`: 섹션 2개(받는 사람/보내는 사람), 로컬 폼 상태(초기값 스토어; sender.name 비면 `from`), 제출 시 스키마 검증 → 에러 표시 → 통과 시 `setRecipient/setSender` 후 `/complete`. "이전" → `/write`. 가드: hydrated 후 `to`·`body` 없으면 `/write`.
- [ ] **Step 4: PASS + build → 커밋** `feat(address): 발송 정보 입력 폼, Daum 우편번호, zod 검증`

---

### Task 8: 완료 페이지

**Files:** `components/complete/EnvelopeReveal.tsx`, `components/complete/CompleteView.tsx`, `app/complete/page.tsx`

- [ ] **Step 1: `EnvelopeReveal`** — props `{ recipientName, recipientAddress, children }`. 상태 `opened`. 봉투(크림 카드, 우표 SVG, 받는 사람 이름/주소 2줄) 클릭 → `opened=true`, 편지지(children)가 `translate-y`/`opacity` 트랜지션으로 나타남. 봉투에 `role="button"` + 안내 "봉투를 눌러 편지를 열어보세요".
- [ ] **Step 2: `CompleteView`(클라이언트)** — 가드(hydrated 후 `recipient.name` 없으면 `/papers`). 헤드라인 + 발송 안내. `EnvelopeReveal` 안에 `LetterPaper mode="read"`(ref). 요약 카드 2개. "이미지로 저장": `toPng(ref.current, { pixelRatio: 2, cacheBust: true })` → `<a>` download `손편지.png`; 실패 시 인라인 에러 문구. "새 편지 쓰기": `reset()` → `/papers`.
- [ ] **Step 3: build → 커밋** `feat(complete): 완료 페이지, 봉투 열림, 이미지 저장`

---

### Task 9: 마무리 — 반응형·가드·README

- [ ] **Step 1: 모든 페이지 375px/1280px에서 확인**(claude-in-chrome 또는 수동). 편지지 폭 모바일 100%, 데스크톱 max 520px.
- [ ] **Step 2: `README.md`** 교체 — 실행법, 환경변수, 폴더 구조, 제외 범위.
- [ ] **Step 3: `npm run lint && npm test && npm run build` 전부 통과 → 커밋** `docs(readme): 실행 방법과 프로젝트 구조`
