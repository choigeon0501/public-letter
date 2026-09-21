const STARS: [number, number, number][] = [
  [6, 12, 0.8], [12, 30, 0.5], [4, 60, 0.6], [9, 95, 0.4], [5, 140, 0.7], [11, 175, 0.5], [7, 200, 0.6],
  [142, 8, 0.6], [136, 40, 0.5], [143, 72, 0.8], [138, 110, 0.4], [144, 150, 0.6], [139, 190, 0.7],
  [30, 5, 0.5], [70, 4, 0.7], [110, 6, 0.4], [45, 205, 0.6], [90, 204, 0.5], [125, 206, 0.6],
];

export default function NightSky() {
  return (
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg, #1b2440 0%, #24305a 60%, #1b2440 100%)' }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <rect x="14" y="14" width="120" height="182" rx="2" fill="#f7f3ea" />
        <rect x="16.5" y="16.5" width="115" height="177" rx="1.5" fill="none" stroke="#c9b26a" strokeWidth="0.5" />
        <g fill="#f6e7a6">
          {STARS.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
          <path d="M126 200 l0.8 2 l2 0.3 l-1.5 1.4 l0.4 2 l-1.7 -1 l-1.7 1 l0.4 -2 l-1.5 -1.4 l2 -0.3z" />
        </g>
        <path d="M20 200 a4 4 0 1 1 3 -6.5 a3 3 0 1 0 -3 6.5z" fill="#f6e7a6" />
      </svg>
    </div>
  );
}
