import type { Locale } from "@/i18n/config";

/** Hours as a short label key + value for the translation files. */
export function timeLabel(min: number, max: number): { key: "minutes" | "hours" | "hoursRange" | "fullDay" | "overnight"; values: Record<string, number> } {
  if (max >= 12) return { key: "overnight", values: {} };
  if (max >= 8) return { key: "fullDay", values: {} };
  if (max < 1) return { key: "minutes", values: { n: Math.round(max * 60) } };
  if (min !== max) return { key: "hoursRange", values: { min, max } };
  return { key: "hours", values: { n: max } };
}

export function costLabel(cost: number) {
  return "$".repeat(cost);
}

const intlLocale: Record<Locale, string> = { en: "en-GB", hy: "hy-AM", ru: "ru-RU" };

export function formatDay(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "short" }).format(new Date(iso));
}

export function formatMonth(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "long", year: "numeric" }).format(new Date(iso));
}

export function formatClock(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}
