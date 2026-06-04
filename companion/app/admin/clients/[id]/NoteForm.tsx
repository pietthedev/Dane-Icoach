'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Note {
  id: string
  body: string
  created_at: string
}

interface NoteFormProps {
  clientId: string
  initialNotes: Note[]
}

export default function NoteForm({ clientId, initialNotes }: NoteFormProps) {
  const router = useRouter()
  const [notes, setNotes]   = useState<Note[]>(initialNotes)
  const [body, setBody]     = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function handleSave() {
    if (!body.trim()) return
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, body: body.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Failed to save note')
        return
      }

      // Prepend the new note to the local list (instant feedback)
      setNotes(prev => [data.note, ...prev])
      setBody('')

      // Refresh the server component so notes stay in sync on next load
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-line shadow-card">
      <h2 className="font-inter font-semibold text-plum-dark text-sm uppercase tracking-wide mb-1">
        My notes on this client
      </h2>
      <p className="font-inter text-xs text-muted mb-4">
        These notes are private to you and never shown to the client.
      </p>

      {/* Input area */}
      <div className="flex flex-col gap-2 mb-5">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note… (Ctrl+Enter to save)"
          rows={3}
          className="w-full font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum resize-none transition-colors"
        />
        {error && (
          <p className="font-inter text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="font-inter text-[10px] text-muted">Ctrl+Enter to save quickly</p>
          <button
            onClick={handleSave}
            disabled={saving || !body.trim()}
            className="font-inter font-semibold text-sm text-white px-5 py-2 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </div>

      {/* Note history */}
      {notes.length === 0 ? (
        <p className="font-inter text-sm text-muted">No notes yet — add your first one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-inter text-[10px] text-muted uppercase tracking-wide">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
          {notes.map(n => (
            <div key={n.id} className="bg-mist rounded-2xl px-4 py-3 border border-line">
              <p className="font-inter text-sm text-ink leading-relaxed whitespace-pre-wrap">{n.body}</p>
              <p className="font-inter text-[10px] text-muted mt-2">
                {new Date(n.created_at).toLocaleString('en-ZA', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
