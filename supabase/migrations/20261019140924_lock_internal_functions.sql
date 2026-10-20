-- Supabase grants new functions to `authenticated` by default; these are internal helpers only.
revoke execute on function public.pick_challenge(uuid, jsonb, integer), public.handle_new_user(), public.random_avatar_color()
  from authenticated;
