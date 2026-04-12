export default function IndianLawLogo({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-testid="indian-law-logo"
    >
      {/* Ashoka Chakra (24-spoke wheel) */}
      <circle cx="50" cy="38" r="18" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="50" cy="38" r="3" fill="currentColor" />
      {/* 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x2 = 50 + 16 * Math.sin(angle);
        const y2 = 38 - 16 * Math.cos(angle);
        return (
          <line
            key={i}
            x1="50"
            y1="38"
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.2"
          />
        );
      })}
      {/* Scales of Justice - left pan */}
      <line x1="50" y1="20" x2="28" y2="28" stroke="currentColor" strokeWidth="2" />
      <path d="M20 28 L28 28 L36 28 L32 38 Q28 42 24 38 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      {/* Scales of Justice - right pan */}
      <line x1="50" y1="20" x2="72" y2="28" stroke="currentColor" strokeWidth="2" />
      <path d="M64 28 L72 28 L80 28 L76 38 Q72 42 68 38 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      {/* Top pillar */}
      <line x1="50" y1="14" x2="50" y2="20" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="13" r="2.5" fill="currentColor" />
      {/* Pillar / Stand */}
      <line x1="50" y1="56" x2="50" y2="72" stroke="currentColor" strokeWidth="3" />
      {/* Book / Constitution base */}
      <path
        d="M32 72 Q50 66 68 72 L68 80 Q50 74 32 80 Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line x1="50" y1="68" x2="50" y2="80" stroke="currentColor" strokeWidth="1" />
      {/* Base platform */}
      <rect x="30" y="82" width="40" height="4" rx="1" fill="currentColor" />
      <rect x="36" y="86" width="28" height="3" rx="1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
