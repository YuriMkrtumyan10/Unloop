"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey, type AuthErrorKey } from "@/lib/auth-errors";
import { Field } from "./Field";
import { Icon } from "./Icon";
import { PasswordField } from "./PasswordField";

type Mode = "pick" | "login" | "signup" | "forgot" | "confirmSent" | "resetSent";

const primary = "flex min-h-14 items-center justify-center gap-2.5 rounded-[18px] bg-lime text-[17px] font-bold text-ink disabled:opacity-60";
const secondary = "flex min-h-14 items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-line bg-card text-[17px] font-semibold disabled:opacity-60";

/** linkError: an email link that didn't work ("reset" for a password reset link). */
export function WelcomeAuth({ next, linkError }: { next: string; linkError: "link" | "reset" | null }) {
  const t = useTranslations("welcome");
  const te = useTranslations("errors");
  const [mode, setMode] = useState<Mode>(linkError === "reset" ? "forgot" : linkError ? "login" : "pick");
  const [notice, setNotice] = useState(linkError !== null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey>();

  function go(to: Mode) {
    setMode(to);
    setPassword("");
    setError(undefined);
    setNotice(false);
  }

  const callback = (path: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(path)}`;

  async function logIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(authErrorKey(error));
      setBusy(false);
      return;
    }
    window.location.assign(next);
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    const { data, error } = await createClient().auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: callback(next) } });
    if (data.session) {
      window.location.assign(next);
      return;
    }
    setBusy(false);
    if (error) setError(authErrorKey(error));
    // With email confirmation on, an address that already has an account comes back with no identities.
    else if (data.user?.identities?.length === 0) setError("userExists");
    else go("confirmSent");
  }

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: callback("/new-password") });
    setBusy(false);
    if (error) setError(authErrorKey(error));
    else go("resetSent");
  }

  async function google() {
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback(next) } });
    if (error) {
      setError("generic");
      setBusy(false);
    }
  }

  const errorLine = error && (
    <p role="alert" className="text-center text-sm text-extreme">
      {te(error)}
    </p>
  );

  if (mode === "confirmSent" || mode === "resetSent") {
    return (
      <div className="flex flex-col gap-3 rounded-3xl bg-card p-5">
        <p className="font-display text-xl font-bold">{t("checkInbox")}</p>
        <p className="text-[15px] leading-snug text-soft">{t(mode === "confirmSent" ? "confirmSent" : "resetSent", { email: email.trim() })}</p>
        <button type="button" onClick={() => go("login")} className="min-h-11 self-start text-sm font-semibold text-lime">
          {t(mode === "confirmSent" ? "confirmedLogin" : "backToLogin")}
        </button>
      </div>
    );
  }

  if (mode === "pick") {
    return (
      <div className="flex flex-col gap-3">
        <button type="button" onClick={() => go("login")} className={primary}>
          {t("login")}
        </button>
        <button type="button" onClick={() => go("signup")} className={secondary}>
          {t("signup")}
        </button>
        <div className="flex items-center gap-3 py-1 text-[13px] font-medium text-muted" aria-hidden="true">
          <span className="h-px grow bg-line" />
          {t("or")}
          <span className="h-px grow bg-line" />
        </div>
        <button type="button" onClick={google} disabled={busy} className={secondary}>
          <Icon name="google" strokeWidth={2.2} />
          {t("google")}
        </button>
        {errorLine}
        <p className="mt-2 text-center text-[13px] leading-snug text-muted">{t("inviteHint")}</p>
      </div>
    );
  }

  const emailField = (
    <Field
      id="email"
      label={t("emailLabel")}
      type="email"
      required
      autoFocus
      autoComplete="email"
      inputMode="email"
      placeholder={t("emailPlaceholder")}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );

  if (mode === "forgot") {
    return (
      <form onSubmit={sendReset} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-xl font-bold">{t("forgotTitle")}</h2>
          <p className="text-[15px] leading-snug text-muted">{t("forgotText")}</p>
        </div>
        {notice && <p className="rounded-[14px] bg-card p-3.5 text-sm leading-snug text-soft">{t("resetError")}</p>}
        {emailField}
        <button type="submit" disabled={busy} className={primary}>
          {t("sendReset")}
        </button>
        {errorLine}
        <button type="button" onClick={() => go("login")} className="min-h-11 text-sm font-semibold text-muted">
          {t("backToLogin")}
        </button>
      </form>
    );
  }

  const login = mode === "login";
  return (
    <form onSubmit={login ? logIn : signUp} className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold">{t(login ? "loginTitle" : "signupTitle")}</h2>
      {notice && <p className="rounded-[14px] bg-card p-3.5 text-sm leading-snug text-soft">{t("linkError")}</p>}
      {emailField}
      <PasswordField
        id="password"
        label={t("passwordLabel")}
        hint={login ? undefined : t("passwordHint")}
        value={password}
        onChange={setPassword}
        autoComplete={login ? "current-password" : "new-password"}
      />
      {login && (
        <button type="button" onClick={() => go("forgot")} className="-mt-2 min-h-11 self-start text-sm font-semibold text-lime">
          {t("forgot")}
        </button>
      )}
      <button type="submit" disabled={busy} className={primary}>
        {t(login ? "loginCta" : "signupCta")}
      </button>
      {errorLine}
      <div className="flex flex-col">
        <button type="button" onClick={() => go(login ? "signup" : "login")} className="min-h-11 text-sm font-semibold">
          {t(login ? "toSignup" : "toLogin")}
        </button>
        <button type="button" onClick={() => go("pick")} className="min-h-11 text-sm font-semibold text-muted">
          {t("back")}
        </button>
      </div>
    </form>
  );
}
