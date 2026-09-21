'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLetterStore } from '@/lib/store';
import LetterPaper from './LetterPaper';
import PaperCard from './PaperCard';
import { getPaper, papers } from './papers';
import { SAMPLE_LETTER } from './sample';

export default function PaperPicker() {
  const router = useRouter();
  const storedPaperId = useLetterStore((s) => s.paperId);
  const setPaper = useLetterStore((s) => s.setPaper);
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const current = getPaper(selected ?? storedPaperId);

  const start = () => {
    setPaper(current.id);
    router.push(`/write?paper=${current.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6 lg:pb-12">
      <div className="py-4">
        <h1 className="text-2xl font-semibold">어떤 편지지에 쓸까요?</h1>
        <p className="mt-1 text-ink-soft">편지지를 누르면 글이 올라간 모습을 미리 볼 수 있어요.</p>
      </div>
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {papers.map((p) => (
            <li key={p.id}>
              <PaperCard paper={p} selected={p.id === current.id} onSelect={setSelected} />
            </li>
          ))}
        </ul>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <LetterPaper paperId={current.id} font="nanum-pen" mode="read" {...SAMPLE_LETTER} />
            <div className="mt-4">
              <p className="font-medium">{current.name}</p>
              <p className="text-sm text-ink-soft">{current.description}</p>
            </div>
            <button type="button" onClick={start} className="btn-primary mt-5 w-full">
              이 편지지로 쓰기
            </button>
          </div>
        </aside>
      </div>

      {/* 모바일: 하단 고정 바 + 미리보기 시트 */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button type="button" onClick={() => setSheetOpen((v) => !v)} className="btn-secondary flex-1" aria-expanded={sheetOpen}>
            {current.name} 미리보기
          </button>
          <button type="button" onClick={start} className="btn-primary flex-1">
            이 편지지로 쓰기
          </button>
        </div>
      </div>
      {sheetOpen && (
        <div className="fixed inset-0 z-30 flex items-end bg-ink/40 lg:hidden" onClick={() => setSheetOpen(false)}>
          <div className="w-full rounded-t-2xl bg-paper p-4 pb-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`${current.name} 미리보기`}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" aria-hidden />
            <div className="mx-auto max-w-[320px]">
              <LetterPaper paperId={current.id} font="nanum-pen" mode="read" {...SAMPLE_LETTER} />
            </div>
            <button type="button" onClick={start} className="btn-primary mt-4 w-full">
              이 편지지로 쓰기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
