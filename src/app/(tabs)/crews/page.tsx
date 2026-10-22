import { getTranslations } from "next-intl/server";
import { myCrews, requireUser } from "@/lib/group";
import { sectionHeading } from "@/lib/ui";
import { CreateCrew } from "@/components/CreateCrew";
import { CrewRow } from "@/components/CrewRow";
import { CrewSearch } from "@/components/CrewSearch";
import { JoinByLink } from "@/components/JoinByLink";
import { SoloRow } from "@/components/SoloRow";
import { WaitingRow } from "@/components/WaitingRow";

type Waiting = { group_id: string; name: string; members: number };

/** Every crew you're in, plus finding, starting and joining more. Works with no crew at all. */
export default async function CrewsPage() {
  const { supabase, user } = await requireUser();
  const t = await getTranslations("crews");

  const [{ crews, current }, { data: incoming }, { data: waiting }] = await Promise.all([
    myCrews(supabase, user.id),
    supabase.from("join_requests").select("group_id").neq("user_id", user.id),
    supabase.rpc("my_requests"),
  ]);
  const solo = crews.find((c) => c.group.solo);
  const others = crews.filter((c) => !c.group.solo).reverse();
  const requestsFor = (groupId: string) => (incoming ?? []).filter((r) => r.group_id === groupId).length;

  return (
    <div className="flex grow flex-col gap-7 px-6 pt-[52px] pb-8">
      <h1 className="font-display text-[26px] font-bold">{t("title")}</h1>

      <section className="flex flex-col gap-2.5">
        <h2 className={sectionHeading}>{t("yours")}</h2>
        <SoloRow current={Boolean(solo && current?.group.id === solo.group.id)} />
        {others.map((crew) => (
          <CrewRow key={crew.group.id} crew={crew} current={current?.group.id === crew.group.id} requests={crew.role === "admin" ? requestsFor(crew.group.id) : 0} />
        ))}
      </section>

      {(waiting as Waiting[] | null)?.length ? (
        <section className="flex flex-col gap-2.5">
          <h2 className={sectionHeading}>{t("waiting")}</h2>
          {(waiting as Waiting[]).map((w) => (
            <WaitingRow key={w.group_id} groupId={w.group_id} name={w.name} members={w.members} />
          ))}
        </section>
      ) : null}

      <section className="flex flex-col gap-2.5">
        <h2 className={sectionHeading}>{t("find")}</h2>
        <CrewSearch />
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className={sectionHeading}>{t("start")}</h2>
        <CreateCrew />
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className={sectionHeading}>{t("haveLink")}</h2>
        <JoinByLink />
      </section>
    </div>
  );
}
