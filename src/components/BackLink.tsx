import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "./Icon";

export function BackLink({ href }: { href: string }) {
  const t = useTranslations("common");
  return (
    <Link href={href} aria-label={t("back")} className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-card text-paper">
      <Icon name="back" strokeWidth={2.2} />
    </Link>
  );
}
