import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, interest } = body as { name?: string; email?: string; interest?: string }

    console.log('[waitlist] Received submission:', { name, email, interest })

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // --- Supabase insert ---
    try {
      const supabase = createClient()
      console.log('[waitlist] Inserting into Supabase waitlist table')
      const { error: dbError } = await supabase.from('waitlist').insert({
        name: String(name),
        email: String(email),
        interest: String(interest ?? ''),
        signed_up_at: new Date().toISOString(),
      })
      if (dbError) {
        console.error('[waitlist] Supabase error:', dbError.message)
        return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 })
      }
      console.log('[waitlist] Supabase insert successful')
    } catch (dbErr: unknown) {
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr)
      console.error('[waitlist] Supabase insert failed:', msg)
      return NextResponse.json({ error: `Database error: ${msg}` }, { status: 500 })
    }

    // --- Resend notification ---
    const resendApiKey = process.env.RESEND_API_KEY
    const notificationEmail = process.env.NOTIFICATION_EMAIL

    console.log('[waitlist] Resend config:', { hasResendKey: !!resendApiKey, notificationEmail })

    if (resendApiKey && notificationEmail) {
      try {
        const resend = new Resend(resendApiKey)
        const { data, error } = await resend.emails.send({
          from: 'Companion by Danè <onboarding@resend.dev>',
          to: 'dane@companionai.coach',
          subject: `New Waitlist Signup — ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #2E2A36;">
              <div style="background: #2E1A47; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 20px;">New Waitlist Signup ✦</h1>
                <p style="color: rgba(255,255,255,0.65); margin: 6px 0 0; font-size: 13px;">Companion by Danè</p>
              </div>
              <div style="background: #FAF9FD; padding: 28px 32px; border: 1px solid #E8E1F7; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 13px; color: #6E667A; width: 110px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 14px; font-weight: 600; color: #2E1A47;">${name}</td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 13px; color: #6E667A;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 14px; color: #2E1A47;"><a href="mailto:${email}" style="color: #4B2E83;">${email}</a></td></tr>
                  <tr><td style="padding: 10px 0; font-size: 13px; color: #6E667A;">Interest</td><td style="padding: 10px 0; font-size: 14px; color: #2E1A47;">${interest || '—'}</td></tr>
                </table>
                <p style="margin: 24px 0 0; font-size: 12px; color: #6E667A;">Signed up ${new Date().toLocaleString('en-ZA', { dateStyle: 'full', timeStyle: 'short' })}</p>
              </div>
            </div>
          `,
        })
        console.log('Resend data:', JSON.stringify(data))
        console.log('Resend error:', JSON.stringify(error))
        if (error) console.error('Resend failed:', error)
      } catch (resendErr: unknown) {
        const msg = resendErr instanceof Error ? resendErr.message : String(resendErr)
        console.error('[waitlist] Resend error (non-fatal):', msg)
      }
    }

    console.log('[waitlist] Submission complete for:', email)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
    console.error('[waitlist] Unhandled error:', message, err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
