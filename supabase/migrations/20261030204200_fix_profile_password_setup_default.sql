create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (
    id,
    phone,
    email,
    display_name,
    auth_confirmed_at,
    password_setup_required
  )
  values (
    new.id,
    new.phone,
    new.email,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    new.confirmed_at,
    coalesce(new.raw_user_meta_data ->> 'requires_password_setup' = 'true', false)
  )
  on conflict (id) do update
    set phone = excluded.phone,
        email = excluded.email,
        display_name = coalesce(excluded.display_name, profiles.display_name),
        auth_confirmed_at = excluded.auth_confirmed_at;
  return new;
end;
$$;
