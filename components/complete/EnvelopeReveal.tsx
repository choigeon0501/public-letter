'use client';

import { useState, type ReactNode } from 'react';

type Props = { recipientName: string; recipientAddress: string; children: ReactNode };

/** 봉투를 누르면 편지지가 위로 올라오며 펼쳐진다. 자동 재생 없이 사용자 동작으로만 연다 */
export default function EnvelopeReveal({ recipientName, recipientAddress, children }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className={`relative transition-[padding] duration-500 ${opened ? 'pt-0' : 'pt-10'}`}>
        <div
          className={`z-10 origin-bottom transition-all duration-700 ease-out ${
            opened ? 'relative translate-y-0 scale-100 opacity-100' : 'pointer-events-none absolute inset-x-0 top-0 translate-y-16 scale-[0.92] opacity-0'
          }`}
          aria-hidden={!opened}
        >
          {children}
        </div>

        <button
          type="button"
          onClick={() => setOpened(true)}
          aria-expanded={opened}
          className={`relative w-full overflow-hidden rounded-md bg-kraft text-left shadow-[0_18px_40px_-20px_rgba(30,42,58,0.5)] transition-all duration-500 ${
            opened ? 'mt-6 h-28 opacity-90' : 'aspect-[3/2]'
          }`}
        >
          <div className="airmail-stripe absolute inset-x-0 top-0" aria-hidden />
          <div className="absolute right-5 top-5 flex h-12 w-10 items-center justify-center rounded-sm border-2 border-dashed border-stamp/60 bg-paper" aria-hidden>
            <span className="text-2xl leading-none text-stamp" style={{ fontFamily: 'var(--font-hand)' }}>
              우
            </span>
          </div>
          <div className={`absolute left-6 ${opened ? 'top-6' : 'bottom-8'} max-w-[70%]`} style={{ fontFamily: 'var(--font-hand)' }}>
            <p className="text-2xl leading-tight text-ink">{recipientName} 님께</p>
            {!opened && <p className="mt-1 text-lg leading-snug text-ink-soft">{recipientAddress}</p>}
          </div>
          {!opened && (
            <span className="absolute inset-x-0 bottom-2 text-center text-xs text-ink/60">봉투를 눌러 편지를 열어보세요</span>
          )}
        </button>
      </div>
    </div>
  );
}
