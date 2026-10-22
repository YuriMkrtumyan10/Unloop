import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { requireGroup } from "@/lib/group";
import { formatDay, formatMonth } from "@/lib/format";
import type { Challenge, Run } from "@/lib/types";
import { categoryColor } from "@/components/CategoryBadge";
import { CrewLink } from "@/components/CrewLink";
import { Polaroid } from "@/components/Polaroid";

type DoneRun = Run & { challenges: Challenge; run_participants: { points: number }[] };

export default async function ScrapbookPage() {
  const { supabase, group } = await requireGroup();
  const t = await getTranslations("scrapbook");
  const locale = (await getLocale()) as Locale;

  const { data } = await supabase
    .from("runs")
    .select("*, challenges(*), run_participants(points)")
    .eq("group_id", group.id)
    .eq("status", "done")
    .order("completed_at", { ascending: false })
    .limit(100);
  const runs = (data ?? []) as DoneRun[];

  const paths = runs.map((r) => r.photo_path).filter((p): p is string => Boolean(p));
  const urls = new Map<string, string>();
  if (paths.length) {
    const { data: signed } = await supabase.storage.from("proofs").createSignedUrls(paths, 60 * 60);
    signed?.forEach((s) => s.path && s.signedUrl && urls.set(s.path, s.signedUrl));
  }

  // Group the polaroids by month, newest first.
  const months: { label: string; runs: DoneRun[] }[] = [];
  for (const run of runs) {
    const label = formatMonth(run.completed_at!, locale);
    if (months.at(-1)?.label !== label) months.push({ label, runs: [] });
    months.at(-1)!.runs.push(run);
  }

  return (
    <div className="flex grow flex-col">
      <header className="flex flex-col gap-1 px-6 pt-[52px] pb-4">
        <CrewLink group={group} />
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-display text-[26px] font-bold">{t("title")}</h1>
          <span className="text-sm font-semibold text-lime">{t("count", { n: runs.length })}</span>
        </div>
      </header>

      {runs.length === 0 ? (
        <div className="mx-6 mt-6 flex flex-col items-start gap-4 rounded-3xl border-[1.5px] border-dashed border-line p-6">
          <p className="font-hand text-2xl text-soft">{t("empty")}</p>
          <Link href="/spin" className="flex min-h-12 items-center rounded-[14px] bg-lime px-5 font-bold text-ink">
            {t("emptyCta")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 px-6 pt-2 pb-8">
          {months.map((month) => (
            <section key={month.label} className="flex flex-col gap-3.5">
              <h2 className="text-xs font-bold tracking-[0.08em] text-muted uppercase">{month.label}</h2>
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-[18px]">
                {month.runs.map((run, i) => (
                  <Polaroid
                    key={run.id}
                    index={i}
                    title={run.challenges.title[locale]}
                    note={run.note}
                    photoUrl={run.photo_path ? (urls.get(run.photo_path) ?? null) : null}
                    day={formatDay(run.completed_at!, locale)}
                    points={Math.max(0, ...run.run_participants.map((p) => p.points))}
                    color={categoryColor[run.challenges.category]}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
