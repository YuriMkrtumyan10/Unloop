"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TIME_ZONE_COOKIE } from "@/lib/timezone";

/** Tells the server this phone's time zone, so "accepted at 21:10" and scrapbook dates are local. */
export function TimeZoneCookie() {
  const router = useRouter();
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!zone) return;
    const current = document.cookie.match(new RegExp(`(?:^|; )${TIME_ZONE_COOKIE}=([^;]*)`))?.[1];
    if (current && decodeURIComponent(current) === zone) return;
    document.cookie = `${TIME_ZONE_COOKIE}=${encodeURIComponent(zone)}; path=/; max-age=31536000; samesite=lax`;
    // Re-render once with the right zone (only happens on a phone's first visit or after travelling).
    router.refresh();
  }, [router]);
  return null;
}
