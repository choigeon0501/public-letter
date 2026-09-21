import Link from 'next/link';

export default function SiteHeader({ cta = true }: { cta?: boolean }) {
  return (
    <header>
      <div className="airmail-stripe" aria-hidden />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-3xl leading-none text-ink" style={{ fontFamily: 'var(--font-hand)' }}>
          손편지
        </Link>
        {cta && (
          <Link href="/papers" className="text-sm font-medium text-postal hover:underline">
            편지 쓰기
          </Link>
        )}
      </div>
    </header>
  );
}
