// Times are rendered on the server, which runs in UTC. The phone tells us its time zone through this cookie.
export const TIME_ZONE_COOKIE = "unloop_tz";

// Until the phone has told us (the very first page), assume Yerevan: that's where the first crews are.
export const DEFAULT_TIME_ZONE = "Asia/Yerevan";

/** The cookie's time zone if it's a real one, otherwise the default. */
export function safeTimeZone(value: string | undefined): string {
  if (!value) return DEFAULT_TIME_ZONE;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return value;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}
