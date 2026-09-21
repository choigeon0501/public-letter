import { Nanum_Pen_Script, Gaegu, Hi_Melody } from 'next/font/google';

export type FontId = 'nanum-pen' | 'gaegu' | 'hi-melody';

const nanumPen = Nanum_Pen_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-nanum-pen',
  display: 'swap',
});
const gaegu = Gaegu({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-gaegu',
  display: 'swap',
});
const hiMelody = Hi_Melody({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hi-melody',
  display: 'swap',
});

export const fonts: { id: FontId; label: string; className: string; variable: string }[] = [
  { id: 'nanum-pen', label: '나눔 펜', className: nanumPen.className, variable: nanumPen.variable },
  { id: 'gaegu', label: '개구', className: gaegu.className, variable: gaegu.variable },
  { id: 'hi-melody', label: '하이멜로디', className: hiMelody.className, variable: hiMelody.variable },
];

export const fontVariableClass = fonts.map((f) => f.variable).join(' ');

export function fontFamilyOf(id: FontId): string {
  return `var(--font-${id})`;
}
