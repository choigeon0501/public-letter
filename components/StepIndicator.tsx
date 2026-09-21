const STEPS = ['편지지', '작성', '발송 정보', '완료'] as const;

export default function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <nav aria-label="진행 단계" className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 px-4 py-4 text-xs sm:text-sm">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                aria-current={active ? 'step' : undefined}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                  active ? 'bg-stamp text-white' : done ? 'bg-ink text-paper' : 'bg-paper-deep text-ink-soft'
                }`}
              >
                {step}
              </span>
              <span className={active ? 'font-semibold text-ink' : 'text-ink-soft'}>{label}</span>
            </div>
            {step < STEPS.length && <span className="h-px w-4 bg-line sm:w-8" aria-hidden />}
          </div>
        );
      })}
    </nav>
  );
}
