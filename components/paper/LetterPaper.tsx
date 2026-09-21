import type { CSSProperties, Ref } from 'react';
import { fontFamilyOf, type FontId } from '@/lib/fonts';
import { getPaper } from './papers';

export type LetterTextPatch = { to?: string; body?: string; from?: string };

type Props = {
  paperId: string;
  font: FontId;
  to: string;
  body: string;
  from: string;
  mode: 'read' | 'edit';
  onChange?: (patch: LetterTextPatch) => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

/**
 * 편지지 렌더러. 글자 크기·줄 간격을 편지지 폭(cqw) 기준으로 잡아
 * 썸네일·작성·완료 화면 어디서든 배경과 글이 같은 비율로 보인다.
 */
export default function LetterPaper({ paperId, font, to, body, from, mode, onChange, className = '', ref }: Props) {
  const paper = getPaper(paperId);
  const { Background, textArea } = paper;
  const lh = `${paper.lineHeight}cqw`;
  const rootStyle: CSSProperties = {
    containerType: 'inline-size',
    fontFamily: fontFamilyOf(font),
    color: paper.inkColor ?? 'var(--color-ink)',
  };
  const areaStyle: CSSProperties = {
    top: `${textArea.top}%`,
    left: `${textArea.left}%`,
    width: `${textArea.width}%`,
    height: `${textArea.height}%`,
  };
  const bodyStyle: CSSProperties = {
    fontSize: '3.9cqw',
    lineHeight: lh,
    backgroundImage: paper.lined
      ? `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${lh} - 1px), var(--color-paper-line) calc(${lh} - 1px), var(--color-paper-line) ${lh})`
      : undefined,
  };
  const toStyle: CSSProperties = { fontSize: '4.6cqw', lineHeight: lh };
  const fromStyle: CSSProperties = { fontSize: '3.9cqw', lineHeight: lh };
  const control = 'w-full bg-transparent outline-none placeholder:text-ink-soft/50';

  return (
    <div
      ref={ref}
      data-paper={paper.id}
      className={`relative aspect-[148/210] w-full overflow-hidden rounded-[3px] shadow-[0_10px_30px_-12px_rgba(43,38,34,0.35)] ${className}`}
      style={rootStyle}
    >
      <Background />
      <div className="absolute z-10 flex flex-col" style={areaStyle}>
        {mode === 'edit' ? (
          <input
            aria-label="받는 사람"
            className={control}
            style={toStyle}
            value={to}
            placeholder="받는 분 (예: 사랑하는 할머니께)"
            onChange={(e) => onChange?.({ to: e.target.value })}
          />
        ) : (
          <p className="truncate" style={toStyle}>
            {to}
          </p>
        )}
        {mode === 'edit' ? (
          <textarea
            aria-label="본문"
            className={`${control} flex-1 resize-none`}
            style={bodyStyle}
            value={body}
            placeholder="여기에 편지를 써보세요."
            onChange={(e) => onChange?.({ body: e.target.value })}
          />
        ) : (
          <div className="flex-1 overflow-hidden whitespace-pre-wrap break-words" style={bodyStyle}>
            {body}
          </div>
        )}
        {mode === 'edit' ? (
          <input
            aria-label="보내는 사람"
            className={`${control} text-right`}
            style={fromStyle}
            value={from}
            placeholder="보내는 이 (예: 손주 민수 올림)"
            onChange={(e) => onChange?.({ from: e.target.value })}
          />
        ) : (
          <p className="truncate text-right" style={fromStyle}>
            {from}
          </p>
        )}
      </div>
    </div>
  );
}
