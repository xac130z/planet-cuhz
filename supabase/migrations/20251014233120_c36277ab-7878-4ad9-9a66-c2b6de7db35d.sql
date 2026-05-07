-- Notifications audit table for tracking match intros
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  match_id uuid not null references matches(id) on delete cascade,
  channel text not null check (channel in ('discord', 'email', 'sms')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'sent' check (status in ('sent', 'failed', 'pending')),
  error text
);

-- Indexes for performance
create index if not exists idx_notifications_match_id on notifications(match_id);
create index if not exists idx_notifications_created on notifications(created_at desc);
create index if not exists idx_notifications_channel on notifications(channel);

-- RLS policies
alter table notifications enable row level security;

-- Members of a match can view notifications for that match
create policy "notifications_readable_by_match_members" on notifications
  for select
  using (
    auth.uid() in (
      select unnest(member_ids) 
      from matches 
      where id = match_id
    )
  );

-- Service role can insert notifications
create policy "notifications_insert_service" on notifications
  for insert
  with check (true);

comment on table notifications is 'Audit log for match notification delivery (Discord, Email, SMS)';
