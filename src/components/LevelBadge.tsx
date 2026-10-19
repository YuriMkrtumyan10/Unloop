import { useTranslations } from "next-intl";
import type { Level } from "@/lib/types";

const color: Record<Level, string> = { easy: "text-easy", spicy: "text-spicy", extreme: "text-extreme" };

export function LevelBadge({ level, suffix }: { level: Level; suffix?: string }) {
  const t = useTranslations("levels");
  return (
    <span className={`rounded-full bg-ink px-3 py-1.5 text-[13px] font-bold ${color[level]}`}>
      {t(level)}
      {suffix}
    </span>
  );
}
