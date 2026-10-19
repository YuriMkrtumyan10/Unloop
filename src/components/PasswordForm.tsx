"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey, type AuthErrorKey } from "@/lib/auth-errors";
import { rowClass } from "@/lib/ui";
import { Icon } from "./Icon";
import { PasswordField } from "./PasswordField";

/**
 * Sets a new password for the signed-in user.
 * "account": folded into a row until tapped. "reset": open, and heads into the app once saved.
 */
export function PasswordForm({ variant }: { variant: "account" | "reset" }) {
  const t = useTranslations("account");
  const tw = useTranslations("welcome");
  const te = useTranslations("errors");
  const [open, setOpen] = useState(variant === "reset");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey>();
  const [done, setDone] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setError(authErrorKey(error));
      setBusy(false);
      return;
    }
    setPassword("");
    setDone(true);
    if (variant === "reset") {
      window.location.assign("/spin");
      return;
    }
    setBusy(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setDone(false);
          }}
          className={rowClass}
        >
          <Icon name="lock" className="shrink-0 text-muted" />
          <span className="min-w-0 grow">{t("changePassword")}</span>
          <Icon name="chevron" size={18} className="shrink-0 text-muted" />
        </button>
        {done && (
          <p role="status" className="flex items-center gap-1.5 px-1 text-sm font-semibold text-easy">
            <Icon name="check" size={16} strokeWidth={2.6} />
            {t("passwordSaved")}
          </p>
        )}
      </>
    );
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <PasswordField
        id="new-password"
        label={t("newPassword")}
        hint={tw("passwordHint")}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        autoFocus={variant === "account"}
      />
      <button type="submit" disabled={busy} className="min-h-[52px] rounded-[18px] bg-lime text-[17px] font-bold text-ink disabled:opacity-60">
        {done ? t("passwordSet") : t("savePassword")}
      </button>
      {error && (
        <p role="alert" className="text-center text-sm text-extreme">
          {te(error)}
        </p>
      )}
      {variant === "account" && (
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setPassword("");
            setError(undefined);
          }}
          className="min-h-11 text-sm font-semibold text-muted"
        >
          {t("cancel")}
        </button>
      )}
    </form>
  );
}
