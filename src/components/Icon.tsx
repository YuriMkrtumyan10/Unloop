import type { Category } from "@/lib/types";

// Stroke icons from the approved mockups, plus one per challenge category.
const paths = {
  spin: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></>,
  scrapbook: <><rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(-6 12 12)" /><circle cx="10" cy="10" r="2" /></>,
  leaderboard: <path d="M4 20V12h5v8M9 20V6h6v14M15 20v-5h5v5z" />,
  star: <path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  camera: <><rect x="3" y="6" width="18" height="14" rx="3" /><circle cx="12" cy="13" r="3.5" /><path d="M8 6l1.5-2h5L16 6" /></>,
  share: <><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  google: <><path d="M21 12.2c0 5-3.6 8.8-9 8.8a9 9 0 1 1 6-15.7" /><path d="M12 12h9" /></>,
  back: <path d="m15 18-6-6 6-6" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  account: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 5.1Q11.3 5 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7c1.8 0 3.4-.5 4.8-1.3" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  bell: <><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>,
  leave: <><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="m10 16-4-4 4-4" /><path d="M6 12h10" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="m6 7 1 13h10l1-13" /></>,
  crown: <path d="M3 19 5 5l6 6 4-9 4 9 6-6 2 14z" transform="scale(0.8) translate(1 1)" />,
  outdoors: <><path d="m3 20 6-11 4 7 3-4 5 8z" /><circle cx="17" cy="6" r="2" /></>,
  food: <><path d="M4 11h16a8 8 0 0 1-16 0z" /><path d="M9 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4" /></>,
  creative: <><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>,
  learn: <><path d="M2 9 12 4l10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></>,
  games: <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="9" cy="9" r="1" /><circle cx="15" cy="15" r="1" /><circle cx="15" cy="9" r="1" /><circle cx="9" cy="15" r="1" /></>,
  social: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M15 14.5c3 0 6 1.8 6 5.5" /></>,
  spicy: <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3 0-6 1-8.5z" />,
  quick: <path d="M13 3 5 13h6l-1 8 8-10h-6z" />,
} satisfies Record<string, React.ReactNode>;

export type IconName = keyof typeof paths;

export const categoryIcon: Record<Category, IconName> = {
  outdoors: "outdoors",
  food: "food",
  creative: "creative",
  learn: "learn",
  games: "games",
  social: "social",
  spicy: "spicy",
  quick: "quick",
};

export function Icon({ name, size = 20, strokeWidth = 2, className }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
