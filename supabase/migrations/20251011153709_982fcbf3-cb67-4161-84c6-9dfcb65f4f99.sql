-- Add idempotency protection for Stripe webhooks

-- Prevent duplicate bookings from same Stripe payment
CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_payment_id_uidx 
  ON bookings (stripe_payment_id) 
  WHERE stripe_payment_id IS NOT NULL;

-- Index for team builds to help with queries
CREATE INDEX IF NOT EXISTS team_builds_buyer_status_idx 
  ON team_builds (buyer_id, status);

-- Create audit table to track processed webhook events
CREATE TABLE IF NOT EXISTS payments_audit (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  price_id TEXT,
  payload JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit table
ALTER TABLE payments_audit ENABLE ROW LEVEL SECURITY;

-- Service role can insert (webhook only)
CREATE POLICY "Service role can insert audit logs" ON payments_audit
  FOR INSERT WITH CHECK (true);

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs" ON payments_audit
  FOR SELECT USING (auth.uid() = user_id);