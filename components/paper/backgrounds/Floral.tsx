function Flower({ x, y, s = 1, petal = '#e9a9a0', core = '#f2c54c' }: { x: number; y: number; s?: number; petal?: string; core?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-3.2" rx="1.6" ry="2.6" fill={petal} transform={`rotate(${a})`} />
      ))}
      <circle r="1.4" fill={core} />
    </g>
  );
}

function Leaf({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <path
      d="M0 0 c4 -6 10 -6 12 0 c-2 6 -8 6 -12 0z"
      fill="#9fb98a"
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
    />
  );
}

export default function Floral() {
  return (
    <div className="absolute inset-0" style={{ background: '#fdf8f0' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <g stroke="#9fb98a" strokeWidth="0.6" fill="none" strokeLinecap="round">
          <path d="M4 22 c8 -10 18 -12 30 -8" />
          <path d="M10 10 c6 2 10 6 12 12" />
          <path d="M144 190 c-8 10 -18 12 -30 8" />
          <path d="M138 202 c-6 -2 -10 -6 -12 -12" />
        </g>
        <Leaf x={6} y={18} r={-30} s={0.7} />
        <Leaf x={18} y={10} r={20} s={0.6} />
        <Leaf x={142} y={194} r={150} s={0.7} />
        <Leaf x={130} y={202} r={200} s={0.6} />
        <Flower x={14} y={14} s={1.1} />
        <Flower x={30} y={9} s={0.8} petal="#f3c5bd" />
        <Flower x={8} y={28} s={0.7} petal="#d9a8c7" />
        <Flower x={134} y={196} s={1.1} />
        <Flower x={118} y={201} s={0.8} petal="#f3c5bd" />
        <Flower x={140} y={182} s={0.7} petal="#d9a8c7" />
      </svg>
    </div>
  );
}
