import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { switchCrew } from "@/app/actions";
import { myCrews, requireUser } from "@/lib/group";
import type { Profile, Role } from "@/lib/types";
import { sectionHeading } from "@/lib/ui";
import { Avatar } from "@/components/Avatar";
import { BackLink } from "@/components/BackLink";
import { Icon } from "@/components/Icon";
import { InviteBox } from "@/components/InviteBox";
import { JoinRequests } from "@/components/JoinRequests";
import { LeaveCrew } from "@/components/LeaveCrew";
import { Tag } from "@/components/Tag";

/** One crew: who's in, requests to join (admin only), the invite link, and leaving. */
export default async function CrewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const { crews, current } = await myCrews(supabase, user.id);
  const crew = crews.find((c) => c.group.id === id);
  if (!crew || crew.group.solo) redirect("/crews");
  const { group, role } = crew;
  const t = await getTranslations("crews");

  const [{ data: memberRows }, { data: requestRows }] = await Promise.all([
    supabase.from("group_members").select("role, profiles(id, display_name, color)").eq("group_id", id).order("joined_at", { ascending: true }),
    role === "admin" ? supabase.from("join_requests").select("profiles(id, display_name, color)").eq("group_id", id).order("created_at", { ascending: true }) : Promise.resolve({ data: [] }),
  ]);
  const members = (memberRows ?? []).flatMap((m) => {
    const profile = m.profiles as unknown as Profile | null;
    return profile ? [{ profile, role: m.role as Role }] : [];
  });
  const requests = (requestRows ?? []).map((r) => r.profiles as unknown as Profile | null).filter((p): p is Profile => Boolean(p));

  // What happens when you leave: the member who joined first after you takes over as admin.
  const others = members.filter((m) => m.profile.id !== user.id);
  const leaveNote = others.length === 0 ? t("leaveLast") : role === "admin" ? t("leaveAdmin", { name: others[0].profile.display_name }) : undefined;
  const isCurrent = current?.group.id === id;

  return (
    <div className="flex grow flex-col gap-7 px-6 pt-[52px] pb-8">
      <header className="flex items-start gap-3">
        <BackLink href="/crews" />
        <div className="flex min-w-0 flex-col gap-1 pt-0.5">
          <h1 className="font-display text-[26px] leading-[1.1] font-bold break-words">{group.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-muted">{t("members", { n: members.length })}</span>
            {isCurrent && <Tag tone="lime">{t("playingNow")}</Tag>}
          </div>
        </div>
      </header>

      {!isCurrent && (
        <form action={switchCrew.bind(null, id)}>
          <button type="submit" className="flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-[18px] bg-lime px-4 font-display text-lg font-extrabold text-ink">
            <Icon name="spin" strokeWidth={2.4} />
            {t("spinWith")}
          </button>
        </form>
      )}

      {requests.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className={sectionHeading}>{t("wantsToJoin")}</h2>
          <JoinRequests groupId={id} people={requests} />
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <h2 className={sectionHeading}>{t("theCrew")}</h2>
        {members.map(({ profile, role: memberRole }) => (
          <div key={profile.id} className="flex min-h-16 items-center gap-3.5 rounded-[18px] bg-card px-4">
            <Avatar profile={profile} size={40} />
            <b className="min-w-0 grow truncate font-bold">
              {profile.display_name}
              {profile.id === user.id && <span className="font-medium text-muted"> ({t("you")})</span>}
            </b>
            {memberRole === "admin" && (
              <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-lime">
                <Icon name="crown" size={16} />
                {t("admin")}
              </span>
            )}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-3xl bg-card p-5">
        <h2 className="text-[15px] font-semibold">{t("invite")}</h2>
        <InviteBox code={group.invite_code} groupName={group.name} />
      </section>

      <LeaveCrew groupId={id} crewName={group.name} note={leaveNote} />
    </div>
  );
}
