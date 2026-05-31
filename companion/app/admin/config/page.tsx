'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ConfigRow { id: string; key: string; value: string; description: string | null; is_secret: boolean }

export default function AdminConfigPage() {
  const [rows, setRows] = useState<ConfigRow[]>([])
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('system_config').select('id, key, value, description, is_secret').order('key')
    setRows((data as ConfigRow[]) ?? [])
    const e: Record<string, string> = {}
    ;(data ?? []).forEach((r: ConfigRow) => { e[r.id] = r.value })
    setEdits(e)
  }, [])

  useEffect(() => { load() }, [load])

  async function save(id: string) {
    setSaving(id)
    const supabase = createClient()
    await supabase.from('system_config').update({ value: edits[id] }).eq('id', id)
    setSaving(null); setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-6" style={{ letterSpacing: '-0.04em' }}>System config</h1>

      {rows.length === 0 ? (
        <p className="font-inter text-muted text-sm">No config rows yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map(row => (
            <div key={row.id} className="bg-white rounded-3xl p-5 border border-line shadow-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-inter font-semibold text-ink text-sm font-mono">{row.key}</p>
                  {row.description && <p className="font-inter text-xs text-muted">{row.description}</p>}
                </div>
                {row.is_secret && <span className="font-inter text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">Secret</span>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type={row.is_secret ? 'password' : 'text'}
                  value={edits[row.id] ?? ''}
                  onChange={e => setEdits(p => ({ ...p, [row.id]: e.target.value }))}
                  className="flex-1 font-inter text-sm border border-mist rounded-2xl px-4 py-2.5 bg-cloud focus:outline-none focus:border-plum font-mono"
                />
                <button onClick={() => save(row.id)} disabled={saving === row.id}
                  className="font-inter font-semibold text-sm text-white px-4 py-2.5 rounded-full bg-plum hover:bg-plum-dark disabled:opacity-60 transition-colors shadow-soft flex-shrink-0">
                  {saving === row.id ? '…' : saved === row.id ? '✓' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
