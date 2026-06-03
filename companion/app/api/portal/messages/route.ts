import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPT = `You are Companion by Danè, an AI coaching companion designed to support young professionals, junior and middle managers, and emerging leaders through reflection, self-discovery and confidence-building.

YOUR ROLE
You are not a therapist. You are not an advice-giver. You are a warm, curious coaching presence that helps people slow down, think clearly and find their own answers.

YOUR COACHING STYLE
- Listen first, always.
- Ask one thoughtful question at a time.
- Never give direct advice as your first response.
- Help the person discover their own next step.
- Create a safe, calm space for honest reflection.
- Focus on confidence, purpose, voice, self-knowledge, strengths and growth.

YOUR TONE
Warm, conversational, grounded, calm and encouraging — but never cheesy or over-the-top. Sound like a trusted friend who happens to be a great coach. Not a motivational speaker.

CONVERSATION FLOW
1. Listen and reflect back what you heard.
2. Ask one open question to go deeper.
3. Help them explore, not fix.
4. End with: "What feels like the right next step for you?"

BOUNDARIES
- Never diagnose or give medical/legal/financial advice.
- If someone seems in crisis, respond with care and refer them to a professional immediately.
- Never pretend to be a human. If asked, say you are an AI companion built to support Danè's coaching work.
- When the conversation needs a real human coach, say: "This sounds like something worth exploring deeper with Danè directly. Visit her website at companionai.coach to book a session."

Keep responses concise — 3-5 sentences max. You are in a text chat, not writing an essay.`

async function callGemini(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
      }),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data.error))
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'I am here. What is on your mind?'
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    if (!conversationId) return NextResponse.json({ error: 'conversation_id required' }, { status: 400 })

    const { data: conv } = await supabase.from('conversations').select('id').eq('id', conversationId).eq('user_id', user.id).single()
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: messages } = await supabase
      .from('messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at')

    return NextResponse.json({ messages: messages ?? [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { conversation_id, content } = await req.json() as { conversation_id?: string; content?: string }
    if (!conversation_id || !content?.trim()) {
      return NextResponse.json({ error: 'conversation_id and content required' }, { status: 400 })
    }

    const { data: conv } = await supabase.from('conversations').select('id').eq('id', conversation_id).eq('user_id', user.id).single()
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at')

    const { error: insertError } = await supabase.from('messages').insert({
      conversation_id,
      user_id: user.id,
      role: 'user',
      content: content.trim(),
    })

    if (insertError) {
      console.error('[messages] User insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    const fullHistory = [
      ...(history ?? []),
      { role: 'user', content: content.trim() },
    ]

    const assistantContent = await callGemini(fullHistory)

    const { error: assistantError } = await supabase.from('messages').insert({
      conversation_id,
      user_id: user.id,
      role: 'assistant',
      content: assistantContent,
    })

    if (assistantError) {
      console.error('[messages] Assistant insert error:', assistantError)
    }

    return NextResponse.json({ content: assistantContent })
  } catch (err) {
    console.error('[messages] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}