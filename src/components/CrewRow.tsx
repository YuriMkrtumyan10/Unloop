import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Membership } from "@/lib/group";
import { rowClass } from "@/lib/ui";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

/** One crew in the Crews tab. Opens the crew's page. */
export function CrewRow({ crew, current, requests }: { crew: Membership; current: boolean; requests: number }) {
  const t = useTranslations("crews");
  return (
    <Link href={`/crews/${crew.group.id}`} className={`${rowClass} py-2.5 ${current ? "border-[1.5px] border-lime" : ""}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-raised font-display text-base font-bold text-lime">{crew.group.name.trim().charAt(0).toUpperCase()}</span>
      <span className="flex min-w-0 grow flex-col">
        <span className="flex min-w-0 items-center gap-1.5">
          <b className="truncate font-bold">{crew.group.name}</b>
          {crew.role === "admin" && (
            <span className="shrink-0 text-lime" title={t("admin")}>
              <Icon name="crown" size={14} />
              <span className="sr-only">{t("admin")}</span>
            </span>
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-muted">{t("members", { n: crew.members })}</span>
      </span>
      {requests > 0 ? <Tag tone="lime">{t("wantIn", { n: requests })}</Tag> : current && <Tag tone="lime">{t("playingNow")}</Tag>}
      <Icon name="chevron" size={18} className="shrink-0 text-muted" />
    </Link>
  );
}
