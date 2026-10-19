"use client";

type Tone = "default" | "easy" | "spicy" | "extreme";

const toneStyles: Record<Tone, { on: string; off: string }> = {
  default: { on: "border-paper bg-paper text-ink", off: "border-line text-paper" },
  easy: { on: "border-easy bg-easy text-ink", off: "border-easy text-easy" },
  spicy: { on: "border-spicy bg-spicy text-ink", off: "border-spicy text-spicy" },
  extreme: { on: "border-extreme bg-extreme text-ink", off: "border-extreme text-extreme" },
};

export function Chip({ selected, onClick, tone = "default", children }: { selected: boolean; onClick: () => void; tone?: Tone; children: React.ReactNode }) {
  const style = toneStyles[tone];
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-10 rounded-full border-[1.5px] px-3.5 text-sm font-semibold transition-colors ${selected ? style.on : style.off}`}
    >
      {children}
    </button>
  );
}
