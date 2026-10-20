"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions";
import { AVATAR_COLORS } from "@/lib/colors";
import type { Profile } from "@/lib/types";
import { sectionHeading } from "@/lib/ui";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { NameField } from "./NameField";

/** Your name and avatar color, with a live preview of how the crew sees you. */
export function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
  const t = useTranslations("account");
  const te = useTranslations("errors");
  const router = useRouter();
  const [name, setName] = useState(profile.display_name);
  const [color, setColor] = useState(profile.color);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const shownName = name.trim() || profile.display_name;
  const changed = name.trim() !== profile.display_name || color !== profile.color;

  function save() {
    startTransition(async () => {
      const res = await updateProfile(name, color);
      if (res.error) {
        setError(res.error);
        return;
      }
      setError(undefined);
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 rounded-3xl bg-card p-5">
        <Avatar profile={{ display_name: shownName, color }} size={64} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <b className="truncate font-display text-xl font-bold">{shownName}</b>
          <span className="truncate text-sm text-muted">{email}</span>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className={sectionHeading}>{t("profile")}</h2>
        <NameField
          value={name}
          onChange={(v) => {
            setName(v);
            setSaved(false);
          }}
        />
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-[15px] font-semibold">{t("yourColor")}</legend>
          <div className="grid grid-cols-7 gap-2">
            {AVATAR_COLORS.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === color}
                aria-label={t("colorN", { n: i + 1 })}
                onClick={() => {
                  setColor(c);
                  setSaved(false);
                }}
                className={`flex aspect-square w-full items-center justify-center rounded-full text-ink ${c === color ? "ring-2 ring-paper ring-offset-[3px] ring-offset-ink" : ""}`}
                style={{ background: c }}
              >
                {c === color && <Icon name="check" size={18} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={save}
          disabled={!changed || pending}
          className={`flex min-h-[52px] items-center justify-center gap-2 rounded-[18px] text-[17px] font-bold ${saved && !changed ? "bg-raised text-lime" : "bg-lime text-ink disabled:bg-raised disabled:text-dim"}`}
        >
          {saved && !changed && <Icon name="check" size={18} strokeWidth={2.6} />}
          {saved && !changed ? t("saved") : t("save")}
        </button>
        {error && (
          <p role="alert" className="text-center text-sm text-extreme">
            {te(error as "generic")}
          </p>
        )}
      </section>
    </div>
  );
}
