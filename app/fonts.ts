import {
  Nanum_Pen_Script,
  Gaegu,
  Hi_Melody,
  Nanum_Brush_Script,
  Gamja_Flower,
  Poor_Story,
  Kirang_Haerang,
  Single_Day,
  Gowun_Batang,
  Nanum_Myeongjo,
} from 'next/font/google';

/** 한글 글리프는 unicode-range 조각으로 쓰일 때만 내려받으므로 10종을 등록해도 초기 로드는 CSS뿐이다 */
const nanumPen = Nanum_Pen_Script({ weight: '400', subsets: ['latin'], variable: '--font-nanum-pen', display: 'swap' });
const gaegu = Gaegu({ weight: '400', subsets: ['latin'], variable: '--font-gaegu', display: 'swap' });
const hiMelody = Hi_Melody({ weight: '400', subsets: ['latin'], variable: '--font-hi-melody', display: 'swap' });
const nanumBrush = Nanum_Brush_Script({ weight: '400', subsets: ['latin'], variable: '--font-nanum-brush', display: 'swap' });
const gamjaFlower = Gamja_Flower({ weight: '400', subsets: ['latin'], variable: '--font-gamja-flower', display: 'swap' });
const poorStory = Poor_Story({ weight: '400', subsets: ['latin'], variable: '--font-poor-story', display: 'swap' });
const kirangHaerang = Kirang_Haerang({ weight: '400', subsets: ['latin'], variable: '--font-kirang-haerang', display: 'swap' });
const singleDay = Single_Day({ weight: '400', variable: '--font-single-day', display: 'swap' });
const gowunBatang = Gowun_Batang({ weight: '400', subsets: ['latin'], variable: '--font-gowun-batang', display: 'swap' });
const nanumMyeongjo = Nanum_Myeongjo({ weight: '400', subsets: ['latin'], variable: '--font-nanum-myeongjo', display: 'swap' });

export const fontVariableClass = [
  nanumPen,
  gaegu,
  hiMelody,
  nanumBrush,
  gamjaFlower,
  poorStory,
  kirangHaerang,
  singleDay,
  gowunBatang,
  nanumMyeongjo,
]
  .map((f) => f.variable)
  .join(' ');
