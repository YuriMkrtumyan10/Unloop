"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { cancelRequest } from "@/app/actions";

/** A crew you asked to join that hasn't answered yet. */
export function WaitingRow({ groupId, name, members }: { groupId: string; name: string; members: number }) {
  const t = useTranslations("crews");
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-[18px] border-[1.5px] border-dashed border-line py-2.5 pr-2.5 pl-4">
      <div className="flex min-w-0 grow flex-col">
        <b className="truncate font-bold">{name}</b>
        <span className="text-[13px] font-medium text-muted">{t("members", { n: members })}</span>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await cancelRequest(groupId);
          })
        }
        className="min-h-11 shrink-0 rounded-[12px] border-[1.5px] border-line px-3.5 text-sm font-semibold disabled:opacity-60"
      >
        {t("cancelRequest")}
      </button>
    </div>
  );
}
