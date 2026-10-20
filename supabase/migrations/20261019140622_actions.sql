-- Unloop v1 actions: create/join group, spin, re-roll, accept, log a done challenge, photo storage.

-- ---------------------------------------------------------------- actions
create function public.create_group(group_name text)
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
  insert into public.group_members (group_id, user_id) values (gid, (select auth.uid()));
  return gid;
end;
$$;

create function public.join_group(code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  gid uuid;
begin
  if (select auth.uid()) is null then raise exception 'not_signed_in'; end if;
  select id into gid from public.groups where invite_code = trim(code);
  if gid is null then raise exception 'bad_invite'; end if;
  insert into public.group_members (group_id, user_id)
  values (gid, (select auth.uid()))
  on conflict do nothing;
  return gid;
end;
$$;

-- Picks a random challenge that fits the filters, preferring ones the group hasn't done.
create function public.pick_challenge(gid uuid, f jsonb, exclude_id integer)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  picked integer;
  max_bucket public.time_bucket := nullif(f ->> 'time', '')::public.time_bucket;
  place_f public.challenge_place := nullif(f ->> 'place', '')::public.challenge_place;
  level_f public.challenge_level := nullif(f ->> 'level', '')::public.challenge_level;
  costs integer[] := case when jsonb_typeof(f -> 'costs') = 'array' and jsonb_array_length(f -> 'costs') > 0
    then array(select jsonb_array_elements_text(f -> 'costs')::integer) else null end;
  people integer := coalesce((f ->> 'people')::integer, 1);
begin
  for pass in 1..2 loop
    select c.id into picked
    from public.challenges c
    where c.active
      and c.min_people <= people
      and (max_bucket is null or c.time_bucket <= max_bucket)
      and (place_f is null or c.place = place_f or c.place = 'either')
      and (level_f is null or c.level = level_f)
      and (costs is null or c.cost = any (costs))
      and (exclude_id is null or c.id <> exclude_id)
      and (pass = 2 or not exists (
        select 1 from public.runs r
        where r.group_id = gid and r.challenge_id = c.id and r.status = 'done'
      ))
    order by random()
    limit 1;
    exit when picked is not null;
  end loop;
  return picked;
end;
$$;

-- Returns the open run's id, or null when nothing fits the filters.
create function public.spin(gid uuid, f jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  open_run public.runs;
  cid integer;
  rid uuid;
begin
  if not public.is_member(gid) then raise exception 'not_a_member'; end if;

  select * into open_run from public.runs
  where group_id = gid and status in ('revealed', 'accepted');

  -- An accepted challenge, or your own unanswered reveal, stays put: no escaping the spin.
  if open_run.id is not null and (open_run.status = 'accepted' or open_run.spun_by = me) then
    return open_run.id;
  end if;

  cid := public.pick_challenge(gid, f, null);
  if cid is null then return null; end if;

  -- Someone else's abandoned reveal gets taken over by this spin.
  if open_run.id is not null then
    update public.runs
    set challenge_id = cid, spun_by = me, rerolled = false, filters = f, created_at = now(),
        people = greatest(1, least(50, coalesce((f ->> 'people')::integer, 1)))
    where id = open_run.id;
    return open_run.id;
  end if;

  insert into public.runs (group_id, challenge_id, spun_by, people, filters)
  values (gid, cid, me, greatest(1, least(50, coalesce((f ->> 'people')::integer, 1))), f)
  returning id into rid;
  return rid;
end;
$$;

create function public.reroll(rid uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  run public.runs;
  cid integer;
begin
  select * into run from public.runs where id = rid for update;
  if run.id is null or run.spun_by <> (select auth.uid()) then raise exception 'not_your_spin'; end if;
  if run.status <> 'revealed' then raise exception 'already_accepted'; end if;
  if run.rerolled then raise exception 'no_rerolls_left'; end if;

  cid := public.pick_challenge(run.group_id, run.filters, run.challenge_id);
  if cid is null then raise exception 'nothing_else_fits'; end if;

  update public.runs set challenge_id = cid, rerolled = true where id = rid;
  return rid;
end;
$$;

create function public.accept_run(rid uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.runs set status = 'accepted', accepted_at = now()
  where id = rid and spun_by = (select auth.uid()) and status = 'revealed';
  if not found then raise exception 'not_your_spin'; end if;
end;
$$;

-- Logs a done challenge. Only the people ticked as "showed up" get points (+5 each with a photo).
create function public.complete_run(rid uuid, participant_ids uuid[], photo text, note_text text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  run public.runs;
  each_points integer;
begin
  select * into run from public.runs where id = rid for update;
  if run.id is null or not public.is_member(run.group_id) then raise exception 'not_a_member'; end if;
  if run.status <> 'accepted' then raise exception 'not_active'; end if;
  if coalesce(array_length(participant_ids, 1), 0) = 0 then raise exception 'nobody_showed_up'; end if;
  if photo is not null and split_part(photo, '/', 1) <> run.group_id::text then raise exception 'bad_photo'; end if;

  select c.points + case when photo is null then 0 else 5 end into each_points
  from public.challenges c where c.id = run.challenge_id;

  update public.runs
  set status = 'done', completed_at = now(), completed_by = (select auth.uid()),
      photo_path = photo, note = nullif(trim(note_text), '')
  where id = rid;

  insert into public.run_participants (run_id, user_id, points)
  select rid, gm.user_id, each_points
  from public.group_members gm
  where gm.group_id = run.group_id and gm.user_id = any (participant_ids);
end;
$$;

