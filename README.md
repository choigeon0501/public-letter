# 손편지 MVP

웹에서 편지지를 고르고 편지를 쓰면, 실제 손글씨로 써서 우편으로 보내주는 서비스의 **UX Flow 검증용 MVP**입니다.
로그인·결제·DB·손글씨 로봇 연동은 없고, 4단계 화면 흐름만 동작합니다.

```
/  (랜딩)  →  /papers 편지지 선택  →  /write 편지 작성(+AI 초안)  →  /address 발송 정보  →  /complete 완료
```

기획 문서: `손편지_서비스_MVP_기획안.md` · 설계 스펙: `docs/superpowers/specs/2026-09-21-handletter-mvp-design.md`

## 실행

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 입력
npm run dev
```

| 스크립트 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` / `npm start` | 프로덕션 빌드·실행 |
| `npm test` | Vitest (로직 테스트) |
| `npm run lint` | ESLint |

## 환경 변수

| 이름 | 필수 | 설명 |
|---|---|---|
| `ANTHROPIC_API_KEY` | AI 초안 사용 시 | 없으면 AI 모달이 "설정되지 않았어요" 안내를 띄우고 나머지 흐름은 정상 동작 |
| `ANTHROPIC_MODEL` | 선택 | 기본 `claude-sonnet-5` |

## 구조

```
app/
  page.tsx                 랜딩
  papers/page.tsx          [1/4] 편지지 선택
  write/page.tsx           [2/4] 편지 작성
  address/page.tsx         [3/4] 발송 정보
  complete/page.tsx        [4/4] 완료
  api/ai/draft/route.ts    Claude 초안 생성 (POST, text/plain 스트리밍)
  fonts.ts                 next/font 손글씨 3종 로드
components/
  paper/LetterPaper.tsx    편지지 렌더러 (편집/읽기 공용, cqw 단위로 어떤 크기에서도 같은 비율)
  paper/papers.ts          편지지 8종 메타데이터 (textArea %, maxChars, lineHeight)
  paper/backgrounds/       편지지 배경 (인라인 SVG/CSS, 이미지 파일 없음)
  write/                   에디터, 글꼴 선택, AI 초안 모달
  address/                 주소 폼, Kakao 우편번호 팝업
  complete/                봉투 열림, 완료 화면
lib/
  store.ts                 Zustand + sessionStorage (LetterState = 이후 주문 API 요청 본문)
  claude.ts                프롬프트 빌더, Anthropic 스트림
  rate-limit.ts            IP별 분당 5회 (인메모리)
  validation.ts            주소 zod 스키마
  font-embed.ts            PNG 저장 시 필요한 폰트 조각만 인라인
  text.ts                  글자 수(코드포인트)
```

## 완료 시점 데이터

`/complete`에서 sessionStorage 키 `handletter-letter`에 아래 구조가 들어 있습니다. 이후 손글씨 출력 파이프라인(`/api/orders` 등)의 요청 본문이 됩니다.

```ts
type LetterState = {
  paperId: string; font: 'nanum-pen' | 'gaegu' | 'hi-melody';
  to: string; body: string; from: string;
  recipient: Address; sender: Address;
};
type Address = { name: string; zonecode: string; address: string; detail: string; phone?: string };
```

## 이번 MVP에서 제외

로그인/회원, 결제, 서버 저장, 주문 이력, 손글씨 로봇 연동, 사진 동봉, 봉투 선택, 우편 종류, AI 다듬기, 2장 이상 장문.
