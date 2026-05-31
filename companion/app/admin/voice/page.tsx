import { createClient } from '@/lib/supabase/server'

interface Persona { id: string; name: string; voice_id: string; languages: string[] | null; is_default: boolean; is_active: boolean }

export default async function AdminVoicePage() {
  const supabase = createClient()
  const { data } = await supabase.from('elevenlabs_personas').select('id, name, voice_id, languages, is_default, is_active').order('created_at')
  const personas: Persona[] = (data as Persona[]) ?? []

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>Voice &amp; Personas</h1>

      <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden mb-6">
        {personas.length === 0 ? (
          <p className="font-inter text-sm text-muted p-6">No personas configured</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-mist bg-cloud">
                {['Name', 'Voice ID', 'Languages', 'Default', 'Active'].map(h => (
                  <th key={h} className="font-inter font-semibold text-xs text-muted uppercase tracking-wide px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {personas.map(p => (
                <tr key={p.id} className="hover:bg-cloud/50">
                  <td className="px-4 py-3 font-inter font-medium text-ink text-sm">{p.name}</td>
                  <td className="px-4 py-3 font-inter text-xs text-muted font-mono">{p.voice_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(p.languages ?? []).map(l => <span key={l} className="font-inter text-[10px] px-1.5 py-0.5 rounded-full bg-mist text-muted">{l}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.is_default ? <span className="text-green-600 font-inter text-sm">✓</span> : '—'}</td>
                  <td className="px-4 py-3">{p.is_active ? <span className="font-inter text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span> : <span className="font-inter text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Inactive</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white rounded-3xl p-5 border border-line shadow-card">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Add persona</h2>
        <p className="font-inter text-sm text-muted">Persona management UI coming soon. Add personas via Supabase dashboard.</p>
      </div>
    </div>
  )
}
