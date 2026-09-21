export default function Seaside() {
  return (
    <div className="absolute inset-0" style={{ background: '#f7fbfd' }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <defs>
          <filter id="seaside-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <g filter="url(#seaside-blur)">
          <ellipse cx="74" cy="214" rx="110" ry="30" fill="#bfe0ee" opacity="0.9" />
          <ellipse cx="40" cy="206" rx="70" ry="18" fill="#9ccbe0" opacity="0.7" />
          <ellipse cx="120" cy="210" rx="60" ry="14" fill="#a8d3e6" opacity="0.7" />
          <ellipse cx="130" cy="-4" rx="50" ry="18" fill="#d8ecf5" opacity="0.8" />
        </g>
        <g stroke="#7fb8d3" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M8 190 q6 -3 12 0 t12 0 t12 0" />
          <path d="M100 196 q6 -3 12 0 t12 0 t12 0" />
          <path d="M60 200 q6 -3 12 0 t12 0" />
        </g>
        <path d="M118 22 q3 -4 6 0 q3 -4 6 0" stroke="#7fb8d3" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M126 14 q3 -4 6 0" stroke="#7fb8d3" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
