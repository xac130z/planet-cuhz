-- Add indices for notifications performance
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_match_channel ON notifications(match_id, channel);

-- Add last_attempt_at column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'last_attempt_at'
  ) THEN
    ALTER TABLE notifications ADD COLUMN last_attempt_at timestamptz;
  END IF;
END $$;

-- Add attempts column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'attempts'
  ) THEN
    ALTER TABLE notifications ADD COLUMN attempts integer DEFAULT 1;
  END IF;
END $$;