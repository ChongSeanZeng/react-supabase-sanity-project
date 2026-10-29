alter table public.profiles
  add column if not exists password_setup_required boolean not null default false;

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
    new.raw_user_meta_data ->> 'requires_password_setup' = 'true'
  )
  on conflict (id) do update
    set phone = excluded.phone,
        email = excluded.email,
        display_name = coalesce(excluded.display_name, profiles.display_name),
        auth_confirmed_at = excluded.auth_confirmed_at;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert or update of phone, email, confirmed_at on auth.users
  for each row execute procedure public.create_profile_for_auth_user();

update public.profiles as profile
set password_setup_required = true
from auth.users as auth_user
where auth_user.id = profile.id
  and auth_user.raw_user_meta_data ->> 'requires_password_setup' = 'true'
  and profile.password_setup_required = false;

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and disabled_at is null
      and password_setup_required = false
  );
$$;

revoke all on function public.is_active_user() from public;
grant execute on function public.is_active_user() to authenticated;
