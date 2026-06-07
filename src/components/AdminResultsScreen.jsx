import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import matches from '../data/schedule'
import PageHeader from './PageHeader'
import TeamBadge from './TeamBadge'

const ADMIN_ID = '18dac4ab-2689-459d-8491-6000801e0c1e'

const matchesByDate = matches.reduce((acc, m) => {
  ;(acc[m.date] ??= []).push(m)
  return acc
}, {})
const dates = Object.keys(matchesByDate).sort()

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase()
}

function ScoreInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{
          width: 28, height: 28, background: '#141b30', border: '1px solid #2a3354', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#c9a84c', fontSize: 16, fontWeight: 700, cursor: 'pointer', userSelect: 'none',
        }}
      >
        −
      </button>
      <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff', width: 32, textAlign: 'center' }}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        style={{
          width: 28, height: 28, background: '#141b30', border: '1px solid #2a3354', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#c9a84c', fontSize: 16, fontWeight: 700, cursor: 'pointer', userSelect: 'none',
        }}
      >
        +
      </button>
    </div>
  )
}

export default function AdminResultsScreen({ user, username, onBack, onLogout }) {
  const [scores, setScores] = useState({})
  const [saveStates, setSaveStates] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user.id !== ADMIN_ID) return
    async function load() {
      const { data } = await supabase
        .from('match_results')
        .select('match_id, home_score, away_score')

      const init = {}
      matches.forEach(m => { init[m.id] = { home: 0, away: 0 } })
      ;(data ?? []).forEach(r => { init[r.match_id] = { home: r.home_score, away: r.away_score } })
      setScores(init)
      setLoading(false)
    }
    load()
  }, [user.id])

  function setScore(matchId, side, value) {
    setScores(prev => ({ ...prev, [matchId]: { ...prev[matchId], [side]: value } }))
    setSaveStates(prev => ({ ...prev, [matchId]: 'idle' }))
  }

  async function handleSave(match) {
    setSaveStates(prev => ({ ...prev, [match.id]: 'saving' }))
    try {
      const { error } = await supabase
        .from('match_results')
        .upsert(
          { match_id: match.id, home_score: scores[match.id].home, away_score: scores[match.id].away },
          { onConflict: 'match_id' }
        )
      if (error) throw error
      setSaveStates(prev => ({ ...prev, [match.id]: 'saved' }))
    } catch {
      setSaveStates(prev => ({ ...prev, [match.id]: 'error' }))
    }
  }

  if (user.id !== ADMIN_ID) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0e1a' }}>
        <p className="eyebrow">Unauthorized</p>
        <button type="button" className="btn-outline" style={{ width: 'auto', padding: '8px 24px' }} onClick={onBack}>
          Go back
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
        <p style={{ color: '#6b7494' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0e1a' }}>
      <PageHeader title="Admin · Results" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div className="px-4 py-5 space-y-8">
        {dates.map(date => (
          <div key={date}>
            <p className="eyebrow mb-3">{formatDate(date)}</p>
            <div className="space-y-3">
              {matchesByDate[date].map(match => {
                const score = scores[match.id] ?? { home: 0, away: 0 }
                const state = saveStates[match.id] ?? 'idle'

                return (
                  <div key={match.id} className="card-fifa">
                    <p className="eyebrow mb-3">Group {match.group}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                        <TeamBadge team={match.home} size={30} />
                        <span className="text-white text-xs text-center truncate w-full" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}>
                          {match.home}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <ScoreInput value={score.home} onChange={v => setScore(match.id, 'home', v)} />
                        <span style={{ color: '#2a3354', fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20 }}>—</span>
                        <ScoreInput value={score.away} onChange={v => setScore(match.id, 'away', v)} />
                      </div>

                      <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                        <TeamBadge team={match.away} size={30} />
                        <span className="text-white text-xs text-center truncate w-full" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}>
                          {match.away}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSave(match)}
                      disabled={state === 'saving'}
                      className={state === 'saved' ? 'btn-outline' : 'btn-gold'}
                      style={
                        state === 'error'
                          ? { background: 'transparent', border: '1px solid #e24b4a', color: '#e24b4a' }
                          : state === 'saved'
                          ? { borderColor: '#3ddc84', color: '#3ddc84' }
                          : {}
                      }
                    >
                      {state === 'saving' ? 'SAVING…' :
                       state === 'saved'  ? '✓ SAVED' :
                       state === 'error'  ? 'ERROR — TRY AGAIN' :
                       'SAVE RESULT'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
