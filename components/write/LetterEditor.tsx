'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LetterPaper from '@/components/paper/LetterPaper';
import { getPaper } from '@/components/paper/papers';
import { countChars } from '@/lib/text';
import { useLetterStore } from '@/lib/store';
import AiDraftModal from './AiDraftModal';
import FontPicker from './FontPicker';

export default function LetterEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const paperParam = params.get('paper');
  const { hydrated, paperId, font, to, body, from, setPaper, setFont, setText } = useLetterStore();
  const [aiOpen, setAiOpen] = useState(false);

  /** 쿼리의 편지지가 스토어와 다르면 쿼리를 우선한다(카탈로그에서 새로 고른 경우) */
  useEffect(() => {
    if (hydrated && paperParam && paperParam !== paperId) setPaper(paperParam);
  }, [hydrated, paperParam, paperId, setPaper]);

  if (!hydrated) {
    return <div className="mx-auto aspect-[148/210] w-full max-w-[520px] animate-pulse rounded bg-paper-deep" />;
  }

  const paper = getPaper(paperParam ?? paperId);
  const count = countChars(body);
  const over = count > paper.maxChars;
  const canProceed = to.trim().length > 0 && body.trim().length > 0 && !over;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-32 sm:px-6 lg:pb-16">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
        <div className="mx-auto w-full max-w-[520px]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <FontPicker value={font} onChange={setFont} />
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className={`${body.trim() ? 'btn-secondary' : 'btn-primary'} px-4 py-2 text-sm`}
            >
              ✨ AI에게 초안 부탁하기
            </button>
          </div>
          <LetterPaper paperId={paper.id} font={font} to={to} body={body} from={from} mode="edit" onChange={setText} />
          <p className={`mt-2 text-right text-sm tabular-nums ${over ? 'font-semibold text-stamp' : 'text-ink-soft'}`} aria-live="polite">
            {count} / {paper.maxChars}자
          </p>
          {over && (
            <p className="mt-2 text-sm text-stamp">
              편지지 한 장에 들어가는 {paper.maxChars}자를 넘었어요. {count - paper.maxChars}자를 줄여주세요.
            </p>
          )}
        </div>

        <aside className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-6">
            <h1 className="text-xl font-semibold">{paper.name}에 편지를 씁니다</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              편지지를 눌러 바로 쓸 수 있어요. 받는 분 호칭, 본문, 보내는 분 순서로 채워주세요.
            </p>
            <div className="mt-6 hidden flex-col gap-2 lg:flex">
              <button type="button" disabled={!canProceed} onClick={() => router.push('/address')} className="btn-primary w-full">
                작성 완료
              </button>
              <Link href="/papers" className="btn-ghost w-full">
                편지지 다시 고르기
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <AiDraftModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        maxChars={paper.maxChars}
        hasBody={body.trim().length > 0}
        onInsert={(text) => setText({ body: text })}
      />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/papers" className="btn-ghost">
            편지지 다시 고르기
          </Link>
          <button type="button" disabled={!canProceed} onClick={() => router.push('/address')} className="btn-primary flex-1">
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
}
