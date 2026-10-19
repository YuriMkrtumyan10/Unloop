import { useTranslations } from "next-intl";
import { signOut } from "@/app/actions";
import type { Profile } from "@/lib/types";
import { sectionHeading } from "@/lib/ui";
import { LanguageSwitch } from "./LanguageSwitch";
import { PasswordForm } from "./PasswordForm";
import { ProfileForm } from "./ProfileForm";
import { SoonRow } from "./SoonRow";

/** The Account tab: profile, password, language, sign out, and rows for what's coming later. */
export function AccountScreen({ profile, email, groupName }: { profile: Profile; email: string; groupName: string }) {
  const t = useTranslations("account");
  return (
    <div className="flex grow flex-col gap-7 px-6 pt-[52px] pb-8">
      <header className="flex flex-col gap-1">
        <span className="truncate text-[13px] font-medium text-muted">{groupName}</span>
        <h1 className="font-display text-[26px] font-bold">{t("title")}</h1>
      </header>

      <ProfileForm profile={profile} email={email} />

      <section className="flex flex-col gap-2.5">
        <h2 className={sectionHeading}>{t("signIn")}</h2>
        <PasswordForm variant="account" />
        <SoonRow icon="mail" label={t("changeEmail")} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={sectionHeading}>{t("language")}</h2>
        <LanguageSwitch />
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className={sectionHeading}>{t("more")}</h2>
        <SoonRow icon="bell" label={t("notifications")} />
        <SoonRow icon="leave" label={t("leaveCrew")} />
        <SoonRow icon="trash" label={t("deleteAccount")} danger />
      </section>

      <form action={signOut}>
        <button type="submit" className="min-h-[52px] w-full rounded-[18px] border-[1.5px] border-line text-[15px] font-semibold">
          {t("signOut")}
        </button>
      </form>
    </div>
  );
}
