export default function SkyBlue() {
  return (
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(120% 90% at 50% 30%, #f3f9ff 0%, #e6f1fb 70%, #d9e8f5 100%)' }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 148 210" aria-hidden>
        <g fill="#ffffff" opacity="0.9">
          <ellipse cx="118" cy="16" rx="12" ry="4" />
          <ellipse cx="124" cy="13" rx="7" ry="4.5" />
          <ellipse cx="28" cy="198" rx="10" ry="3.5" />
          <ellipse cx="33" cy="195.5" rx="6" ry="4" />
        </g>
      </svg>
    </div>
  );
}
