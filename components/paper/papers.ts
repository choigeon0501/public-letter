import type { ComponentType } from 'react';
import PlainCream from './backgrounds/PlainCream';
import LinedWhite from './backgrounds/LinedWhite';
import Kraft from './backgrounds/Kraft';
import Floral from './backgrounds/Floral';
import NightSky from './backgrounds/NightSky';
import Seaside from './backgrounds/Seaside';
import SeasonAutumn from './backgrounds/SeasonAutumn';
import Celebration from './backgrounds/Celebration';
import CherryBlossom from './backgrounds/CherryBlossom';
import Hanji from './backgrounds/Hanji';
import ForestGreen from './backgrounds/ForestGreen';
import SkyBlue from './backgrounds/SkyBlue';
import Lavender from './backgrounds/Lavender';
import BlushPink from './backgrounds/BlushPink';
import VintageKraft from './backgrounds/VintageKraft';
import Grid from './backgrounds/Grid';
import Dotted from './backgrounds/Dotted';
import Camping from './backgrounds/Camping';
import HarvestMoon from './backgrounds/HarvestMoon';
import Winter from './backgrounds/Winter';

export type TextArea = { top: number; left: number; width: number; height: number };

export type PaperCategory = '기본' | '계절' | '감성' | '축하';

export const PAPER_CATEGORIES: PaperCategory[] = ['기본', '계절', '감성', '축하'];

export type LetterPaper = {
  id: string;
  name: string;
  description: string;
  /** 카탈로그 필터용 */
  category: PaperCategory;
  tags: string[];
  maxChars: number;
  /** 줄 간격. 편지지 폭 기준 cqw 단위라 크기가 바뀌어도 배경 줄과 글이 함께 움직인다 */
  lineHeight: number;
  /** 본문 뒤에 가로줄을 그릴지 */
  lined?: boolean;
  /** 글자 색. 어두운 편지지에서 대비 확보용 */
  inkColor?: string;
  textArea: TextArea;
  Background: ComponentType;
};

export const DEFAULT_PAPER_ID = 'plain-cream';

const STANDARD_AREA: TextArea = { top: 10, left: 10, width: 80, height: 80 };

export const papers: LetterPaper[] = [
  {
    id: 'plain-cream',
    category: '기본',
    name: '크림 무지',
    description: '담백한 기본형. 어떤 이야기든 잘 어울려요.',
    tags: ['기본'],
    maxChars: 700,
    lineHeight: 6.6,
    textArea: STANDARD_AREA,
    Background: PlainCream,
  },
  {
    id: 'lined-white',
    category: '기본',
    name: '화이트 줄노트',
    description: '줄이 있는 클래식 편지지. 손글씨가 가장 또렷해요.',
    tags: ['기본', '클래식'],
    maxChars: 700,
    lineHeight: 6.6,
    lined: true,
    textArea: { top: 10, left: 14, width: 78, height: 80 },
    Background: LinedWhite,
  },
  {
    id: 'kraft',
    category: '기본',
    name: '크라프트',
    description: '갈색 종이 질감. 소박하고 정겨운 느낌.',
    tags: ['기본', '빈티지'],
    maxChars: 650,
    lineHeight: 6.6,
    inkColor: '#3d2a1a',
    textArea: STANDARD_AREA,
    Background: Kraft,
  },
  {
    id: 'floral',
    category: '감성',
    name: '들꽃',
    description: '은은한 들꽃 일러스트. 가족과 감사의 마음에.',
    tags: ['가족', '감사'],
    maxChars: 550,
    lineHeight: 6.6,
    textArea: { top: 16, left: 12, width: 76, height: 68 },
    Background: Floral,
  },
  {
    id: 'night-sky',
    category: '감성',
    name: '밤하늘',
    description: '남색 테두리와 별. 연인에게, 그리운 사람에게.',
    tags: ['연인', '그리움'],
    maxChars: 550,
    lineHeight: 6.6,
    textArea: { top: 13, left: 15, width: 70, height: 74 },
    Background: NightSky,
  },
  {
    id: 'seaside',
    category: '감성',
    name: '바닷가',
    description: '파란 수채 물결. 안부를 전할 때.',
    tags: ['안부'],
    maxChars: 600,
    lineHeight: 6.6,
    textArea: { top: 12, left: 10, width: 80, height: 72 },
    Background: Seaside,
  },
  {
    id: 'season-autumn',
    category: '계절',
    name: '가을',
    description: '낙엽과 따뜻한 톤. 계절 인사를 담아.',
    tags: ['시즌'],
    maxChars: 550,
    lineHeight: 6.6,
    textArea: { top: 16, left: 10, width: 80, height: 70 },
    Background: SeasonAutumn,
  },
  {
    id: 'celebration',
    category: '축하',
    name: '축하',
    description: '컨페티가 흩날리는 밝은 편지지. 생일과 축하에.',
    tags: ['생일', '축하'],
    maxChars: 500,
    lineHeight: 6.6,
    textArea: { top: 16, left: 10, width: 80, height: 70 },
    Background: Celebration,
  },
  {
    id: 'grid',
    name: '모눈',
    category: '기본',
    description: '연한 격자. 글씨 크기를 고르게 쓰고 싶을 때.',
    tags: ['기본', '노트'],
    maxChars: 700,
    lineHeight: 6.6,
    textArea: STANDARD_AREA,
    Background: Grid,
  },
  {
    id: 'dotted',
    name: '도트',
    category: '기본',
    description: '점이 찍힌 노트. 담백하지만 심심하지 않게.',
    tags: ['기본', '노트'],
    maxChars: 700,
    lineHeight: 6.6,
    textArea: STANDARD_AREA,
    Background: Dotted,
  },
  {
    id: 'sky-blue',
    name: '연하늘',
    category: '기본',
    description: '맑은 하늘색 무지. 가볍게 안부를 전할 때.',
    tags: ['파스텔', '안부'],
    maxChars: 700,
    lineHeight: 6.6,
    textArea: STANDARD_AREA,
    Background: SkyBlue,
  },
  {
    id: 'blush-pink',
    name: '연분홍',
    category: '기본',
    description: '은은한 분홍 무지. 다정한 말을 담기에.',
    tags: ['파스텔', '연인'],
    maxChars: 700,
    lineHeight: 6.6,
    textArea: STANDARD_AREA,
    Background: BlushPink,
  },
  {
    id: 'hanji',
    name: '한지',
    category: '감성',
    description: '닥종이 결과 먹선 테두리. 어른께 올리는 편지에.',
    tags: ['전통', '어른께'],
    maxChars: 600,
    lineHeight: 6.6,
    inkColor: '#2f2620',
    textArea: { top: 10, left: 12, width: 76, height: 78 },
    Background: Hanji,
  },
  {
    id: 'vintage-kraft',
    name: '빈티지 크라프트',
    category: '감성',
    description: '우표와 소인이 찍힌 오래된 봉투 느낌.',
    tags: ['빈티지', '회상'],
    maxChars: 550,
    lineHeight: 6.6,
    inkColor: '#3d2a1a',
    textArea: { top: 20, left: 10, width: 80, height: 68 },
    Background: VintageKraft,
  },
  {
    id: 'lavender',
    name: '라벤더',
    category: '감성',
    description: '보랏빛 라벤더 가지. 로맨틱한 고백에.',
    tags: ['로맨틱', '연인'],
    maxChars: 600,
    lineHeight: 6.6,
    textArea: { top: 12, left: 12, width: 76, height: 74 },
    Background: Lavender,
  },
  {
    id: 'forest-green',
    name: '숲속',
    category: '감성',
    description: '초록 잎이 드리운 숲. 차분하게 마음을 전할 때.',
    tags: ['자연', '위로'],
    maxChars: 600,
    lineHeight: 6.6,
    textArea: { top: 14, left: 12, width: 76, height: 72 },
    Background: ForestGreen,
  },
  {
    id: 'camping',
    name: '캠핑',
    category: '감성',
    description: '산과 텐트, 모닥불. 함께한 여행을 떠올리며.',
    tags: ['여행', '친구'],
    maxChars: 550,
    lineHeight: 6.6,
    textArea: { top: 12, left: 10, width: 80, height: 66 },
    Background: Camping,
  },
  {
    id: 'cherry-blossom',
    name: '벚꽃',
    category: '계절',
    description: '흩날리는 벚꽃잎. 봄 인사와 설렘에.',
    tags: ['봄', '연인'],
    maxChars: 550,
    lineHeight: 6.6,
    textArea: { top: 16, left: 12, width: 76, height: 68 },
    Background: CherryBlossom,
  },
  {
    id: 'harvest-moon',
    name: '한가위',
    category: '계절',
    description: '보름달과 억새. 명절 안부를 담아.',
    tags: ['명절', '가족'],
    maxChars: 500,
    lineHeight: 6.6,
    textArea: { top: 23, left: 15, width: 70, height: 64 },
    Background: HarvestMoon,
  },
  {
    id: 'winter',
    name: '겨울',
    category: '계절',
    description: '눈송이와 작은 트리. 연말 인사와 크리스마스에.',
    tags: ['겨울', '크리스마스'],
    maxChars: 500,
    lineHeight: 6.6,
    textArea: { top: 12, left: 14, width: 72, height: 66 },
    Background: Winter,
  },
];

export function getPaper(id: string | null | undefined): LetterPaper {
  return papers.find((p) => p.id === id) ?? papers.find((p) => p.id === DEFAULT_PAPER_ID)!;
}
