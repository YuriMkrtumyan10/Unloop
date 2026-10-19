"use client";

import { useTranslations } from "next-intl";
import { InviteBox } from "./InviteBox";

/** Bottom of the leaderboard: the invite link for friends who join late. */
export function InviteSection({ code, groupName }: { code: string; groupName: string }) {
  const t = useTranslations("settings");
  return (
    <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-card p-5">
      <h2 className="text-[15px] font-semibold">{t("inviteMore")}</h2>
      <InviteBox code={code} groupName={groupName} />
    </section>
  );
}
