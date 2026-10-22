import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Group } from "@/lib/types";
import { Icon } from "./Icon";

/** The crew's name at the top of a tab. Tap it to switch crews. */
export function CrewLink({ group, suffix }: { group: Group; suffix?: string }) {
  const t = useTranslations("crews");
  return (
    <Link href="/crews" className="flex min-w-0 items-center gap-1 text-[13px] font-medium text-muted">
      <span className="truncate">
        {group.solo ? t("justMe") : group.name}
        {suffix && ` · ${suffix}`}
      </span>
      <Icon name="chevron" size={14} strokeWidth={2.4} className="shrink-0" />
    </Link>
  );
}
