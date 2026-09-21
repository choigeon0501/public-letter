import SiteHeader from '@/components/SiteHeader';
import StepIndicator from '@/components/StepIndicator';
import PaperPicker from '@/components/paper/PaperPicker';

export default function PapersPage() {
  return (
    <>
      <SiteHeader cta={false} />
      <StepIndicator current={1} />
      <main className="flex-1">
        <PaperPicker />
      </main>
    </>
  );
}
