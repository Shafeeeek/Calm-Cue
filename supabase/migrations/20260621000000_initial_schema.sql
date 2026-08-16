-- Calm Cue user data. Run with `supabase db push` or paste into the SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  support_contact text,
  primary_goal text,
  reminders_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mood_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  anxiety_level smallint not null check (anxiety_level between 1 and 5),
  note text check (char_length(note) <= 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.breathing_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  duration_seconds integer not null check (duration_seconds >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.grounding_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_steps text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'bot')),
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now()
);

create table if not exists public.saved_videos (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id text not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, video_id)
);

create index if not exists mood_check_ins_user_created_idx
  on public.mood_check_ins(user_id, created_at desc);
create index if not exists breathing_sessions_user_created_idx
  on public.breathing_sessions(user_id, created_at desc);
create index if not exists grounding_sessions_user_created_idx
  on public.grounding_sessions(user_id, created_at desc);
create index if not exists chat_messages_user_created_idx
  on public.chat_messages(user_id, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.mood_check_ins enable row level security;
alter table public.breathing_sessions enable row level security;
alter table public.grounding_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.saved_videos enable row level security;

revoke all on public.profiles from anon;
revoke all on public.mood_check_ins from anon;
revoke all on public.breathing_sessions from anon;
revoke all on public.grounding_sessions from anon;
revoke all on public.chat_messages from anon;
revoke all on public.saved_videos from anon;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.mood_check_ins to authenticated;
grant select, insert, update, delete on public.breathing_sessions to authenticated;
grant select, insert, update, delete on public.grounding_sessions to authenticated;
grant select, insert, update, delete on public.chat_messages to authenticated;
grant select, insert, update, delete on public.saved_videos to authenticated;

drop policy if exists "Users own their profile" on public.profiles;
create policy "Users own their profile"
on public.profiles for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = id)
with check ((select auth.uid()) is not null and (select auth.uid()) = id);

drop policy if exists "Users own their mood check-ins" on public.mood_check_ins;
create policy "Users own their mood check-ins"
on public.mood_check_ins for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users own their breathing sessions" on public.breathing_sessions;
create policy "Users own their breathing sessions"
on public.breathing_sessions for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users own their grounding sessions" on public.grounding_sessions;
create policy "Users own their grounding sessions"
on public.grounding_sessions for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users own their chat messages" on public.chat_messages;
create policy "Users own their chat messages"
on public.chat_messages for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users own their saved videos" on public.saved_videos;
create policy "Users own their saved videos"
on public.saved_videos for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
