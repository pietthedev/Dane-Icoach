'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ExportRequest {
  id: string
  export_type: string
  status: string
  created_at: string
  download_url: string | null
}

const EXPORT_OPTIONS = [
  { type: 'full_json', label: 'Full data export', description: 'All conversations, journal entries, goals and profile data in JSON format', icon: '📦' },
  { type: 'summaries_pdf', label: 'Session summaries PDF', description: 'A readable summary of all your coaching conversations', icon: '📄' },
  { type: 'ratings_csv', label: 'Ratings & notes CSV', description: 'Your session ratings, colour tags and notes in spreadsheet format', icon: '📊' },
]

export default function ExportPage() {
  const [requests, setRequests] = useState<ExportRequest[]>([])
  const [requesting, setRequesting] = useState<string | null>(null)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('data_export_requests')
      .select('id, export_type, status, created_at, download_url')
      .order('created_at', { ascending: false })
      .limit(20)
    setRequests((data as ExportRequest[]) ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  async function requestExport(type: string) {
    setRequesting(type)
    await fetch('/api/portal/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ export_type: type }),
    })
    await load()
    setRequesting(null)
  }

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    ready: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-poppins font-bold text-plum-dark text-2xl mb-1" style={{ letterSpacing: '-0.04em' }}>Data &amp; Export</h1>
      <p className="font-inter text-muted text-sm mb-6">Your data belongs to you. Download or delete it at any time.</p>

      {/* POPIA notice */}
      <div className="bg-mist rounded-3xl px-5 py-4 mb-6 flex gap-3">
        <span aria-hidden="true" className="text-lg">🛡</span>
        <p className="font-inter text-sm text-plum-dark leading-relaxed">
          Under POPIA, you have the right to access, correct and delete your personal data. Export requests are processed within 72 hours.
        </p>
      </div>

      {/* Export options */}
      <section className="mb-6">
        <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Request an export</h2>
        <div className="flex flex-col gap-3">
          {EXPORT_OPTIONS.map(opt => (
            <div key={opt.type} className="bg-white rounded-3xl p-5 border border-line shadow-card flex items-start gap-4">
              <span aria-hidden="true" className="text-2xl flex-shrink-0">{opt.icon}</span>
              <div className="flex-1">
                <p className="font-inter font-semibold text-ink text-sm">{opt.label}</p>
                <p className="font-inter text-xs text-muted leading-relaxed mt-0.5">{opt.description}</p>
              </div>
              <button onClick={() => requestExport(opt.type)} disabled={requesting === opt.type}
                className="font-inter font-semibold text-sm text-white px-4 py-2 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60 flex-shrink-0">
                {requesting === opt.type ? '…' : 'Request'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Previous requests */}
      {requests.length > 0 && (
        <section className="mb-8">
          <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-3">Previous requests</h2>
          <div className="flex flex-col gap-2">
            {requests.map(r => (
              <div key={r.id} className="bg-white rounded-3xl p-4 border border-line flex items-center justify-between gap-3">
                <div>
                  <p className="font-inter font-medium text-ink text-sm capitalize">{r.export_type.replace(/_/g, ' ')}</p>
                  <p className="font-inter text-xs text-muted">{new Date(r.created_at).toLocaleString('en-ZA')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-inter text-xs px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] ?? 'bg-mist text-muted'}`}>{r.status}</span>
                  {r.status === 'ready' && r.download_url && (
                    <a href={r.download_url} download className="font-inter text-xs text-plum underline">Download</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Delete all data */}
      <div className="bg-white rounded-3xl p-6 border border-red-200">
        <h2 className="font-inter font-semibold text-red-600 text-sm uppercase tracking-wide mb-2">Delete all my data</h2>
        <p className="font-inter text-sm text-muted leading-relaxed mb-4">
          This permanently deletes all your conversations, journal entries, goals and profile data. This cannot be undone. Your subscription will not be affected.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="text" value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
            placeholder='Type "DELETE" to confirm'
            className="font-inter text-sm border border-red-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-red-400 w-full"
          />
          <button
            disabled={deleteInput !== 'DELETE' || deleting}
            onClick={() => { setDeleting(true) }}
            className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors w-fit"
          >
            {deleting ? 'Deleting…' : 'Delete all my data'}
          </button>
        </div>
      </div>
    </div>
  )
}
