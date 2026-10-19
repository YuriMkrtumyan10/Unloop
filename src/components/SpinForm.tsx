"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { spin } from "@/app/actions";
import type { Level, SpinFilters, TimeBucket } from "@/lib/types";
import { Chip } from "./Chip";
import { Icon } from "./Icon";

const TIMES: TimeBucket[] = ["quick", "short", "half", "full"];
const LEVELS: Level[] = ["easy", "spicy", "extreme"];
const STORAGE_KEY = "unloop:filters";

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">{children}</p>;
}

export function SpinForm({ groupId, crewSize }: { groupId: string; crewSize: number }) {
  const t = useTranslations("home");
  const te = useTranslations("errors");
  const [filters, setFilters] = useState<SpinFilters>({ people: Math.max(crewSize, 1), time: null, costs: [], place: null, level: null });
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  // Remember the last filters on this phone (people count always starts at the crew size).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<SpinFilters> | null;
      if (saved) setFilters((f) => ({ ...f, ...saved, people: f.people }));
    } catch {}
  }, []);

  function update(patch: Partial<SpinFilters>) {
    setError(undefined);
    setFilters((f) => {
      const next = { ...f, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ time: next.time, costs: next.costs, place: next.place, level: next.level }));
      } catch {}
      return next;
    });
  }

  function go() {
    setError(undefined);
    startTransition(async () => {
      // A little suspense before the reveal.
      const [res] = await Promise.all([spin(groupId, filters), new Promise((r) => setTimeout(r, 900))]);
      if (res?.error) setError(res.error);
    });
  }

  const toggleCost = (c: number) => update({ costs: filters.costs.includes(c) ? filters.costs.filter((x) => x !== c) : [...filters.costs, c].sort() });

  return (
    <div className="flex grow flex-col gap-[18px] px-6 pt-6 pb-4">
      <div className="flex items-center justify-between rounded-[18px] bg-card py-3 pr-3 pl-4">
        <span className="text-[15px] font-semibold">{t("howMany")}</span>
        <div className="flex items-center gap-3.5">
          <button type="button" aria-label={t("fewer")} onClick={() => update({ people: Math.max(1, filters.people - 1) })} className="size-10 rounded-xl bg-raised text-xl font-bold">
            −
          </button>
          <span className="min-w-5 text-center font-display text-xl font-bold" aria-live="polite">
            {filters.people}
          </span>
          <button type="button" aria-label={t("more")} onClick={() => update({ people: Math.min(50, filters.people + 1) })} className="size-10 rounded-xl bg-raised text-xl font-bold">
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("time")}</Label>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((time) => (
            <Chip key={time} selected={filters.time === time} onClick={() => update({ time: filters.time === time ? null : time })}>
              {t(`times.${time}`)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("budget")}</Label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((c) => (
            <Chip key={c} selected={filters.costs.includes(c)} onClick={() => toggleCost(c)}>
              {c === 1 ? t("free") : "$".repeat(c)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("where")}</Label>
        <div className="flex flex-wrap gap-2">
          <Chip selected={filters.place === "in"} onClick={() => update({ place: "in" })}>
            {t("inside")}
          </Chip>
          <Chip selected={filters.place === "out"} onClick={() => update({ place: "out" })}>
            {t("outside")}
          </Chip>
          <Chip selected={filters.place === null} onClick={() => update({ place: null })}>
            {t("dontCare")}
          </Chip>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("brave")}</Label>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((level) => (
            <Chip key={level} tone={level} selected={filters.level === level} onClick={() => update({ level: filters.level === level ? null : level })}>
              {t(`levels.${level}`)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex grow flex-col items-center justify-center gap-3 py-6">
        <button
          type="button"
          onClick={go}
          disabled={pending}
          className="flex size-[168px] flex-col items-center justify-center gap-1 rounded-full bg-lime text-ink shadow-[0_0_0_10px_#1E1C19,0_0_0_12px_#2A2723] transition-transform active:scale-95"
        >
          <Icon name="spin" size={34} strokeWidth={2.4} className={pending ? "animate-spin-wheel" : ""} />
          <span className="font-display text-3xl font-extrabold">{t("spin")}</span>
        </button>
        {error && (
          <p role="alert" className="max-w-[280px] text-center text-sm text-spicy">
            {te(error as "generic")}
          </p>
        )}
      </div>
    </div>
  );
}
