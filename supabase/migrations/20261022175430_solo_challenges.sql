-- Challenges written for one person ("Go to the cinema alone"): they only come up when the spin is for 1 person.

alter table public.challenges add column solo boolean not null default false;

-- Picks a random challenge that fits the filters, preferring ones the group hasn't done.
create or replace function public.pick_challenge(gid uuid, f jsonb, exclude_id integer)
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
      and (not c.solo or people = 1)
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
