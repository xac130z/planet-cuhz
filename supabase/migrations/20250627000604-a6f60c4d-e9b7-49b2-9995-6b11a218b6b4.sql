
-- Enable the required extensions for cron jobs and HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Now create the cron job to reset daily limits at midnight UTC
SELECT cron.schedule(
  'reset-daily-limits',
  '0 0 * * *', -- Run at midnight UTC every day
  $$
  SELECT
    net.http_post(
        url:='https://wjebryxdefcgsxsqomac.supabase.co/functions/v1/reset-daily-limits',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqZWJyeXhkZWZjZ3N4c3FvbWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTAyMTIsImV4cCI6MjA2NTU4NjIxMn0.o4e8h0oIHqMtVBBhEU3KQMRRvwCc2PpbjSbvqvGm1_o"}'::jsonb,
        body:='{"task": "reset-daily-limits"}'::jsonb
    ) as request_id;
  $$
);
