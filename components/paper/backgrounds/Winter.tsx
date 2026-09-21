function Flake({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#bfe0ea" strokeWidth="0.5" strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 -4 v8" />
          <path d="M0 -3 l-1.2 -1.2 M0 -3 l1.2 -1.2 M0 3 l-1.2 1.2 M0 3 l1.2 1.2" />
        </g>
      ))}
    </g>
  );
}

export default function Winter() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1f4a4f 0%, #2a5f63 100%)' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <rect x="12" y="12" width="124" height="186" rx="2" fill="#fbfaf6" />
        <rect x="14.5" y="14.5" width="119" height="181" rx="1.5" fill="none" stroke="#b83b3b" strokeWidth="0.5" />
        <Flake x={6} y={10} s={1} />
        <Flake x={142} y={22} s={0.8} />
        <Flake x={5} y={120} s={0.7} />
        <Flake x={143} y={150} s={1} />
        <Flake x={30} y={4} s={0.6} />
        <Flake x={110} y={205} s={0.7} />
        <Flake x={70} y={4} s={0.5} />
        <g transform="translate(118 178)">
          <path d="M0 6 l6 -12 l6 12z" fill="#3f7d54" />
          <path d="M1.5 1 l4.5 -9 l4.5 9z" fill="#4f9264" />
          <rect x="5" y="6" width="2" height="2.5" fill="#6b4a2f" />
          <circle cx="6" cy="-8.5" r="1" fill="#e8b84a" />
        </g>
        <g fill="#bfe0ea" opacity="0.8">
          <circle cx="50" cy="8" r="0.6" />
          <circle cx="92" cy="6" r="0.5" />
          <circle cx="8" cy="60" r="0.5" />
          <circle cx="140" cy="90" r="0.5" />
        </g>
      </svg>
    </div>
  );
}
