import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FLAGS } from '../data/teams'

// Team tiers based on FIFA rankings
const TIER_1 = ['Argentina', 'France', 'Spain', 'England', 'Brazil', 'Portugal', 'Belgium', 'Netherlands', 'Italy', 'Germany']
const TIER_2 = ['Croatia', 'Denmark', 'Switzerland', 'USA', 'Mexico', 'Senegal', 'Morocco', 'Japan', 'Uruguay', 'Colombia', 'Wales', 'Poland', 'Australia', 'Ecuador', 'Ghana']
const TIER_3 = ['Cameroon', 'Serbia', 'South Korea', 'Costa Rica', 'Canada', 'Tunisia', 'Qatar', 'IR Iran', 'Saudi Arabia', 'Mali', 'Ivory Coast', 'Burkina Faso', 'Egypt', 'Algeria']

export default function TeamSelectionScreen({ user, onTeamsSelected, onLogout }) {
  const [tier1Picks, setTier1Picks] = useState([])
  const [tier2Picks, setTier2Picks] = useState([])
  const [tier3Picks, setTier3Picks] = useState([])
  const [tier4Picks, setTier4Picks] = useState([])
  const [tier4Options, setTier4Options] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Build Tier 4 options from all World Cup nations not in other tiers
  useEffect(() => {
    const allTierTeams = new Set([...TIER_1, ...TIER_2, ...TIER_3])
    const worldCupTeams = new Set([
      'Mexico', 'South Korea', 'South Africa', 'Czechia',
      'Canada', 'Switzerland', 'Qatar', 'Bosnia-Herzegovina',
      'Brazil', 'Morocco', 'Scotland', 'Haiti',
      'USA', 'Paraguay', 'Australia', 'Türkiye',
      'Germany', 'Ecuador', 'Ivory Coast', 'Curaçao',
      'Netherlands', 'Japan', 'Tunisia', 'Sweden',
      'Belgium', 'Iran', 'Egypt', 'New Zealand',
      'Spain', 'Uruguay', 'Saudi Arabia', 'Cape Verde',
      'France', 'Senegal', 'Norway', 'Iraq',
      'Argentina', 'Austria', 'Algeria', 'Jordan',
      'Portugal', 'Colombia', 'Uzbekistan', 'DR Congo',
      'England', 'Croatia', 'Panama', 'Ghana',
    ])
    const tier4 = Array.from(worldCupTeams).filter(team => !allTierTeams.has(team)).sort()
    setTier4Options(tier4)
  }, [])

  const remainingTier1 = 2 - tier1Picks.length
  const remainingTier2 = 1 - tier2Picks.length
  const remainingTier3 = 1 - tier3Picks.length
  const remainingTier4 = 1 - tier4Picks.length
  const totalPicks = tier1Picks.length + tier2Picks.length + tier3Picks.length + tier4Picks.length
  const isComplete = totalPicks === 5

  function toggleTeam(team, tier) {
    if (tier === 1) {
      if (tier1Picks.includes(team)) {
        setTier1Picks(tier1Picks.filter(t => t !== team))
      } else if (remainingTier1 > 0) {
        setTier1Picks([...tier1Picks, team])
      }
    } else if (tier === 2) {
      if (tier2Picks.includes(team)) {
        setTier2Picks(tier2Picks.filter(t => t !== team))
      } else if (remainingTier2 > 0) {
        setTier2Picks([...tier2Picks, team])
      }
    } else if (tier === 3) {
      if (tier3Picks.includes(team)) {
        setTier3Picks(tier3Picks.filter(t => t !== team))
      } else if (remainingTier3 > 0) {
        setTier3Picks([...tier3Picks, team])
      }
    } else if (tier === 4) {
      if (tier4Picks.includes(team)) {
        setTier4Picks(tier4Picks.filter(t => t !== team))
      } else if (remainingTier4 > 0) {
        setTier4Picks([...tier4Picks, team])
      }
    }
  }

  async function handleConfirm() {
    if (!isComplete) return

    setLoading(true)
    setError('')

    const selectedTeams = [...tier1Picks, ...tier2Picks, ...tier3Picks, ...tier4Picks]

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ favorite_teams: selectedTeams })
        .eq('id', user.id)

      if (updateError) {
        setError('Failed to save teams. Please try again.')
        setLoading(false)
        return
      }

      onTeamsSelected(selectedTeams)
    } catch (err) {
      setError(err.message || 'An error occurred.')
      setLoading(false)
    }
  }

  function TierSection({ tier, teams, selected, remaining, title }) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-lg font-bold">{title}</h3>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            remaining === 0 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'
          }`}>
            {selected.length}/{tier}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {teams.map(team => (
            <button
              key={team}
              type="button"
              onClick={() => toggleTeam(team, tier)}
              disabled={!selected.includes(team) && remaining === 0}
              className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 font-medium text-sm ${
                selected.includes(team)
                  ? 'bg-white/20 border-white/60 text-white'
                  : !selected.includes(team) && remaining === 0
                  ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-white/5 border-white/20 text-white hover:border-white/40 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{FLAGS[team] || '⚽'}</span>
              <span className="truncate">{team}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
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

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-2">Pick Your Teams</h1>
          <p className="text-white/50 text-sm mb-8">
            Select 5 teams across different tiers to get started
          </p>

          <TierSection
            tier={2}
            teams={TIER_1}
            selected={tier1Picks}
            remaining={remainingTier1}
            title="Tier 1: Elite Teams"
          />

          <TierSection
            tier={1}
            teams={TIER_2}
            selected={tier2Picks}
            remaining={remainingTier2}
            title="Tier 2: Strong Teams"
          />

          <TierSection
            tier={1}
            teams={TIER_3}
            selected={tier3Picks}
            remaining={remainingTier3}
            title="Tier 3: Developing Teams"
          />

          <TierSection
            tier={1}
            teams={tier4Options}
            selected={tier4Picks}
            remaining={remainingTier4}
            title="Tier 4: Other Nations"
          />
        </div>
      </div>

      {/* Summary Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Selected Teams Summary */}
          {totalPicks > 0 && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <p className="text-white/50 text-xs uppercase font-bold tracking-wide mb-2">Selected Teams</p>
              <div className="flex flex-wrap gap-2">
                {[...tier1Picks, ...tier2Picks, ...tier3Picks, ...tier4Picks].map(team => (
                  <div
                    key={team}
                    className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm flex items-center gap-1"
                  >
                    <span>{FLAGS[team] || '⚽'}</span>
                    <span>{team}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-semibold">Progress</span>
              <span className="text-white/50 text-xs">{totalPicks}/5 teams</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-white/60 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(totalPicks / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isComplete || loading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
              isComplete && !loading
                ? 'bg-white/20 border border-white/40 hover:bg-white/30 cursor-pointer'
                : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            {loading ? 'Saving...' : `Confirm Teams (${totalPicks}/5)`}
          </button>
        </div>
      </div>
    </div>
  )
}
