-- Unloop v1 schema: profiles, groups, challenges, runs (spins), proofs, points.
-- Writes that need rules (spin, re-roll, accept, log) go through security-definer
-- functions, so clients only ever read tables directly.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------- types
create type public.challenge_level as enum ('easy', 'spicy', 'extreme');
create type public.challenge_place as enum ('in', 'out', 'either');
-- quick: under 1h · short: 2–3h · half: half a day · full: all day or overnight
create type public.time_bucket as enum ('quick', 'short', 'half', 'full');
create type public.run_status as enum ('revealed', 'accepted', 'done');

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  color text not null default '#C8F03C',
  created_at timestamptz not null default now()
);

-- Avatar colors from the approved mockups.
create function public.random_avatar_color()
returns text
language sql
volatile
set search_path = ''
as $$
  select (array['#C8F03C', '#FFB36B', '#9DB8FF', '#F59BD0', '#7FD1AE', '#FF9A4D', '#E2C6FF'])[1 + floor(random() * 7)::int];
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, color)
  values (
    new.id,
    left(coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1),
      'friend'
    ), 40),
    public.random_avatar_color()
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- groups
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  invite_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index group_members_user_idx on public.group_members (user_id);

create function public.is_member(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------- challenges
create table public.challenges (
  id integer primary key,
  category text not null check (category in ('outdoors', 'food', 'creative', 'learn', 'games', 'social', 'spicy', 'quick')),
  title jsonb not null, -- { "en": ..., "hy": ..., "ru": ... }
  min_people integer not null check (min_people >= 1),
  hours_min numeric not null,
  hours_max numeric not null,
  time_bucket public.time_bucket not null,
  cost smallint not null check (cost between 1 and 3),
  place public.challenge_place not null,
  points integer not null check (points > 0),
  level public.challenge_level not null,
  active boolean not null default true
);

-- ---------------------------------------------------------------- runs
-- A run is one spin: revealed -> accepted -> done.
create table public.runs (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  challenge_id integer not null references public.challenges (id),
  spun_by uuid not null references public.profiles (id),
  status public.run_status not null default 'revealed',
  rerolled boolean not null default false,
  people integer not null check (people between 1 and 50),
  filters jsonb not null default '{}'::jsonb,
  photo_path text,
  note text check (char_length(note) <= 80),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  completed_by uuid references public.profiles (id)
);
-- Only one open (revealed or accepted) run per group.
create unique index runs_one_open_per_group on public.runs (group_id) where status in ('revealed', 'accepted');
create index runs_group_done_idx on public.runs (group_id, completed_at desc) where status = 'done';

create table public.run_participants (
  run_id uuid not null references public.runs (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  points integer not null,
  primary key (run_id, user_id)
);
create index run_participants_user_idx on public.run_participants (user_id);

-- ---------------------------------------------------------------- RLS
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.challenges enable row level security;
alter table public.runs enable row level security;
alter table public.run_participants enable row level security;

create policy "see yourself and your crew" on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    or exists (
      select 1 from public.group_members mine
      join public.group_members theirs on theirs.group_id = mine.group_id
      where mine.user_id = (select auth.uid()) and theirs.user_id = profiles.id
    )
  );
create policy "edit yourself" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "members see their group" on public.groups
  for select to authenticated using (public.is_member(id));
create policy "members see the crew" on public.group_members
  for select to authenticated using (public.is_member(group_id));
create policy "anyone signed in reads challenges" on public.challenges
  for select to authenticated using (true);
create policy "members see runs" on public.runs
  for select to authenticated using (public.is_member(group_id));
create policy "members see who showed up" on public.run_participants
  for select to authenticated
  using (exists (select 1 from public.runs r where r.id = run_id and public.is_member(r.group_id)));

-- ---------------------------------------------------------------- leaderboard
create view public.leaderboard
with (security_invoker = true) as
select
  gm.group_id,
  gm.user_id,
  coalesce(sum(rp.points), 0)::integer as points,
  count(rp.run_id)::integer as challenges
from public.group_members gm
left join public.runs r on r.group_id = gm.group_id and r.status = 'done'
left join public.run_participants rp on rp.run_id = r.id and rp.user_id = gm.user_id
group by gm.group_id, gm.user_id;

