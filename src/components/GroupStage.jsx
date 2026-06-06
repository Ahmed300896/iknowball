import { useState } from 'react'
import { groupsMap, groupNames, FLAGS } from '../data/teams'

const POSITION_STYLES = [
  'text-yellow-400',
  'text-slate-300',
  'text-orange-400',
  'text-slate-500',
]

function TeamRow({ team, position, isFirst, isLast, onMoveUp, onMoveDown }) {
  const isEliminated = position === 4

  return (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border bg-white/5 border-white/10 ${
      isEliminated ? 'opacity-40' : ''
    }`}>
      <span className={`w-5 text-center font-bold text-sm ${POSITION_STYLES[position - 1]}`}>
        {position}
      </span>
      <span className="text-xl leading-none">
        {FLAGS[team] ?? '🏳️'}
      </span>
      <span className="flex-1 text-sm font-medium text-white">
        {team}
      </span>
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 active:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 active:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ▼
        </button>
      </div>
    </div>
  )
}

function GroupCard({ groupLetter, teams, onReorder }) {
  function move(index, direction) {
    const next = [...teams]
    const swap = index + direction
    ;[next[index], next[swap]] = [next[swap], next[index]]
    onReorder(groupLetter, next)
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
        Group {groupLetter}
      </h2>
      <div className="flex flex-col gap-2">
        {teams.map((team, i) => (
          <TeamRow
            key={team}
            team={team}
            position={i + 1}
            isFirst={i === 0}
            isLast={i === teams.length - 1}
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
          />
        ))}
      </div>
    </div>
  )
}

export default function GroupStage({ username, onNext, onBack, onHome }) {
  const [picks, setPicks] = useState(() =>
    Object.fromEntries(groupNames.map(g => [g, [...groupsMap[g]]]))
  )

  function handleReorder(groupLetter, newOrder) {
    setPicks(prev => ({ ...prev, [groupLetter]: newOrder }))
  }

  const allRanked = groupNames.every(g => picks[g]?.length === 4)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-white/70 text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onHome}
          className="text-white font-bold text-lg hover:text-white/70 transition-colors"
        >
          iknowball
        </button>
        <span className="text-white/40 text-sm">{username}</span>
      </div>

      <div className="px-4 pt-6 pb-4">
        <h1 className="text-white text-2xl font-bold">Pick your group standings</h1>
        <p className="text-white/40 text-sm mt-1">Use the arrows to rank each group 1st to 4th</p>
        <div className="flex flex-col gap-1 mt-3">
          <p className="text-xs font-semibold" style={{ color: '#3ddc84' }}>
            ✓ Top 2 from each group advance automatically
          </p>
          <p className="text-xs" style={{ color: '#8b93ab' }}>
            ★ 3rd place teams compete for 8 wildcard spots
          </p>
        </div>
      </div>

      <div className="px-4 pb-32 flex flex-col gap-4">
        {groupNames.map(g => (
          <GroupCard key={g} groupLetter={g} teams={picks[g]} onReorder={handleReorder} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-white/10 px-4 py-4">
        <button
          onClick={() => onNext(picks)}
          disabled={!allRanked}
          className="w-full bg-white text-black font-bold text-lg rounded-xl py-3 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          Next
        </button>
      </div>
    </div>
  )
}
