-- Run this in the Supabase SQL Editor
-- Creates the admin_client_notes table used by Danè to store private notes per client

CREATE TABLE IF NOT EXISTS admin_client_notes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id  uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body       text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- If the table already exists without the body column, add it:
ALTER TABLE admin_client_notes ADD COLUMN IF NOT EXISTS body text;

-- Service role bypasses RLS, but add a basic policy so anon key can't read these
ALTER TABLE admin_client_notes ENABLE ROW LEVEL SECURITY;

-- Only allow access via service role (no user-facing RLS policy needed)
-- If you ever query this via anon key, add: CREATE POLICY "admin_notes_policy" ON admin_client_notes FOR ALL USING (false);
