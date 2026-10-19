import { useTranslations } from "next-intl";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

export type Standing = { profile: Profile; points: number; challenges: number };

const heights = ["h-[136px]", "h-24", "h-[72px]"];

/** Top three, drawn 2nd · 1st · 3rd. */
export function Podium({ top }: { top: Standing[] }) {
  const t = useTranslations("leaderboard");
  const order = [1, 0, 2].filter((i) => top[i]);
  return (
    <div className="grid grid-cols-3 items-end gap-2.5 px-6 pt-6">
      {order.map((place) => {
        const s = top[place];
        const first = place === 0;
        return (
          <div key={s.profile.id} className={`flex flex-col items-center gap-2 ${order.length < 3 && place === 0 ? "col-start-2" : ""}`}>
            {first && <Icon name="crown" size={30} className="text-lime" />}
            <Avatar profile={s.profile} size={first ? 72 : 56} className={first ? "ring-4 ring-lime" : ""} />
            <span className={`max-w-full truncate ${first ? "text-[15px] font-bold" : "text-sm font-semibold"}`}>{s.profile.display_name}</span>
            <div className={`flex w-full flex-col items-center justify-center rounded-t-2xl ${heights[place]} ${first ? "bg-lime text-ink" : "bg-raised"}`}>
              <span className={`font-display font-extrabold ${first ? "text-[28px]" : "text-[22px]"}`}>{s.points}</span>
              <span className={`text-xs ${first ? "font-bold" : "font-semibold text-muted"}`}>{t(`place${place + 1}` as "place1")}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
