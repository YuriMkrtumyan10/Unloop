"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { answerRequest } from "@/app/actions";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";

/** For the crew's admin: people who asked to join, to let in or turn down. */
export function JoinRequests({ groupId, people }: { groupId: string; people: Profile[] }) {
  const t = useTranslations("crews");
  const te = useTranslations("errors");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function answer(userId: string, accept: boolean) {
    setError(undefined);
    startTransition(async () => {
      const res = await answerRequest(groupId, userId, accept);
      if (res.error) setError(res.error);
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      {people.map((p) => (
        <div key={p.id} className="flex min-h-16 items-center gap-3 rounded-[18px] border-[1.5px] border-lime py-2.5 pr-2.5 pl-4">
          <Avatar profile={p} size={40} />
          <b className="min-w-0 grow truncate font-bold">{p.display_name}</b>
          <button
            type="button"
            disabled={pending}
            onClick={() => answer(p.id, false)}
            className="min-h-11 shrink-0 rounded-[12px] border-[1.5px] border-line px-3 text-sm font-semibold disabled:opacity-60"
          >
            {t("reject")}
          </button>
          <button type="button" disabled={pending} onClick={() => answer(p.id, true)} className="min-h-11 shrink-0 rounded-[12px] bg-lime px-3 text-sm font-bold text-ink disabled:opacity-60">
            {t("accept")}
          </button>
        </div>
      ))}
      {error && (
        <p role="alert" className="text-sm text-extreme">
          {te(error as "generic")}
        </p>
      )}
    </div>
  );
}
