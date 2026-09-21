import SiteHeader from '@/components/SiteHeader';
import StepIndicator from '@/components/StepIndicator';
import AddressForm from '@/components/address/AddressForm';

export default function AddressPage() {
  return (
    <>
      <SiteHeader cta={false} />
      <StepIndicator current={3} />
      <main className="flex-1">
        <AddressForm />
      </main>
    </>
  );
}
