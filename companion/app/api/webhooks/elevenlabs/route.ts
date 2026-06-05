import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Service role client — webhook has no user session
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface ElevenLabsTranscriptEntry {
  role: 'user' | 'agent'
  message: string
  time_in_call_secs?: number
}

interface ElevenLabsWebhookPayload {
  type: string
  event_timestamp?: number
  // ElevenLabs sends these either top-level or nested under data
  conversation_id?: string
  agent_id?: string
  status?: string
  transcript?: ElevenLabsTranscriptEntry[]
  metadata?: {
    start_time_unix_secs?: number
    call_duration_secs?: number
    cost?: number
    summary?: string
  }
  analysis?: {
    transcript_summary?: string
    success_evaluation?: string
  }
  // Some versions wrap everything under data
  data?: {
    conversation_id?: string
    agent_id?: string
    status?: string
    transcript?: ElevenLabsTranscriptEntry[]
    metadata?: ElevenLabsWebhookPayload['metadata']
    analysis?: ElevenLabsWebhookPayload['analysis']
  }
}

export async function POST(req: NextRequest) {
  // Log immediately — this is the first sign of life in Vercel logs
  console.log('[elevenlabs-webhook] Received webhook')
  console.log('[elevenlabs-webhook] Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())))

  try {
    // ── Read body first so it's available for both signature check and parsing
    const rawBody   = await req.text()
    const sigHeader = req.headers.get('ElevenLabs-Signature') ?? req.headers.get('elevenlabs-signature')
    const secret    = process.env.ELEVENLABS_WEBHOOK_SECRET

    console.log(`[elevenlabs-webhook] sig header present=${!!sigHeader} secret set=${!!secret}`)

    // ── Verify HMAC-SHA256 signature (only when secret is configured) ─────────
    // ElevenLabs sends: ElevenLabs-Signature: t=<timestamp>,v0=<hmac-sha256>
    // Signed string: "<timestamp>.<raw_body>"
    if (secret) {
      if (!sigHeader) {
        console.warn('[elevenlabs-webhook] Missing ElevenLabs-Signature header — rejecting')
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Parse "t=<timestamp>,v0=<signature>"
      const parts     = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')))
      const timestamp = parts['t']
      const v0        = parts['v0']

      if (!timestamp || !v0) {
        console.warn('[elevenlabs-webhook] Malformed signature header — rejecting', { sigHeader })
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Reject stale webhooks (> 5 minutes old)
      const ageSeconds = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10)
      if (ageSeconds > 300) {
        console.warn(`[elevenlabs-webhook] Stale webhook (${ageSeconds}s old) — rejecting`)
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const expected = crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}.${rawBody}`)
        .digest('hex')

      if (!crypto.timingSafeEqual(Buffer.from(v0, 'hex'), Buffer.from(expected, 'hex'))) {
        console.warn('[elevenlabs-webhook] Invalid signature — rejecting')
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      console.log('[elevenlabs-webhook] Signature verified ✓')
    } else {
      console.log('[elevenlabs-webhook] No secret configured — skipping signature check')
    }

    const payload = JSON.parse(rawBody) as ElevenLabsWebhookPayload

    // Normalise: some versions nest under data, some don't
    const inner           = payload.data ?? payload
    const eventType       = payload.type
    const conversationId  = inner.conversation_id ?? payload.conversation_id
    const transcript      = inner.transcript      ?? payload.transcript ?? []
    const metadata        = inner.metadata        ?? payload.metadata   ?? {}
    const analysis        = inner.analysis        ?? payload.analysis   ?? {}

    console.log(`[elevenlabs webhook] type=${eventType} conv=${conversationId} msgs=${transcript.length}`)

    if (eventType !== 'conversation.completed') {
      // Acknowledge unhandled types gracefully
      return NextResponse.json({ received: true })
    }

    if (!conversationId) {
      console.error('[elevenlabs webhook] Missing conversation_id')
      return NextResponse.json({ received: true })
    }

    const supabase = getServiceClient()

    // ── Find or create the conversation row ──────────────────────────────────
    const { data: existing } = await supabase
      .from('conversations')
      .select('id, user_id')
      .eq('elevenlabs_conversation_id', conversationId)
      .maybeSingle()

    let convId: string
    let userId: string

    if (existing) {
      convId = existing.id
      userId = existing.user_id
      console.log(`[elevenlabs webhook] Found existing conversation: ${convId}`)

      // Update status and duration
      await supabase.from('conversations').update({
        status:     'completed',
        ended_at:   metadata.call_duration_secs
          ? new Date((( metadata.start_time_unix_secs ?? 0) + metadata.call_duration_secs) * 1000).toISOString()
          : undefined,
        updated_at: new Date().toISOString(),
      }).eq('id', convId)

    } else {
      // Conversation not found — may happen if the webhook beats the client save
      // We can't create it without a user_id, so log and return
      console.warn(`[elevenlabs webhook] No conversation found for elevenlabs_id=${conversationId} — skipping create (user_id unknown from webhook)`)
      return NextResponse.json({ received: true })
    }

    // ── Replace messages with the definitive ElevenLabs transcript ───────────
    if (transcript.length > 0) {
      // Delete existing client-captured messages (less accurate) and replace
      await supabase.from('messages').delete().eq('conversation_id', convId)

      const rows = transcript.map((t, i) => ({
        conversation_id:  convId,
        user_id:          userId,
        role:             t.role === 'agent' ? 'assistant' : 'user',
        content:          t.message.replace(/\[[\w\s]+\]/g, '').trim(),
        created_at:       new Date(
          ((metadata.start_time_unix_secs ?? 0) + (t.time_in_call_secs ?? i)) * 1000
        ).toISOString(),
      }))

      const { error: msgErr } = await supabase.from('messages').insert(rows)
      if (msgErr) console.error('[elevenlabs webhook] Failed to insert messages:', msgErr)
      else console.log(`[elevenlabs webhook] Saved ${rows.length} messages`)
    }

    // ── Upsert summary with ElevenLabs analysis ──────────────────────────────
    const summaryText = analysis.transcript_summary ?? metadata.summary ?? null

    if (summaryText) {
      const { error: sumErr } = await supabase.from('conversation_summaries').upsert({
        conversation_id: convId,
        user_id:         userId,
        summary:         summaryText,
        key_topics:      [],   // ElevenLabs doesn't provide structured topics
        action_items:    [],
        generated_by:    'elevenlabs',
        language:        'en',
        updated_at:      new Date().toISOString(),
      }, { onConflict: 'conversation_id' })

      if (sumErr) console.error('[elevenlabs webhook] Failed to upsert summary:', sumErr)
      else console.log('[elevenlabs webhook] Summary saved from ElevenLabs analysis')
    }

    console.log(`[elevenlabs webhook] Done: conv=${convId} duration=${metadata.call_duration_secs}s cost=${metadata.cost}`)
    return NextResponse.json({ received: true })

  } catch (err) {
    // Log fully but always return 200 — ElevenLabs will retry on non-2xx
    console.error('[elevenlabs-webhook] Uncaught error:', err)
    return NextResponse.json({ received: true, error: String(err) })
  }
}
