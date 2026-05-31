'use client'

import { useState } from 'react'
import type { ConfigRow } from '@/app/admin/config/page'

const SENSITIVE_PATTERN = /key|secret|password|token/i

function isSensitive(row: ConfigRow): boolean {
  return row.is_secret || SENSITIVE_PATTERN.test(row.key)
}

function maskValue(value: string): string {
  if (!value) return '—'
  return '•'.repeat(Math.min(value.length, 24))
}

interface RowState {
  editing: boolean
  draft: string
  saving: boolean
  error: string | null
  saved: boolean
  revealed: boolean
}

export default function ConfigTable({ rows }: { rows: ConfigRow[] }) {
  const [states, setStates] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(
      rows.map(r => [
        r.id,
        { editing: false, draft: r.value, saving: false, error: null, saved: false, revealed: false },
      ])
    )
  )

  function setState(id: string, patch: Partial<RowState>) {
    setStates(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  function startEdit(row: ConfigRow) {
    setState(row.id, { editing: true, draft: row.value, error: null, saved: false, revealed: false })
  }

  function cancelEdit(id: string) {
    setState(id, { editing: false, error: null })
  }

  async function save(row: ConfigRow) {
    const { draft } = states[row.id]
    setState(row.id, { saving: true, error: null })

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: row.key, value: draft }),
      })
      const json = await res.json() as { error?: string }

      if (!res.ok) {
        setState(row.id, { saving: false, error: json.error ?? 'Save failed' })
        return
      }

      setState(row.id, { saving: false, editing: false, saved: true, error: null })
      // Update the displayed value in-place so row stays current without a reload
      row.value = draft
      setTimeout(() => setState(row.id, { saved: false }), 2500)
    } catch {
      setState(row.id, { saving: false, error: 'Network error — please try again' })
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_2fr_auto] gap-0 border-b border-mist bg-cloud px-5 py-3">
        <span className="font-inter font-semibold text-xs text-muted uppercase tracking-wide">Key</span>
        <span className="font-inter font-semibold text-xs text-muted uppercase tracking-wide pl-4">Value / Description</span>
        <span className="font-inter font-semibold text-xs text-muted uppercase tracking-wide w-20 text-right">Action</span>
      </div>

      {rows.map((row, idx) => {
        const s = states[row.id] ?? { editing: false, draft: row.value, saving: false, error: null, saved: false, revealed: false }
        const sensitive = isSensitive(row)
        const displayValue = sensitive && !s.revealed ? maskValue(row.value) : (row.value || '—')
        const isLast = idx === rows.length - 1

        return (
          <div
            key={row.id}
            className={`px-5 py-4 ${!isLast ? 'border-b border-mist' : ''} ${s.editing ? 'bg-plum/[0.02]' : 'hover:bg-cloud/60'} transition-colors`}
          >
            {/* Key + description row */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="font-mono font-semibold text-sm text-ink bg-mist px-2 py-0.5 rounded-lg break-all">
                    {row.key}
                  </code>
                  {sensitive && (
                    <span className="font-inter font-semibold text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                      Secret
                    </span>
                  )}
                  {s.saved && (
                    <span className="font-inter font-semibold text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                      ✓ Saved
                    </span>
                  )}
                </div>
                {row.description && (
                  <p className="font-inter text-xs text-muted mt-1 leading-relaxed">{row.description}</p>
                )}
              </div>

              {/* Action button (when not editing) */}
              {!s.editing && (
                <button
                  onClick={() => startEdit(row)}
                  className="font-inter font-semibold text-xs text-plum hover:text-plum-dark flex-shrink-0 px-3 py-1.5 rounded-full border border-mist hover:border-plum transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Current value display (not editing) */}
            {!s.editing && (
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm break-all ${sensitive && !s.revealed ? 'tracking-widest text-muted' : 'text-ink'}`}>
                  {displayValue}
                </span>
                {sensitive && row.value && (
                  <button
                    onClick={() => setState(row.id, { revealed: !s.revealed })}
                    className="font-inter text-[11px] text-muted hover:text-plum transition-colors flex-shrink-0 underline"
                  >
                    {s.revealed ? 'Hide' : 'Reveal'}
                  </button>
                )}
              </div>
            )}

            {/* Inline edit form */}
            {s.editing && (
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <input
                    type={sensitive ? 'password' : 'text'}
                    value={s.draft}
                    onChange={e => setState(row.id, { draft: e.target.value })}
                    disabled={s.saving}
                    autoFocus
                    placeholder={sensitive ? 'Enter new value…' : 'Value'}
                    className="flex-1 font-mono text-sm text-ink border border-plum/40 rounded-2xl px-4 py-2.5 bg-white focus:outline-none focus:border-plum transition-colors disabled:opacity-60 min-w-0"
                  />
                  <button
                    onClick={() => save(row)}
                    disabled={s.saving || s.draft === row.value}
                    className="font-inter font-semibold text-sm text-white px-4 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {s.saving ? '…' : 'Save'}
                  </button>
                  <button
                    onClick={() => cancelEdit(row.id)}
                    disabled={s.saving}
                    className="font-inter text-sm text-muted hover:text-ink px-3 py-2.5 rounded-full hover:bg-mist transition-colors flex-shrink-0"
                  >
                    Cancel
                  </button>
                </div>
                {s.error && (
                  <p className="font-inter text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {s.error}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
