import { Suspense } from 'react';
import SiteHeader from '@/components/SiteHeader';
import StepIndicator from '@/components/StepIndicator';
import LetterEditor from '@/components/write/LetterEditor';

export default function WritePage() {
  return (
    <>
      <SiteHeader cta={false} />
      <StepIndicator current={2} />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto aspect-[148/210] w-full max-w-[520px] animate-pulse rounded bg-paper-deep" />}>
          <LetterEditor />
        </Suspense>
      </main>
    </>
  );
}
