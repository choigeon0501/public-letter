'use client';

import dynamic from 'next/dynamic';
import type { Address as KakaoAddress } from 'react-daum-postcode';

const KakaoPostcodeEmbed = dynamic(() => import('react-daum-postcode').then((m) => m.KakaoPostcodeEmbed), {
  ssr: false,
  loading: () => <div className="h-[400px] animate-pulse rounded-lg bg-paper-deep" />,
});

export type PostcodeResult = { zonecode: string; address: string };

/** 도로명 주소를 기본으로 쓰고 건물명이 있으면 괄호로 붙인다 */
export function formatKakaoAddress(data: KakaoAddress): PostcodeResult {
  const base = data.roadAddress || data.jibunAddress || data.address;
  const building = data.addressType === 'R' && data.buildingName ? ` (${data.buildingName})` : '';
  return { zonecode: data.zonecode, address: `${base}${building}` };
}

export default function PostcodeSearch({ onComplete }: { onComplete: (r: PostcodeResult) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <KakaoPostcodeEmbed onComplete={(data) => onComplete(formatKakaoAddress(data))} autoClose={false} style={{ width: '100%', height: 400 }} />
    </div>
  );
}
