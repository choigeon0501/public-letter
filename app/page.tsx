import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import LetterPaper from '@/components/paper/LetterPaper';
import { papers } from '@/components/paper/papers';
import { SAMPLE_LETTER } from '@/components/paper/sample';

const STEPS = [
  { title: '편지지를 고르고', desc: '여덟 가지 편지지 중 마음에 드는 것을 고릅니다.' },
  { title: '편지를 쓰고', desc: '편지지 위에 바로 씁니다. 막히면 AI가 초안을 잡아드려요.' },
  { title: '주소를 적으면 끝', desc: '받는 분과 보내는 분 주소만 적으면, 저희가 손으로 옮겨 써서 우체국으로 갑니다.' },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <section className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h1 className="text-[44px] leading-[1.15] text-ink sm:text-[60px]" style={{ fontFamily: 'var(--font-hand)' }}>
              화면에 쓰면,
              <br />
              손글씨로 옮겨 써서
              <br />
              우편으로 보내드려요.
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
              타이핑한 편지를 사람이 종이에 손으로 다시 씁니다. 받는 분은 화면이 아니라 우편함에서 편지를 만나요.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/papers" className="btn-primary">
                편지지 고르기
              </Link>
              <span className="text-sm text-ink-soft">로그인 없이 바로 시작</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="absolute -bottom-6 left-1/2 h-40 w-[110%] -translate-x-1/2 rounded-md bg-kraft shadow-[0_18px_40px_-20px_rgba(30,42,58,0.5)]" aria-hidden />
            <div className="relative rotate-[-2deg]">
              <LetterPaper paperId="floral" font="nanum-pen" mode="read" {...SAMPLE_LETTER} />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <h2 className="text-2xl font-semibold">세 단계면 됩니다</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative border-t-2 border-ink pt-4">
                <span className="text-sm text-ink-soft">{i + 1}단계</span>
                <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">편지지 미리보기</h2>
            <Link href="/papers" className="text-sm font-medium text-postal hover:underline">
              여덟 가지 모두 보기
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {papers.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link href={`/write?paper=${p.id}`} className="group block">
                  <LetterPaper paperId={p.id} font="nanum-pen" mode="read" {...SAMPLE_LETTER} className="transition-transform group-hover:-translate-y-1" />
                  <p className="mt-3 font-medium">{p.name}</p>
                  <p className="text-sm text-ink-soft">{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-ink-soft">
        손편지 · 화면에서 쓰고, 종이로 받는 편지
      </footer>
    </>
  );
}
