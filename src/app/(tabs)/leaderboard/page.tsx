import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { requireGroup } from "@/lib/group";
import { Avatar } from "@/components/Avatar";
import { CrewLink } from "@/components/CrewLink";
import { InviteSection } from "@/components/InviteSection";
import { Icon } from "@/components/Icon";
import { Podium, type Standing } from "@/components/Podium";

export default async function LeaderboardPage() {
  const { supabase, group, crew, me } = await requireGroup();
  const t = await getTranslations("leaderboard");

  // Just me: a scoreboard of one, and a nudge to bring rivals.
  if (group.solo) {
    const { data: mine } = await supabase.from("leaderboard").select("points, challenges").eq("group_id", group.id).eq("user_id", me.id).maybeSingle();
    return (
      <div className="flex grow flex-col gap-6 px-6 pt-[52px] pb-8">
        <header className="flex flex-col gap-1">
          <CrewLink group={group} suffix={t("allTime")} />
          <h1 className="font-display text-[26px] font-bold">{t("title")}</h1>
        </header>
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-card px-5 py-7 text-center">
          <Avatar profile={me} size={72} className="ring-4 ring-lime" />
          <span className="font-display text-[40px] leading-none font-extrabold text-lime">{mine?.points ?? 0}</span>
          <span className="text-sm font-semibold text-muted">
            {t("soloPoints")} · {t("challenges", { n: mine?.challenges ?? 0 })}
          </span>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-3xl border-[1.5px] border-dashed border-line p-5">
          <p className="font-hand text-2xl leading-tight text-soft">{t("soloJoke")}</p>
          <p className="text-sm leading-[1.45] font-medium text-muted">{t("soloNote")}</p>
          <Link href="/crews" className="mt-1 flex min-h-12 items-center rounded-[14px] bg-lime px-5 font-bold text-ink">
            {t("soloCta")}
          </Link>
        </div>
      </div>
    );
  }

  const { data } = await supabase.from("leaderboard").select("user_id, points, challenges").eq("group_id", group.id);
  const standings: Standing[] = crew
    .map((profile) => {
      const row = data?.find((r) => r.user_id === profile.id);
      return { profile, points: row?.points ?? 0, challenges: row?.challenges ?? 0 };
    })
    .sort((a, b) => b.points - a.points || b.challenges - a.challenges);

  const rest = standings.slice(3);
  const last = standings.at(-1);
  const showNudge = standings.length >= 3 && last && last.points < standings[standings.length - 2].points;

  return (
    <div className="flex grow flex-col pb-8">
      <header className="flex flex-col gap-1 px-6 pt-[52px] pb-2">
        <CrewLink group={group} suffix={t("allTime")} />
        <h1 className="font-display text-[26px] font-bold">{t("title")}</h1>
      </header>

      <Podium top={standings.slice(0, 3)} />

      <div className="flex flex-col gap-2.5 px-6 pt-5">
        {rest.map((s, i) => (
          <div key={s.profile.id} className="flex min-h-16 items-center gap-3.5 rounded-[18px] bg-card px-4">
            <span className="w-5 font-display text-[15px] font-bold text-muted">{i + 4}</span>
            <Avatar profile={s.profile} size={40} />
            <div className="flex min-w-0 grow flex-col">
              <b className="truncate font-bold">{s.profile.display_name}</b>
              <em className="text-[13px] font-medium text-muted not-italic">{t("challenges", { n: s.challenges })}</em>
            </div>
            <span className="font-display text-lg font-bold">{s.points}</span>
          </div>
        ))}

        {showNudge && (
          <div className="mt-1.5 flex items-center gap-3 rounded-[18px] border-[1.5px] border-dashed border-line p-4">
            <Icon name="spin" size={22} className="shrink-0 text-lime" />
            <p className="text-sm leading-[1.4] font-medium text-soft">{t("nudge", { name: last.profile.display_name })}</p>
          </div>
        )}

        <InviteSection code={group.invite_code} groupName={group.name} />
      </div>
    </div>
  );
}
