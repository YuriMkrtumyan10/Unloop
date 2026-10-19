"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { GROUP_COOKIE } from "@/lib/group";
import { isLocale, LOCALE_COOKIE } from "@/i18n/config";
import type { SpinFilters } from "@/lib/types";

const YEAR = 60 * 60 * 24 * 365;

export async function setLocale(locale: string) {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, { path: "/", maxAge: YEAR, sameSite: "lax" });
  revalidatePath("/", "layout");
}

async function saveName(name: string) {
  const clean = name.trim().slice(0, 40);
  if (!clean) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) await supabase.from("profiles").update({ display_name: clean }).eq("id", user.id);
}

async function rememberGroup(groupId: string) {
  (await cookies()).set(GROUP_COOKIE, groupId, { path: "/", maxAge: YEAR, sameSite: "lax" });
}

export async function createGroup(name: string, myName: string): Promise<{ error?: string; inviteCode?: string }> {
  const groupName = name.trim();
  if (!groupName) return { error: "needName" };
  await saveName(myName);
  const supabase = await createClient();
  const { data: groupId, error } = await supabase.rpc("create_group", { group_name: groupName.slice(0, 40) });
  if (error || !groupId) return { error: "generic" };
  await rememberGroup(groupId);
  const { data } = await supabase.from("groups").select("invite_code").eq("id", groupId).single();
  return { inviteCode: data?.invite_code };
}

/** Accepts a bare code or a full invite link. */
export async function joinGroup(codeOrLink: string, myName?: string): Promise<{ error?: string }> {
  const code = codeOrLink.trim().split("/").filter(Boolean).pop() ?? "";
  if (!code) return { error: "badInvite" };
  if (myName) await saveName(myName);
  const supabase = await createClient();
  const { data: groupId, error } = await supabase.rpc("join_group", { code });
  if (error || !groupId) return { error: "badInvite" };
  await rememberGroup(groupId);
  redirect("/spin");
}

export async function spin(groupId: string, filters: SpinFilters): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: runId, error } = await supabase.rpc("spin", { gid: groupId, f: filters });
  if (error) return { error: "generic" };
  if (!runId) return { error: "nothingFits" };
  redirect("/run");
}

export async function reroll(runId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reroll", { rid: runId });
  if (error) return { error: error.message === "nothing_else_fits" ? "nothingElse" : "generic" };
  revalidatePath("/run");
  return {};
}

export async function acceptRun(runId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_run", { rid: runId });
  if (error) return { error: "generic" };
  revalidatePath("/run");
  return {};
}

export async function completeRun(runId: string, participantIds: string[], photoPath: string | null, note: string): Promise<{ error?: string }> {
  if (participantIds.length === 0) return { error: "nobody" };
  const supabase = await createClient();
  const { error } = await supabase.rpc("complete_run", {
    rid: runId,
    participant_ids: participantIds,
    photo: photoPath,
    note_text: note.slice(0, 80),
  });
  if (error) return { error: "generic" };
  redirect("/scrapbook");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/welcome");
}
