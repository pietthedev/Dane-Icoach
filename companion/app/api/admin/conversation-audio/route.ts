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

    // ── Log full metadata for debugging ──────────────────────────────────────
    const metaRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${elevenLabsId}`,
      { headers: { 'xi-api-key': apiKey } }
    )
    if (metaRes.ok) {
      const meta = await metaRes.json()
      console.log('[admin/conversation-audio] ElevenLabs metadata:', JSON.stringify(meta, null, 2))
    } else {
      console.warn('[admin/conversation-audio] Metadata fetch status:', metaRes.status)
    }

    // ── Stream binary audio from ElevenLabs /audio endpoint ──────────────────
    const audioRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${elevenLabsId}/audio`,
      { headers: { 'xi-api-key': apiKey } }
    )

    console.log('[admin/conversation-audio] Audio status:', audioRes.status)

    if (!audioRes.ok) {
      console.error('[admin/conversation-audio] Audio fetch failed:', audioRes.status, await audioRes.text())
      return NextResponse.json({ error: 'Audio not available' }, { status: 404 })
    }

    const contentType = audioRes.headers.get('content-type') ?? 'audio/mpeg'
    const contentLength = audioRes.headers.get('content-length')

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    }
    if (contentLength) headers['Content-Length'] = contentLength

    return new NextResponse(audioRes.body, { status: 200, headers })
  } catch (err) {
    console.error('[admin/conversation-audio] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
