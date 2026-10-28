alter table public.profiles
  add column if not exists disabled_at timestamptz;

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
  );
$$;

revoke all on function public.is_active_user() from public;
grant execute on function public.is_active_user() to authenticated;

create or replace function public.is_admin()
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
      and role = 'admin'
      and disabled_at is null
  );
$$;

drop policy if exists "Students can update their display name" on public.profiles;
create policy "Active students can update their display name"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) and (select public.is_active_user()))
  with check (id = (select auth.uid()) and (select public.is_active_user()));

drop policy if exists "Students read their progress and admins read all" on public.course_progress;
create policy "Active students read their progress and admins read all"
  on public.course_progress for select to authenticated
  using (
    (student_id = (select auth.uid()) and (select public.is_active_user()))
    or (select public.is_admin())
  );

drop policy if exists "Students create their own progress" on public.course_progress;
create policy "Active students create their own progress"
  on public.course_progress for insert to authenticated
  with check (student_id = (select auth.uid()) and (select public.is_active_user()));

drop policy if exists "Students update their own progress" on public.course_progress;
create policy "Active students update their own progress"
  on public.course_progress for update to authenticated
  using (student_id = (select auth.uid()) and (select public.is_active_user()))
  with check (student_id = (select auth.uid()) and (select public.is_active_user()));

drop policy if exists "Students read only their own exam results" on public.exam_attempts;
create policy "Active students read only their own exam results"
  on public.exam_attempts for select to authenticated
  using (
    (student_id = (select auth.uid()) and (select public.is_active_user()))
    or (select public.is_admin())
  );

drop policy if exists "Students submit their own answers" on public.exam_attempts;
create policy "Active students submit their own answers"
  on public.exam_attempts for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and (select public.is_active_user())
    and status = 'submitted'
    and score is null
    and graded_by is null
  );

drop policy if exists "Students read their certificates and admins read all" on public.certificates;
create policy "Active students read their certificates and admins read all"
  on public.certificates for select to authenticated
  using (
    (student_id = (select auth.uid()) and (select public.is_active_user()))
    or (select public.is_admin())
  );
