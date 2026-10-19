-- Avatar colors are picked on the account page; keep them to plain hex colors.
alter table public.profiles
  add constraint profiles_color_hex check (color ~ '^#[0-9A-Fa-f]{6}$');
