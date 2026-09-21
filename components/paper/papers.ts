import type { ComponentType } from 'react';
import PlainCream from './backgrounds/PlainCream';
import LinedWhite from './backgrounds/LinedWhite';
import Kraft from './backgrounds/Kraft';
import Floral from './backgrounds/Floral';
import NightSky from './backgrounds/NightSky';
import Seaside from './backgrounds/Seaside';
import SeasonAutumn from './backgrounds/SeasonAutumn';
import Celebration from './backgrounds/Celebration';

export type TextArea = { top: number; left: number; width: number; height: number };

export type LetterPaper = {
  id: string;
  name: string;
  description: string;
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
    name: '축하',
    description: '컨페티가 흩날리는 밝은 편지지. 생일과 축하에.',
    tags: ['생일', '축하'],
    maxChars: 500,
    lineHeight: 6.6,
    textArea: { top: 16, left: 10, width: 80, height: 70 },
    Background: Celebration,
  },
];

export function getPaper(id: string | null | undefined): LetterPaper {
  return papers.find((p) => p.id === id) ?? papers.find((p) => p.id === DEFAULT_PAPER_ID)!;
}
