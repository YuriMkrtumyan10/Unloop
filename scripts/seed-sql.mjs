// Turns supabase/seed/challenges.json into an upsert SQL migration.
// Usage: node scripts/seed-sql.mjs > supabase/migrations/<timestamp>_seed_challenges.sql
import { readFileSync } from "node:fs";

const challenges = JSON.parse(readFileSync(new URL("../supabase/seed/challenges.json", import.meta.url), "utf8"));
const q = (s) => `'${String(s).replaceAll("'", "''")}'`;

const rows = challenges.map(
  (c) =>
    `  (${c.id}, ${q(c.category)}, ${q(JSON.stringify(c.title))}::jsonb, ${c.min_people}, ${c.hours_min}, ${c.hours_max}, ${q(c.time_bucket)}, ${c.cost}, ${q(c.place)}, ${c.points}, ${q(c.level)})`,
);

console.log(`-- Generated from supabase/seed/challenges.json by scripts/seed-sql.mjs. Edit the JSON, not this file.
insert into public.challenges (id, category, title, min_people, hours_min, hours_max, time_bucket, cost, place, points, level)
values
${rows.join(",\n")}
on conflict (id) do update set
  category = excluded.category, title = excluded.title, min_people = excluded.min_people,
  hours_min = excluded.hours_min, hours_max = excluded.hours_max, time_bucket = excluded.time_bucket,
  cost = excluded.cost, place = excluded.place, points = excluded.points, level = excluded.level;`);
