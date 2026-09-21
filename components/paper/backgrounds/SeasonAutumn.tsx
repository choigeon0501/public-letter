function Leaf({ x, y, r, s, fill }: { x: number; y: number; r: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 -6 c4 0 6 4 6 6 c0 2 -2 6 -6 6 c-4 0 -6 -4 -6 -6 c0 -2 2 -6 6 -6z" fill={fill} />
      <path d="M0 -5 v10" stroke="#8a4b2a" strokeWidth="0.5" opacity="0.6" />
    </g>
  );
}

export default function SeasonAutumn() {
  return (
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg, #fbf3e6 0%, #f8ecd9 100%)' }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <Leaf x={128} y={14} r={25} s={1.1} fill="#d9782d" />
        <Leaf x={140} y={30} r={-15} s={0.8} fill="#c9553a" />
        <Leaf x={116} y={30} r={60} s={0.6} fill="#e5a34a" />
        <Leaf x={12} y={192} r={-30} s={1.0} fill="#c9553a" />
        <Leaf x={26} y={202} r={20} s={0.7} fill="#d9782d" />
        <Leaf x={8} y={176} r={70} s={0.55} fill="#e5a34a" />
        <g stroke="#b47a4a" strokeWidth="0.4" fill="none" strokeLinecap="round" opacity="0.6">
          <path d="M100 8 q8 8 4 20" />
          <path d="M40 204 q-8 -8 -4 -20" />
        </g>
      </svg>
    </div>
  );
}
