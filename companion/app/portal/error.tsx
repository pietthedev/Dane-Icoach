'use client'

export default function PortalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center h-full min-h-48 p-10">
      <div className="bg-white rounded-3xl p-8 border border-line shadow-card max-w-sm w-full text-center">
        <span className="text-4xl block mb-3">⚠️</span>
        <h2 className="font-poppins font-bold text-plum-dark text-lg mb-2" style={{ letterSpacing: '-0.03em' }}>Something went wrong</h2>
        <p className="font-inter text-sm text-muted mb-5">We couldn&apos;t load this page. Please try again.</p>
        <button onClick={reset}
          className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft">
          Try again
        </button>
      </div>
    </div>
  )
}
