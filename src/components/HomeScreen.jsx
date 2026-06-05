import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import TeamSelectionScreen from './TeamSelectionScreen'
import HowToPlay from './HowToPlay'
import { FLAGS } from '../data/teams'

export default function HomeScreen({ user, username, onPlay, onLogout, onViewPredictions, onAdmin, onScorePredictor, onLeaderboard }) {
  const [showTeamSelection, setShowTeamSelection] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [favoriteTeams, setFavoriteTeams] = useState([])
  const [loadingTeams, setLoadingTeams] = useState(true)

  useEffect(() => {
    console.log('[HomeScreen] user.id:', user?.id)
    console.log('[HomeScreen] ADMIN_ID:', '0d3be115-d531-4146-9256-120dc7d047bc')
    console.log('[HomeScreen] isAdmin:', user?.id === '0d3be115-d531-4146-9256-120dc7d047bc')
  }, [user?.id])

  useEffect(() => {
    async function fetchFavoriteTeams() {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('favorite_teams')
          .eq('id', user.id)
          .single()
        
        if (profile?.favorite_teams && Array.isArray(profile.favorite_teams)) {
          setFavoriteTeams(profile.favorite_teams)
        }
      } catch (error) {
        console.error('Error fetching favorite teams:', error)
      } finally {
        setLoadingTeams(false)
      }
    }

    if (user?.id) {
      fetchFavoriteTeams()
    }
  }, [user?.id])

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
    // Refetch favorite teams to update the My Teams section
    setLoadingTeams(true)
    supabase
      .from('profiles')
      .select('favorite_teams')
      .eq('id', user.id)
      .single()
      .then(({ data: profile }) => {
        if (profile?.favorite_teams && Array.isArray(profile.favorite_teams)) {
          setFavoriteTeams(profile.favorite_teams)
        }
      })
      .catch((error) => console.error('Error refetching teams:', error))
      .finally(() => {
        setLoadingTeams(false)
        setShowTeamSelection(false)
      })
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

  // Show HowToPlay when requested
  if (showHowToPlay === true) {
    return (
      <HowToPlay
        onBack={() => setShowHowToPlay(false)}
        onLogout={onLogout}
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="text-white/70 text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10"
          >
            How to play
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="text-white/70 text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10"
          >
            Logout
          </button>
        </div>
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
        {/* My Teams Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">My Teams</h2>
            {favoriteTeams.length === 5 && (
              <button
                type="button"
                onClick={() => setShowTeamSelection(true)}
                className="text-white text-sm font-semibold px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10"
              >
                Change
              </button>
            )}
          </div>
          
          {loadingTeams ? (
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <p className="text-white/50 text-sm">Loading teams...</p>
            </div>
          ) : favoriteTeams.length === 5 ? (
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 flex-wrap">
                {favoriteTeams.map((team) => (
                  <div key={team} className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                    <span className="text-lg">{FLAGS[team] || '⚽'}</span>
                    <span className="text-white text-sm font-medium">{team}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <p className="text-white/50 text-sm mb-3">You haven't selected your 5 teams yet. Pick them to unlock team-specific games like Starting 11 and iknowball FPL.</p>
              <button
                type="button"
                onClick={() => setShowTeamSelection(true)}
                className="w-full bg-white text-black font-bold rounded-lg py-2.5 text-sm active:scale-95 transition-transform"
              >
                Pick your 5 teams
              </button>
            </div>
          )}
        </div>

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

            {/* Score Predictor - Active */}
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
              <p className="text-white font-bold text-base mb-1">Score Predictor</p>
              <p className="text-white/50 text-sm mb-3">
                Predict the exact scoreline for every World Cup match
              </p>
              <button
                type="button"
                onClick={onScorePredictor}
                className="w-full bg-white text-black font-bold rounded-lg py-2.5 text-sm active:scale-95 transition-transform"
              >
                Play
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
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <p className="text-white font-bold text-base mb-1">Leaderboard</p>
          <p className="text-white/50 text-sm mb-3">
            See who has submitted the most predictions
          </p>
          <button
            type="button"
            onClick={onLeaderboard}
            className="w-full bg-white/10 text-white font-bold rounded-lg py-2.5 text-sm border border-white/20 hover:bg-white/15 active:scale-95 transition-all"
          >
            View leaderboard
          </button>
        </div>

        {user.id === '0d3be115-d531-4146-9256-120dc7d047bc' && (
          <div className="flex justify-center pt-4 pb-2">
            <button
              type="button"
              onClick={onAdmin}
              className="text-white/20 text-xs hover:text-white/40 transition-colors"
            >
              admin
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
