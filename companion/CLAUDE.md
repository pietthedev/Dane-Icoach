# Companion by Danè — Project Context for Claude

## Tech Stack
- Next.js 14, TypeScript, Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Supabase project ID: `qqxrifvdnnsajvnbqisr`
- Supabase URL: `https://qqxrifvdnnsajvnbqisr.supabase.co`

## Critical Schema — Exact Column Names

### profiles
`id`, `full_name` (NOT first_name/last_name), `avatar_url`, `phone`, `timezone`,
`language_preference`, `plan`, `plan_status`, `token_limit_monthly`, `tokens_used_this_month`,
`token_reset_date`, `conversations_limit_monthly`, `conversations_used_this_month`,
`pref_learn_from_ratings`, `pref_auto_summarise`, `pref_cross_session_memory`,
`pref_email_digest`, `pref_push_notifications`, `pref_quote_of_day`,
`consent_marketing`, `consent_data_training`, `consent_given_at`,
`onboarding_completed`, `onboarding_step`, `last_active_at`, `created_at`, `updated_at`

### conversations
`id`, `user_id`, `title`, `mode` (text|voice|voice_playback), `language`, `model`,
`status` (active|completed|abandoned — NOT 'ended'), `tokens_used`, `started_at`, `ended_at`, `created_at`, `updated_at`

### conversation_summaries
`id`, `conversation_id`, `user_id`, `summary`, `key_topics` (text[]), `action_items` (text[]),
`generated_by`, `language`, `created_at`, `updated_at`

### conversation_ratings
`id`, `conversation_id`, `user_id`, `rating` (1-5), `color_tag` (green|blue|amber|red|purple),
`notes`, `created_at`, `updated_at`

### bookings
`id`, `user_id`, `title` (NOT session_type), `scheduled_at`, `duration_minutes`,
`status` (scheduled|confirmed|completed|cancelled|no_show|rescheduled),
`meeting_url`, `pre_session_notes`, `post_session_notes`, `created_at`, `updated_at`

### homework
`id`, `user_id`, `assigned_by` (uuid, NOT NULL — must be Dane's UUID),
`title`, `description` (NOT instructions), `homework_type` (exercise|reflection|reading|practice|goal_setting|other),
`due_date`, `status` (pending|in_progress|submitted|reviewed|skipped),
`coach_feedback` (NOT feedback), `coach_feedback_at` (NOT feedback_at),
`created_at`, `updated_at`

### goals
`id`, `user_id`, `title`, `category` (confidence|voice|leadership|purpose|relationships|career|wellbeing|other),
`target_date`, `progress_pct` (NOT progress), `status` (active|achieved|paused|abandoned — NOT 'completed'),
`achieved_at`, `created_at`, `updated_at`

### journal_entries
`id`, `user_id`, `title`, `body`, `entry_type` (reflection|homework|goal|win|challenge|gratitude),
`mood` (great|good|neutral|low|struggling), `mood_score` (1-10),
`tags` (text[]), `created_at`, `updated_at`
NOTE: NO share_with_coach column

### notifications
`id`, `user_id`, `type` (summary_ready|homework_assigned|homework_due|booking_confirmed|
booking_reminder_24h|booking_reminder_1h|booking_cancelled|invoice_paid|invoice_failed|
account_suspended|token_limit_warning|token_limit_reached|quote_of_day|coach_feedback|
goal_achieved|insight_detected|system),
`title`, `body`, `read` (NOT is_read), `created_at`

### quotes
`id`, `quote_text` (NOT text or body), `author`, `category` (confidence|purpose|leadership|
resilience|mindfulness|growth|relationships|voice|general),
`language`, `source` (ai|dane|curated — NOT 'manual'), `is_active`, `created_at`

## Known Issues & Fixes Applied
- Removed broken `admin_roles` RLS policies on conversations, profiles, bookings,
  homework, journal_entries, quotes, notifications (caused infinite recursion 500 errors)
- Supabase client uses legacy JWT anon key (not new sb_publishable_ format)
- Portal layout selects `full_name` not `first_name, last_name`

## Key People
- Dane de Klerk — coach/admin, UUID: `30e904de-2252-4cc7-9d40-ff09ee3614b0`

## Test Users
| Name | Email | Password | UUID |
|------|-------|----------|------|
| Sarah Mitchell | sarah@example.com | sarah@example.comA | 1d791b66-55fe-4841-942d-b43f252cb6f9 |
| James Okonkwo | james@example.com | james@example.comA | 9401272b-cb98-420a-a9ad-f317b037fe33 |
| Annika van Zyl | annika@example.com | annika@example.comA | 28ba1e2f-359d-4d23-929e-633acaa62dcb |
| Lerato Nkosi | lerato@example.com | lerato@example.comA | 3e5aa7c0-12d9-4428-b729-df37470029a8 |
| Thabo Pietersen | thabo@example.com | thabo@example.comA | 1b1cf901-2e4b-4e72-a22c-56476e86bfce |

## File Structure
- `app/portal/` — user-facing portal pages
- `app/api/portal/` — API routes for portal
- `app/admin/` — admin pages
- `components/portal/PortalShell.tsx` — main layout shell
- `lib/supabase/client.ts` — browser Supabase client
- `lib/supabase/server.ts` — server Supabase client
- `scripts/seed-data.sql` — seed data (schema-verified)

## Before Making Any Changes
1. Check this file for correct column names
2. Run `scripts/validate-seed.sql` in Supabase SQL Editor to verify schema
3. Run `scripts/pre-test-check.sql` to verify all columns exist before testing
