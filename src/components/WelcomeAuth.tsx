"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "./Icon";

export function WelcomeAuth({ next }: { next: string }) {
  const t = useTranslations("welcome");
  const [mode, setMode] = useState<"pick" | "email" | "sent">("pick");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function google() {
    setBusy(true);
    setError(false);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectTo() } });
    if (error) {
      setError(true);
      setBusy(false);
    }
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const { error } = await createClient().auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo() } });
    setBusy(false);
    if (error) setError(true);
    else setMode("sent");
  }

  if (mode === "sent") {
    return (
      <div className="flex flex-col gap-3 rounded-3xl bg-card p-5">
        <p className="font-display text-xl font-bold">{t("checkInbox")}</p>
        <p className="text-[15px] text-muted">{t("linkSent", { email })}</p>
        <button type="button" onClick={() => setMode("email")} className="min-h-11 self-start text-sm font-semibold text-lime">
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mode === "email" ? (
        <form onSubmit={sendLink} className="flex flex-col gap-3">
          <label htmlFor="email" className="sr-only">
            {t("emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-14 rounded-[18px] border-[1.5px] border-line bg-card px-4 text-[17px] font-semibold placeholder:text-muted focus:border-lime focus:outline-none"
          />
          <button type="submit" disabled={busy} className="min-h-14 rounded-[18px] bg-lime text-[17px] font-bold text-ink disabled:opacity-60">
            {t("sendLink")}
          </button>
          <button type="button" onClick={() => setMode("pick")} className="min-h-11 text-sm font-semibold text-muted">
            {t("back")}
          </button>
        </form>
      ) : (
        <>
          <button type="button" onClick={google} disabled={busy} className="flex min-h-14 items-center justify-center gap-2.5 rounded-[18px] bg-lime text-[17px] font-bold text-ink disabled:opacity-60">
            <Icon name="google" strokeWidth={2.2} />
            {t("google")}
          </button>
          <button type="button" onClick={() => setMode("email")} className="flex min-h-14 items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-line bg-card text-[17px] font-semibold">
            <Icon name="mail" />
            {t("email")}
          </button>
        </>
      )}
      {error && <p role="alert" className="text-center text-sm text-extreme">{t("error")}</p>}
      <p className="mt-2 text-center text-[13px] leading-snug text-muted">{t("inviteHint")}</p>
    </div>
  );
}
