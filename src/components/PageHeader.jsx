export default function PageHeader({ title, showBack, onBack, username, onLogout }) {
  const initials = (username || 'IK')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0].toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div className="sticky top-0 z-20" style={{ background: '#0a0e1a' }}>
      {/* Gold top line */}
      <div style={{ height: 3, background: '#c9a84c' }} />
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #1e2540' }}
      >
        {/* Left: back chevron or spacer */}
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 shrink-0"
            style={{ color: '#c9a84c' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <div className="w-7" />
        )}

        {/* Center: title */}
        <h1
          className="flex-1 text-center text-base"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.08em', color: '#fff' }}
        >
          {title}
        </h1>

        {/* Right: avatar — tap to log out */}
        <button
          type="button"
          onClick={onLogout}
          title="Log out"
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
          style={{
            border: '1.5px solid #c9a84c',
            color: '#c9a84c',
            background: '#141b30',
            fontFamily: 'Oswald, sans-serif',
          }}
        >
          {initials}
        </button>
      </div>
    </div>
  )
}
