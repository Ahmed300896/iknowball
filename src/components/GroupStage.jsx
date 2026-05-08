import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { groups, groupNames, FLAGS } from '../data/teams'

const POSITION_STYLES = [
  'text-yellow-400',  // 1st
  'text-slate-300',   // 2nd
  'text-orange-400',  // 3rd
  'text-slate-500',   // 4th
]

function SortableTeam({ id, position, team }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const isEliminated = position === 4

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border select-none cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'bg-white/20 border-white/40 shadow-lg z-10'
          : isEliminated
          ? 'bg-red-950/20 border-red-900/20'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <span className={`w-5 text-center font-bold text-sm ${isEliminated ? 'text-red-600' : POSITION_STYLES[position - 1]}`}>
        {isEliminated ? '❌' : position}
      </span>
      <span className={`text-xl leading-none ${isEliminated ? 'opacity-30' : ''}`}>{FLAGS[team] ?? '🏳️'}</span>
      <span className={`flex-1 text-sm font-medium ${isEliminated ? 'line-through text-white/25' : 'text-white'}`}>{team}</span>
      <span className="text-white/30 text-lg">⠿</span>
    </div>
  )
}

function GroupCard({ groupLetter, teams, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const ids = teams.map(t => `${groupLetter}-${t}`)

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    onReorder(groupLetter, arrayMove(teams, oldIndex, newIndex))
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
        Group {groupLetter}
      </h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {teams.map((team, i) => (
              <SortableTeam key={ids[i]} id={ids[i]} position={i + 1} team={team} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default function GroupStage({ nickname, onNext }) {
  const [picks, setPicks] = useState(() =>
    Object.fromEntries(groupNames.map(g => [g, [...groups[g]]]))
  )

  function handleReorder(groupLetter, newOrder) {
    setPicks(prev => ({ ...prev, [groupLetter]: newOrder }))
  }

  const allRanked = groupNames.every(g => picks[g]?.length === 4)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-lg">iknowball</span>
        <span className="text-white/40 text-sm">{nickname}</span>
      </div>

      <div className="px-4 pt-6 pb-4">
        <h1 className="text-white text-2xl font-bold">Pick your group standings</h1>
        <p className="text-white/40 text-sm mt-1">Drag to rank each group 1st to 4th</p>
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
