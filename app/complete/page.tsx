import SiteHeader from '@/components/SiteHeader';
import StepIndicator from '@/components/StepIndicator';
import CompleteView from '@/components/complete/CompleteView';

export default function CompletePage() {
  return (
    <>
      <SiteHeader cta={false} />
      <StepIndicator current={4} />
      <main className="flex-1">
        <CompleteView />
      </main>
    </>
  );
}
