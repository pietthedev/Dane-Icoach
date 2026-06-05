# Companion by Danè — Project Context for Claude

## Tech Stack
- Next.js 14, TypeScript, Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Supabase project ID: `qqxrifvdnnsajvnbqisr`
- Supabase URL: `https://qqxrifvdnnsajvnbqisr.supabase.co`

---

## Access Control Rules
- **Admins never access `/portal`** — portal layout redirects them to `/admin` immediately
- **New clients are auto-assigned to Danè** (UUID: `30e904de-2252-4cc7-9d40-ff09ee3614b0`) via a DB trigger on signup
- **Each coach sees only their own clients** — `coach_clients.coach_id = auth.uid()` filters all admin client pages
- Login page and auth callback both check `admin_roles` and hard-redirect admins to `/admin`
- All conversations are **private by default** — user must explicitly share with coach via `shared_with_coach = true`

## Plan Limits
| Plan     | Conversations/month | Voice sessions/month | Voice min/day |
|----------|--------------------|--------------------|---------------|
| free     | 5                  | 1 session/day      | 3 min max     |
| grow     | unlimited          | 6                  | 20 min        |
| business | unlimited          | 15                 | 30 min        |

---

## Critical Schema — Exact Column Names

### admin_profiles
`id` (matches auth.users id), `full_name`, `email`, `avatar_url`, `phone`, `timezone`, `bio`
- Danè's row: id = `30e904de-2252-4cc7-9d40-ff09ee3614b0`

### coach_clients
`id`, `coach_id` (uuid → admin_profiles.id), `client_id` (uuid → profiles.id),
`assigned_at`, `is_primary`
- All existing clients assigned to Danè; DB trigger auto-assigns new signups to Danè

### subscriptions
`id`, `user_id` (uuid → profiles.id), `paystack_subscription_code`, `paystack_customer_code`,
`paystack_email_token`, `plan`, `status` (active|cancelled|past_due),
`current_period_start`, `current_period_end`, `created_at`, `updated_at`
- One row per user (upsert on `user_id`)
- `paystack_email_token` is required to cancel via Paystack API

### profiles
`id`, `full_name` (NOT first_name/last_name), `avatar_url`, `phone`, `timezone`,
`language_preference`, `plan`, `plan_status`, `token_limit_monthly`, `tokens_used_this_month`,
`token_reset_date`, `conversations_limit_monthly`, `conversations_used_this_month`,
`voice_sessions_used_this_month`, `voice_sessions_limit_monthly`,
`voice_minutes_used_today`, `voice_minutes_limit_daily`, `voice_last_session_date`,
`pref_learn_from_ratings`, `pref_auto_summarise`, `pref_cross_session_memory`,
`pref_email_digest`, `pref_push_notifications`, `pref_quote_of_day`,
`consent_marketing`, `consent_data_training`, `consent_given_at`,
`onboarding_completed`, `onboarding_step`, `last_active_at`, `created_at`, `updated_at`

### conversations
`id`, `user_id`, `title`, `mode` (text|voice|voice_playback), `language`, `model`,
`status` (active|completed|abandoned — NOT 'ended'), `tokens_used`,
`elevenlabs_conversation_id` (text, nullable), `shared_with_coach` (boolean, default false),
`started_at`, `ended_at`, `created_at`, `updated_at`

### messages
`id`, `conversation_id`, `user_id`, `role` (user|assistant), `content`, `created_at`
- ElevenLabs pacing tags `[slow]`, `[fast]`, `[pause]` are stripped before saving

### conversation_summaries
`id`, `conversation_id`, `user_id`, `summary`, `key_topics` (text[]), `action_items` (text[]),
`generated_by` (gemini-2.5-flash|elevenlabs), `language`, `created_at`, `updated_at`

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

### admin_client_notes
`id`, `client_id` (uuid → profiles.id), `author_id` (uuid → admin_profiles.id),
`note` (NOT body), `is_pinned`, `created_at`, `updated_at`

### notifications
`id`, `user_id`, `type` (summary_ready|homework_assigned|homework_due|booking_confirmed|
booking_reminder_24h|booking_reminder_1h|booking_cancelled|invoice_paid|invoice_failed|
account_suspended|token_limit_warning|token_limit_reached|quote_of_day|coach_feedback|
goal_achieved|insight_detected|system),
`title`, `body`, `read` (NOT is_read), `created_at`

### invoices
`id`, `user_id`, `amount` (integer, in kobo), `currency` (default ZAR),
`status` (pending|paid|failed), `paystack_reference` (unique), `paid_at`, `created_at`, `updated_at`

### quotes
`id`, `quote_text` (NOT text or body), `author`, `category` (confidence|purpose|leadership|
resilience|mindfulness|growth|relationships|voice|general),
`language`, `source` (ai|dane|curated — NOT 'manual'), `is_active`, `created_at`

---

## Environment Variables Required

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### App
```
NEXT_PUBLIC_SITE_URL          # http://localhost:3000 locally, https://companionai.coach on Vercel
CRON_SECRET                   # random string to protect cron endpoints
```

### ElevenLabs (voice sessions)
```
ELEVENLABS_API_KEY
NEXT_PUBLIC_ELEVENLABS_AGENT_ID
ELEVENLABS_WEBHOOK_SECRET     # from ElevenLabs agent settings → Webhooks
```

### Gemini (fallback AI summary)
```
GEMINI_API_KEY
```

### Paystack (billing)
```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
PAYSTACK_SECRET_KEY
PAYSTACK_SUBACCOUNT_CODE
PAYSTACK_SPLIT_PERCENTAGE
PAYSTACK_GROW_PLAN_CODE       # PLN_xxx — created via scripts/setup-paystack-plans.js
PAYSTACK_BUSINESS_PLAN_CODE   # PLN_xxx
```

### OneSignal (push notifications)
```
NEXT_PUBLIC_ONESIGNAL_APP_ID
ONESIGNAL_REST_API_KEY
```

### Email
```
RESEND_API_KEY
NOTIFICATION_EMAIL
```

### Other integrations
```
CALENDLY_API_TOKEN
```

---

## API Routes

### Portal (user-facing)
| Route | Method | Description |
|-------|--------|-------------|
| `/api/portal/conversations` | GET/POST | List or create text conversations |
| `/api/portal/messages` | GET/POST | Fetch or send messages in a conversation |
| `/api/portal/voice-session` | POST | Save voice session transcript + generate summary |
| `/api/portal/end-voice-session` | POST | Update `voice_minutes_used_today` and session count |
| `/api/portal/check-limits` | GET | Return user's current plan limits and usage |
| `/api/portal/conversation-audio` | GET | Stream voice recording from ElevenLabs |
| `/api/portal/subscribe` | POST | Initialise Paystack transaction for plan upgrade |
| `/api/portal/cancel-subscription` | POST | Disable Paystack subscription and reset plan |
| `/api/portal/ratings` | PATCH | Save conversation rating and colour tag |
| `/api/portal/notes` | PATCH | Save conversation notes |
| `/api/portal/profile` | GET/PATCH | Fetch or update user profile |
| `/api/portal/notifications/read-all` | PATCH | Mark all notifications as read |

### Webhooks
| Route | Method | Description |
|-------|--------|-------------|
| `/api/webhooks/paystack` | POST | Handles charge.success, subscription.create, subscription.disable, invoice.payment_failed |
| `/api/webhooks/elevenlabs` | POST | Handles conversation.completed — saves definitive transcript and summary |

### Admin
| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/notes` | POST | Create admin note for a client (uses service role) |
| `/api/admin/quotes` | GET/POST | Fetch or create quotes (uses service role) |
| `/api/admin/conversation-audio` | GET | Stream voice recording for admin view |
| `/api/notifications/send` | POST | Send push notification (admin only) — single user or broadcast |

### Cron
| Route | Schedule | Description |
|-------|----------|-------------|
| `/api/cron/daily-quote` | `0 5 * * *` (7am SAST) | Send daily quote push to opted-in users |

---

## Architecture Notes

### Voice Session Flow
1. User speaks → ElevenLabs captures audio
2. `onDisconnect` fires in `VoiceWidget` → client POSTs to `/api/portal/voice-session`
3. `voice-session` creates conversation row with `elevenlabs_conversation_id`, saves client-captured messages, tries ElevenLabs summary first (5s timeout), falls back to Gemini
4. ElevenLabs webhook fires ~30–60s later → replaces messages with definitive transcript, upserts better summary with `generated_by: 'elevenlabs'`
5. Push notification sent: "Your session summary is ready"

### Paystack Subscription Flow
1. User clicks Upgrade → `/api/portal/subscribe` → Paystack hosted payment page
2. `charge.success` webhook → update `profiles.plan`, upsert `subscriptions`
3. `subscription.create` webhook → store `paystack_subscription_code` and `email_token`
4. Monthly: `charge.success` fires again (no metadata) → user resolved by `paystack_customer_code`
5. Cancel: `/api/portal/cancel-subscription` → POST to Paystack disable endpoint using `paystack_email_token`

### Push Notification Flow
- `OneSignalProvider` (in portal layout) calls `OneSignal.login(userId)` to link device
- Tags device with `quote_of_day=1|0` based on `pref_quote_of_day` preference
- `lib/notifications.ts` helper used by all routes — sends via OneSignal REST API + inserts into `notifications` table
- Daily cron sends to users tagged `quote_of_day=1`

### Admin Client Access
- `app/admin/clients/page.tsx` — filters via `coach_clients.coach_id = auth.uid()`
- `app/admin/clients/[id]/page.tsx` — verifies ownership before loading any data
- All data fetched with service role client to bypass RLS

---

## Known Issues & Fixes Applied
- Removed broken `admin_roles` RLS policies (caused infinite recursion 500 errors)
- Supabase client uses legacy JWT anon key (not new sb_publishable_ format)
- `admin_client_notes` column is `note` (NOT `body`) and has `author_id`
- ElevenLabs pacing tags stripped with `/\[[\w\s]+\]/g` before saving messages
- Sign-out uses `window.location.href = '/'` (not `router.push`) to fully clear session

---

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

---

## File Structure
- `app/portal/` — user-facing portal pages
- `app/api/portal/` — API routes for portal features
- `app/api/webhooks/` — Paystack and ElevenLabs webhook handlers
- `app/api/admin/` — admin-only API routes (service role)
- `app/api/cron/` — Vercel cron job endpoints
- `app/api/notifications/` — push notification sender
- `app/admin/` — admin portal pages
- `components/portal/PortalShell.tsx` — portal layout shell
- `components/admin/AdminShell.tsx` — admin layout shell
- `components/OneSignalProvider.tsx` — initialises OneSignal push SDK
- `lib/supabase/client.ts` — browser Supabase client
- `lib/supabase/server.ts` — server Supabase client
- `lib/notifications.ts` — shared push notification + in-app notification helper
- `scripts/setup-paystack-plans.js` — creates Paystack recurring plans via API
- `scripts/setup-subscriptions.sql` — creates subscriptions + invoices tables
- `scripts/setup-admin-client-notes.sql` — creates admin_client_notes table
- `public/OneSignalSDKWorker.js` — required OneSignal service worker
- `vercel.json` — Vercel cron configuration

## Before Making Any Changes
1. Check this file for correct column names
2. Use service role client for all admin reads/writes — never anon client in admin routes
3. Run `scripts/validate-seed.sql` in Supabase SQL Editor to verify schema if unsure
