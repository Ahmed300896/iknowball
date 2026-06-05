import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import matches from '../data/schedule'

const TOTAL_MATCHES = 72

const FLAGS = {
  'Mexico': '🇲🇽',
  'South Korea': '🇰🇷',
  'South Africa': '🇿🇦',
  'Czechia': '🇨🇿',
  'Canada': '🇨🇦',
  'Switzerland': '🇨🇭',
  'Qatar': '🇶🇦',
  'Bosnia & Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷',
  'Morocco': '🇲🇦',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Haiti': '🇭🇹',
  'United States': '🇺🇸',
  'Paraguay': '🇵🇾',
  'Australia': '🇦🇺',
  'Turkiye': '🇹🇷',
  'Germany': '🇩🇪',
  'Ecuador': '🇪🇨',
  'Ivory Coast': '🇨🇮',
  'Curacao': '🇨🇼',
  'Netherlands': '🇳🇱',
  'Japan': '🇯🇵',
  'Tunisia': '🇹🇳',
  'Sweden': '🇸🇪',
  'Belgium': '🇧🇪',
  'Iran': '🇮🇷',
  'Egypt': '🇪🇬',
  'New Zealand': '🇳🇿',
  'Spain': '🇪🇸',
  'Uruguay': '🇺🇾',
  'Saudi Arabia': '🇸🇦',
  'Cape Verde': '🇨🇻',
  'France': '🇫🇷',
  'Senegal': '🇸🇳',
  'Norway': '🇳🇴',
  'Iraq': '🇮🇶',
  'Argentina': '🇦🇷',
  'Austria': '🇦🇹',
  'Algeria': '🇩🇿',
  'Jordan': '🇯🇴',
  'Portugal': '🇵🇹',
  'Colombia': '🇨🇴',
  'Uzbekistan': '🇺🇿',
  'DR Congo': '🇨🇩',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Croatia': '🇭🇷',
  'Panama': '🇵🇦',
  'Ghana': '🇬🇭',
}

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

export default function ScorePredictor({ user, onBack, onLogout }) {
  const today = new Date().toLocaleDateString('en-CA')
  const todaysMatches = matches.filter(m => m.date === today)
  const nextMatch = matches.find(m => m.date > today)

  const [allPredictions, setAllPredictions] = useState({})
  const [scores, setScores] = useState({})
  const [saveStates, setSaveStates] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('score_predictions')
          .select('predictions')
          .eq('user_id', user.id)
          .single()

        const saved = data?.predictions ?? {}
        setAllPredictions(saved)

        // Pre-fill scores for today's matches from saved predictions
        const prefilled = {}
        todaysMatches.forEach(m => {
          prefilled[m.id] = {
            home: saved[m.id]?.homeScore ?? 0,
            away: saved[m.id]?.awayScore ?? 0,
          }
        })
        setScores(prefilled)
      } catch {
        // No saved predictions yet — initialise today's scores to 0-0
        const init = {}
        todaysMatches.forEach(m => { init[m.id] = { home: 0, away: 0 } })
        setScores(init)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function setScore(matchId, side, value) {
    setScores(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: value },
    }))
    // Clear saved state if user edits after saving
    setSaveStates(prev => ({ ...prev, [matchId]: 'idle' }))
  }

  async function handleSubmit(match) {
    setSaveStates(prev => ({ ...prev, [match.id]: 'saving' }))
    try {
      const updated = {
        ...allPredictions,
        [match.id]: { homeScore: scores[match.id].home, awayScore: scores[match.id].away },
      }
      const { error } = await supabase
        .from('score_predictions')
        .upsert({ user_id: user.id, predictions: updated }, { onConflict: 'user_id' })
      if (error) throw error
      setAllPredictions(updated)
      setSaveStates(prev => ({ ...prev, [match.id]: 'saved' }))
    } catch {
      setSaveStates(prev => ({ ...prev, [match.id]: 'error' }))
    }
  }

  const predictedCount = Object.keys(allPredictions).length

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="text-white/60 text-sm font-semibold shrink-0"
          >
            ← Back
          </button>
          <span className="text-white font-bold truncate">Score Predictor</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-white/60 text-sm font-semibold px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 shrink-0"
        >
          Logout
        </button>
      </div>

      {/* Progress counter */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs font-medium">Predictions set</span>
          <span className="text-white text-xs font-bold tabular-nums">
            {predictedCount} / {TOTAL_MATCHES}
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${(predictedCount / TOTAL_MATCHES) * 100}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-5 pb-20">
        {todaysMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3 text-center">
            <p className="text-white text-lg font-semibold">No games today</p>
            <p className="text-white/50 text-sm">Check back tomorrow!</p>
            {nextMatch && (
              <p className="text-white/30 text-xs mt-2">
                Next match: {formatDate(nextMatch.date)}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-white text-xl font-bold">Today's Matches</h2>
              <p className="text-white/40 text-sm mt-0.5">{formatDate(today)}</p>
            </div>

            <div className="space-y-3">
              {todaysMatches.map(match => {
                const score = scores[match.id] ?? { home: 0, away: 0 }
                const state = saveStates[match.id] ?? 'idle'

                return (
                  <div
                    key={match.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4"
                  >
                    {/* Group badge */}
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                      Group {match.group}
                    </p>

                    {/* Teams + score inputs */}
                    <div className="flex items-center gap-2 mb-4">
                      {/* Home team */}
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <span className="text-2xl leading-none">
                          {FLAGS[match.home] ?? '🏳️'}
                        </span>
                        <span className="text-white text-xs font-medium text-center leading-tight truncate w-full text-center">
                          {match.home}
                        </span>
                      </div>

                      {/* Score controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ScoreInput
                          value={score.home}
                          onChange={v => setScore(match.id, 'home', v)}
                        />
                        <span className="text-white/25 text-sm font-bold select-none px-0.5">
                          —
                        </span>
                        <ScoreInput
                          value={score.away}
                          onChange={v => setScore(match.id, 'away', v)}
                        />
                      </div>

                      {/* Away team */}
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <span className="text-2xl leading-none">
                          {FLAGS[match.away] ?? '🏳️'}
                        </span>
                        <span className="text-white text-xs font-medium text-center leading-tight truncate w-full text-center">
                          {match.away}
                        </span>
                      </div>
                    </div>

                    {/* Submit button */}
                    <button
                      type="button"
                      onClick={() => handleSubmit(match)}
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
                       'Submit Prediction'}
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
