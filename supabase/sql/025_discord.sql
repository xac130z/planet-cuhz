-- Phase 8: Discord Bot Mode tables (optional logging)

-- Discord events log (optional; for debugging interactions)
create table if not exists discord_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null, -- 'interaction', 'slash', 'button', 'dm_sent'
  discord_user_id text,
  user_id uuid references auth.users(id),
  match_id uuid,
  payload jsonb,
  created_at timestamptz default now()
);

-- Discord OAuth states (CSRF protection)
create table if not exists discord_oauth_states (
  state text primary key,
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '10 minutes')
);

-- Index for faster lookups
create index if not exists idx_discord_events_user on discord_events(user_id);
create index if not exists idx_discord_events_match on discord_events(match_id);
create index if not exists idx_discord_oauth_expires on discord_oauth_states(expires_at);

-- RLS policies
alter table discord_events enable row level security;
alter table discord_oauth_states enable row level security;

-- Service role can insert events
create policy if not exists "Service role can insert discord events"
on discord_events for insert
to service_role
with check (true);

-- Users can view their own events
create policy if not exists "Users can view own discord events"
on discord_events for select
using (auth.uid() = user_id);

-- Service role manages OAuth states
create policy if not exists "Service role manages oauth states"
on discord_oauth_states for all
to service_role
using (true)
with check (true);

-- Cleanup old OAuth states (optional cron job)
-- delete from discord_oauth_states where expires_at < now();
