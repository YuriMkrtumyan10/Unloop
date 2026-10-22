import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { requireGroup } from "@/lib/group";
import type { Challenge } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { CrewLink } from "@/components/CrewLink";
import { Icon } from "@/components/Icon";
import { SpinForm } from "@/components/SpinForm";

export default async function SpinPage() {
  const { supabase, group, crew, me } = await requireGroup();
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;

  const [{ data: mine }, { data: open }] = await Promise.all([
    supabase.from("leaderboard").select("points").eq("group_id", group.id).eq("user_id", me.id).maybeSingle(),
    supabase.from("runs").select("status, challenges(title)").eq("group_id", group.id).eq("status", "accepted").maybeSingle(),
  ]);
  const activeTitle = open ? (open.challenges as unknown as Pick<Challenge, "title">).title[locale] : null;

  return (
    <div className="flex grow flex-col">
      <header className="flex items-center justify-between gap-3 px-6 pt-[52px]">
        <div className="flex min-w-0 flex-col gap-0.5">
          <CrewLink group={group} suffix={group.solo ? undefined : String(crew.length)} />
          <span className="font-display text-[22px] font-bold">{t("greeting")}</span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-2 text-sm font-bold text-lime">
          <Icon name="star" size={16} strokeWidth={2.2} />
          {t("pts", { n: mine?.points ?? 0 })}
        </span>
      </header>

      {activeTitle && (
        <Link href="/run" className="mx-6 mt-5 flex items-center gap-3 rounded-[18px] border-[1.5px] border-lime px-4 py-3">
          <span className="size-2.5 shrink-0 rounded-full bg-lime shadow-[0_0_0_6px_rgba(200,240,60,0.18)]" />
          <span className="min-w-0 grow">
            <span className="block text-xs font-bold tracking-[0.08em] text-lime uppercase">{t("happeningNow")}</span>
            <span className="block truncate text-[15px] font-semibold">{activeTitle}</span>
          </span>
        </Link>
      )}

      <SpinForm groupId={group.id} crewSize={crew.length} />
    </div>
  );
}
