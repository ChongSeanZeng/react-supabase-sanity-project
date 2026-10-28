create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique,
  display_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone)
  on conflict (id) do update set phone = excluded.phone;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert or update of phone on auth.users
  for each row execute procedure public.create_profile_for_auth_user();

insert into public.profiles (id, phone)
select id, phone from auth.users
on conflict (id) do update set phone = excluded.phone;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.course_progress (
  student_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_key text not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, course_slug, lesson_key)
);

create or replace function public.update_course_progress_timestamp()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_course_progress_updated_at on public.course_progress;
create trigger set_course_progress_updated_at
  before update on public.course_progress
  for each row execute procedure public.update_course_progress_timestamp();

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  score integer check (score between 0 and 14),
  status text not null default 'submitted' check (status in ('submitted', 'reviewed')),
  feedback text,
  graded_by uuid references auth.users(id),
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reviewed_attempt_has_grade check (
    (status = 'submitted' and score is null and graded_by is null)
    or (status = 'reviewed' and score is not null and graded_by is not null)
  )
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  certificate_number text not null unique,
  issued_by uuid not null references auth.users(id),
  issued_at timestamptz not null default now(),
  unique (student_id, course_slug)
);

alter table public.profiles enable row level security;
alter table public.course_progress enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.certificates enable row level security;

drop policy if exists "Profiles are visible to owner or admin" on public.profiles;
create policy "Profiles are visible to owner or admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
  on public.profiles for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Students can update their display name" on public.profiles;
create policy "Students can update their display name"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

drop policy if exists "Students read their progress and admins read all" on public.course_progress;
create policy "Students read their progress and admins read all"
  on public.course_progress for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Students create their own progress" on public.course_progress;
create policy "Students create their own progress"
  on public.course_progress for insert to authenticated
  with check (student_id = (select auth.uid()));

drop policy if exists "Students update their own progress" on public.course_progress;
create policy "Students update their own progress"
  on public.course_progress for update to authenticated
  using (student_id = (select auth.uid()))
  with check (student_id = (select auth.uid()));

drop policy if exists "Admins manage progress" on public.course_progress;
create policy "Admins manage progress"
  on public.course_progress for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Students read only their own exam results" on public.exam_attempts;
create policy "Students read only their own exam results"
  on public.exam_attempts for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Students submit their own answers" on public.exam_attempts;
create policy "Students submit their own answers"
  on public.exam_attempts for insert to authenticated
  with check (student_id = (select auth.uid()) and status = 'submitted' and score is null and graded_by is null);

drop policy if exists "Admins grade exam attempts" on public.exam_attempts;
create policy "Admins grade exam attempts"
  on public.exam_attempts for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Students read their certificates and admins read all" on public.certificates;
create policy "Students read their certificates and admins read all"
  on public.certificates for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins issue certificates" on public.certificates;
create policy "Admins issue certificates"
  on public.certificates for insert to authenticated
  with check ((select public.is_admin()) and issued_by = (select auth.uid()));

drop policy if exists "Admins manage certificates" on public.certificates;
create policy "Admins manage certificates"
  on public.certificates for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.profiles, public.course_progress, public.exam_attempts, public.certificates to authenticated;
grant insert on public.course_progress, public.exam_attempts to authenticated;
grant update (student_id, course_slug, lesson_key, completed_at, updated_at) on public.course_progress to authenticated;
grant update (score, status, feedback, graded_by, graded_at) on public.exam_attempts to authenticated;
grant insert, update, delete on public.certificates to authenticated;
