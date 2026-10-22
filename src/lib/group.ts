import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Group, Profile, Role } from "@/lib/types";

export const GROUP_COOKIE = "unloop_group";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type Membership = { group: Group; role: Role; members: number };

/** The signed-in user, or off to the welcome screen. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/welcome");
  return { supabase, user };
}

/** Every crew you're in (your "Just me" space too), newest first, and the one you're playing with right now. */
export async function myCrews(supabase: Supabase, userId: string) {
  const preferred = (await cookies()).get(GROUP_COOKIE)?.value;
  const { data } = await supabase
    .from("group_members")
    .select("role, groups(id, name, invite_code, solo, group_members(count))")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  const crews: Membership[] = (data ?? []).flatMap((m) => {
    const g = m.groups as unknown as (Group & { group_members: { count: number }[] }) | null;
    if (!g) return [];
    return [{ group: { id: g.id, name: g.name, invite_code: g.invite_code, solo: g.solo }, role: m.role as Role, members: g.group_members[0]?.count ?? 0 }];
  });
  const current = crews.find((c) => c.group.id === preferred) ?? crews[0];
  return { crews, current };
}

/** The signed-in user, their profile, and the crew they're currently playing with. Redirects if either is missing. */
export async function requireGroup() {
  const { supabase, user } = await requireUser();
  const { current } = await myCrews(supabase, user.id);
  if (!current) redirect("/group");
  const { group, role } = current;

  const { data: members } = await supabase
    .from("group_members")
    .select("profiles(id, display_name, color)")
    .eq("group_id", group.id)
    .order("joined_at", { ascending: true });

  const crew = (members ?? []).map((m) => m.profiles as unknown as Profile).filter(Boolean);
  const me = crew.find((p) => p.id === user.id)!;

  return { supabase, user, group, role, crew, me };
}
