import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Logo } from "@/components/Logo";
import { WelcomeAuth } from "@/components/WelcomeAuth";

export default async function Welcome({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/spin";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(safeNext);

  const t = await getTranslations("welcome");
  return (
    <main className="group relative flex min-h-dvh flex-col overflow-hidden px-6 pt-14 pb-8">
      <div className="flex justify-end">
        <LanguageSwitch />
      </div>
      {/* While a log in / sign up form is open, the logo and pitch step aside so the form fits on screen. */}
      <div className="flex grow flex-col justify-center gap-7 py-8 group-has-[form]:grow-0 group-has-[form]:gap-5 group-has-[form]:py-6">
        <div className="group-has-[form]:hidden">
          <Logo />
        </div>
        <h1 className="font-display text-[54px] leading-[0.95] font-extrabold tracking-[-0.02em]">unloop</h1>
        <p className="max-w-[300px] text-[22px] leading-[1.3] font-medium">
          {t("taglineSame")}
          <br />
          <span className="text-lime">{t("taglineNot")}</span>
        </p>
        <p className="max-w-[310px] text-base leading-[1.45] text-muted group-has-[form]:hidden">{t("pitch")}</p>
      </div>
      <WelcomeAuth next={safeNext} linkError={error === "link" || error === "reset" ? error : null} />
    </main>
  );
}
