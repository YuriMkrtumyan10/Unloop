"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { requestJoin, searchCrews } from "@/app/actions";
import type { CrewHit } from "@/lib/types";
import { inputClass } from "@/lib/ui";

/** Search crews by name and ask to join. myName (sign-up screen only) is saved first, so the admin sees who's asking. */
export function CrewSearch({ myName }: { myName?: string }) {
  const t = useTranslations("crews");
  const te = useTranslations("errors");
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<{ query: string; crews: CrewHit[] }>();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const q = query.trim();

  useEffect(() => {
    if (q.length < 2) return;
    let live = true;
    const timer = setTimeout(async () => {
      const crews = await searchCrews(q);
      if (live) setHits({ query: q, crews });
    }, 300);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q]);

  function ask(crew: CrewHit) {
    setError(undefined);
    startTransition(async () => {
      const res = await requestJoin(crew.id, myName);
      if (res.error) {
        setError(res.error);
        return;
      }
      setSent(true);
      setHits((h) => h && { ...h, crews: h.crews.map((c) => (c.id === crew.id ? { ...c, status: "requested" } : c)) });
    });
  }

  const shown = q.length >= 2 && hits ? hits.crews : null;
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="crew-search" className="sr-only">
        {t("searchLabel")}
      </label>
      <input id="crew-search" inputMode="search" enterKeyHint="search" value={query} maxLength={40} autoComplete="off" placeholder={t("searchPlaceholder")} onChange={(e) => setQuery(e.target.value)} className={inputClass} />

      {shown && shown.length === 0 && <p className="px-1 text-sm font-medium text-muted">{t("noResults")}</p>}
      {shown?.map((crew) => (
        <div key={crew.id} className="flex min-h-16 items-center gap-3 rounded-[18px] bg-card py-2.5 pr-2.5 pl-4">
          <div className="flex min-w-0 grow flex-col">
            <b className="truncate font-bold">{crew.name}</b>
            <span className="text-[13px] font-medium text-muted">{t("members", { n: crew.members })}</span>
          </div>
          {crew.status ? (
            <span className="shrink-0 px-2 text-sm font-semibold text-muted">{crew.status === "member" ? t("youreIn") : t("requested")}</span>
          ) : (
            <button
              type="button"
              disabled={pending || myName?.trim() === ""}
              onClick={() => ask(crew)}
              className="min-h-11 shrink-0 rounded-[12px] bg-paper px-3.5 text-sm font-bold text-ink disabled:opacity-60"
            >
              {t("askToJoin")}
            </button>
          )}
        </div>
      ))}

      {sent && <p className="px-1 text-sm font-medium text-lime">{t("requestSent")}</p>}
      {error && (
        <p role="alert" className="px-1 text-sm text-extreme">
          {te(error as "generic")}
        </p>
      )}
    </div>
  );
}
