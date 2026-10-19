import { useTranslations } from "next-intl";
import type { Challenge } from "@/lib/types";
import { costLabel, timeLabel } from "@/lib/format";
import { CategoryBadge } from "./CategoryBadge";
import { LevelBadge } from "./LevelBadge";

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[14px] bg-sand px-3 py-2.5">
      <b className="text-base font-bold text-ink">{value}</b>
      <span className="text-xs font-medium text-dim">{label}</span>
    </div>
  );
}

/** The tilted card from the reveal screen. `title` is already in the user's language. */
export function ChallengeCard({ challenge, title, people }: { challenge: Challenge; title: string; people: number }) {
  const t = useTranslations("reveal");
  const tt = useTranslations("time");
  const time = timeLabel(challenge.hours_min, challenge.hours_max);
  return (
    <div className="relative flex min-h-[470px] items-center justify-center py-4">
      <div className="absolute h-[440px] w-[280px] -rotate-[7deg] rounded-[28px] bg-raised" />
      <div className="absolute h-[440px] w-[280px] rotate-[4deg] rounded-[28px] bg-line" />
      <div className="animate-reveal relative flex w-[min(322px,100%)] -rotate-[1.5deg] flex-col gap-[18px] rounded-[28px] bg-cream p-[22px] text-ink shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={challenge.category} />
          <LevelBadge level={challenge.level} />
        </div>
        <h1 className={`font-display ${title.length > 60 ? "text-[21px]" : title.length > 40 ? "text-[24px]" : "text-[27px]"} leading-[1.1] font-extrabold tracking-[-0.015em] break-words hyphens-auto`}>{title}</h1>
        <div className="grid grid-cols-2 gap-2">
          <Fact value={t("people", { n: challenge.min_people })} label={t("youAre", { n: people })} />
          <Fact value={tt(time.key, time.values)} label={t("time")} />
          <Fact value={costLabel(challenge.cost)} label={t("budget")} />
          <Fact value={t(`place.${challenge.place}`)} label={t("where")} />
        </div>
        <div className="flex items-center justify-between border-t-2 border-dashed border-sand-line pt-3.5">
          <span className="font-display text-[34px] font-extrabold">
            {challenge.points}
            <span className="font-sans text-base font-bold"> {t("pts")}</span>
          </span>
          <span className="text-sm font-semibold text-dim">{t("photoBonus")}</span>
        </div>
      </div>
    </div>
  );
}
