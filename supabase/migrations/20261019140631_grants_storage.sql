-- Unloop v1: who can call the action functions, and the private bucket for proof photos.

revoke execute on function public.create_group(text), public.join_group(text), public.spin(uuid, jsonb),
  public.reroll(uuid), public.accept_run(uuid), public.complete_run(uuid, uuid[], text, text),
  public.pick_challenge(uuid, jsonb, integer), public.is_member(uuid), public.handle_new_user(),
  public.random_avatar_color()
  from public, anon;
grant execute on function public.create_group(text), public.join_group(text), public.spin(uuid, jsonb),
  public.reroll(uuid), public.accept_run(uuid), public.complete_run(uuid, uuid[], text, text),
  public.is_member(uuid)
  to authenticated;

-- ---------------------------------------------------------------- photo storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('proofs', 'proofs', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- Files live at <group_id>/<run_id>.jpg; only that group's members can see or add them.
create policy "members read proofs" on storage.objects
  for select to authenticated
  using (bucket_id = 'proofs' and public.is_member(((storage.foldername(name))[1])::uuid));
create policy "members upload proofs" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'proofs' and public.is_member(((storage.foldername(name))[1])::uuid));
