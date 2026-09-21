function Sprig({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M0 0 v-18" stroke="#7d8f6a" strokeWidth="0.6" strokeLinecap="round" />
      {[-16, -13.5, -11, -8.5, -6].map((cy, i) => (
        <g key={cy}>
          <ellipse cx={-1.6} cy={cy} rx="1.3" ry="1.9" fill={i % 2 ? '#a58bd4' : '#b79ee0'} />
          <ellipse cx={1.6} cy={cy + 1.2} rx="1.3" ry="1.9" fill={i % 2 ? '#b79ee0' : '#a58bd4'} />
        </g>
      ))}
    </g>
  );
}

export default function Lavender() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #f8f5fc 0%, #f1ecf8 100%)' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <Sprig x={14} y={34} r={-18} />
        <Sprig x={22} y={36} r={8} />
        <Sprig x={134} y={204} r={162} />
        <Sprig x={126} y={202} r={188} />
        <path d="M10 36 q6 -4 12 0" stroke="#c9b3e6" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
