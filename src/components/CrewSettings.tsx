"use client";

import { useTranslations } from "next-intl";
import { signOut } from "@/app/actions";
import { InviteBox } from "./InviteBox";
import { LanguageSwitch } from "./LanguageSwitch";

/** Small extras at the bottom of the leaderboard: invite more friends, change language, sign out. */
export function CrewSettings({ code, groupName }: { code: string; groupName: string }) {
  const t = useTranslations("settings");
  return (
    <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-card p-5">
      <h2 className="text-[15px] font-semibold">{t("inviteMore")}</h2>
      <InviteBox code={code} groupName={groupName} />
      <div className="flex items-center justify-between gap-3 pt-2">
        <LanguageSwitch />
        <form action={signOut}>
          <button type="submit" className="min-h-10 text-sm font-semibold text-muted underline-offset-4 hover:underline">
            {t("signOut")}
          </button>
        </form>
      </div>
    </section>
  );
}
