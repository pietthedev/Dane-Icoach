import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    // Verify caller is an authenticated admin
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: role } = await serviceClient
      .from('admin_roles').select('role').eq('user_id', user.id).single()
    if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const elevenLabsId = searchParams.get('elevenlabs_id')
    if (!elevenLabsId) {
      return NextResponse.json({ error: 'elevenlabs_id required' }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ElevenLabs API not configured' }, { status: 500 })

    const elRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${elevenLabsId}`,
      { headers: { 'xi-api-key': apiKey } }
    )

    if (!elRes.ok) {
      return NextResponse.json({ audio_url: null, reason: elRes.status === 404 ? 'Not found' : 'ElevenLabs error' })
    }

    const data = await elRes.json()
    return NextResponse.json({
      audio_url:     (data.audio_recording_url as string | null) ?? null,
      expires_at:    (data.audio_recording_expires_at as string | null) ?? null,
      duration_secs: (data.metadata?.call_duration_secs as number | null) ?? null,
      cost_credits:  (data.metadata?.cost as number | null) ?? null,
    })
  } catch (err) {
    console.error('[admin/conversation-audio]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
