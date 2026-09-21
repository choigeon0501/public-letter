import { Suspense } from 'react';
import SiteHeader from '@/components/SiteHeader';
import StepIndicator from '@/components/StepIndicator';
import LetterEditor from '@/components/write/LetterEditor';

/** 키 유무를 요청 시점에 읽도록 정적 프리렌더를 끈다(빌드 후 키를 넣어도 반영) */
export const dynamic = 'force-dynamic';

export default function WritePage() {
  /** 키가 없으면 AI 버튼이 모달 대신 준비 중 안내만 띄운다 */
  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <>
      <SiteHeader cta={false} />
      <StepIndicator current={2} />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto aspect-[148/210] w-full max-w-[520px] animate-pulse rounded bg-paper-deep" />}>
          <LetterEditor aiEnabled={aiEnabled} />
        </Suspense>
      </main>
    </>
  );
}
