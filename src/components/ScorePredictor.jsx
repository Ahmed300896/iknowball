import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import matches from '../data/schedule'
import PageHeader from './PageHeader'
import TeamBadge from './TeamBadge'
import BottomNav from './BottomNav'

const TOTAL_MATCHES = 72

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateShort(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase()
}

const safeScore = (v) => { const n = Number(v); return isNaN(n) ? 0 : Math.max(0, Math.round(n)); }

// Vertical stepper: + on top, score in middle, - below
function ScoreStepper({ value, onChange }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        style={{
          width: 26, height: 26,
          background: '#141b30', border: '1px solid #2a3354',
          borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#c9a84c', fontSize: 16, fontWeight: 700,
          cursor: 'pointer', lineHeight: 1, userSelect: 'none',
        }}
      >
        +
      </button>
      <span
        style={{
          fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 30,
          color: '#ffffff', width: 36, textAlign: 'center', lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{
          width: 26, height: 26,
          background: '#141b30', border: '1px solid #2a3354',
          borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#c9a84c', fontSize: 16, fontWeight: 700,
          cursor: 'pointer', lineHeight: 1, userSelect: 'none',
        }}
      >
        −
      </button>
    </div>
  )
}

export default function ScorePredictor({ user, username, onBack, onLogout, currentScreen, onPredict, onRanks }) {
  const today = new Date().toLocaleDateString('en-CA')

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

        // Pre-populate steppers for every saved prediction, not just today's
        const prefilled = {}
        Object.keys(saved).forEach(id => {
          prefilled[id] = {
            home: safeScore(saved[id]?.homeScore),
            away: safeScore(saved[id]?.awayScore),
          }
        })
        setScores(prefilled)
      } catch {
        setScores({})
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function setScore(matchId, side, value) {
    setScores(prev => ({ ...prev, [matchId]: { ...prev[matchId], [side]: value } }))
    setSaveStates(prev => ({ ...prev, [matchId]: 'idle' }))
  }

  // A match is locked once its date is in the past (we only have dates, not kickoff times).
  // On the match day itself, predictions remain open until midnight.
  function isMatchLocked(matchDate) {
    return matchDate < today
  }

  async function handleSubmit(match) {
    if (isMatchLocked(match.date)) return // server-side guard: silently refuse
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

  // Determine which match dates to display.
  // If there are games today show only today; otherwise show the next 5 match days.
  const hasTodayMatches = matches.some(m => m.date === today)
  const upcomingDates = [...new Set(
    matches.filter(m => m.date >= today).map(m => m.date)
  )].sort()
  const datesToShow = hasTodayMatches ? [today] : upcomingDates.slice(0, 5)
  const groupedMatches = datesToShow
    .map(date => ({ date, items: matches.filter(m => m.date === date) }))
    .filter(g => g.items.length > 0)
  const isUpcoming = !hasTodayMatches

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
        <p style={{ color: '#6b7494' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0e1a' }}>
      <PageHeader
        title={isUpcoming ? "Upcoming Games" : "Today's Games"}
        showBack onBack={onBack} username={username} onLogout={onLogout}
      />

      {/* Progress bar */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e2540' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="eyebrow">Predictions set</span>
          <span style={{ fontFamily: 'Oswald, sans-serif', color: '#c9a84c', fontSize: 13, fontWeight: 600 }}>
            {predictedCount} / {TOTAL_MATCHES}
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1e2540' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(predictedCount / TOTAL_MATCHES) * 100}%`, background: '#c9a84c' }}
          />
        </div>
      </div>

      {/* Info line */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #1e2540" }}>
        <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6, margin: 0 }}>
          Predict the exact scoreline for every match before kickoff. Submit your prediction and check back after the match to see your points.
        </p>
      </div>

      <div className="px-4 py-5">
        {groupedMatches.length === 0 ? (
          <div
            className="mt-8 mx-auto max-w-xs text-center rounded-lg p-8"
            style={{ background: '#0d1224', border: '1px solid #1e2540' }}
          >
            <p className="eyebrow mb-3">Schedule</p>
            <p className="text-white text-lg mb-2" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}>
              NO UPCOMING MATCHES
            </p>
            <p className="text-sm" style={{ color: '#8b93ab' }}>All matches have been played.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedMatches.map(group => (
              <div key={group.date}>
                <p className="text-xs font-semibold tracking-widest mb-4 text-center" style={{ color: '#6b7494', fontFamily: 'Oswald, sans-serif' }}>
                  {formatDateShort(group.date)}
                </p>
                <div className="space-y-3">
                  {group.items.map(match => {
                    const score = scores[match.id] ?? { home: 0, away: 0 }
                    const state = saveStates[match.id] ?? 'idle'
                    const isSaved = !!allPredictions[match.id]
                    const locked = isMatchLocked(match.date)
                    const savedPred = allPredictions[match.id]

                    if (locked) {
                      // ── Locked card ──────────────────────────────────────
                      return (
                        <div key={match.id} className="card-fifa" style={{ opacity: 0.75 }}>
                          {/* Header row: group badge + lock badge */}
                          <div className="flex items-center justify-between mb-3">
                            <p className="eyebrow">Group {match.group}</p>
                            <div className="flex items-center gap-1" style={{ background: 'rgba(107,116,148,0.15)', border: '1px solid #2a3354', borderRadius: 3, padding: '2px 7px' }}>
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                <rect x="2" y="5" width="8" height="6" rx="1" stroke="#6b7494" strokeWidth="1.2"/>
                                <path d="M4 5V3.5C4 2.4 4.9 1.5 6 1.5C7.1 1.5 8 2.4 8 3.5V5" stroke="#6b7494" strokeWidth="1.2"/>
                              </svg>
                              <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.12em', color: '#6b7494' }}>
                                LOCKED
                              </span>
                            </div>
                          </div>

                          {/* Team names */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                              <TeamBadge team={match.home} size={28} />
                              <span className="text-xs text-center truncate w-full" style={{ fontFamily: 'Oswald, sans-serif', color: '#6b7494', letterSpacing: '0.02em' }}>
                                {match.home}
                              </span>
                            </div>

                            {/* Predicted score or no-prediction label */}
                            <div className="flex flex-col items-center gap-1 shrink-0">
                              {savedPred ? (
                                <div className="flex items-center gap-1">
                                  <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 28, color: '#3d4560', lineHeight: 1, width: 32, textAlign: 'center' }}>
                                    {safeScore(savedPred.homeScore)}
                                  </span>
                                  <span style={{ color: '#2a3354', fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, lineHeight: 1 }}>:</span>
                                  <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 28, color: '#3d4560', lineHeight: 1, width: 32, textAlign: 'center' }}>
                                    {safeScore(savedPred.awayScore)}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 10, letterSpacing: '0.08em', color: '#3d4560' }}>
                                  NO PREDICTION
                                </span>
                              )}
                              <span style={{ fontSize: 9, color: '#3d4560', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em' }}>
                                {savedPred ? 'YOUR PICK' : '—'}
                              </span>
                            </div>

                            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                              <TeamBadge team={match.away} size={28} />
                              <span className="text-xs text-center truncate w-full" style={{ fontFamily: 'Oswald, sans-serif', color: '#6b7494', letterSpacing: '0.02em' }}>
                                {match.away}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    // ── Unlocked card ──────────────────────────────────────
                    return (
                      <div key={match.id} className="card-fifa">
                        {/* Submitted indicator */}
                        {isSaved && state !== 'error' && (
                          <div className="flex items-center gap-1.5 mb-3">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="5.5" fill="#3ddc84" fillOpacity="0.15" stroke="#3ddc84" strokeWidth="1"/>
                              <path d="M3.5 6L5.2 7.7L8.5 4.5" stroke="#3ddc84" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-xs" style={{ color: '#3ddc84', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.1em', fontWeight: 600 }}>
                              SUBMITTED
                            </span>
                          </div>
                        )}

                        {/* Group badge */}
                        <p className="eyebrow mb-3">Group {match.group}</p>

                        {/* Scorebug row */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                            <TeamBadge team={match.home} size={32} />
                            <span className="text-white text-xs font-medium text-center truncate w-full" style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.02em' }}>
                              {match.home}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <ScoreStepper value={score.home} onChange={v => setScore(match.id, 'home', v)} />
                            <span style={{ color: '#2a3354', fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 24, lineHeight: 1 }}>:</span>
                            <ScoreStepper value={score.away} onChange={v => setScore(match.id, 'away', v)} />
                          </div>

                          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                            <TeamBadge team={match.away} size={32} />
                            <span className="text-white text-xs font-medium text-center truncate w-full" style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.02em' }}>
                              {match.away}
                            </span>
                          </div>
                        </div>

                        {/* Submit button */}
                        <button
                          type="button"
                          onClick={() => handleSubmit(match)}
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
                           'SUBMIT PREDICTION'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav
        currentScreen={currentScreen ?? 'score-predictor'}
        onHome={onBack}
        onPredict={onPredict ?? (() => {})}
        onRanks={onRanks ?? (() => {})}
      />
    </div>
  )
}
