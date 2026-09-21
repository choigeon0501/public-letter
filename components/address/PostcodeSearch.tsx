'use client';

import { useKakaoPostcodePopup, type Address as KakaoAddress } from 'react-daum-postcode';

export type PostcodeResult = { zonecode: string; address: string };

/** 도로명 주소를 기본으로 쓰고 건물명이 있으면 괄호로 붙인다 */
export function formatKakaoAddress(data: KakaoAddress): PostcodeResult {
  const base = data.roadAddress || data.jibunAddress || data.address;
  const building = data.addressType === 'R' && data.buildingName ? ` (${data.buildingName})` : '';
  return { zonecode: data.zonecode, address: `${base}${building}` };
}

/** 우편번호 검색을 별도 팝업 창으로 연다. 같은 popupKey를 써서 창이 여러 개 뜨지 않게 한다 */
export function usePostcodePopup(onComplete: (r: PostcodeResult) => void) {
  const open = useKakaoPostcodePopup();
  return () =>
    open({
      popupKey: 'handletter-postcode',
      popupTitle: '우편번호 찾기',
      onComplete: (data) => onComplete(formatKakaoAddress(data)),
    });
}
