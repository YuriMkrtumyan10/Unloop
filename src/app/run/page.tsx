import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { requireOpenRun } from "@/lib/run";
import { formatClock, timeLabel, costLabel } from "@/lib/format";
import { Avatar } from "@/components/Avatar";
import { BackLink } from "@/components/BackLink";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Icon } from "@/components/Icon";
import { RevealActions } from "@/components/RevealActions";

const levelText = { easy: "text-easy", spicy: "text-spicy", extreme: "text-extreme" } as const;

export default async function RunPage() {
  const { run, challenge, crew, me, spinner, group } = await requireOpenRun();
  const locale = (await getLocale()) as Locale;
  const title = challenge.title[locale];
  const spinnerName = spinner?.display_name ?? "?";

  if (run.status === "revealed") {
    const t = await getTranslations("reveal");
    return (
      <main className="flex min-h-dvh flex-col gap-4 px-6 pt-[52px] pb-8">
        <div className="flex items-center justify-between gap-3">
          <BackLink href="/spin" />
          <span className="text-right text-sm font-semibold text-muted">{t("whoDecides", { name: spinnerName })}</span>
        </div>
        <div className="flex grow items-center justify-center">
          <ChallengeCard key={challenge.id} challenge={challenge} title={title} people={run.people} />
        </div>
        <RevealActions runId={run.id} isSpinner={run.spun_by === me.id} rerolled={run.rerolled} spinnerName={spinnerName} />
      </main>
    );
  }

  const t = await getTranslations("active");
  const tr = await getTranslations("reveal");
  const tc = await getTranslations("categories");
  const tl = await getTranslations("levels");
  const tt = await getTranslations("time");
  const time = timeLabel(challenge.hours_min, challenge.hours_max);
  const pill = "rounded-full bg-card px-3 py-2 text-sm font-semibold";

  return (
    <main className="flex min-h-dvh flex-col gap-[22px] px-6 pt-[52px] pb-8">
      <div className="flex items-center gap-2.5">
        <span className="size-2.5 rounded-full bg-lime shadow-[0_0_0_6px_rgba(200,240,60,0.18)]" />
        <span className="text-[13px] font-bold tracking-[0.08em] text-lime uppercase">{t("now")}</span>
      </div>

      <h1 className={`font-display ${title.length > 60 ? "text-[24px]" : "text-[32px]"} leading-[1.05] font-extrabold tracking-[-0.02em] break-words hyphens-auto`}>{title}</h1>

      <div className="flex flex-wrap gap-2">
        <span className={pill}>{tc(challenge.category)}</span>
        <span className={pill}>{tt(time.key, time.values)}</span>
        <span className={pill}>{costLabel(challenge.cost)}</span>
        <span className={`${pill} ${levelText[challenge.level]}`}>
          {tl(challenge.level)} · {challenge.points} {tr("pts")}
        </span>
      </div>

      {!group.solo && (
        <section className="flex flex-col gap-3.5 rounded-3xl bg-card p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] font-semibold">{t("crew")}</span>
            {run.accepted_at && <span className="text-[13px] font-medium text-muted">{t("acceptedBy", { name: spinnerName, time: formatClock(run.accepted_at, locale) })}</span>}
          </div>
          <div className="flex flex-wrap pl-2.5">
            {crew.map((p) => (
              <Avatar key={p.id} profile={p} className="-ml-2.5 border-[3px] border-card" />
            ))}
          </div>
        </section>
      )}

      <div className="flex items-start gap-3.5 rounded-3xl border-[1.5px] border-dashed border-line px-5 py-[18px]">
        <Icon name="camera" size={24} className="shrink-0 text-[#FFB36B]" />
        <p className="text-[15px] leading-[1.45] font-medium text-soft">
          {t.rich("photoHint", { b: (chunks) => <b className="text-paper">{chunks}</b> })}
        </p>
      </div>

      <div className="grow" />

      <div className="flex flex-col gap-2.5">
        <Link href="/run/proof" className="flex min-h-[60px] items-center justify-center gap-2.5 rounded-[18px] bg-lime font-display text-lg font-extrabold text-ink">
          <Icon name="check" strokeWidth={2.6} />
          {t("done")}
        </Link>
        <Link href="/spin" className="flex min-h-11 items-center justify-center text-sm font-semibold text-muted">
          {t("later")}
        </Link>
      </div>
    </main>
  );
}
