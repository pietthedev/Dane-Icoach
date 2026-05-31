import { createClient } from '@/lib/supabase/server'
import ConfigTable from '@/components/admin/ConfigTable'

export interface ConfigRow {
  id: string
  key: string
  value: string
  description: string | null
  is_secret: boolean
}

export default async function AdminConfigPage() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('system_config')
    .select('id, key, value, description, is_secret')
    .order('key')

  const rows: ConfigRow[] = (data as ConfigRow[]) ?? []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="font-poppins font-bold text-plum-dark text-2xl"
          style={{ letterSpacing: '-0.04em' }}
        >
          System config
        </h1>
        <p className="font-inter text-muted text-sm mt-1">
          Platform-wide configuration. Secrets are masked — click Edit to reveal and update.
        </p>
        {error && (
          <p className="font-inter text-sm text-red-600 mt-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5">
            Could not load config: {error.message}
          </p>
        )}
      </div>

      {rows.length === 0 && !error ? (
        <div className="bg-white rounded-3xl p-8 border border-line text-center">
          <p className="font-inter text-muted text-sm">
            No config rows found. Add rows to the{' '}
            <code className="font-mono text-xs bg-mist px-1.5 py-0.5 rounded">system_config</code>{' '}
            table in Supabase.
          </p>
        </div>
      ) : (
        <ConfigTable rows={rows} />
      )}
    </div>
  )
}
