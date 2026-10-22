"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createGroup } from "@/app/actions";

export type CreatedCrew = { id: string; code: string; name: string };

/** Name a new crew and create it. Without onCreated, opens the new crew's page (with its invite link). */
export function CreateCrew({ myName, onCreated }: { myName?: string; onCreated?: (crew: CreatedCrew) => void }) {
  const t = useTranslations("group");
  const te = useTranslations("errors");
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function create() {
    setError(undefined);
    startTransition(async () => {
      const res = await createGroup(name, myName);
      if (res.error || !res.groupId || !res.inviteCode) setError(res.error ?? "generic");
      else if (onCreated) onCreated({ id: res.groupId, code: res.inviteCode, name: name.trim() });
      else router.push(`/crews/${res.groupId}`);
    });
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-3xl bg-card p-5">
      <label htmlFor="gname" className="text-[15px] font-semibold">
        {t("nameCrew")}
      </label>
      <input
        id="gname"
        value={name}
        maxLength={40}
        placeholder={t("crewPlaceholder")}
        onChange={(e) => setName(e.target.value)}
        className="min-h-[52px] rounded-[14px] border-[1.5px] border-line bg-ink px-4 text-[17px] font-semibold placeholder:text-dim focus:border-lime focus:outline-none"
      />
      <button type="button" onClick={create} disabled={pending || !name.trim() || myName?.trim() === ""} className="min-h-[52px] rounded-[14px] bg-lime font-bold text-ink disabled:opacity-60">
        {t("create")}
      </button>
      {error && (
        <p role="alert" className="text-sm text-extreme">
          {te(error as "generic")}
        </p>
      )}
    </div>
  );
}
