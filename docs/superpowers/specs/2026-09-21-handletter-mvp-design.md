# 손편지 서비스 MVP — 설계 스펙

> 작성일: 2026-09-21
> 근거 문서: `손편지_서비스_MVP_기획안.md` v0.1 + 사용자 확인 사항(아래 §2)

## 1. 목표

편지지 선택 → 편지 작성(AI 초안 포함) → 발송 정보 입력 → 완료/확인의 UX Flow를 실제로 동작하는 화면으로 검증한다.
하드웨어 연동, 결제, 로그인, DB는 제외한다. 완료 시점의 `LetterState`가 이후 손글씨 출력 파이프라인의 입력 포맷이 된다.

## 2. 확정된 결정 (기획안 §6)

| # | 항목 | 결정 |
|---|---|---|
| 1 | 전화번호 | 수신자·발신자 모두 선택. 필드 아래 "등기·배송 문의용, 선택 입력" 안내 |
| 2 | maxChars | 편지지별 500~700 (`papers.ts` 상수). 줄노트·무지 700, 일러스트 큰 편지지 500 |
| 3 | To/From 위치 | 모든 편지지 동일. textArea 안에서 To는 첫 줄, From은 마지막 줄 우측 정렬 |
| 4 | AI 존댓말/반말 | 관계 칩 선택 시 자동 기본값 + 사용자가 토글로 변경 가능. API `tone` 필드로 전달 |
| 5 | 이미지로 저장 | 포함. `html-to-image`로 읽기 전용 편지지 PNG 저장 |
| 6 | 랜딩 분리 | `/` = 랜딩, `/papers` = 편지지 선택 |

관계 → 기본 톤: 부모·가족·손주/자녀(어른에게)·동료·기타 → 존댓말, 친구·연인 → 반말.

## 3. 라우트와 흐름

```
/  (랜딩)  →  /papers [1/4]  →  /write?paper={id} [2/4]  →  /address [3/4]  →  /complete [4/4]
```

| 경로 | 렌더링 | 내용 |
|---|---|---|
| `/` | 서버 정적 | 히어로 카피 + 이용 방법 3단계 + 편지지 미리보기 4장 + CTA "편지 쓰기" → `/papers` |
| `/papers` | 클라이언트 | 편지지 8종 그리드, 미리보기 패널(데스크톱 우측 고정 / 모바일 하단 시트), CTA "이 편지지로 쓰기" → `/write?paper=id` |
| `/write` | 클라이언트 | 편지지 위 To/본문/From 편집, 글꼴 3종, 글자 수 카운터, AI 초안 모달, CTA "작성 완료" → `/address`, "편지지 다시 고르기" → `/papers` |
| `/address` | 클라이언트 | 수신자/발신자 폼, Daum 우편번호 임베드, zod 검증, CTA "편지 보내기" → `/complete`, "이전" → `/write` |
| `/complete` | 클라이언트 | 완료 메시지, 봉투 → 편지 열림, 읽기 전용 편지지, 발송 정보 요약, "이미지로 저장", "새 편지 쓰기"(스토어 초기화 → `/papers`) |

- 스텝 인디케이터는 `/papers`~`/complete`에만 노출. 랜딩에는 없음.
- 가드: `/write`는 `paper` 쿼리 또는 스토어 `paperId`가 없으면 `/papers`로. `/address`는 `to`/`body`가 없으면 `/write`로. `/complete`는 `recipient.name`이 없으면 `/papers`로. 가드는 스토어 hydration 완료 후에만 판단한다.
- `/write?paper=id` 진입 시 스토어의 `paperId`를 갱신한다. 본문은 유지한다(편지지 바꿔도 글은 남는다).

## 4. 상태 모델

```ts
type Address = { name: string; zonecode: string; address: string; detail: string; phone?: string };

type LetterState = {
  paperId: string;   // 기본 'plain-cream'
  font: FontId;      // 'nanum-pen' | 'gaegu' | 'hi-melody'
  to: string;
  body: string;
  from: string;
  recipient: Address;
  sender: Address;
};
```

- Zustand 5 + `persist(createJSONStorage(() => sessionStorage))`, 키 `handletter-letter`.
- 스토어는 `hydrated: boolean`을 노출한다(`onRehydrateStorage`). 페이지 가드와 초기 렌더는 `hydrated`가 true일 때만 판단한다.
- 액션: `setPaper`, `setFont`, `setText({to,body,from})`, `setRecipient`, `setSender`, `reset`.
- `/address` 진입 시 `sender.name`이 비어 있으면 `from` 값을 기본값으로 채운다.

## 5. 편지지

```ts
type LetterPaper = {
  id: string;
  name: string;
  description: string;
  tags: string[];            // 카탈로그 카드 태그 (기본 / 가족·감사 / 연인 등)
  maxChars: number;
  lineHeight: number;        // 줄 간격(px). 줄노트는 배경 줄과 일치
  textArea: { top: number; left: number; width: number; height: number }; // %
  Background: React.ComponentType; // 인라인 SVG/CSS 배경
};
```

8종: `plain-cream`(700) · `lined-white`(700) · `kraft`(650) · `floral`(550) · `night-sky`(550) · `seaside`(600) · `season-autumn`(550) · `celebration`(500).

- 편지지 비율은 A5 세로(148:210) 고정. `LetterPaper` 컴포넌트는 `aspect-[148/210]` 컨테이너 안에 배경 레이어(absolute, z-0)와 텍스트 레이어(absolute, textArea 좌표, z-10)를 겹친다.
- 배경은 `html-to-image` 캡처를 위해 외부 이미지 파일 없이 인라인 SVG + CSS 그라데이션으로만 만든다.
- 텍스트 레이어는 To(1줄) / 본문(가변, `line-height: lineHeight`) / From(1줄, 우측 정렬)로 구성. 편집 모드에선 `<input>`·`<textarea>`(배경 투명, 테두리 없음), 읽기 모드에선 `<p>`/`<div>`로 같은 스타일을 쓴다.
- 글꼴은 `next/font/google` 3종(Nanum Pen Script, Gaegu, Hi Melody)을 CSS 변수로 로드하고, `LetterPaper` 루트에 `style={{ fontFamily: var(--font-...) }}`로 적용해 편집/읽기 모드가 동일하게 보이도록 한다.
- 글자 수는 `[...body].length`(코드포인트)로 세고, `textarea maxLength`는 두지 않는다(IME 조합 문제). 초과 시 카운터를 빨간색으로 바꾸고 "작성 완료"를 비활성화한다.

## 6. AI 초안

### 모달 입력
1. 누구에게 (텍스트, 최대 200자)
2. 관계 (칩: 친구 / 연인 / 가족 / 손주·자녀 / 부모 / 동료 / 기타 + 직접 입력)
3. 담고 싶은 내용 (여러 줄, 최대 200자)
4. 말투 토글 (존댓말 / 반말) — 관계 칩 선택 시 자동 설정, 이후 수동 변경 가능

### API — `POST /api/ai/draft`
- Request: `{ recipient, relationship, intent, tone: 'formal' | 'casual', maxChars }`. zod로 검증(각 문자열 ≤200자, maxChars 100~1000).
- Response: `text/plain; charset=utf-8` 스트리밍(chunked). 클라이언트는 `ReadableStream`을 읽어 모달에 점진 표시.
- 모델: `process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5'`. `max_tokens` 1024.
- 시스템 프롬프트: 기획안 §3.2 요지 + `{maxChars}자 이내` + `{tone}` 지시 + "본문만 출력, 호칭/서명 없음".
- 레이트리밋: 인메모리 `Map<ip, number[]>`(분당 5회). Vercel 인스턴스별로 초기화되는 것을 인지하고 MVP에서 감수.
- 키 없음(`ANTHROPIC_API_KEY` 미설정) → 503 + `{ error: 'AI 기능이 설정되지 않았습니다.' }`. 모달은 이 메시지를 그대로 노출.
- 결과 액션: "편지지에 넣기"(본문이 비어 있지 않으면 확인 후 덮어쓰기) / "다시 생성" / "닫기".

## 7. 주소 입력

- `react-daum-postcode`의 `DaumPostcodeEmbed`를 `next/dynamic({ ssr: false })`로 로드. "우편번호 찾기" 버튼 → 폼 아래 임베드 영역 펼침 → 선택 시 `zonecode`·`address` 채우고 접힘, 포커스는 상세 주소로.
- 기본 주소 입력은 `readOnly`.
- 검증(zod, `lib/validation.ts`): name 1~20자, zonecode 5자리 숫자, address 필수, detail 1~100자, phone 선택(입력 시 `01[0-9]-?\d{3,4}-?\d{4}`).
- 제출 시 전체 검증 → 실패 필드 아래 에러 메시지, 첫 에러 필드로 스크롤.

## 8. 완료 페이지

- 상단: "편지가 접수되었어요. 정성껏 손으로 써서 보내드릴게요." + "영업일 기준 2~3일 내 발송".
- `EnvelopeReveal`: 봉투(수신자 이름·주소 요약 표시) → 클릭 시 CSS 트랜지션으로 편지지가 위로 펼쳐짐. 자동 재생 없음, 클릭 1회.
- 편지: `LetterPaper` 읽기 모드. 발송 정보 요약 카드 2개(받는 사람 / 보내는 사람).
- "이미지로 저장": `toPng(letterRef.current, { pixelRatio: 2 })` → `<a download="letter.png">`. 실패 시 토스트 문구.
- "새 편지 쓰기": `reset()` 후 `/papers`.

## 9. 컴포넌트/파일 구조

```
app/
  layout.tsx                 # 폰트 변수, 메타데이터, 공통 셸
  page.tsx                   # 랜딩
  papers/page.tsx
  write/page.tsx             # <Suspense>로 useSearchParams 감싸기
  address/page.tsx
  complete/page.tsx
  api/ai/draft/route.ts
components/
  StepIndicator.tsx
  paper/LetterPaper.tsx      # 편집/읽기 공용 렌더러
  paper/PaperCard.tsx
  paper/backgrounds/*.tsx    # 편지지별 배경 컴포넌트 8개
  paper/papers.ts            # 메타데이터 + fonts 정의
  write/LetterEditor.tsx
  write/AiDraftModal.tsx
  write/FontPicker.tsx
  address/AddressForm.tsx
  address/PostcodeSearch.tsx
  complete/EnvelopeReveal.tsx
lib/
  store.ts
  fonts.ts                   # next/font/google 3종
  claude.ts                  # Anthropic 클라이언트 + 프롬프트 빌더
  rate-limit.ts
  validation.ts
  text.ts                    # countChars 등
```

## 10. 디자인 방향

- 참고: 이지온메일(카탈로그 카드 = 썸네일 + 이름 + 태그 + 한 줄 설명, 이용안내 번호형), 편지쓰다(글씨체 미리보기 카드, 히어로 카피 톤), LetterTo(완료 페이지의 단순 세로 구조).
- 팔레트: 따뜻한 크림 배경(`#faf6ef`), 잉크 텍스트(`#2b2622`), 포인트는 벽돌빛 레드(`#c4553d`). Tailwind v4 `@theme`에 토큰 정의.
- UI 본문 폰트는 Pretendard 대신 시스템 산세리프(로딩 최소화), 편지지 안에서만 손글씨 폰트.
- 모바일 우선. 편지지는 모바일에서 화면 폭 100%, 데스크톱에서 최대 520px.

## 11. 테스트

Vitest(jsdom). 로직만 테스트한다.
- `papers.ts`: 8종 id 고유, maxChars 500~700, textArea 좌표 0~100.
- `text.ts`: `countChars` 코드포인트 기준(이모지·한글).
- `validation.ts`: 주소 스키마 성공/실패 케이스, phone 선택.
- `store.ts`: 초기값, `reset`, `setPaper`가 본문을 지우지 않음.
- `claude.ts`: `buildPrompt`가 maxChars·tone을 포함.
- `rate-limit.ts`: 분당 N회 초과 시 거부, 시간 경과 후 허용.
- Daum 임베드, 스트리밍 UI, html-to-image는 수동 확인.

## 12. 환경 변수

`.env.example`:
```
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5
```

## 13. 제외 (기획안 §5.2 그대로)

로그인/결제/DB, 하드웨어 연동, 사진 동봉, 봉투 선택, 우편 종류, AI 다듬기, 2장 이상 장문.
