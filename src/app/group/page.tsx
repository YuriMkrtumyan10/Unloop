import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { GroupSetup } from "@/components/GroupSetup";

export default async function GroupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/welcome");
  const { data: me } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();

  const t = await getTranslations("group");
  return (
    <main className="flex min-h-dvh flex-col gap-7 px-6 pt-14 pb-8">
      <h1 className="font-display text-[30px] leading-[1.1] font-bold tracking-[-0.01em]">{t("title")}</h1>
      <GroupSetup defaultName={me?.display_name ?? ""} />
    </main>
  );
}
