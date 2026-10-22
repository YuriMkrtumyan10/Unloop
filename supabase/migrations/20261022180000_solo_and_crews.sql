-- Solo play, several crews per person, crew admins, join requests, and leaving a crew.
-- A solo space is a one-person group flagged `solo`, so spin, scrapbook and points work unchanged.

-- ---------------------------------------------------------------- columns
alter table public.groups add column solo boolean not null default false;
-- One "Just me" space per person.
create unique index groups_one_solo_per_user on public.groups (created_by) where solo;

create type public.member_role as enum ('admin', 'member');
alter table public.group_members add column role public.member_role not null default 'member';
-- One admin per crew: they answer join requests.
create unique index group_members_one_admin on public.group_members (group_id) where role = 'admin';

-- ---------------------------------------------------------------- join requests
create table public.join_requests (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index join_requests_user_idx on public.join_requests (user_id);
alter table public.join_requests enable row level security;

create function public.is_admin(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = (select auth.uid()) and role = 'admin'
  );
$$;

create policy "see your requests and the ones to your crew" on public.join_requests
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin(group_id));

-- The admin needs the name and color of whoever is knocking.
create policy "admins see who wants in" on public.profiles
  for select to authenticated
  using (exists (select 1 from public.join_requests jr where jr.user_id = profiles.id and public.is_admin(jr.group_id)));

-- ---------------------------------------------------------------- admins
-- Gives a crew without an admin one: the member who joined first.
create function public.ensure_admin(gid uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.group_members set role = 'admin'
  where group_id = gid
    and user_id = (select user_id from public.group_members where group_id = gid order by joined_at, user_id limit 1)
    and not exists (select 1 from public.group_members where group_id = gid and role = 'admin');
$$;

-- Existing crews: whoever created the crew is its admin.
update public.group_members gm set role = 'admin'
from public.groups g
where g.id = gm.group_id and g.created_by = gm.user_id;
select public.ensure_admin(id) from public.groups;

-- ---------------------------------------------------------------- actions
create or replace function public.create_group(group_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  gid uuid;
begin
  if (select auth.uid()) is null then raise exception 'not_signed_in'; end if;
  insert into public.groups (name, created_by)
  values (trim(group_name), (select auth.uid()))
  returning id into gid;
  insert into public.group_members (group_id, user_id, role) values (gid, (select auth.uid()), 'admin');
  return gid;
end;
$$;

-- Your "Just me" space, made the first time you ask for it.
create function public.ensure_solo()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  gid uuid;
begin
  if me is null then raise exception 'not_signed_in'; end if;
  insert into public.groups (name, created_by, solo)
  values ('Just me', me, true)
  on conflict (created_by) where solo do nothing;
  select id into gid from public.groups where created_by = me and solo;
  insert into public.group_members (group_id, user_id, role)
  values (gid, me, 'admin')
  on conflict do nothing;
  return gid;
end;
$$;

-- Invite links skip the queue. A crew everyone left comes back to life with the newcomer as admin.
create or replace function public.join_group(code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  gid uuid;
begin
  if (select auth.uid()) is null then raise exception 'not_signed_in'; end if;
  select id into gid from public.groups where invite_code = trim(code) and not solo;
  if gid is null then raise exception 'bad_invite'; end if;
  insert into public.group_members (group_id, user_id)
  values (gid, (select auth.uid()))
  on conflict do nothing;
  delete from public.join_requests where group_id = gid and user_id = (select auth.uid());
  perform public.ensure_admin(gid);
  return gid;
end;
$$;

-- Crews whose name contains `q`, for asking to join. Never shows solo spaces, empty crews or invite codes.
create function public.search_groups(q text)
returns table (id uuid, name text, members integer, status text)
language sql
stable
security definer
set search_path = ''
as $$
  select g.id, g.name, count(gm.user_id)::integer,
    case
      when bool_or(gm.user_id = (select auth.uid())) then 'member'
      when exists (select 1 from public.join_requests jr where jr.group_id = g.id and jr.user_id = (select auth.uid())) then 'requested'
    end
  from public.groups g
  join public.group_members gm on gm.group_id = g.id
  where not g.solo
    and char_length(trim(q)) >= 2
    and strpos(lower(g.name), lower(trim(q))) > 0
  group by g.id
  order by strpos(lower(g.name), lower(trim(q))) = 1 desc, count(gm.user_id) desc, g.name
  limit 20;
$$;

-- Your requests still waiting for an answer, with the crew's name (you can't read the crew itself yet).
create function public.my_requests()
returns table (group_id uuid, name text, members integer)
language sql
stable
security definer
set search_path = ''
as $$
  select g.id, g.name, (select count(*)::integer from public.group_members gm where gm.group_id = g.id)
  from public.join_requests jr
  join public.groups g on g.id = jr.group_id
  where jr.user_id = (select auth.uid())
  order by jr.created_at desc;
$$;

create function public.request_join(gid uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then raise exception 'not_signed_in'; end if;
  if not exists (
    select 1 from public.groups g
    where g.id = gid and not g.solo and exists (select 1 from public.group_members gm where gm.group_id = g.id)
  ) then raise exception 'no_such_crew'; end if;
  if public.is_member(gid) then raise exception 'already_in'; end if;
  insert into public.join_requests (group_id, user_id)
  values (gid, (select auth.uid()))
  on conflict do nothing;
end;
$$;

create function public.cancel_request(gid uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.join_requests where group_id = gid and user_id = (select auth.uid());
$$;

-- The crew's admin lets someone in, or says no (they can ask again later).
create function public.answer_request(gid uuid, uid uuid, accept boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin(gid) then raise exception 'not_admin'; end if;
  delete from public.join_requests where group_id = gid and user_id = uid;
  if not found then raise exception 'no_request'; end if;
  if accept then
    insert into public.group_members (group_id, user_id) values (gid, uid) on conflict do nothing;
  end if;
end;
$$;

-- Leaving keeps your past challenges in the crew's scrapbook; you just drop off its leaderboard.
-- An admin who leaves hands over to `next_admin`, or else to the member who joined first.
create function public.leave_group(gid uuid, next_admin uuid default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  was_admin boolean;
begin
  if (select solo from public.groups where id = gid) then raise exception 'solo'; end if;
  delete from public.group_members where group_id = gid and user_id = me
  returning role = 'admin' into was_admin;
  if not found then raise exception 'not_a_member'; end if;

  if was_admin and next_admin is not null then
    update public.group_members set role = 'admin' where group_id = gid and user_id = next_admin;
  end if;
  perform public.ensure_admin(gid);

  -- Nobody left to answer: drop the waiting requests. The crew disappears from search.
  if not exists (select 1 from public.group_members where group_id = gid) then
    delete from public.join_requests where group_id = gid;
  end if;
end;
$$;

-- ---------------------------------------------------------------- grants
revoke execute on function public.is_admin(uuid), public.ensure_admin(uuid), public.ensure_solo(),
  public.search_groups(text), public.my_requests(), public.request_join(uuid), public.cancel_request(uuid),
  public.answer_request(uuid, uuid, boolean), public.leave_group(uuid, uuid)
  from public, anon;
revoke execute on function public.ensure_admin(uuid) from authenticated;
grant execute on function public.is_admin(uuid), public.ensure_solo(), public.search_groups(text), public.my_requests(),
  public.request_join(uuid), public.cancel_request(uuid), public.answer_request(uuid, uuid, boolean),
  public.leave_group(uuid, uuid)
  to authenticated;
