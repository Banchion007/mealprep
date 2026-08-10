-- Add payment verification tracking to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP;

-- Create webhook logs table for audit trail
CREATE TABLE IF NOT EXISTS webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  payment_intent_id TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS webhook_logs_event_id_idx ON webhook_logs(event_id);
CREATE INDEX IF NOT EXISTS webhook_logs_payment_intent_idx ON webhook_logs(payment_intent_id);

-- Enable RLS on webhook_logs (admin only)
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view webhook logs
CREATE POLICY webhook_logs_admin_select ON webhook_logs
  FOR SELECT
  USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  ));

-- Policy: Service role can insert/update webhook logs
CREATE POLICY webhook_logs_service_insert ON webhook_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY webhook_logs_service_update ON webhook_logs
  FOR UPDATE
  USING (true);
