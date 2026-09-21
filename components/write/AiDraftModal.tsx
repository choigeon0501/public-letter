'use client';

import { useEffect, useRef, useState } from 'react';
import type { Tone } from '@/lib/claude';

type Props = {
  open: boolean;
  onClose: () => void;
  maxChars: number;
  hasBody: boolean;
  onInsert: (text: string) => void;
  /** false면 질문 UI까지만 보여주고 생성 대신 준비 중 안내 */
  enabled: boolean;
};

const RELATIONS = ['친구', '연인', '가족', '손주·자녀', '부모', '동료', '기타'] as const;
const CASUAL_RELATIONS: string[] = ['친구', '연인'];

type Phase = 'form' | 'streaming' | 'done' | 'error' | 'unavailable';

export default function AiDraftModal({ open, onClose, maxChars, hasBody, onInsert, enabled }: Props) {
  const [recipient, setRecipient] = useState('');
  const [relationChip, setRelationChip] = useState<string>('');
  const [relationCustom, setRelationCustom] = useState('');
  const [tone, setTone] = useState<Tone>('formal');
  const [intent, setIntent] = useState('');
  const [phase, setPhase] = useState<Phase>('form');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const relationship = relationChip === '기타' ? relationCustom : relationChip;
  const canGenerate = recipient.trim() && relationship.trim() && intent.trim();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!open) return null;

  const pickRelation = (chip: string) => {
    setRelationChip(chip);
    setTone(CASUAL_RELATIONS.includes(chip) ? 'casual' : 'formal');
  };

  const generate = async () => {
    if (!enabled) {
      setPhase('unavailable');
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase('streaming');
    setDraft('');
    setError('');
    setConfirmOverwrite(false);

    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, relationship, intent, tone, maxChars }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'AI가 잠시 응답하지 않아요. 다시 시도해주세요.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setDraft(text);
      }
      setDraft(text.trim());
      setPhase('done');
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 났어요.');
      setPhase('error');
    }
  };

  const insert = () => {
    if (hasBody && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }
    onInsert(draft);
    onClose();
    setPhase('form');
  };

  const backToForm = () => {
    abortRef.current?.abort();
    setPhase('form');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-draft-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-paper p-5 sm:max-w-lg sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="ai-draft-title" className="text-lg font-semibold">
              AI에게 초안 부탁하기
            </h2>
            <p className="mt-1 text-sm text-ink-soft">세 가지만 알려주면 첫 문장을 잡아드려요. 마음에 드는 부분만 고쳐 쓰면 됩니다.</p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost -mr-2 -mt-1" aria-label="닫기">
            ✕
          </button>
        </div>

        {phase === 'form' && (
          <form
            className="mt-5 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (canGenerate) generate();
            }}
          >
            <label className="block">
              <span className="text-sm font-medium">누구에게 쓰는 편지인가요?</span>
              <input className="field mt-1.5" value={recipient} maxLength={200} onChange={(e) => setRecipient(e.target.value)} placeholder="예: 할머니, 군대 간 남자친구" />
            </label>

            <div>
              <span className="text-sm font-medium">나는 그 사람에게 어떤 존재인가요?</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {RELATIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => pickRelation(r)}
                    aria-pressed={relationChip === r}
                    className={`rounded-full border px-3 py-1 text-sm ${relationChip === r ? 'border-ink bg-ink text-paper' : 'border-line bg-white/60'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {relationChip === '기타' && (
                <input className="field mt-2" value={relationCustom} maxLength={200} onChange={(e) => setRelationCustom(e.target.value)} placeholder="예: 옛 담임 선생님의 제자" />
              )}
            </div>

            <div>
              <span className="text-sm font-medium">말투</span>
              <div className="mt-1.5 inline-flex rounded-full border border-line bg-white/60 p-0.5" role="radiogroup" aria-label="말투">
                {(['formal', 'casual'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={tone === t}
                    onClick={() => setTone(t)}
                    className={`rounded-full px-4 py-1 text-sm ${tone === t ? 'bg-ink text-paper' : 'text-ink-soft'}`}
                  >
                    {t === 'formal' ? '존댓말' : '반말'}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-medium">어떤 내용을 담고 싶나요?</span>
              <textarea className="field mt-1.5 min-h-24 resize-y" value={intent} maxLength={200} onChange={(e) => setIntent(e.target.value)} placeholder="두세 문장이면 충분해요. 예: 추석에 못 가서 죄송하고, 건강 챙기시라는 말" />
              <span className="mt-1 block text-right text-xs text-ink-soft">{intent.length} / 200</span>
            </label>

            <button type="submit" disabled={!canGenerate} className="btn-primary w-full">
              초안 만들기
            </button>
          </form>
        )}

        {(phase === 'streaming' || phase === 'done') && (
          <div className="mt-5">
            <div className="min-h-40 whitespace-pre-wrap rounded-lg border border-line bg-white p-4 leading-relaxed" aria-live="polite">
              {draft}
              {phase === 'streaming' && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-ink align-middle" aria-hidden />}
            </div>
            {phase === 'streaming' && <p className="mt-2 text-sm text-ink-soft">쓰는 중이에요…</p>}
            {phase === 'done' && (
              <div className="mt-4 flex flex-col gap-2">
                {confirmOverwrite && (
                  <p className="rounded-lg bg-stamp-soft px-3 py-2 text-sm text-ink">이미 쓴 내용이 있어요. 지우고 이 초안으로 바꿀까요?</p>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={insert} className="btn-primary flex-1">
                    {confirmOverwrite ? '지우고 넣기' : '편지지에 넣기'}
                  </button>
                  <button type="button" onClick={generate} className="btn-secondary">
                    다시 생성
                  </button>
                </div>
                <button type="button" onClick={backToForm} className="btn-ghost">
                  내용 고치기
                </button>
              </div>
            )}
            {phase === 'streaming' && (
              <button type="button" onClick={backToForm} className="btn-ghost mt-3">
                취소
              </button>
            )}
          </div>
        )}

        {phase === 'unavailable' && (
          <div className="mt-5 text-center">
            <p className="text-lg font-semibold">AI 초안 기능은 아직 준비 중입니다.</p>
            <p className="mt-2 text-sm text-ink-soft">지금은 편지지에 직접 써주세요. 입력하신 내용은 남아 있어요.</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={backToForm} className="btn-secondary flex-1">
                내용 고치기
              </button>
              <button type="button" onClick={onClose} className="btn-primary flex-1">
                확인
              </button>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="mt-5">
            <p className="rounded-lg bg-stamp-soft px-3 py-3 text-sm">{error}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={generate} className="btn-primary flex-1">
                다시 시도
              </button>
              <button type="button" onClick={backToForm} className="btn-secondary">
                내용 고치기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
