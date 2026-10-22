import type { Locale } from "@/i18n/config";

export type Level = "easy" | "spicy" | "extreme";
export type Place = "in" | "out" | "either";
export type TimeBucket = "quick" | "short" | "half" | "full";
export type Category = "outdoors" | "food" | "creative" | "learn" | "games" | "social" | "spicy" | "quick";

export type Challenge = {
  id: number;
  category: Category;
  title: Record<Locale, string>;
  min_people: number;
  hours_min: number;
  hours_max: number;
  time_bucket: TimeBucket;
  cost: 1 | 2 | 3;
  place: Place;
  points: number;
  level: Level;
};

export type Profile = {
  id: string;
  display_name: string;
  color: string;
};

export type Group = {
  id: string;
  name: string;
  invite_code: string;
  /** A one-person "Just me" space: no invite link, no leaving, never in search. */
  solo: boolean;
};

export type Role = "admin" | "member";

/** A crew as search shows it to someone outside: no invite code, no members' names. */
export type CrewHit = {
  id: string;
  name: string;
  members: number;
  status: "member" | "requested" | null;
};

export type Run = {
  id: string;
  group_id: string;
  challenge_id: number;
  spun_by: string;
  status: "revealed" | "accepted" | "done";
  rerolled: boolean;
  people: number;
  photo_path: string | null;
  note: string | null;
  accepted_at: string | null;
  completed_at: string | null;
};

export type SpinFilters = {
  people: number;
  time: TimeBucket | null;
  costs: number[];
  place: Exclude<Place, "either"> | null;
  level: Level | null;
};
