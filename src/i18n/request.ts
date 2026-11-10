import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { safeTimeZone, TIME_ZONE_COOKIE } from "@/lib/timezone";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "./config";

// No locale in the URL: the language lives in a cookie the user picks on the welcome screen.
export default getRequestConfig(async () => {
  const jar = await cookies();
  const stored = jar.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(stored) ? stored : defaultLocale;
  return {
    locale,
    // The phone's own time zone (set by TimeZoneCookie), so times aren't shown in the server's UTC.
    timeZone: safeTimeZone(jar.get(TIME_ZONE_COOKIE)?.value),
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
