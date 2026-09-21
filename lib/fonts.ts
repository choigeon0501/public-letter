export type FontId =
  | 'nanum-pen'
  | 'gaegu'
  | 'hi-melody'
  | 'nanum-brush'
  | 'gamja-flower'
  | 'poor-story'
  | 'kirang-haerang'
  | 'single-day'
  | 'gowun-batang'
  | 'nanum-myeongjo';

export type FontOption = { id: FontId; label: string; kind: '손글씨' | '정자체' };

export const fontOptions: FontOption[] = [
  { id: 'nanum-pen', label: '나눔 펜', kind: '손글씨' },
  { id: 'gaegu', label: '개구', kind: '손글씨' },
  { id: 'hi-melody', label: '하이멜로디', kind: '손글씨' },
  { id: 'nanum-brush', label: '나눔 붓', kind: '손글씨' },
  { id: 'gamja-flower', label: '감자꽃', kind: '손글씨' },
  { id: 'poor-story', label: '푸어스토리', kind: '손글씨' },
  { id: 'kirang-haerang', label: '키랑해랑', kind: '손글씨' },
  { id: 'single-day', label: '싱글데이', kind: '손글씨' },
  { id: 'gowun-batang', label: '고운바탕', kind: '정자체' },
  { id: 'nanum-myeongjo', label: '나눔명조', kind: '정자체' },
];

export const DEFAULT_FONT_ID: FontId = 'nanum-pen';

export function isFontId(v: unknown): v is FontId {
  return fontOptions.some((f) => f.id === v);
}

/** CSS 변수 이름은 app/fonts.ts에서 next/font가 만드는 것과 일치해야 한다 */
export function fontFamilyOf(id: FontId): string {
  return `var(--font-${id})`;
}
