import { z } from 'zod';
import type { Address } from './store';

export const addressSchema = z.object({
  name: z.string().trim().min(1, '이름을 적어주세요.').max(20, '이름은 20자 이내로 적어주세요.'),
  zonecode: z.string().regex(/^\d{5}$/, '우편번호 찾기로 주소를 골라주세요.'),
  address: z.string().trim().min(1, '우편번호 찾기로 주소를 골라주세요.'),
  detail: z.string().trim().min(1, '동·호수 같은 상세 주소를 적어주세요.').max(100, '상세 주소는 100자 이내로 적어주세요.'),
  phone: z
    .string()
    .trim()
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '휴대폰 번호 형식으로 적어주세요. 예: 010-1234-5678')
    .optional()
    .or(z.literal('')),
});

export type FieldErrors = Partial<Record<keyof Address, string>>;

export function validateAddress(a: Address): FieldErrors {
  const result = addressSchema.safeParse(a);
  if (result.success) return {};

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof Address;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
