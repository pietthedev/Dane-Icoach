import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    if (!conversationId) return NextResponse.json({ error: 'conversation_id required' }, { status: 400 })

    // Verify ownership
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

    // Verify ownership
    const { data: conv } = await supabase.from('conversations').select('id').eq('id', conversation_id).eq('user_id', user.id).single()
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Save user message
    await supabase.from('messages').insert({ conversation_id, role: 'user', content })

    // Note: Anthropic API integration should be added here when ANTHROPIC_API_KEY is configured
    // For now, return a placeholder response
    const assistantContent = 'The AI companion is not yet configured. Please add your Anthropic API key to enable conversations.'

    await supabase.from('messages').insert({ conversation_id, role: 'assistant', content: assistantContent })

    return NextResponse.json({ content: assistantContent })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
