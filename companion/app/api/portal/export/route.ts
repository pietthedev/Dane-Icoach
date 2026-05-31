import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_TYPES = ['full_json', 'summaries_pdf', 'ratings_csv']

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { export_type } = await req.json() as { export_type?: string }
    if (!export_type || !VALID_TYPES.includes(export_type)) {
      return NextResponse.json({ error: 'Invalid export_type' }, { status: 400 })
    }

    await supabase.from('data_export_requests').insert({
      user_id: user.id,
      export_type,
      status: 'pending',
      requested_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'Export request created. Processing within 72 hours.' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
