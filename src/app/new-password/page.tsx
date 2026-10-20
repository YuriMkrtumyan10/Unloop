import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { PasswordForm } from "@/components/PasswordForm";

// Where a password reset link lands, already signed in by the link.
export default async function NewPassword() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/welcome?error=reset");

  const t = await getTranslations("account");
  return (
    <main className="flex min-h-dvh flex-col justify-center gap-6 px-6 py-14">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] leading-[1.1] font-bold tracking-[-0.01em]">{t("newPasswordTitle")}</h1>
        <p className="text-[15px] leading-snug text-muted">{t("newPasswordText")}</p>
      </div>
      <PasswordForm variant="reset" />
    </main>
  );
}
