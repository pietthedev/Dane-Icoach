import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function VoiceSessionPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [personasRes, langRes, usageRes] = await Promise.allSettled([
    supabase.from('elevenlabs_personas').select('id, name, languages, is_default').eq('is_active', true),
    supabase.from('supported_languages').select('code, label').order('label'),
    supabase.from('usage').select('voice_minutes_used, voice_minutes_limit').eq('user_id', user.id).order('period_start', { ascending: false }).limit(1).single(),
  ])

  const personas = personasRes.status === 'fulfilled' ? (personasRes.value.data ?? []) : []
  const languages = langRes.status === 'fulfilled' ? (langRes.value.data ?? []) : []
  const usage = usageRes.status === 'fulfilled' ? usageRes.value.data : null

  const remaining = usage ? (usage.voice_minutes_limit ?? 0) - (usage.voice_minutes_used ?? 0) : null

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-plum-dark text-2xl" style={{ letterSpacing: '-0.04em' }}>Voice session</h1>
          <p className="font-inter text-muted text-sm mt-1">Start a voice conversation with your AI companion</p>
        </div>
        {remaining !== null && (
          <div className="bg-white rounded-2xl px-4 py-2.5 border border-line shadow-card text-center">
            <p className="font-poppins font-bold text-plum-dark text-lg" style={{ letterSpacing: '-0.04em' }}>{remaining}</p>
            <p className="font-inter text-[10px] text-muted uppercase tracking-wide">min remaining</p>
          </div>
        )}
      </div>

      {/* Persona selector */}
      {personas.length > 0 && (
        <section className="mb-6">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Choose a voice persona</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {personas.map((p: { id: string; name: string; languages: string[]; is_default: boolean }) => (
              <div key={p.id} className="bg-white rounded-3xl p-5 border border-line shadow-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center text-xl flex-shrink-0">🎙️</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-inter font-semibold text-ink text-sm">{p.name}</p>
                    {p.is_default && <span className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-plum text-white">Default</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(p.languages ?? []).map((l: string) => (
                      <span key={l} className="font-inter text-[10px] px-2 py-0.5 rounded-full bg-mist text-muted">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Language selector */}
      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Session language</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((l: { code: string; label: string }) => (
              <span key={l.code} className="font-inter text-sm px-3 py-1.5 rounded-full bg-white border border-line shadow-card text-muted cursor-pointer hover:border-plum hover:text-plum transition-colors">
                {l.label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Start button */}
      <div className="bg-white rounded-3xl p-6 border border-line shadow-card">
        <h2 className="font-poppins font-bold text-plum-dark text-base mb-2" style={{ letterSpacing: '-0.03em' }}>Ready to speak?</h2>
        <p className="font-inter text-muted text-sm mb-5">Your session will be recorded and a transcript saved automatically.</p>
        {remaining !== null && remaining <= 0 ? (
          <div>
            <p className="font-inter text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-3">
              You&apos;ve used all your voice minutes this month.
            </p>
            <Link href="/portal/billing" className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft inline-block">
              Upgrade plan
            </Link>
          </div>
        ) : (
          <button className="font-inter font-semibold text-sm text-white px-8 py-3.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft flex items-center gap-2">
            <span>🎙️</span> Start voice session
          </button>
        )}
      </div>
    </div>
  )
}
