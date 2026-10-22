"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { goSolo } from "@/app/actions";
import { rowClass } from "@/lib/ui";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

/** "Just me" in the Crews tab: tap to spin solo (the space is made the first time). */
export function SoloRow({ current }: { current: boolean }) {
  const t = useTranslations("crews");
  const te = useTranslations("errors");
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await goSolo();
            setError(Boolean(res?.error));
          })
        }
        className={`${rowClass} py-2.5 disabled:opacity-60 ${current ? "border-[1.5px] border-lime" : ""}`}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-raised text-lime">
          <Icon name="account" />
        </span>
        <span className="flex min-w-0 grow flex-col">
          <b className="truncate font-bold">{t("justMe")}</b>
          <span className="truncate text-[13px] font-medium text-muted">{t("justMeHint")}</span>
        </span>
        {current && <Tag tone="lime">{t("playingNow")}</Tag>}
        <Icon name="chevron" size={18} className="shrink-0 text-muted" />
      </button>
      {error && (
        <p role="alert" className="text-sm text-extreme">
          {te("generic")}
        </p>
      )}
    </>
  );
}
