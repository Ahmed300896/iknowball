function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10.5L10 3.5L17 10.5V17H13V13H7V17H3V10.5Z"
        stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    </svg>
  )
}

function PredictIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="3" stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="1" fill={active ? '#c9a84c' : '#5a6280'}/>
      <line x1="10" y1="2" x2="10" y2="4" stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="16" x2="10" y2="18" stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2" y1="10" x2="4" y2="10" stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="10" x2="18" y2="10" stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function RanksIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="12" width="4" height="6" rx="1" fill={active ? '#c9a84c' : '#5a6280'}/>
      <rect x="8" y="8" width="4" height="10" rx="1" fill={active ? '#c9a84c' : '#5a6280'}/>
      <rect x="13" y="4" width="4" height="14" rx="1" fill={active ? '#c9a84c' : '#5a6280'}/>
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5"/>
      <path d="M3 17C3 14.2386 6.13401 12 10 12C13.866 12 17 14.2386 17 17"
        stroke={active ? '#c9a84c' : '#5a6280'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function BottomNav({ currentScreen, onHome, onPredict, onRanks }) {
  const items = [
    { key: 'home',            label: 'HOME',    Icon: HomeIcon,    onClick: onHome },
    { key: 'score-predictor', label: 'PREDICT', Icon: PredictIcon, onClick: onPredict },
    { key: 'leaderboard',     label: 'RANKS',   Icon: RanksIcon,   onClick: onRanks },
    { key: 'profile',         label: 'PROFILE', Icon: ProfileIcon, onClick: onHome },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex"
      style={{ background: '#0a0e1a', borderTop: '1px solid #1e2540' }}
    >
      {items.map(({ key, label, Icon, onClick }) => {
        const active = currentScreen === key
        return (
          <button
            key={key}
            type="button"
            onClick={onClick}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
          >
            <Icon active={active} />
            <span
              className="text-[9px] font-semibold tracking-widest"
              style={{ color: active ? '#c9a84c' : '#5a6280', fontFamily: 'Oswald, sans-serif' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
