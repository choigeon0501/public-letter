export type FontId = 'nanum-pen' | 'gaegu' | 'hi-melody';

export const fontOptions: { id: FontId; label: string }[] = [
  { id: 'nanum-pen', label: '나눔 펜' },
  { id: 'gaegu', label: '개구' },
  { id: 'hi-melody', label: '하이멜로디' },
];

/** CSS 변수 이름은 app/fonts.ts에서 next/font가 만드는 것과 일치해야 한다 */
export function fontFamilyOf(id: FontId): string {
  return `var(--font-${id})`;
}
