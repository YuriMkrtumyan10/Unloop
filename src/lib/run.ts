import { redirect } from "next/navigation";
import { requireGroup } from "@/lib/group";
import type { Challenge, Run } from "@/lib/types";

/** The group's open (revealed or accepted) challenge, or back to the spin screen if there is none. */
export async function requireOpenRun() {
  const ctx = await requireGroup();
  const { data } = await ctx.supabase
    .from("runs")
    .select("*, challenges(*)")
    .eq("group_id", ctx.group.id)
    .in("status", ["revealed", "accepted"])
    .maybeSingle();
  if (!data) redirect("/spin");
  const { challenges, ...run } = data as Run & { challenges: Challenge };
  const spinner = ctx.crew.find((p) => p.id === run.spun_by);
  return { ...ctx, run: run as Run, challenge: challenges, spinner };
}
