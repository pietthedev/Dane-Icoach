import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

async function generateSummary(transcript: string): Promise<{
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
          contents: [
            {
              parts: [
                {
                  text: `Summarise this coaching conversation. Return ONLY a JSON object, no markdown, no code fences, no explanation.

Transcript:
${transcript}

JSON format:
{"summary":"2-3 sentence summary","key_topics":["topic1","topic2"],"action_items":["action1"]}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.2,
            responseMimeType: 'application/json',
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

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    console.log('[voice-session] Gemini raw text:', text.slice(0, 200))

    if (!text) {
      console.error('[voice-session] Empty response from Gemini')
      return null
    }

    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    console.error('[voice-session] Summary generation failed:', err)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { messages, started_at, ended_at } =
      await req.json() as {
        messages: Message[]
        started_at: string
        ended_at: string
        elevenlabs_conversation_id: string | null
      }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages to save' }, { status: 400 })
    }

    console.log('[voice-session] Saving session with', messages.length, 'messages')

    const title = buildTranscriptTitle(messages)
    const transcriptText = buildTranscriptText(messages)

    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title,
        mode: 'voice',
        status: 'completed',
        started_at,
        ended_at,
      })
      .select('id')
      .single()

    if (convError || !conv) {
      console.error('[voice-session] Failed to create conversation:', convError)
      return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 })
    }

    const summaryData = await generateSummary(transcriptText)
    if (summaryData) {
      const { error: sumError } = await supabase.from('conversation_summaries').insert({
        conversation_id: conv.id,
        user_id: user.id,
        summary: summaryData.summary,
        key_topics: summaryData.key_topics,
        action_items: summaryData.action_items,
        generated_by: 'gemini-2.5-flash',
        language: 'en',
      })
      if (sumError) console.error('[voice-session] Failed to save summary:', sumError)
      else console.log('[voice-session] Summary saved successfully')
    }

    return NextResponse.json({ conversation_id: conv.id })
  } catch (err) {
    console.error('[voice-session] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}