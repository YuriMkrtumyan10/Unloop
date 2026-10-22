"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "./Icon";

const tabs: { href: string; key: "spin" | "scrapbook" | "leaderboard" | "crews" | "account"; icon: IconName }[] = [
  { href: "/spin", key: "spin", icon: "spin" },
  { href: "/scrapbook", key: "scrapbook", icon: "scrapbook" },
  { href: "/leaderboard", key: "leaderboard", icon: "leaderboard" },
  { href: "/crews", key: "crews", icon: "social" },
  { href: "/account", key: "account", icon: "account" },
];

/** requests: people waiting to join a crew you're the admin of (a dot on the Crews tab). */
export function BottomNav({ requests = 0 }: { requests?: number }) {
  const t = useTranslations("nav");
  const path = usePathname();
  return (
    <nav className="sticky bottom-0 grid grid-cols-5 border-t border-raised bg-ink px-1 pt-2.5 pb-[max(26px,env(safe-area-inset-bottom))]">
      {tabs.map((tab) => {
        const active = path.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 text-[11px] ${active ? "font-bold text-lime" : "font-semibold text-muted"}`}
          >
            <span className="relative">
              <Icon name={tab.icon} size={22} />
              {tab.key === "crews" && requests > 0 && (
                <>
                  <span className="absolute -top-0.5 -right-1 size-2.5 rounded-full bg-lime ring-2 ring-ink" />
                  <span className="sr-only">{t("requests", { n: requests })}</span>
                </>
              )}
            </span>
            <span className="max-w-full truncate">{t(tab.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
