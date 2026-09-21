'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import LetterPaper from '@/components/paper/LetterPaper';
import { getPaper } from '@/components/paper/papers';
import { useLetterStore, type Address } from '@/lib/store';
import { buildFontEmbedCss } from '@/lib/font-embed';
import EnvelopeReveal from './EnvelopeReveal';

function AddressCard({ title, a }: { title: string; a: Address }) {
  return (
    <div className="rounded-xl border border-line bg-white/50 p-4">
      <p className="text-sm text-ink-soft">{title}</p>
      <p className="mt-1 font-semibold">{a.name}</p>
      <p className="mt-1 text-sm leading-relaxed">
        ({a.zonecode}) {a.address}
        <br />
        {a.detail}
      </p>
      {a.phone && <p className="mt-1 text-sm text-ink-soft">{a.phone}</p>}
    </div>
  );
}

export default function CompleteView() {
  const router = useRouter();
  const { hydrated, paperId, font, to, body, from, recipient, sender, reset } = useLetterStore();
  const letterRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (hydrated && !recipient.name) router.replace('/papers');
  }, [hydrated, recipient.name, router]);

  if (!hydrated || !recipient.name) {
    return <div className="mx-auto h-96 w-full max-w-2xl animate-pulse rounded-2xl bg-paper-deep" />;
  }

  const saveImage = async () => {
    if (!letterRef.current) return;
    setSaving(true);
    setSaveError('');
    try {
      const { toPng } = await import('html-to-image');
      const fontEmbedCSS = await buildFontEmbedCss(letterRef.current, `${to}${body}${from}`).catch(() => undefined);
      const dataUrl = await toPng(letterRef.current, { pixelRatio: 2, fontEmbedCSS });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `손편지-${recipient.name}.png`;
      a.click();
    } catch {
      setSaveError('이미지를 만들지 못했어요. 화면을 캡처해서 저장해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const startNew = () => {
    reset();
    router.push('/papers');
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
      <div className="py-6 text-center sm:py-10">
        <h1 className="text-3xl leading-tight sm:text-4xl" style={{ fontFamily: 'var(--font-hand)' }}>
          편지가 접수되었어요.
        </h1>
        <p className="mt-3 text-ink-soft">정성껏 손으로 써서 보내드릴게요. 영업일 기준 2~3일 안에 우체국으로 갑니다.</p>
      </div>

      <EnvelopeReveal recipientName={recipient.name} recipientAddress={`${recipient.address} ${recipient.detail}`}>
        <LetterPaper ref={letterRef} paperId={getPaper(paperId).id} font={font} to={to} body={body} from={from} mode="read" />
      </EnvelopeReveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <AddressCard title="받는 사람" a={recipient} />
        <AddressCard title="보내는 사람" a={sender} />
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={saveImage} disabled={saving} className="btn-secondary">
            {saving ? '이미지 만드는 중…' : '이미지로 저장'}
          </button>
          <button type="button" onClick={startNew} className="btn-primary">
            새 편지 쓰기
          </button>
        </div>
        {saveError && <p className="text-sm text-stamp">{saveError}</p>}
      </div>
    </div>
  );
}
