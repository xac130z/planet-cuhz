-- Add digest preferences to user_profiles
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS digest_cadence text DEFAULT 'daily' CHECK (digest_cadence IN ('daily', 'weekly', 'off')),
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';

-- Create comms_logs for tracking all notifications
CREATE TABLE IF NOT EXISTS comms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'welcome', 'digest', 'match'
  channel text NOT NULL, -- 'email', 'sms', 'discord'
  status text NOT NULL DEFAULT 'sent', -- 'sent', 'failed', 'delivered'
  provider text, -- 'sendgrid', 'twilio', 'n8n'
  error text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comms_logs_user ON comms_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comms_logs_event ON comms_logs(event_type, created_at DESC);

-- RLS for comms_logs
ALTER TABLE comms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own comms logs"
  ON comms_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages comms logs"
  ON comms_logs FOR ALL
  USING (true);