function Reed({ x, r }: { x: number; r: number }) {
  return (
    <g transform={`translate(${x} 210) rotate(${r})`}>
      <path d="M0 0 v-34" stroke="#b9a06a" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M0 -34 c-3 -3 -2 -9 1 -12 c3 3 2 9 -1 12z" fill="#d7c08d" />
      <path d="M0 -30 c-4 -2 -5 -7 -3 -10" stroke="#d7c08d" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

export default function HarvestMoon() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2c3550 0%, #4a4a6a 55%, #8b6f5c 100%)' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <circle cx="112" cy="22" r="13" fill="#f6e3a1" />
        <circle cx="106" cy="18" r="2.5" fill="#ecd48a" opacity="0.7" />
        <circle cx="116" cy="27" r="1.8" fill="#ecd48a" opacity="0.7" />
        <rect x="14" y="42" width="120" height="150" rx="1.5" fill="#f9f3e4" />
        <rect x="16.5" y="44.5" width="115" height="145" rx="1" fill="none" stroke="#c9a96a" strokeWidth="0.5" />
        <Reed x={10} r={-6} />
        <Reed x={5} r={4} />
        <Reed x={140} r={6} />
        <Reed x={145} r={-3} />
        <g fill="#f6e3a1" opacity="0.8">
          <circle cx="20" cy="10" r="0.7" />
          <circle cx="40" cy="6" r="0.5" />
          <circle cx="70" cy="9" r="0.6" />
          <circle cx="138" cy="8" r="0.5" />
        </g>
      </svg>
    </div>
  );
}
