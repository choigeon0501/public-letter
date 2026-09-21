import { Nanum_Pen_Script, Gaegu, Hi_Melody } from 'next/font/google';

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

export const fontVariableClass = [nanumPen.variable, gaegu.variable, hiMelody.variable].join(' ');
