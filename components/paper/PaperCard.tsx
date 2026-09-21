import LetterPaper from './LetterPaper';
import type { LetterPaper as Paper } from './papers';
import { SAMPLE_LETTER } from './sample';

type Props = { paper: Paper; selected: boolean; onSelect: (id: string) => void };

export default function PaperCard({ paper, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(paper.id)}
      aria-pressed={selected}
      className={`group block w-full rounded-xl p-2 text-left transition-colors ${
        selected ? 'bg-stamp-soft ring-2 ring-stamp' : 'hover:bg-paper-deep'
      }`}
    >
      <LetterPaper paperId={paper.id} font="nanum-pen" mode="read" {...SAMPLE_LETTER} />
      <div className="px-1 pb-1 pt-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{paper.name}</span>
          {paper.tags.map((t) => (
            <span key={t} className="rounded-full bg-paper-deep px-2 py-0.5 text-[11px] text-ink-soft">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-1 text-sm leading-snug text-ink-soft">{paper.description}</p>
        <p className="mt-1 text-xs text-ink-soft/80">최대 {paper.maxChars}자</p>
      </div>
    </button>
  );
}
