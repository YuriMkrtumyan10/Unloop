"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { leaveCrew } from "@/app/actions";
import { rowClass } from "@/lib/ui";
import { Icon } from "./Icon";

/** Leave crew, with an "are you sure" step. note: who takes over as admin, or that you're the last one. */
export function LeaveCrew({ groupId, crewName, note }: { groupId: string; crewName: string; note?: string }) {
  const t = useTranslations("crews");
  const te = useTranslations("errors");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className={`${rowClass} text-extreme`}>
        <Icon name="leave" className="shrink-0" />
        <span className="min-w-0 grow">{t("leave")}</span>
      </button>
    );
  }

  return (
    <div role="alertdialog" aria-labelledby="leave-title" className="flex flex-col gap-3.5 rounded-3xl border-[1.5px] border-extreme p-5">
      <p id="leave-title" className="text-[15px] leading-[1.45] font-semibold">
        {t("leaveConfirm", { crew: crewName })}
      </p>
      {note && <p className="text-sm leading-[1.45] font-medium text-muted">{note}</p>}
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={() => setAsking(false)} disabled={pending} className="min-h-[52px] rounded-[14px] border-[1.5px] border-line font-semibold">
          {t("stay")}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await leaveCrew(groupId);
              if (res?.error) setError(res.error);
            })
          }
          className="min-h-[52px] rounded-[14px] bg-extreme px-3 font-bold text-ink disabled:opacity-60"
        >
          {t("leaveYes")}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-extreme">
          {te(error as "generic")}
        </p>
      )}
    </div>
  );
}
