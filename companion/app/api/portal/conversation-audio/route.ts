import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversationId   = searchParams.get('conversation_id') // our Supabase conversation id

    if (!conversationId) {
      return NextResponse.json({ error: 'conversation_id required' }, { status: 400 })
    }

    // Verify the conversation belongs to this user and get elevenlabs_conversation_id
    const { data: conv } = await supabase
      .from('conversations')
      .select('id, elevenlabs_conversation_id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (!conv) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const elevenLabsId = conv.elevenlabs_conversation_id
    if (!elevenLabsId) {
      return NextResponse.json({ audio_url: null, reason: 'No ElevenLabs recording for this conversation' })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API not configured' }, { status: 500 })
    }

    // Fetch conversation metadata from ElevenLabs to get the audio URL
    const elRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${elevenLabsId}`,
      {
        headers: { 'xi-api-key': apiKey },
      }
    )

    if (!elRes.ok) {
      if (elRes.status === 404) {
        return NextResponse.json({ audio_url: null, reason: 'Recording not found on ElevenLabs' })
      }
      console.error('[conversation-audio] ElevenLabs error:', elRes.status)
      return NextResponse.json({ audio_url: null, reason: 'Could not retrieve recording' })
    }

    const elData = await elRes.json()

    // ElevenLabs returns audio_recording_url and audio_recording_expires_at
    const audioUrl       = (elData.audio_recording_url as string | null) ?? null
    const expiresAt      = (elData.audio_recording_expires_at as string | null) ?? null
    const durationSecs   = (elData.metadata?.call_duration_secs as number | null) ?? null
    const cost           = (elData.metadata?.cost as number | null) ?? null

    return NextResponse.json({
      audio_url:    audioUrl,
      expires_at:   expiresAt,
      duration_secs: durationSecs,
      cost_credits:  cost,
    })
  } catch (err) {
    console.error('[conversation-audio]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
