"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { joinGroup } from "@/app/actions";
import { NameField } from "./NameField";

export function JoinNow({ code, defaultName }: { code: string; defaultName: string }) {
  const t = useTranslations("join");
  const te = useTranslations("errors");
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-5">
      <NameField value={name} onChange={setName} />
      <button
        type="button"
        disabled={pending || !name.trim()}
        onClick={() =>
          startTransition(async () => {
            const res = await joinGroup(code, name);
            if (res?.error) setError(res.error);
          })
        }
        className="min-h-[58px] rounded-[18px] bg-lime font-display text-lg font-extrabold text-ink disabled:opacity-60"
      >
        {t("cta")}
      </button>
      {error && <p role="alert" className="text-sm text-extreme">{te(error as "badInvite")}</p>}
    </div>
  );
}
