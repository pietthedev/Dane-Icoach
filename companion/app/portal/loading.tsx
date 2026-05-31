export default function PortalLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-48 p-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-[3px] border-plum border-t-transparent animate-spin" />
        <p className="font-inter text-sm text-muted">Loading…</p>
      </div>
    </div>
  )
}
