import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import matches from '../data/schedule'
import { FLAGS as TEAM_FLAGS } from '../data/teams'

const ADMIN_ID = '381ba0a0-7c88-42e9-82ab-37c12b5b0010'

// schedule.js uses "United States"; teams.js uses "USA"
const FLAGS = { ...TEAM_FLAGS, 'United States': '🇺🇸' }

const matchesByDate = matches.reduce((acc, m) => {
  ;(acc[m.date] ??= []).push(m)
  return acc
}, {})
const dates = Object.keys(matchesByDate).sort()

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function ScoreInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white text-lg font-bold active:bg-white/25 select-none"
      >
        −
      </button>
      <span className="text-white font-bold w-6 text-center tabular-nums text-lg select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white text-lg font-bold active:bg-white/25 select-none"
      >
        +
      </button>
    </div>
  )
}

export default function AdminResultsScreen({ user, onBack, onLogout }) {
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white/60 text-sm">Unauthorized</p>
        <button
          type="button"
          onClick={onBack}
          className="text-white/60 text-sm font-semibold px-4 py-2 rounded-xl border border-white/20 bg-white/5"
        >
          Go back
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onBack} className="text-white/60 text-sm font-semibold shrink-0">
            ← Back
          </button>
          <span className="text-white font-bold truncate">Results Entry</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-white/60 text-sm font-semibold px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 shrink-0"
        >
          Logout
        </button>
      </div>

      <div className="px-4 py-5 pb-20 space-y-8">
        {dates.map(date => (
          <div key={date}>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
              {formatDate(date)}
            </p>
            <div className="space-y-3">
              {matchesByDate[date].map(match => {
                const score = scores[match.id] ?? { home: 0, away: 0 }
                const state = saveStates[match.id] ?? 'idle'

                return (
                  <div key={match.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                      Group {match.group}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <span className="text-2xl leading-none">{FLAGS[match.home] ?? '🏳️'}</span>
                        <span className="text-white text-xs font-medium text-center leading-tight truncate w-full">
                          {match.home}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <ScoreInput value={score.home} onChange={v => setScore(match.id, 'home', v)} />
                        <span className="text-white/25 text-sm font-bold select-none px-0.5">—</span>
                        <ScoreInput value={score.away} onChange={v => setScore(match.id, 'away', v)} />
                      </div>

                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <span className="text-2xl leading-none">{FLAGS[match.away] ?? '🏳️'}</span>
                        <span className="text-white text-xs font-medium text-center leading-tight truncate w-full">
                          {match.away}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSave(match)}
                      disabled={state === 'saving'}
                      className={`w-full font-bold rounded-xl py-2.5 text-sm active:scale-95 transition-all disabled:opacity-50 ${
                        state === 'saved'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : state === 'error'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white text-black'
                      }`}
                    >
                      {state === 'saving' ? 'Saving…' :
                       state === 'saved'  ? '✓ Saved!' :
                       state === 'error'  ? 'Error — try again' :
                       'Save Result'}
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
