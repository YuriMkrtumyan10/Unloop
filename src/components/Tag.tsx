const tones = {
  lime: "bg-lime/15 text-lime",
  muted: "bg-raised text-muted",
};

/** A small uppercase label on a row: "Playing now", "Admin", "2 want in". */
export function Tag({ tone = "muted", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] uppercase ${tones[tone]}`}>{children}</span>;
}
