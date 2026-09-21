const CONFETTI: [number, number, number, string][] = [
  [10, 8, 20, '#f26d6d'], [24, 14, -30, '#f5c04a'], [38, 6, 50, '#5ab5d0'], [52, 16, -10, '#8bc98b'],
  [66, 5, 35, '#e58fc4'], [80, 12, -45, '#f26d6d'], [94, 7, 15, '#f5c04a'], [108, 15, -25, '#5ab5d0'],
  [122, 6, 40, '#8bc98b'], [136, 12, -35, '#e58fc4'], [18, 24, 10, '#5ab5d0'], [128, 26, -20, '#f26d6d'],
  [8, 196, -20, '#f5c04a'], [30, 204, 30, '#8bc98b'], [118, 200, -40, '#e58fc4'], [140, 194, 25, '#5ab5d0'],
];

export default function Celebration() {
  return (
    <div className="absolute inset-0" style={{ background: '#fffdfa' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        {CONFETTI.map(([x, y, r, c]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="3" height="1.6" rx="0.3" fill={c} transform={`rotate(${r} ${x} ${y})`} />
        ))}
        <g fill="none" strokeWidth="0.6" strokeLinecap="round">
          <path d="M60 10 q3 -4 6 0 t6 0" stroke="#f5c04a" />
          <path d="M100 22 q3 -4 6 0 t6 0" stroke="#5ab5d0" />
          <path d="M70 202 q3 -4 6 0 t6 0" stroke="#e58fc4" />
        </g>
        <circle cx="46" cy="22" r="1" fill="#f26d6d" />
        <circle cx="90" cy="18" r="0.8" fill="#8bc98b" />
        <circle cx="100" cy="206" r="0.9" fill="#f5c04a" />
      </svg>
    </div>
  );
}
