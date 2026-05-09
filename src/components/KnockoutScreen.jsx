import { useState, useMemo } from 'react'
import { FLAGS } from '../data/teams'
import { supabase } from '../lib/supabase'

const ROUNDS = [
  { key: 'r32',   label: 'Round of 32',    count: 16 },
  { key: 'r16',   label: 'Round of 16',    count: 8 },
  { key: 'qf',    label: 'Quarter-finals', count: 4 },
  { key: 'sf',    label: 'Semi-finals',    count: 2 },
  { key: 'final', label: 'Final',          count: 1 },
]

// Official FIFA 2026 R32 bracket.
// For 3rd-place slots the qualifying group is unknown until the tournament ends,
// so we use the 3rd-place team from the first group listed as a placeholder.
function buildR32Slots(groupPicks) {
  const w = g => groupPicks[g]?.[0] ?? '?'  // group winner
  const r = g => groupPicks[g]?.[1] ?? '?'  // runner-up
  const t = g => groupPicks[g]?.[2] ?? '?'  // 3rd place (placeholder)
  return [
    [r('A'), r('B')],        // M1:  2nd A vs 2nd B
    [w('C'), r('F')],        // M2:  1st C vs 2nd F
    [w('F'), r('C')],        // M3:  1st F vs 2nd C
    [w('E'), t('A')],        // M4:  1st E vs best 3rd (A/B/C/D/F) → placeholder: 3rd A
    [w('I'), t('C')],        // M5:  1st I vs best 3rd (C/D/F/G/H) → placeholder: 3rd C
    [w('A'), t('C')],        // M6:  1st A vs best 3rd (C/E/F/H/I) → placeholder: 3rd C
    [w('L'), t('E')],        // M7:  1st L vs best 3rd (E/H/I/J/K) → placeholder: 3rd E
    [w('G'), t('A')],        // M8:  1st G vs best 3rd (A/E/H/I/J) → placeholder: 3rd A
    [w('D'), t('B')],        // M9:  1st D vs best 3rd (B/E/F/I/J) → placeholder: 3rd B
    [w('H'), r('J')],        // M10: 1st H vs 2nd J
    [r('K'), r('L')],        // M11: 2nd K vs 2nd L
    [w('B'), t('E')],        // M12: 1st B vs best 3rd (E/F/G/I/J) → placeholder: 3rd E
    [r('D'), r('G')],        // M13: 2nd D vs 2nd G
    [w('J'), r('H')],        // M14: 1st J vs 2nd H
    [w('K'), t('D')],        // M15: 1st K vs best 3rd (D/E/I/J/L) → placeholder: 3rd D
    [r('E'), r('I')],        // M16: 2nd E vs 2nd I
  ]
}

function MatchCard({ teamA, teamB, picked, onPick }) {
  return (
    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
      <button
        type="button"
        onClick={() => onPick(teamA)}
        className={`w-full flex items-center gap-3 px-4 py-4 transition-colors text-left ${
          picked === teamA ? 'bg-white text-black' : 'text-white active:bg-white/10'
        }`}
      >
        <span className="text-xl w-7 text-center leading-none">{FLAGS[teamA] ?? '🏳️'}</span>
        <span className="flex-1 font-medium">{teamA}</span>
        {picked === teamA && <span className="font-bold text-black/50">✓</span>}
      </button>

      <div className="flex items-center gap-3 px-4 py-0.5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/20 text-xs">vs</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button
        type="button"
        onClick={() => onPick(teamB)}
        className={`w-full flex items-center gap-3 px-4 py-4 transition-colors text-left ${
          picked === teamB ? 'bg-white text-black' : 'text-white active:bg-white/10'
        }`}
      >
        <span className="text-xl w-7 text-center leading-none">{FLAGS[teamB] ?? '🏳️'}</span>
        <span className="flex-1 font-medium">{teamB}</span>
        {picked === teamB && <span className="font-bold text-black/50">✓</span>}
      </button>
    </div>
  )
}

export default function KnockoutScreen({ nickname, groupPicks, onSubmit }) {
  const r32Slots = useMemo(() => buildR32Slots(groupPicks), [groupPicks])

  const [roundIndex, setRoundIndex] = useState(0)
  const [allPicks, setAllPicks] = useState(() =>
    Object.fromEntries(ROUNDS.map(({ key, count }) => [key, Array(count).fill(null)]))
  )

  const currentRound = ROUNDS[roundIndex]
  const currentPicks = allPicks[currentRound.key]

  const matches = roundIndex === 0
    ? r32Slots
    : (() => {
        const prevPicks = allPicks[ROUNDS[roundIndex - 1].key]
        return Array.from({ length: currentRound.count }, (_, i) => [
          prevPicks[i * 2],
          prevPicks[i * 2 + 1],
        ])
      })()

  function handlePick(matchIndex, winner) {
    setAllPicks(prev => ({
      ...prev,
      [currentRound.key]: prev[currentRound.key].map((p, i) => i === matchIndex ? winner : p),
    }))
  }

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const allPicked = currentPicks.every(p => p !== null)
  const isFinal = roundIndex === ROUNDS.length - 1

  async function handleNext() {
    if (!isFinal) {
      setRoundIndex(r => r + 1)
      return
    }

    setSaving(true)
    setSaveError('')

    const champion = allPicks.final[0]
    const { error } = await supabase.from('predictions').insert({
      nickname,
      group_picks: groupPicks,
      knockout: {
        r32: allPicks.r32,
        r16: allPicks.r16,
        qf: allPicks.qf,
        sf: allPicks.sf,
        final: champion,
      },
      champion,
    })

    setSaving(false)

    if (error) {
      console.error('Supabase insert error:', error)
      setSaveError('Something went wrong. Please try again.')
      return
    }

    onSubmit()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">iknowball</span>
        <span className="text-white/40 text-sm">{nickname}</span>
      </div>

      <div className="px-4 pt-6 pb-5">
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">
          Round {roundIndex + 1} of {ROUNDS.length}
        </p>
        <h1 className="text-white text-2xl font-bold">{currentRound.label}</h1>
      </div>

      <div className="px-4 pb-32 flex flex-col gap-8">
        {matches.map(([teamA, teamB], i) => (
          <MatchCard
            key={i}
            teamA={teamA}
            teamB={teamB}
            picked={currentPicks[i]}
            onPick={winner => handlePick(i, winner)}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-white/10 px-4 py-4">
        {saveError && (
          <p className="text-red-400 text-sm text-center mb-3">{saveError}</p>
        )}
        <button
          onClick={handleNext}
          disabled={!allPicked || saving}
          className="w-full bg-white text-black font-bold text-lg rounded-xl py-3 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          {saving ? 'Saving...' : isFinal ? 'Submit my prediction' : 'Next'}
        </button>
      </div>
    </div>
  )
}
