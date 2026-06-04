import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

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
  try {
    // ── Verify webhook secret ────────────────────────────────────────────────
    const secret          = process.env.ELEVENLABS_WEBHOOK_SECRET
    const incomingSecret  = req.headers.get('xi-webhook-secret')

    if (secret && incomingSecret !== secret) {
      console.warn('[elevenlabs webhook] Invalid secret — rejecting')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payload = await req.json() as ElevenLabsWebhookPayload

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
        content:          t.message,
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
    console.error('[elevenlabs webhook] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
