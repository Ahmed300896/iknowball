import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import TeamSelectionScreen from './TeamSelectionScreen'

export default function HomeScreen({ user, username, onPlay, onLogout, onViewPredictions }) {
  const [showTeamSelection, setShowTeamSelection] = useState(false)
  const [userTeams, setUserTeams] = useState(null)

  // Load user's favorite teams on mount
  useEffect(() => {
    if (!user?.id) return

    async function loadTeams() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('favorite_teams')
        .eq('id', user.id)
        .single()
      
      setUserTeams(profile?.favorite_teams || null)
    }

    loadTeams()
  }, [user?.id])

  function handlePlayClick() {
    // Check if user has selected teams
    if (userTeams && Array.isArray(userTeams) && userTeams.length > 0) {
      // User has teams - go straight to game
      onPlay()
    } else {
      // User hasn't selected teams - show team selection
      setShowTeamSelection(true)
    }
  }

  function handleTeamsSelected(selectedTeams) {
    // Update local state with selected teams
    setUserTeams(selectedTeams)
    setShowTeamSelection(false)
    // Proceed to game
    onPlay()
  }

  // ONLY show TeamSelectionScreen if user clicked Play and needs to select teams
  if (showTeamSelection === true) {
    return (
      <TeamSelectionScreen
        user={user}
        onTeamsSelected={handleTeamsSelected}
        onLogout={onLogout}
      />
    )
  }

  // Default: Always show HomeScreen dashboard first

  const initials = username
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-lg">iknowball</span>
        <button
          type="button"
          onClick={onLogout}
          className="text-white/70 text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10"
        >
          Logout
        </button>
      </div>

      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
            {initials || 'IK'}
          </div>
          <div>
            <p className="text-white/40 text-sm">Welcome back,</p>
            <p className="text-white text-2xl font-bold mt-1">{username}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-xl font-bold">Games</h2>
            <span className="text-white/40 text-sm">1 available</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
            <div>
              <p className="text-white text-lg font-bold">World Cup Predictor</p>
              <p className="text-white/50 text-sm mt-2">
                Pick your group standings, knockout winners and champion
              </p>
            </div>
            <button
              type="button"
              onClick={handlePlayClick}
              className="w-full bg-white text-black font-bold rounded-2xl py-3 active:scale-95 transition-transform"
            >
              Play
            </button>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
            <div>
              <p className="text-white text-lg font-bold">See all predictions</p>
              <p className="text-white/50 text-sm mt-2">
                Browse all saved predictions from the community.
              </p>
            </div>
            <button
              type="button"
              onClick={onViewPredictions}
              className="w-full bg-white/10 text-white font-bold rounded-2xl py-3 border border-white/20 hover:bg-white/10 active:scale-95 transition-transform"
            >
              See all predictions
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-xl font-bold">Leaderboard</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 text-white/50">
            Leaderboard coming soon
          </div>
        </div>
      </div>
    </div>
  )
}
