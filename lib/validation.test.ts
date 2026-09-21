import { describe, it, expect } from 'vitest';
import { addressSchema, validateAddress } from './validation';

const ok = { name: '김하늘', zonecode: '06236', address: '서울 강남구 테헤란로 1', detail: '101동 101호' };

describe('addressSchema', () => {
  it('정상 통과, phone 없어도 됨', () => {
    expect(addressSchema.safeParse(ok).success).toBe(true);
  });

  it('우편번호 5자리 아니면 실패', () => {
    expect(addressSchema.safeParse({ ...ok, zonecode: '123' }).success).toBe(false);
  });

  it('상세주소 빈 값 실패', () => {
    expect(addressSchema.safeParse({ ...ok, detail: '' }).success).toBe(false);
  });

  it('phone 형식 검사, 빈 문자열은 허용', () => {
    expect(addressSchema.safeParse({ ...ok, phone: '010-1234-5678' }).success).toBe(true);
    expect(addressSchema.safeParse({ ...ok, phone: '01012345678' }).success).toBe(true);
    expect(addressSchema.safeParse({ ...ok, phone: '12' }).success).toBe(false);
    expect(addressSchema.safeParse({ ...ok, phone: '' }).success).toBe(true);
  });
});

describe('validateAddress', () => {
  it('필드별 에러 메시지를 돌려준다', () => {
    const errors = validateAddress({ name: '', zonecode: '', address: '', detail: '' });
    expect(errors.name).toBeTruthy();
    expect(errors.zonecode).toBeTruthy();
    expect(errors.detail).toBeTruthy();
    expect(validateAddress(ok)).toEqual({});
  });
});
