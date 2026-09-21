/** 글자 수는 코드포인트 기준(이모지·한글 조합형도 1자) */
export function countChars(s: string): number {
  return [...s].length;
}
