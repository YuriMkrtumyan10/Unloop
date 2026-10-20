import { useTranslations } from "next-intl";
import { rowClass } from "@/lib/ui";
import { Icon, type IconName } from "./Icon";

/** A setting that's planned but not built yet: shown with a "Soon" tag, can't be tapped. */
export function SoonRow({ icon, label, danger = false }: { icon: IconName; label: string; danger?: boolean }) {
  const t = useTranslations("account");
  return (
    <button type="button" disabled className={`${rowClass} cursor-not-allowed ${danger ? "text-extreme" : "text-paper"}`}>
      <Icon name={icon} className={`shrink-0 ${danger ? "" : "text-muted"}`} />
      <span className="min-w-0 grow opacity-75">{label}</span>
      <span className="shrink-0 rounded-full bg-raised px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] text-muted uppercase">{t("soon")}</span>
    </button>
  );
}
