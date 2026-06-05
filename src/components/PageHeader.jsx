import { useState, useEffect, useRef } from 'react'

export default function PageHeader({ title, showBack, onBack, username, onLogout }) {
  const [open, setOpen] = useState(false)
  const avatarRef = useRef(null)

  const initials = (username || 'IK')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0].toUpperCase())
    .slice(0, 2)
    .join('')

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [open])

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

        {/* Right: avatar with dropdown */}
        <div ref={avatarRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
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

          {open && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 100,
                marginTop: 6,
                minWidth: 140,
                background: '#0d1224',
                border: '1px solid #1e2540',
                borderRadius: 4,
                padding: 8,
              }}
            >
              <p style={{ fontSize: 11, color: '#6b7494', padding: '6px 12px' }}>
                {username}
              </p>
              <button
                type="button"
                onClick={() => { setOpen(false); onLogout() }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  borderTop: '1px solid #1e2540',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
