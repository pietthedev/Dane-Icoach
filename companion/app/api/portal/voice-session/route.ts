import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendNotification } from '@/lib/notifications'

interface Message {
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

function buildTranscriptTitle(messages: Message[]): string {
  const firstUser = messages.find(m => m.role === 'user')
  if (firstUser) {
    return firstUser.content.slice(0, 60) + (firstUser.content.length > 60 ? '...' : '')
  }
  return `Voice session ${new Date().toLocaleDateString('en-ZA')}`
}

function buildTranscriptText(messages: Message[]): string {
  return messages
    .map(m => `${m.role === 'user' ? 'User' : 'Companion'}: ${m.content}`)
    .join('\n\n')
}

// ── Try to get summary from ElevenLabs first ──────────────────────────────────
async function fetchElevenLabsSummary(elevenLabsConvId: string): Promise<{
  summary: string
  key_topics: string[]
  action_items: string[]
} | null> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey || !elevenLabsConvId) return null

    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${elevenLabsConvId}`,
      {
        headers: { 'xi-api-key': apiKey },
        // short timeout — this might not be ready yet, Gemini is the fallback
        signal: AbortSignal.timeout(5000),
      }
    )

    if (!res.ok) {
      console.log(`[voice-session] ElevenLabs conv not ready yet (${res.status}) — will use Gemini`)
      return null
    }

    const data = await res.json()
    const summaryText: string | undefined =
      data.analysis?.transcript_summary ??
      data.metadata?.summary

    if (!summaryText) return null

    console.log('[voice-session] Using ElevenLabs summary')
    return {
      summary:      summaryText,
      key_topics:   [],
      action_items: [],
    }
  } catch {
    // Timeout or network error — fall through to Gemini
    return null
  }
}

// ── Gemini fallback summary ───────────────────────────────────────────────────
// Returns plain text — no JSON parsing, eliminates truncation errors
async function generateGeminiSummary(transcript: string): Promise<{
  summary: string
  key_topics: string[]
  action_items: string[]
} | null> {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[voice-session] GEMINI_API_KEY not set')
      return null
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Summarise this coaching conversation in 2-3 sentences. Return plain text only, no JSON, no markdown.

Transcript:
${transcript}`,
            }],
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.2,
          },
        }),
      }
    )

    const data = await res.json()
    console.log('[voice-session] Gemini response status:', res.status)

    if (!res.ok) {
      console.error('[voice-session] Gemini API error:', JSON.stringify(data))
      return null
    }

    const summaryText: string = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim()
    if (!summaryText) return null

    // Extract 3 key words from the summary as fallback topics
    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','was','are','were','be','been','being','have','has','had','do','did','will','would','could','should','may','might','that','this','it','its','they','their','them','we','our','you','your','i','my'])
    const keyTopics = summaryText
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4 && !stopWords.has(w.toLowerCase()))
      .slice(0, 3)

    return { summary: summaryText, key_topics: keyTopics, action_items: [] }
  } catch (err) {
    console.error('[voice-session] Gemini summary failed:', err)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { messages, started_at, ended_at, elevenlabs_conversation_id } =
      await req.json() as {
        messages: Message[]
        started_at: string
        ended_at: string
        elevenlabs_conversation_id: string | null
      }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages to save' }, { status: 400 })
    }

    console.log('[voice-session] Saving session:', {
      messages: messages.length,
      elevenlabs_conversation_id,
    })

    const title          = buildTranscriptTitle(messages)
    const transcriptText = buildTranscriptText(messages)

    // ── Create conversation row — store elevenlabs_conversation_id ────────────
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({
        user_id:                    user.id,
        title,
        mode:                       'voice',
        status:                     'completed',
        started_at,
        ended_at,
        elevenlabs_conversation_id: elevenlabs_conversation_id ?? null,
      })
      .select('id')
      .single()

    if (convError || !conv) {
      console.error('[voice-session] Failed to create conversation:', convError)
      return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 })
    }

    console.log('[voice-session] Conversation created:', conv.id)

    // ── Save messages captured by the client ──────────────────────────────────
    const messageRows = messages.map(m => ({
      conversation_id: conv.id,
      user_id:         user.id,
      role:            m.role === 'agent' ? 'assistant' : 'user',
      content:         m.content.replace(/\[[\w\s]+\]/g, '').trim(),
      created_at:      m.timestamp,
    }))
    const { error: msgError } = await supabase.from('messages').insert(messageRows)
    if (msgError) console.error('[voice-session] Failed to save messages:', msgError)

    // ── Generate summary: try ElevenLabs first, fall back to Gemini ──────────
    let summaryData: { summary: string; key_topics: string[]; action_items: string[] } | null = null
    let generatedBy = 'gemini-2.5-flash'

    if (elevenlabs_conversation_id) {
      summaryData = await fetchElevenLabsSummary(elevenlabs_conversation_id)
      if (summaryData) generatedBy = 'elevenlabs'
    }

    if (!summaryData) {
      summaryData = await generateGeminiSummary(transcriptText)
    }

    if (summaryData) {
      const { error: sumError } = await supabase.from('conversation_summaries').insert({
        conversation_id: conv.id,
        user_id:         user.id,
        summary:         summaryData.summary,
        key_topics:      summaryData.key_topics,
        action_items:    summaryData.action_items,
        generated_by:    generatedBy,
        language:        'en',
      })
      if (sumError) console.error('[voice-session] Failed to save summary:', sumError)
      else console.log(`[voice-session] Summary saved (source: ${generatedBy})`)
    }

    // Notify the user that their summary is ready (fire-and-forget)
    sendNotification({
      userId:  user.id,
      title:   'Your session summary is ready',
      message: 'Tap to view your transcript, key topics and action items.',
      url:     `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/portal/conversations`,
      type:    'summary_ready',
    }).catch(console.error)

    return NextResponse.json({ conversation_id: conv.id })
  } catch (err) {
    console.error('[voice-session] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
