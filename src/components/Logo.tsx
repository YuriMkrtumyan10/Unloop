/** The loop being broken: grey loop, lime line escaping it. */
export function Logo({ width = 132 }: { width?: number }) {
  return (
    <svg width={width} height={(width * 72) / 132} viewBox="0 0 132 72" fill="none" aria-hidden="true">
      <path d="M8 36c0-15 12-27 27-27s27 12 27 27-12 27-27 27c-9 0-14-4-18-9" stroke="#3A3631" strokeWidth="10" strokeLinecap="round" />
      <path d="M17 54C30 70 70 60 88 36s18-22 36-26" stroke="#C8F03C" strokeWidth="10" strokeLinecap="round" />
      <circle cx="124" cy="10" r="7" fill="#C8F03C" />
    </svg>
  );
}
