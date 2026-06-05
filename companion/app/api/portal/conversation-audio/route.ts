import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')

    if (!conversationId) {
      return NextResponse.json({ error: 'conversation_id required' }, { status: 400 })
    }

    // Verify ownership and get elevenlabs_conversation_id
    const { data: conv } = await supabase
      .from('conversations')
      .select('id, elevenlabs_conversation_id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (!conv) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const elevenLabsId = conv.elevenlabs_conversation_id as string | null
    if (!elevenLabsId) {
      return NextResponse.json({ error: 'No ElevenLabs recording for this conversation' }, { status: 404 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      console.error('[conversation-audio] ELEVENLABS_API_KEY not set')
      return NextResponse.json({ error: 'ElevenLabs API not configured' }, { status: 500 })
    }

    // ── First: log the full conversation metadata for debugging ─────────────
    const metaRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${elevenLabsId}`,
      { headers: { 'xi-api-key': apiKey } }
    )
    if (metaRes.ok) {
      const meta = await metaRes.json()
      console.log('[conversation-audio] ElevenLabs metadata:', JSON.stringify(meta, null, 2))
    } else {
      console.warn('[conversation-audio] Metadata fetch status:', metaRes.status)
    }

    // ── Stream the binary audio directly from ElevenLabs /audio endpoint ────
    const audioRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${elevenLabsId}/audio`,
      { headers: { 'xi-api-key': apiKey } }
    )

    console.log('[conversation-audio] Audio endpoint status:', audioRes.status)
    console.log('[conversation-audio] Audio content-type:', audioRes.headers.get('content-type'))

    if (!audioRes.ok) {
      console.error('[conversation-audio] Audio fetch failed:', audioRes.status, await audioRes.text())
      return NextResponse.json(
        { error: 'Audio not available', status: audioRes.status },
        { status: 404 }
      )
    }

    // Pipe the binary stream straight back to the browser
    const contentType = audioRes.headers.get('content-type') ?? 'audio/mpeg'
    const contentLength = audioRes.headers.get('content-length')

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    }
    if (contentLength) headers['Content-Length'] = contentLength

    return new NextResponse(audioRes.body, { status: 200, headers })
  } catch (err) {
    console.error('[conversation-audio] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
