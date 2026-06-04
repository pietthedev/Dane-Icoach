-- Run this in the Supabase SQL Editor

-- Subscriptions table (stores Paystack subscription details per user)
CREATE TABLE IF NOT EXISTS subscriptions (
  id                          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                     uuid REFERENCES profiles(id) NOT NULL,
  paystack_subscription_code  text,
  paystack_customer_code      text,
  paystack_email_token        text,   -- needed to cancel via Paystack API
  plan                        text NOT NULL,
  status                      text DEFAULT 'active',
  current_period_start        timestamptz,
  current_period_end          timestamptz,
  created_at                  timestamptz DEFAULT now(),
  updated_at                  timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Unique constraint so upsert by user_id works
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- Invoices table (one row per charge)
CREATE TABLE IF NOT EXISTS invoices (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             uuid REFERENCES profiles(id) NOT NULL,
  amount              integer NOT NULL,          -- in smallest currency unit (kobo)
  currency            text DEFAULT 'ZAR',
  status              text DEFAULT 'pending',    -- pending | paid | failed
  paystack_reference  text UNIQUE,
  paid_at             timestamptz,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

-- New voice columns on profiles (add if not already present)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS voice_sessions_used_this_month  integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS voice_sessions_limit_monthly    integer,
  ADD COLUMN IF NOT EXISTS voice_minutes_used_today        numeric  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS voice_minutes_limit_daily       numeric,
  ADD COLUMN IF NOT EXISTS voice_last_session_date         date;

-- Set free-plan defaults for existing users who don't have limits yet
UPDATE profiles
SET
  voice_minutes_limit_daily = 3
WHERE plan = 'free' AND voice_minutes_limit_daily IS NULL;

UPDATE profiles
SET
  voice_sessions_limit_monthly = 6,
  voice_minutes_limit_daily    = 20
WHERE plan = 'grow' AND voice_sessions_limit_monthly IS NULL;

UPDATE profiles
SET
  voice_sessions_limit_monthly = 15,
  voice_minutes_limit_daily    = 30
WHERE plan = 'business' AND voice_sessions_limit_monthly IS NULL;
