"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { acceptRun, reroll } from "@/app/actions";
import { Icon } from "./Icon";

export function RevealActions({ runId, isSpinner, rerolled, spinnerName }: { runId: string; isSpinner: boolean; rerolled: boolean; spinnerName: string }) {
  const t = useTranslations("reveal");
  const te = useTranslations("errors");
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (!isSpinner) {
    return <p className="rounded-[18px] bg-card p-4 text-center text-[15px] font-medium text-soft">{t("waiting", { name: spinnerName })}</p>;
  }

  function run(action: () => Promise<{ error?: string }>) {
    setError(undefined);
    startTransition(async () => {
      const res = await action();
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      <button type="button" disabled={pending} onClick={() => run(() => acceptRun(runId))} className="min-h-[58px] rounded-[18px] bg-lime font-display text-lg font-extrabold text-ink disabled:opacity-60">
        {t("accept")}
      </button>
      <button
        type="button"
        disabled={pending || rerolled}
        onClick={() => run(() => reroll(runId))}
        className="flex min-h-[52px] items-center justify-center gap-2 rounded-[18px] border-[1.5px] border-line px-4 py-2 text-center font-semibold disabled:text-muted"
      >
        <Icon name="spin" size={18} className={`shrink-0 ${pending ? "animate-spin-wheel" : ""}`} />
        {rerolled ? (
          t("noRerolls")
        ) : (
          <span>
            {t("reroll")} <span className="text-muted">{t("rerollLeft")}</span>
          </span>
        )}
      </button>
      {error && <p role="alert" className="text-center text-sm text-spicy">{te(error as "generic")}</p>}
    </div>
  );
}
