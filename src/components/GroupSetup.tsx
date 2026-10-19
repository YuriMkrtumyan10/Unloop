"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createGroup, joinGroup } from "@/app/actions";
import { Icon } from "./Icon";
import { InviteBox } from "./InviteBox";
import { NameField } from "./NameField";

export function GroupSetup({ defaultName }: { defaultName: string }) {
  const t = useTranslations("group");
  const te = useTranslations("errors");
  const [myName, setMyName] = useState(defaultName);
  const [groupName, setGroupName] = useState("");
  const [invite, setInvite] = useState("");
  const [created, setCreated] = useState<{ code: string; name: string }>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function create() {
    setError(undefined);
    startTransition(async () => {
      const res = await createGroup(groupName, myName);
      if (res.error || !res.inviteCode) setError(res.error ?? "generic");
      else setCreated({ code: res.inviteCode, name: groupName.trim() });
    });
  }

  function join() {
    setError(undefined);
    startTransition(async () => {
      const res = await joinGroup(invite, myName);
      if (res?.error) setError(res.error);
    });
  }

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

      <div className="flex flex-col gap-3.5 rounded-3xl bg-card p-5">
        <label htmlFor="gname" className="text-[15px] font-semibold">
          {t("nameCrew")}
        </label>
        <input
          id="gname"
          value={groupName}
          maxLength={40}
          placeholder={t("crewPlaceholder")}
          onChange={(e) => setGroupName(e.target.value)}
          className="min-h-[52px] rounded-[14px] border-[1.5px] border-line bg-ink px-4 text-[17px] font-semibold placeholder:text-dim focus:border-lime focus:outline-none"
        />
        <button type="button" onClick={create} disabled={pending || !groupName.trim() || !myName.trim()} className="min-h-[52px] rounded-[14px] bg-lime font-bold text-ink disabled:opacity-60">
          {t("create")}
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm font-medium text-muted">
        <span className="h-px grow bg-line" />
        {t("haveLink")}
        <span className="h-px grow bg-line" />
      </div>

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
        <button type="button" onClick={join} disabled={pending || !invite.trim() || !myName.trim()} className="min-h-[52px] rounded-[14px] bg-paper px-5 font-bold text-ink disabled:opacity-60">
          {t("join")}
        </button>
      </div>

      {error && <p role="alert" className="text-sm text-extreme">{te(error as "generic")}</p>}
    </div>
  );
}
