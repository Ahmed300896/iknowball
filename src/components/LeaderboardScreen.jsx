import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { calculateScorePoints } from '../lib/scoring'
import PageHeader from './PageHeader'
import BottomNav from './BottomNav'

function initials(username) {
  return (username || '?').split(' ').filter(Boolean).map(p => p[0].toUpperCase()).slice(0, 2).join('')
}

function Avatar({ username, size = 44, ring, ringColor }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: '#141b30',
        border: ring ? `2px solid ${ringColor}` : '1px solid #2a3354',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: Math.round(size * 0.32), color: ringColor ?? '#8b93ab' }}>
        {initials(username)}
      </span>
    </div>
  )
}

function CrownIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <path d="M1 12H17M1 12L3 4L7 8L9 2L11 8L15 4L17 12H1Z" stroke="#c9a84c" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

export default function LeaderboardScreen({ user, username, onBack, onLogout, currentScreen, onPredict, onRanks }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Fetch predictions, results, profiles, and XI points in parallel
      var [predRes, resultsRes, profilesRes, xiPointsRes] = await Promise.all([
        supabase.from('score_predictions').select('user_id, predictions'),
        supabase.from('match_results').select('match_id, home_score, away_score, match_type'),
        supabase.from('profiles').select('id, username'),
        supabase.from('user_points').select('user_id, points').like('game', 'starting_xi_%'),
      ])

      var predData = predRes.data ?? []
      var resultsData = resultsRes.data ?? []
      var profiles = profilesRes.data ?? []
      var xiPointsData = xiPointsRes.data ?? []

      // Build a predictions lookup keyed by user_id
      var predMap = {}
      predData.forEach(function (row) {
        predMap[row.user_id] = row.predictions || {}
      })

      // Sum XI points per user
      var xiPointsMap = {}
      xiPointsData.forEach(function (r) {
        xiPointsMap[r.user_id] = (xiPointsMap[r.user_id] ?? 0) + (r.points ?? 0)
      })

      // Build a results lookup keyed by match_id (string)
      var resultsMap = {}
      resultsData.forEach(function (r) {
        resultsMap[String(r.match_id)] = {
          homeScore: r.home_score,
          awayScore: r.away_score,
          matchType: r.match_type,
        }
      })

      // Iterate over ALL profiles so every user appears, even with 0 points
      var ranked = profiles.map(function (profile) {
        var predictions = predMap[profile.id] || {}
        var total = 0
        Object.keys(predictions).forEach(function (matchId) {
          var result = resultsMap[String(matchId)]
          if (!result) return
          var pred = predictions[matchId]
          if (!pred) return
          total += calculateScorePoints(
            { homeScore: pred.homeScore, awayScore: pred.awayScore },
            { homeScore: result.homeScore, awayScore: result.awayScore },
            result.matchType
          )
        })
        total += xiPointsMap[profile.id] ?? 0
        return {
          userId: profile.id,
          username: profile.username || 'Unknown',
          points: total,
        }
      })

      ranked.sort(function (a, b) { return b.points - a.points })
      setRows(ranked)
      setLoading(false)
    }
    load()
  }, [])

  const currentUserIndex = rows.findIndex(r => r.userId === user.id)
  const top3 = rows.slice(0, 3)
  const rest = rows.slice(3)

  const MEDAL = {
    0: { color: '#c9a84c', label: '1ST' },
    1: { color: '#b8bcc8', label: '2ND' },
    2: { color: '#cd7f32', label: '3RD' },
  }

  // Podium order: 2nd (left), 1st (center), 3rd (right)
  const podiumOrder = [
    { slot: 1, row: top3[1] },
    { slot: 0, row: top3[0] },
    { slot: 2, row: top3[2] },
  ]

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0e1a' }}>
      <PageHeader title="Leaderboard" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div className="px-4 pt-5 pb-4">
        {loading ? (
          <div className="flex items-center justify-center pt-20">
            <p style={{ color: '#6b7494' }}>Loading…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center pt-20">
            <p className="text-white text-lg" style={{ fontFamily: 'Oswald, sans-serif' }}>NO PREDICTIONS YET</p>
            <p className="text-sm mt-2" style={{ color: '#8b93ab' }}>Be the first!</p>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-3 mb-8 pt-4">
                {podiumOrder.map(({ slot, row }) => {
                  if (!row) return <div key={slot} className="w-24" />
                  const medal = MEDAL[slot]
                  const isFirst = slot === 0
                  const baseHeight = isFirst ? 72 : slot === 1 ? 52 : 40

                  return (
                    <div key={slot} className="flex flex-col items-center" style={{ width: 88 }}>
                      {isFirst && (
                        <div className="mb-1.5">
                          <CrownIcon />
                        </div>
                      )}
                      <Avatar username={row.username} size={isFirst ? 52 : 44} ring ringColor={medal.color} />
                      <p
                        className="mt-1.5 text-center truncate w-full text-xs"
                        style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#fff', letterSpacing: '0.04em' }}
                      >
                        {row.username}
                      </p>
                      <p
                        className="text-sm"
                        style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: medal.color }}
                      >
                        {row.points} PTS
                      </p>
                      {/* Podium base */}
                      <div
                        className="w-full mt-2 rounded-t flex items-center justify-center"
                        style={{ height: baseHeight, background: `${medal.color}18`, borderTop: `2px solid ${medal.color}40` }}
                      >
                        <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, color: `${medal.color}60` }}>
                          {slot + 1}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Ranks 4+ */}
            {rest.length > 0 && (
              <div style={{ borderTop: '1px solid #1e2540' }}>
                {rest.map((row, i) => {
                  const rank = i + 4
                  const isCurrentUser = row.userId === user.id

                  return (
                    <div
                      key={row.userId}
                      className="flex items-center gap-3 py-3"
                      style={{
                        borderBottom: '1px solid #1e2540',
                        borderLeft: isCurrentUser ? '3px solid #c9a84c' : '3px solid transparent',
                        paddingLeft: 12,
                        paddingRight: 4,
                      }}
                    >
                      <span
                        style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 14, color: '#6b7494', width: 28, textAlign: 'center', flexShrink: 0 }}
                      >
                        {rank}
                      </span>
                      <Avatar username={row.username} size={32} ringColor={isCurrentUser ? '#c9a84c' : undefined} />
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <span
                          className="truncate text-sm"
                          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: isCurrentUser ? '#c9a84c' : '#ffffff', letterSpacing: '0.02em' }}
                        >
                          {row.username}
                        </span>
                        {isCurrentUser && <span className="text-xs shrink-0" style={{ color: '#c9a84c', opacity: 0.7 }}>YOU</span>}
                      </div>
                      <p className="shrink-0" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 14, color: isCurrentUser ? '#c9a84c' : '#ffffff' }}>
                        {row.points} <span style={{ fontSize: 10, opacity: 0.6 }}>PTS</span>
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky current user row if below rank 10 */}
      {!loading && currentUserIndex > 9 && (
        <div
          className="fixed bottom-[57px] left-0 right-0 px-4 pb-2 pt-3"
          style={{ background: 'linear-gradient(to top, #0a0e1a 70%, transparent)', pointerEvents: 'none' }}
        >
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded"
            style={{ background: '#0d1224', border: '1px solid #1e2540', borderLeft: '3px solid #c9a84c', pointerEvents: 'auto' }}
          >
            <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 14, color: '#c9a84c', width: 28, textAlign: 'center', flexShrink: 0 }}>
              {currentUserIndex + 1}
            </span>
            <Avatar username={rows[currentUserIndex]?.username} size={28} ring ringColor="#c9a84c" />
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="truncate text-sm" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#c9a84c', letterSpacing: '0.02em' }}>
                {rows[currentUserIndex]?.username}
              </span>
              <span className="text-xs shrink-0" style={{ color: '#c9a84c', opacity: 0.7 }}>YOU</span>
            </div>
            <p className="shrink-0" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 14, color: '#c9a84c' }}>
              {rows[currentUserIndex]?.points} <span style={{ fontSize: 10, opacity: 0.6 }}>PTS</span>
            </p>
          </div>
        </div>
      )}

      <BottomNav
        currentScreen={currentScreen ?? 'leaderboard'}
        onHome={onBack}
        onPredict={onPredict ?? (() => {})}
        onRanks={onRanks ?? (() => {})}
      />
    </div>
  )
}
