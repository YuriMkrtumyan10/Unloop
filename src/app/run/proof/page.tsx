import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireOpenRun } from "@/lib/run";
import { BackLink } from "@/components/BackLink";
import { ProofForm } from "@/components/ProofForm";

export default async function ProofPage() {
  const { run, challenge, crew, group } = await requireOpenRun();
  if (run.status !== "accepted") redirect("/run");
  const t = await getTranslations("proof");
  return (
    <main className="flex min-h-dvh flex-col gap-[22px] px-6 pt-[52px] pb-8">
      <div className="flex items-center gap-3">
        <BackLink href="/run" />
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
      </div>
      <ProofForm runId={run.id} groupId={group.id} points={challenge.points} crew={crew} solo={group.solo} />
    </main>
  );
}
