import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { JoinNow } from "@/components/JoinNow";

// Invite links: /join/<code>. Strangers sign in first and come straight back here.
export default async function Join({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/welcome?next=${encodeURIComponent(`/join/${code}`)}`);

  const { data: me } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
  const t = await getTranslations("join");
  return (
    <main className="flex min-h-dvh flex-col justify-center gap-6 px-6 py-14">
      <h1 className="font-display text-[30px] leading-[1.1] font-bold tracking-[-0.01em]">{t("title")}</h1>
      <JoinNow code={code} defaultName={me?.display_name ?? ""} />
    </main>
  );
}
