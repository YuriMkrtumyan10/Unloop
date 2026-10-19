"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "./Icon";

export function InviteBox({ code, groupName }: { code: string; groupName: string }) {
  const t = useTranslations("invite");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const link = `${origin}/join/${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link is still visible to copy by hand.
    }
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: "Unloop", text: t("shareText", { group: groupName }), url: link }).catch(() => {});
    } else {
      await copy();
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex min-h-[52px] items-center gap-2 rounded-[14px] bg-ink py-1.5 pr-1.5 pl-4">
        <span className="grow truncate text-[15px] font-medium text-muted">{link}</span>
        <button type="button" onClick={copy} className="min-h-10 shrink-0 rounded-[10px] bg-raised px-3.5 text-sm font-semibold">
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <button
        type="button"
        onClick={share}
        className="flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-line font-semibold"
      >
        <Icon name="share" size={18} />
        {t("share")}
      </button>
    </div>
  );
}
