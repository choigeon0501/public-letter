const PETALS: [number, number, number, number][] = [
  [8, 10, 20, 1], [20, 6, -30, 0.8], [34, 14, 50, 0.7], [12, 26, -10, 0.6], [26, 22, 70, 0.5],
  [120, 6, 35, 0.9], [132, 16, -45, 0.7], [140, 4, 15, 0.6],
  [6, 180, -25, 0.8], [18, 196, 40, 0.6], [10, 204, -50, 0.5],
  [130, 190, 20, 0.9], [142, 176, -35, 0.7], [118, 204, 60, 0.6], [136, 202, -15, 0.8],
  [70, 4, 25, 0.5], [90, 206, -20, 0.5],
];

export default function CherryBlossom() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #fff7f8 0%, #fdf1f3 100%)' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <g stroke="#8d6a5a" strokeWidth="0.7" fill="none" strokeLinecap="round">
          <path d="M-2 14 c14 -2 22 6 34 2 c8 -3 12 -6 20 -4" />
          <path d="M150 196 c-14 2 -22 -6 -34 -2 c-8 3 -12 6 -20 4" />
        </g>
        {PETALS.map(([x, y, r, s]) => (
          <path
            key={`${x}-${y}`}
            d="M0 -3 c2 -1 4 1 3 3 c-1 2 -2 3 -3 4 c-1 -1 -2 -2 -3 -4 c-1 -2 1 -4 3 -3z"
            fill="#f4b6c2"
            opacity="0.9"
            transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
          />
        ))}
        <g fill="#f7cdd5">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-3" rx="1.6" ry="2.6" transform={`translate(30 12) rotate(${a})`} />
          ))}
          <circle cx="30" cy="12" r="1.2" fill="#e88aa0" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={`b${a}`} cx="0" cy="-3" rx="1.6" ry="2.6" transform={`translate(118 198) rotate(${a})`} />
          ))}
          <circle cx="118" cy="198" r="1.2" fill="#e88aa0" />
        </g>
      </svg>
    </div>
  );
}
