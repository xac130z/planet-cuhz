-- Phase 7: Admin Console + Moderation RBAC

-- Create enum for roles
create type public.app_role as enum ('admin', 'root');

-- Admin roles table (separate from user_profiles per security best practice)
create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.admin_roles enable row level security;

-- Security definer function to check roles (prevents RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Ban list table
create table if not exists public.ban_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reason text not null,
  banned_by uuid references auth.users(id),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.ban_list enable row level security;

-- Content flags for moderation
create table if not exists public.content_flags (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.lfg_listings(id) on delete cascade,
  reporter_id uuid references auth.users(id),
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'approved', 'closed', 'actioned')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id)
);

alter table public.content_flags enable row level security;

-- Admin audit logs
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;

-- RLS Policies

-- admin_roles: admins can view all, service role can manage
create policy "Admins can view all roles"
on public.admin_roles
for select
to authenticated
using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'root'));

create policy "Service role manages admin roles"
on public.admin_roles
for all
to service_role
using (true)
with check (true);

-- ban_list: admins can view all
create policy "Admins can view ban list"
on public.ban_list
for select
to authenticated
using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'root'));

create policy "Service role manages bans"
on public.ban_list
for all
to service_role
using (true)
with check (true);

-- content_flags: reporters can view their own, admins see all
create policy "Users can view their own flags"
on public.content_flags
for select
to authenticated
using (reporter_id = auth.uid());

create policy "Admins can view all flags"
on public.content_flags
for select
to authenticated
using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'root'));

create policy "Authenticated users can create flags"
on public.content_flags
for insert
to authenticated
with check (reporter_id = auth.uid());

create policy "Service role manages flags"
on public.content_flags
for all
to service_role
using (true)
with check (true);

-- admin_audit_logs: admins can view all
create policy "Admins can view audit logs"
on public.admin_audit_logs
for select
to authenticated
using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'root'));

create policy "Service role creates audit logs"
on public.admin_audit_logs
for insert
to service_role
with check (true);

-- Helper function to check if user is banned
create or replace function public.is_user_banned(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ban_list
    where user_id = _user_id
      and (expires_at is null or expires_at > now())
  )
$$;