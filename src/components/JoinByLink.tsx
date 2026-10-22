"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { joinGroup } from "@/app/actions";

/** Paste an invite link (or just the code) to join straight away, no request needed. */
export function JoinByLink({ myName }: { myName?: string }) {
  const t = useTranslations("group");
  const te = useTranslations("errors");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function join() {
    setError(undefined);
    startTransition(async () => {
      const res = await joinGroup(invite, myName);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="join" className="sr-only">
          {t("pasteLink")}
        </label>
        <input
          id="join"
          value={invite}
          placeholder={t("pasteLink")}
          onChange={(e) => setInvite(e.target.value)}
          className="min-h-[52px] min-w-0 grow rounded-[14px] border-[1.5px] border-line bg-card px-4 font-medium placeholder:text-muted focus:border-lime focus:outline-none"
        />
        <button type="button" onClick={join} disabled={pending || !invite.trim() || myName?.trim() === ""} className="min-h-[52px] rounded-[14px] bg-paper px-5 font-bold text-ink disabled:opacity-60">
          {t("join")}
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
