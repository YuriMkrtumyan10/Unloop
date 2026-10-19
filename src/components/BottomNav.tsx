"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "./Icon";

const tabs: { href: string; key: "spin" | "scrapbook" | "leaderboard"; icon: IconName }[] = [
  { href: "/spin", key: "spin", icon: "spin" },
  { href: "/scrapbook", key: "scrapbook", icon: "scrapbook" },
  { href: "/leaderboard", key: "leaderboard", icon: "leaderboard" },
];

export function BottomNav() {
  const t = useTranslations("nav");
  const path = usePathname();
  return (
    <nav className="sticky bottom-0 grid grid-cols-3 border-t border-raised bg-ink px-3 pt-2.5 pb-[max(26px,env(safe-area-inset-bottom))]">
      {tabs.map((tab) => {
        const active = path.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 text-xs ${active ? "font-bold text-lime" : "font-semibold text-muted"}`}
          >
            <Icon name={tab.icon} size={22} />
            {t(tab.key)}
          </Link>
        );
      })}
    </nav>
  );
}
