import { fontFamilyOf, fontOptions, type FontId } from '@/lib/fonts';

type Props = { value: FontId; onChange: (id: FontId) => void };

export default function FontPicker({ value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="글꼴" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none]">
      {fontOptions.map((f) => {
        const active = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(f.id)}
            className={`shrink-0 rounded-full border px-3 py-1 text-lg leading-none transition-colors ${
              active ? 'border-ink bg-ink text-paper' : 'border-line bg-white/60 text-ink hover:bg-white'
            }`}
            style={{ fontFamily: fontFamilyOf(f.id) }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
