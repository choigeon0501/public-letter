/**
 * 펜 플로터가 편지지에 글을 쓰는 장면. 외부 이미지·영상 없이 SVG + CSS 애니메이션.
 * 캐리지(펜)가 한 줄씩 지나가면 같은 타이밍으로 글줄이 그려진다. 12초 주기.
 */
const LINES = [
  'M0 0 c6 -4 10 4 16 0 s10 4 16 0 s10 4 16 0 s10 4 16 0 s10 4 16 0 s10 4 16 0 s10 4 16 0',
  'M0 0 c5 -3 9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s6 3 10 0',
  'M0 0 c6 -4 10 4 16 0 s10 4 16 0 s10 4 16 0 s10 4 16 0 s10 4 16 0 s10 4 16 0',
  'M0 0 c5 -3 9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0 s9 3 14 0',
];
const LINE_Y = [48, 66, 84, 102];

export default function HandwritingRobot() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 320 240" className="h-auto w-full" role="img" aria-label="손글씨 기계가 편지지에 글을 쓰는 모습">
        <style>{`
          .hr-rail { animation: hr-rail 12s linear infinite; }
          .hr-carriage { animation: hr-carriage 12s linear infinite; }
          .hr-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hr-draw 12s linear infinite; }
          .hr-line:nth-child(1) { animation-delay: 0s; }
          .hr-line:nth-child(2) { animation-delay: 3s; }
          .hr-line:nth-child(3) { animation-delay: 6s; }
          .hr-line:nth-child(4) { animation-delay: 9s; }
          @keyframes hr-rail {
            0%, 21% { transform: translateY(0px); }
            25%, 46% { transform: translateY(18px); }
            50%, 71% { transform: translateY(36px); }
            75%, 96% { transform: translateY(54px); }
            100% { transform: translateY(0px); }
          }
          @keyframes hr-carriage {
            0%   { transform: translate(0px, 0px); }
            21%  { transform: translate(112px, 0px); }
            25%  { transform: translate(0px, 18px); }
            46%  { transform: translate(108px, 18px); }
            50%  { transform: translate(0px, 36px); }
            71%  { transform: translate(96px, 36px); }
            75%  { transform: translate(0px, 54px); }
            96%  { transform: translate(118px, 54px); }
            100% { transform: translate(0px, 0px); }
          }
          @keyframes hr-draw {
            0%   { stroke-dashoffset: 1; }
            21%  { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .hr-rail { animation: none; transform: translateY(54px); }
            .hr-carriage { animation: none; transform: translate(118px, 54px); }
            .hr-line { animation: none; stroke-dashoffset: 0; }
          }
        `}</style>

        {/* 받침판 */}
        <rect x="16" y="40" width="288" height="176" rx="6" fill="#3a4050" />
        <rect x="24" y="48" width="272" height="160" rx="3" fill="#2c3140" />
        {/* 편지지 */}
        <g transform="translate(60 56)">
          <rect x="0" y="0" width="200" height="144" rx="2" fill="#fbf8f1" />
          <rect x="0" y="0" width="200" height="144" rx="2" fill="none" stroke="#e5ded0" strokeWidth="0.8" />
          <text x="26" y="34" fontSize="10" fill="#1e2a3a" style={{ fontFamily: 'var(--font-hand)' }}>
            사랑하는 할머니께
          </text>
          <g stroke="#1e2a3a" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {LINES.map((d, i) => (
              <path key={d} className="hr-line" d={d} pathLength={1} transform={`translate(26 ${LINE_Y[i]})`} />
            ))}
          </g>
          <text x="128" y="124" fontSize="9" fill="#1e2a3a" style={{ fontFamily: 'var(--font-hand)' }}>
            손주 민수 올림
          </text>
        </g>

        {/* 세로 레일 두 개 + 가로 레일(갠트리) */}
        <rect x="30" y="52" width="6" height="152" rx="3" fill="#8a94a8" />
        <rect x="284" y="52" width="6" height="152" rx="3" fill="#8a94a8" />
        <g className="hr-rail" style={{ transformOrigin: '0 0' }}>
          <rect x="28" y="71" width="264" height="8" rx="4" fill="#c9d0dc" />
          <rect x="28" y="73" width="264" height="2" fill="#aab3c2" />
        </g>
        {/* 캐리지와 펜: 펜촉(86,104)이 첫 글줄 시작점과 맞닿는다 */}
        <g className="hr-carriage" style={{ transformOrigin: '0 0' }}>
          <g transform="translate(74 0)">
            <rect x="0" y="63" width="24" height="24" rx="4" fill="#e9edf3" stroke="#aab3c2" strokeWidth="1" />
            <rect x="9" y="85" width="6" height="14" rx="1" fill="#1e2a3a" />
            <path d="M9 99 l3 5 l3 -5z" fill="#c8362b" />
            <circle cx="12" cy="71" r="3" fill="#c8362b" />
          </g>
        </g>
      </svg>
    </div>
  );
}
