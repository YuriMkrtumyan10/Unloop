"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions";
import { locales } from "@/i18n/config";

export function LanguageSwitch() {
  const current = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-1" role="group" aria-label="Language">
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            aria-pressed={active}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await setLocale(locale);
                router.refresh();
              })
            }
            className={`min-h-9 rounded-full px-3 py-2 text-[13px] font-semibold uppercase ${active ? "bg-paper text-ink" : "border border-line text-muted"}`}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
