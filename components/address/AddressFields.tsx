'use client';

import { useId } from 'react';
import type { Address } from '@/lib/store';
import type { FieldErrors } from '@/lib/validation';
import { usePostcodePopup } from './PostcodeSearch';

type Props = {
  title: string;
  hint?: string;
  value: Address;
  errors: FieldErrors;
  onChange: (next: Address) => void;
};

export default function AddressFields({ title, hint, value, errors, onChange }: Props) {
  const id = useId();
  const set = (patch: Partial<Address>) => onChange({ ...value, ...patch });
  const openPostcode = usePostcodePopup((r) => {
    set(r);
    document.getElementById(`${id}-detail`)?.focus();
  });
  const fieldClass = (key: keyof Address) => `field ${errors[key] ? 'field-error' : ''}`;
  const errorText = (key: keyof Address) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="mt-1 text-sm text-stamp">
        {errors[key]}
      </p>
    ) : null;

  return (
    <fieldset className="rounded-2xl border border-line bg-white/50 p-4 sm:p-6">
      <legend className="px-1 text-lg font-semibold">{title}</legend>
      {hint && <p className="mb-4 text-sm text-ink-soft">{hint}</p>}
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-medium">
            이름
          </label>
          <input
            id={`${id}-name`}
            className={`${fieldClass('name')} mt-1.5`}
            value={value.name}
            onChange={(e) => set({ name: e.target.value })}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            autoComplete="name"
          />
          {errorText('name')}
        </div>

        <div>
          <label htmlFor={`${id}-zonecode`} className="text-sm font-medium">
            주소
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id={`${id}-zonecode`}
              className={`${fieldClass('zonecode')} w-28 flex-none`}
              value={value.zonecode}
              readOnly
              placeholder="우편번호"
              aria-invalid={!!errors.zonecode}
              aria-describedby={errors.zonecode ? `${id}-zonecode-error` : undefined}
            />
            <button type="button" onClick={() => openPostcode()} className="btn-secondary px-4 py-2 text-sm">
              우편번호 찾기
            </button>
          </div>
          <input
            className={`${fieldClass('address')} mt-2`}
            value={value.address}
            readOnly
            placeholder="우편번호 찾기로 주소를 골라주세요"
            aria-label="기본 주소"
            aria-invalid={!!errors.address}
          />
          {errorText('zonecode') ?? errorText('address')}
          <input
            id={`${id}-detail`}
            className={`${fieldClass('detail')} mt-2`}
            value={value.detail}
            onChange={(e) => set({ detail: e.target.value })}
            placeholder="상세 주소 (동·호수 등)"
            aria-label="상세 주소"
            aria-invalid={!!errors.detail}
            aria-describedby={errors.detail ? `${id}-detail-error` : undefined}
          />
          {errorText('detail')}
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className="text-sm font-medium">
            전화번호 <span className="font-normal text-ink-soft">(선택)</span>
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            className={`${fieldClass('phone')} mt-1.5`}
            value={value.phone ?? ''}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="010-0000-0000"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            autoComplete="tel"
          />
          {errorText('phone')}
          <p className="mt-1 text-xs text-ink-soft">배송 문의가 있을 때만 연락드려요. 적지 않아도 발송됩니다.</p>
        </div>
      </div>
    </fieldset>
  );
}
