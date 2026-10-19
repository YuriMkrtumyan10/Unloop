import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Group, Profile } from "@/lib/types";

export const GROUP_COOKIE = "unloop_group";

/** The signed-in user, their profile, and the group they're currently looking at. Redirects if either is missing. */
export async function requireGroup() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/welcome");

  const preferred = (await cookies()).get(GROUP_COOKIE)?.value;
  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id, groups(id, name, invite_code)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const groups = (memberships ?? []).map((m) => m.groups as unknown as Group).filter(Boolean);
  const group = groups.find((g) => g.id === preferred) ?? groups[0];
  if (!group) redirect("/group");

  const { data: members } = await supabase
    .from("group_members")
    .select("profiles(id, display_name, color)")
    .eq("group_id", group.id)
    .order("joined_at", { ascending: true });

  const crew = (members ?? []).map((m) => m.profiles as unknown as Profile).filter(Boolean);
  const me = crew.find((p) => p.id === user.id)!;

  return { supabase, user, group, crew, me };
}
