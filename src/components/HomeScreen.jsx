import { useState } from 'react'
import { supabase } from '../lib/supabase'
import TeamSelectionScreen from './TeamSelectionScreen'

export default function HomeScreen({ user, username, onPlay, onLogout, onViewPredictions }) {
  const [showTeamSelection, setShowTeamSelection] = useState(false)

  // World Cup Predictor - no team selection required
  function handleWorldCupPlay() {
    onPlay()
  }

  // For future games that require team selection (Starting 11, FPL)
  async function handleTeamRequiredGameClick() {
    const { data: profile } = await supabase
      .from('profiles')
      .select('favorite_teams')
      .eq('id', user.id)
      .single()
    
    const userTeams = profile?.favorite_teams
    
    if (userTeams && Array.isArray(userTeams) && userTeams.length > 0) {
      onPlay()
    } else {
      setShowTeamSelection(true)
    }
  }

  function handleTeamsSelected(selectedTeams) {
    setShowTeamSelection(false)
  }

  // ONLY show TeamSelectionScreen when user explicitly clicks Play and needs to select teams
  if (showTeamSelection === true) {
    return (
      <TeamSelectionScreen
        user={user}
        onTeamsSelected={handleTeamsSelected}
        onLogout={onLogout}
        onBack={() => setShowTeamSelection(false)}
      />
    )
  }

  // Default: Always show HomeScreen dashboard

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

      <div className="px-4 pb-20 space-y-8">
        {/* Games Section */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Games</h2>
          
          <div className="space-y-3">
            {/* World Cup Predictor - Active */}
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <p className="text-white font-bold text-base mb-1">World Cup Predictor</p>
              <p className="text-white/50 text-sm mb-3">
                Pick your group standings, knockout winners and champion
              </p>
              <button
                type="button"
                onClick={handleWorldCupPlay}
                className="w-full bg-white text-black font-bold rounded-lg py-2.5 text-sm active:scale-95 transition-transform"
              >
                Play
              </button>
            </div>

            {/* Starting 11 - Coming Soon */}
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <p className="text-white font-bold text-base mb-1">Starting 11</p>
              <p className="text-white/50 text-sm mb-3">
                Pick the starting lineup before each match for your 5 teams
              </p>
              <button
                type="button"
                disabled
                className="w-full bg-white/5 text-white/40 font-bold rounded-lg py-2.5 text-sm border border-white/10 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Score Predictor - Coming Soon */}
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <p className="text-white font-bold text-base mb-1">Score Predictor</p>
              <p className="text-white/50 text-sm mb-3">
                Predict the exact scoreline for every World Cup match
              </p>
              <button
                type="button"
                disabled
                className="w-full bg-white/5 text-white/40 font-bold rounded-lg py-2.5 text-sm border border-white/10 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* iknowball FPL - Coming Soon */}
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <p className="text-white font-bold text-base mb-1">iknowball FPL</p>
              <p className="text-white/50 text-sm mb-3">
                Build a 15-player fantasy squad from your 5 teams
              </p>
              <button
                type="button"
                disabled
                className="w-full bg-white/5 text-white/40 font-bold rounded-lg py-2.5 text-sm border border-white/10 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* See All Predictions */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <p className="text-white font-bold text-base mb-1">See all predictions</p>
          <p className="text-white/50 text-sm mb-3">
            Browse all saved predictions from the community
          </p>
          <button
            type="button"
            onClick={onViewPredictions}
            className="w-full bg-white/10 text-white font-bold rounded-lg py-2.5 text-sm border border-white/20 hover:bg-white/15 active:scale-95 transition-all"
          >
            Browse predictions
          </button>
        </div>

        {/* Leaderboard Section */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Leaderboard</h2>
          <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
            <p className="text-white/50 text-sm">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
