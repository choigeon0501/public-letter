'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLetterStore, type Address } from '@/lib/store';
import { validateAddress, type FieldErrors } from '@/lib/validation';
import AddressFields from './AddressFields';

/** 스토어 복원이 끝난 뒤에만 마운트되어 초기값을 한 번에 잡는다 */
function AddressFormInner() {
  const router = useRouter();
  const { from, recipient, sender, setRecipient, setSender } = useLetterStore();
  const [rec, setRec] = useState<Address>(recipient);
  const [snd, setSnd] = useState<Address>(() => ({ ...sender, name: sender.name || from }));
  const [recErrors, setRecErrors] = useState<FieldErrors>({});
  const [sndErrors, setSndErrors] = useState<FieldErrors>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const re = validateAddress(rec);
    const se = validateAddress(snd);
    setRecErrors(re);
    setSndErrors(se);
    if (Object.keys(re).length || Object.keys(se).length) {
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setRecipient(rec);
    setSender(snd);
    router.push('/complete');
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto w-full max-w-2xl px-4 pb-32 sm:px-6 lg:pb-16">
      <div className="py-4">
        <h1 className="text-2xl font-semibold">어디로 보낼까요?</h1>
        <p className="mt-1 text-ink-soft">봉투에 그대로 적히는 주소예요. 우편번호 찾기로 정확하게 골라주세요.</p>
      </div>
      <div className="flex flex-col gap-6">
        <AddressFields title="받는 사람" value={rec} errors={recErrors} onChange={setRec} />
        <AddressFields title="보내는 사람" hint="반송될 때 돌아올 주소예요." value={snd} errors={sndErrors} onChange={setSnd} />
      </div>

      <div className="mt-8 hidden items-center justify-between lg:flex">
        <Link href="/write" className="btn-ghost">
          이전
        </Link>
        <button type="submit" className="btn-primary">
          편지 보내기
        </button>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link href="/write" className="btn-ghost">
            이전
          </Link>
          <button type="submit" className="btn-primary flex-1">
            편지 보내기
          </button>
        </div>
      </div>
    </form>
  );
}

export default function AddressForm() {
  const router = useRouter();
  const { hydrated, to, body } = useLetterStore();
  const ready = hydrated && to.trim().length > 0 && body.trim().length > 0;

  useEffect(() => {
    if (hydrated && !ready) router.replace('/write');
  }, [hydrated, ready, router]);

  if (!ready) {
    return <div className="mx-auto h-96 w-full max-w-2xl animate-pulse rounded-2xl bg-paper-deep" />;
  }
  return <AddressFormInner />;
}
