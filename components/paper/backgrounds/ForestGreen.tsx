function Leaf({ x, y, r, s = 1, fill = '#5f8f62' }: { x: number; y: number; r: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 c5 -7 12 -7 14 0 c-2 7 -9 7 -14 0z" fill={fill} />
      <path d="M1 0 h12" stroke="#3f6b45" strokeWidth="0.4" opacity="0.6" />
    </g>
  );
}

export default function ForestGreen() {
  return (
    <div className="absolute inset-0" style={{ background: '#f4f7f0' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <g stroke="#3f6b45" strokeWidth="0.7" fill="none" strokeLinecap="round">
          <path d="M-4 6 c12 8 18 20 14 36" />
          <path d="M152 204 c-12 -8 -18 -20 -14 -36" />
        </g>
        <Leaf x={2} y={10} r={20} s={0.9} />
        <Leaf x={8} y={22} r={50} s={0.8} fill="#7aa66f" />
        <Leaf x={3} y={34} r={80} s={0.7} fill="#4f7d55" />
        <Leaf x={14} y={6} r={-10} s={0.6} fill="#8fb885" />
        <Leaf x={132} y={200} r={200} s={0.9} />
        <Leaf x={140} y={188} r={230} s={0.8} fill="#7aa66f" />
        <Leaf x={145} y={176} r={260} s={0.7} fill="#4f7d55" />
        <Leaf x={134} y={206} r={170} s={0.6} fill="#8fb885" />
        <g fill="#c9d9c1">
          <circle cx="24" cy="30" r="0.8" />
          <circle cx="124" cy="182" r="0.8" />
          <circle cx="16" cy="40" r="0.5" />
        </g>
      </svg>
    </div>
  );
}
