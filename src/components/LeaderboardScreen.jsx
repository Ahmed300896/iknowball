import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TOTAL_MATCHES = 72

const RANK_STYLES = {
  1: { label: '🥇', row: 'border-yellow-500/40 bg-yellow-500/10', rank: 'text-yellow-400' },
  2: { label: '🥈', row: 'border-slate-400/40 bg-slate-400/10', rank: 'text-slate-300' },
  3: { label: '🥉', row: 'border-orange-500/40 bg-orange-500/10', rank: 'text-orange-400' },
}

export default function LeaderboardScreen({ user, onBack, onLogout }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: predictions }, { data: profiles }] = await Promise.all([
        supabase.from('score_predictions').select('user_id, predictions'),
        supabase.from('profiles').select('id, username'),
      ])

      const profileMap = Object.fromEntries(
        (profiles ?? []).map(p => [p.id, p.username])
      )

      const ranked = (predictions ?? [])
        .map(row => ({
          userId: row.user_id,
          username: profileMap[row.user_id] ?? 'Unknown',
          count: Object.keys(row.predictions ?? {}).length,
        }))
        .sort((a, b) => b.count - a.count)

      setRows(ranked)
      setLoading(false)
    }
    load()
  }, [])

  const currentUserIndex = rows.findIndex(r => r.userId === user.id)

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
          <span className="text-white font-bold truncate">Leaderboard</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-white/60 text-sm font-semibold px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 shrink-0"
        >
          Logout
        </button>
      </div>

      <div className="px-4 py-5 pb-20">
        <div className="mb-5">
          <h2 className="text-white text-xl font-bold">Score Predictor</h2>
          <p className="text-white/40 text-sm mt-0.5">Ranked by predictions submitted</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center pt-20">
            <p className="text-white/50">Loading…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-2 text-center">
            <p className="text-white text-lg font-semibold">No predictions yet</p>
            <p className="text-white/40 text-sm">Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rows.map((row, i) => {
              const rank = i + 1
              const isCurrentUser = row.userId === user.id
              const medal = RANK_STYLES[rank]

              const rowClass = isCurrentUser
                ? 'border-blue-500/50 bg-blue-500/10'
                : medal
                ? medal.row
                : 'border-white/10 bg-white/5'

              const rankClass = medal ? medal.rank : 'text-white/40'

              return (
                <div
                  key={row.userId}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${rowClass}`}
                >
                  <span className={`w-7 text-center text-sm font-bold tabular-nums shrink-0 ${rankClass}`}>
                    {medal ? medal.label : rank}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-white truncate">
                    {row.username}
                    {isCurrentUser && (
                      <span className="ml-2 text-blue-400 text-xs font-medium">you</span>
                    )}
                  </span>
                  <span className="text-white/50 text-xs tabular-nums shrink-0">
                    {row.count} / {TOTAL_MATCHES}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Sticky current user row if they're not visible near the top */}
        {!loading && currentUserIndex > 9 && (
          <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-blue-500/50 bg-blue-500/10 pointer-events-auto">
              <span className="w-7 text-center text-sm font-bold tabular-nums text-white/40 shrink-0">
                {currentUserIndex + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-white truncate">
                {rows[currentUserIndex]?.username}
                <span className="ml-2 text-blue-400 text-xs font-medium">you</span>
              </span>
              <span className="text-white/50 text-xs tabular-nums shrink-0">
                {rows[currentUserIndex]?.count} / {TOTAL_MATCHES}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
