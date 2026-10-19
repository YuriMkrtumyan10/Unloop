"use client";

import { useTranslations } from "next-intl";

export function NameField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslations("group");
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="myname" className="text-[15px] font-semibold">
        {t("yourName")}
      </label>
      <input
        id="myname"
        value={value}
        maxLength={40}
        autoComplete="given-name"
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[52px] rounded-[14px] border-[1.5px] border-line bg-card px-4 text-[17px] font-semibold focus:border-lime focus:outline-none"
      />
    </div>
  );
}
