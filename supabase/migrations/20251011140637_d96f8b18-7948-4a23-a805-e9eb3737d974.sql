-- Entitlements table (Founders Premium + Hire Credits)
create table if not exists entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  founders_expires_at timestamptz,
  hire_credit_count int default 0,
  hire_credit_cap_usd int default 0,
  updated_at timestamptz default now()
);

alter table entitlements enable row level security;

create policy "Users can view own entitlements" on entitlements
  for select using (auth.uid() = user_id);

create policy "Users can update own entitlements" on entitlements
  for update using (auth.uid() = user_id);

-- Team Builds table (Assembly Service)
create table if not exists team_builds (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id),
  description text,
  desired_roles jsonb,
  skill_tiers text[],
  region text,
  platform text,
  availability_windows text,
  discord_psn text,
  budget_notes text,
  deadline date,
  total_price numeric,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table team_builds enable row level security;

create policy "Users can view own team builds" on team_builds
  for select using (auth.uid() = buyer_id);

create policy "Users can create own team builds" on team_builds
  for insert with check (auth.uid() = buyer_id);

-- Team Build Players (Junction Table)
create table if not exists team_build_players (
  id uuid primary key default gen_random_uuid(),
  team_build_id uuid references team_builds(id) on delete cascade,
  player_id uuid references auth.users(id),
  role text not null,
  fee numeric,
  accepted boolean default false,
  created_at timestamptz default now()
);

alter table team_build_players enable row level security;

create policy "Team build members can view" on team_build_players
  for select using (
    auth.uid() in (
      select buyer_id from team_builds where id = team_build_id
      union
      select player_id
    )
  );

-- Bookings table (7-Game Hires, Coaching, etc.)
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id),
  player_id uuid references auth.users(id),
  type text not null,
  price_usd numeric not null,
  contracted_games int,
  completed_games int default 0,
  status text default 'pending',
  stripe_payment_id text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table bookings enable row level security;

create policy "Users can view bookings they're part of" on bookings
  for select using (auth.uid() in (buyer_id, player_id));

create policy "Buyers can create bookings" on bookings
  for insert with check (auth.uid() = buyer_id);

-- Alert Preferences
create table if not exists alerts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  availability_opt_in boolean default false,
  phone_opt_in boolean default false,
  last_notified_at timestamptz,
  updated_at timestamptz default now()
);

alter table alerts enable row level security;

create policy "Users manage own alerts" on alerts
  for all using (auth.uid() = user_id);

-- LFG Listings (Squad Finder Posts)
create table if not exists lfg_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  role text not null,
  skill_tier text,
  region text,
  platform text,
  availability text,
  notes text,
  status text default 'active',
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '7 days')
);

alter table lfg_listings enable row level security;

create policy "Anyone can view active listings" on lfg_listings
  for select using (status = 'active');

create policy "Users create own listings" on lfg_listings
  for insert with check (auth.uid() = user_id);