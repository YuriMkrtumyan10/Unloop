"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { goSolo } from "@/app/actions";
import { CreateCrew, type CreatedCrew } from "./CreateCrew";
import { CrewSearch } from "./CrewSearch";
import { Icon } from "./Icon";
import { InviteBox } from "./InviteBox";
import { JoinByLink } from "./JoinByLink";
import { NameField } from "./NameField";

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-muted">
      <span className="h-px grow bg-line" />
      {children}
      <span className="h-px grow bg-line" />
    </div>
  );
}

/** First stop after sign-up: your name, then start a crew, find one, go solo, or paste an invite link. */
export function GroupSetup({ defaultName }: { defaultName: string }) {
  const t = useTranslations("group");
  const te = useTranslations("errors");
  const [myName, setMyName] = useState(defaultName);
  const [created, setCreated] = useState<CreatedCrew>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (created) {
    return (
      <div className="flex flex-col gap-3.5 rounded-3xl border-[1.5px] border-dashed border-lime p-5">
        <div className="flex items-center gap-2.5">
          <Icon name="check" strokeWidth={2.2} className="text-lime" />
          <p className="text-[15px] font-semibold">{t("created")}</p>
        </div>
        <InviteBox code={created.code} groupName={created.name} />
        <Link href="/spin" className="flex min-h-[58px] items-center justify-center rounded-[18px] bg-lime font-display text-lg font-extrabold text-ink">
          {t("letsGo")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <NameField value={myName} onChange={setMyName} />

      <CreateCrew myName={myName} onCreated={setCreated} />

      <Divider>{t("findCrew")}</Divider>
      <CrewSearch myName={myName} />

      <Divider>{t("noCrewYet")}</Divider>
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          disabled={pending || !myName.trim()}
          onClick={() =>
            startTransition(async () => {
              setError(undefined);
              const res = await goSolo(myName);
              if (res?.error) setError(res.error);
            })
          }
          className="flex min-h-14 items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-line bg-card text-[17px] font-semibold disabled:opacity-60"
        >
          <Icon name="account" size={20} />
          {t("soloCta")}
        </button>
        <p className="text-center text-[13px] font-medium text-muted">{t("soloHint")}</p>
        {error && (
          <p role="alert" className="text-center text-sm text-extreme">
            {te(error as "generic")}
          </p>
        )}
      </div>

      <Divider>{t("haveLink")}</Divider>
      <JoinByLink myName={myName} />
    </div>
  );
}
