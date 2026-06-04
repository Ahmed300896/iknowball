import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { groups, groupNames, FLAGS } from '../data/teams'

function buildAllMatches() {
  const all = {}
  groupNames.forEach(letter => {
    const teams = groups[letter]
    const matches = []
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({ id: `${letter}_${i}_${j}`, home: teams[i], away: teams[j] })
      }
    }
    all[letter] = matches
  })
  return all
}

const ALL_MATCHES = buildAllMatches()
const TOTAL = groupNames.reduce((sum, g) => sum + ALL_MATCHES[g].length, 0)

function initPredictions() {
  const init = {}
  groupNames.forEach(letter => {
    ALL_MATCHES[letter].forEach(m => { init[m.id] = { home: 0, away: 0 } })
  })
  return init
}

function ScoreInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white text-lg font-bold active:bg-white/25 select-none"
      >
        −
      </button>
      <span className="text-white font-bold w-5 text-center tabular-nums text-base select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white text-lg font-bold active:bg-white/25 select-none"
      >
        +
      </button>
    </div>
  )
}

export default function ScorePredictor({ user, username, onBack, onLogout }) {
  const [predictions, setPredictions] = useState(initPredictions)
  const [activeGroup, setActiveGroup] = useState('A')
  const [confirmed, setConfirmed] = useState(() => new Set())
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState('idle') // 'idle' | 'saving' | 'saved' | 'error'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('score_predictions')
          .select('predictions, confirmed_ids')
          .eq('user_id', user.id)
          .single()

        if (data?.predictions) {
          setPredictions(prev => ({ ...prev, ...data.predictions }))
        }
        if (data?.confirmed_ids) {
          setConfirmed(new Set(data.confirmed_ids))
        }
      } catch {
        // no existing predictions — start fresh
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id])

  const setScore = useCallback((matchId, side, value) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: value },
    }))
    setConfirmed(prev => new Set(prev).add(matchId))
    setSaveState('idle')
  }, [])

  async function handleSave() {
    setSaveState('saving')
    try {
      const { error } = await supabase
        .from('score_predictions')
        .upsert(
          {
            user_id: user.id,
            predictions,
            confirmed_ids: [...confirmed],
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
      if (error) throw error
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const confirmedCount = confirmed.size
  const pct = TOTAL > 0 ? (confirmedCount / TOTAL) * 100 : 0

  const saveLabel =
    saveState === 'saving' ? 'Saving…' :
    saveState === 'saved'  ? 'Saved ✓' :
    saveState === 'error'  ? 'Error' :
    'Save'

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
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onLogout}
            className="text-white/60 text-sm font-semibold px-3 py-1.5 rounded-xl border border-white/20 bg-white/5"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className={`text-sm font-bold px-4 py-1.5 rounded-xl active:scale-95 transition-all disabled:opacity-50 ${
              saveState === 'saved'
                ? 'bg-white/20 text-white border border-white/20'
                : saveState === 'error'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white text-black'
            }`}
          >
            {saveLabel}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs font-medium">Predictions set</span>
          <span className="text-white text-xs font-bold tabular-nums">
            {confirmedCount} / {TOTAL}
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Group tabs */}
      <div className="flex overflow-x-auto gap-1.5 px-4 py-3 border-b border-white/10 scrollbar-none">
        {groupNames.map(letter => {
          const groupConfirmed = ALL_MATCHES[letter].filter(m => confirmed.has(m.id)).length
          const groupTotal = ALL_MATCHES[letter].length
          const done = groupConfirmed === groupTotal

          return (
            <button
              key={letter}
              type="button"
              onClick={() => setActiveGroup(letter)}
              className={`shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                activeGroup === letter
                  ? 'bg-white text-black'
                  : done
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Match list */}
      <div className="px-4 pt-4 pb-24 space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">
          Group {activeGroup} — predict exact scores
        </p>

        {ALL_MATCHES[activeGroup].map(match => {
          const pred = predictions[match.id] ?? { home: 0, away: 0 }
          const isSet = confirmed.has(match.id)

          return (
            <div
              key={match.id}
              className={`rounded-xl p-3 border transition-colors ${
                isSet
                  ? 'bg-white/8 border-white/20'
                  : 'bg-white/3 border-white/8'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Home */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="text-base leading-none shrink-0">
                    {FLAGS[match.home] ?? '🏳️'}
                  </span>
                  <span className="text-white text-sm font-medium truncate">
                    {match.home}
                  </span>
                </div>

                {/* Score controls */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <ScoreInput
                    value={pred.home}
                    onChange={v => setScore(match.id, 'home', v)}
                  />
                  <span className="text-white/25 px-1 text-sm font-bold select-none">—</span>
                  <ScoreInput
                    value={pred.away}
                    onChange={v => setScore(match.id, 'away', v)}
                  />
                </div>

                {/* Away */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                  <span className="text-white text-sm font-medium truncate text-right">
                    {match.away}
                  </span>
                  <span className="text-base leading-none shrink-0">
                    {FLAGS[match.away] ?? '🏳️'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky bottom save */}
      <div className="fixed bottom-0 inset-x-0 px-4 pb-6 pt-3 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === 'saving'}
          className="pointer-events-auto w-full bg-white text-black font-bold rounded-xl py-3 text-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}
