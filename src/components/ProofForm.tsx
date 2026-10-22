"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { completeRun } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { shrinkPhoto } from "@/lib/image";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

/** solo: a "Just me" run, so there's nobody else to tick. */
export function ProofForm({ runId, groupId, points, crew, solo }: { runId: string; groupId: string; points: number; crew: Profile[]; solo: boolean }) {
  const t = useTranslations("proof");
  const te = useTranslations("errors");
  const input = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [note, setNote] = useState("");
  const [present, setPresent] = useState<string[]>(crew.map((p) => p.id));
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(file?: File) {
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  const toggle = (id: string) => setPresent((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const each = points + (photo ? 5 : 0);

  function submit() {
    setError(undefined);
    startTransition(async () => {
      let path: string | null = null;
      if (photo) {
        try {
          path = `${groupId}/${runId}.jpg`;
          const blob = await shrinkPhoto(photo);
          const { error: upload } = await createClient().storage.from("proofs").upload(path, blob, { contentType: "image/jpeg", upsert: false });
          if (upload && !upload.message.toLowerCase().includes("exists")) throw upload;
        } catch {
          setError("upload");
          return;
        }
      }
      const res = await completeRun(runId, present, path, note);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="relative flex h-[280px] -rotate-1 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[26px] border-2 border-dashed border-lime bg-[#1A1916]"
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- local preview of the picked file */}
            <img src={preview} alt={t("photoAlt")} className="absolute inset-0 size-full object-cover" />
            <span className="absolute right-3 bottom-3 rounded-full bg-ink/80 px-3 py-1.5 text-[13px] font-bold">{t("change")}</span>
          </>
        ) : (
          <>
            <Icon name="camera" size={44} strokeWidth={1.8} className="text-lime" />
            <span className="text-lg font-bold">{t("addPhoto")}</span>
            <span className="rounded-full bg-lime px-3 py-1.5 text-[13px] font-bold text-ink">{t("bonus")}</span>
          </>
        )}
      </button>

      <div className="flex flex-col gap-2">
        <label htmlFor="note" className="text-[15px] font-semibold">
          {t("noteLabel")} <span className="font-medium text-muted">{t("optional")}</span>
        </label>
        <input
          id="note"
          value={note}
          maxLength={80}
          placeholder={t("notePlaceholder")}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[52px] rounded-[14px] border-[1.5px] border-line bg-card px-4 font-medium placeholder:text-muted focus:border-lime focus:outline-none"
        />
      </div>

      {!solo && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-[15px] font-semibold">{t("whoShowedUp")}</legend>
          <div className="grid grid-cols-5 gap-x-2 gap-y-3">
            {crew.map((p) => {
              const on = present.includes(p.id);
              return (
                <button key={p.id} type="button" aria-pressed={on} onClick={() => toggle(p.id)} className={`flex min-w-0 flex-col items-center gap-1.5 text-[13px] font-semibold ${on ? "" : "text-muted"}`}>
                  {on ? (
                    <Avatar profile={p} size={52} />
                  ) : (
                    <span className="flex size-[52px] items-center justify-center rounded-full border-[1.5px] border-dashed border-dim bg-raised text-lg font-bold text-muted">
                      {p.display_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="max-w-full truncate">{p.display_name}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="grow" />

      <div className="flex flex-col gap-2.5">
        <button type="button" onClick={submit} disabled={pending || present.length === 0} className="min-h-[60px] rounded-[18px] bg-lime px-4 font-display text-lg font-extrabold text-ink disabled:opacity-60">
          {pending ? t("saving") : t(solo ? "logItSolo" : "logIt", { n: each })}
        </button>
        {!photo && <p className="text-center text-[13px] font-medium text-muted">{t(solo ? "withPhotoSolo" : "withPhoto", { n: points + 5 })}</p>}
        {error && <p role="alert" className="text-center text-sm text-spicy">{te(error as "generic")}</p>}
      </div>
    </>
  );
}
