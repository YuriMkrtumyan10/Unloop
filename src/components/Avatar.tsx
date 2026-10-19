import type { Profile } from "@/lib/types";

export function Avatar({ profile, size = 44, className = "" }: { profile: Pick<Profile, "display_name" | "color">; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-ink ${className}`}
      style={{ width: size, height: size, background: profile.color, fontSize: Math.round(size * 0.38) }}
    >
      {profile.display_name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
