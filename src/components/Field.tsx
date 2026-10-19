import type { InputHTMLAttributes } from "react";
import { inputClass } from "@/lib/ui";

/** A labelled text input in the app's style. */
export function Field({ id, label, ...input }: { id: string; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
      </label>
      <input id={id} className={inputClass} {...input} />
    </div>
  );
}
