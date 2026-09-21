import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LetterPaper from './LetterPaper';

describe('LetterPaper', () => {
  it('읽기 모드에서 to/body/from을 보여준다', () => {
    render(
      <LetterPaper paperId="plain-cream" font="nanum-pen" to="할머니께" body="안녕하세요" from="민수 올림" mode="read" />,
    );
    expect(screen.getByText('할머니께')).toBeTruthy();
    expect(screen.getByText('안녕하세요')).toBeTruthy();
    expect(screen.getByText('민수 올림')).toBeTruthy();
  });

  it('편집 모드에서 To/본문/From 입력이 있다', () => {
    render(<LetterPaper paperId="lined-white" font="gaegu" to="" body="" from="" mode="edit" onChange={() => {}} />);
    expect(screen.getByRole('textbox', { name: '받는 사람' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: '본문' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: '보내는 사람' })).toBeTruthy();
  });
});
