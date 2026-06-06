import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { FLAGS } from '../data/teams'
import matches from '../data/schedule'
import { calculateAndSaveUserPoints } from '../lib/resultsHelper'

// teams.js uses "USA" but schedule.js uses "United States"
const SCHEDULE_NAME = {
  'USA': 'United States',
}

const TEAMS = Object.keys(FLAGS)

export default function AdminScreen({ onBack, onLogout }) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    home_team: '',
    away_team: '',
    home_score: '',
    away_score: '',
    stage: 'group',
    match_date: ''
  })

  function handlePasswordSubmit(e) {
    e.preventDefault()
    if (password === 'iknowball2026admin') {
      setIsAuthenticated(true)
      setPassword('')
      fetchResults()
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  async function fetchResults() {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('results')
        .select('*')
        .order('match_date', { ascending: false })

      if (fetchError) throw fetchError
      setResults(data || [])
    } catch (err) {
      console.error('Error fetching results:', err)
      setError('Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.home_team || !formData.away_team || formData.home_score === '' || formData.away_score === '' || !formData.match_date) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const { error: insertError } = await supabase
        .from('results')
        .insert([
          {
            home_team: formData.home_team,
            away_team: formData.away_team,
            home_score: parseInt(formData.home_score),
            away_score: parseInt(formData.away_score),
            stage: formData.stage,
            match_date: formData.match_date
          }
        ])

      if (insertError) throw insertError

      // Find the matching match in schedule.js and calculate points for all users
      var scheduleName = function(name) { return SCHEDULE_NAME[name] || name }
      var scheduleHome = scheduleName(formData.home_team)
      var scheduleAway = scheduleName(formData.away_team)
      var match = matches.find(function(m) {
        return m.home === scheduleHome && m.away === scheduleAway
      })

      if (match) {
        await calculateAndSaveUserPoints(match.id)
      }

      setFormData({
        home_team: '',
        away_team: '',
        home_score: '',
        away_score: '',
        stage: 'group',
        match_date: ''
      })
      setSuccess('Result saved and points calculated for all users!')
      await fetchResults()
    } catch (err) {
      console.error('Error saving result:', err)
      setError('Failed to save result: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Password screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
            <h1 className="text-white text-2xl font-bold mb-2">Admin Access</h1>
            <p className="text-white/50 text-sm mb-6">Enter password to continue</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
              
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-white text-black font-bold rounded-lg py-2.5 active:scale-95 transition-transform"
              >
                Enter
              </button>
            </form>

            <button
              type="button"
              onClick={onBack}
              className="w-full mt-3 text-white/50 font-semibold px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-white font-bold text-lg">Admin Panel</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(false)
              setResults([])
            }}
            className="text-white/70 text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10"
          >
            Logout Admin
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

      <div className="px-4 py-6 pb-20 space-y-6 max-w-2xl mx-auto">
        {/* Form Section */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <h2 className="text-white text-xl font-bold mb-4">Enter Match Result</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-sm font-semibold mb-1 block">Home Team</label>
                <select
                  name="home_team"
                  value={formData.home_team}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="">Select</option>
                  {TEAMS.map(team => (
                    <option key={team} value={team}>{FLAGS[team]} {team}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/50 text-sm font-semibold mb-1 block">Away Team</label>
                <select
                  name="away_team"
                  value={formData.away_team}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="">Select</option>
                  {TEAMS.map(team => (
                    <option key={team} value={team}>{FLAGS[team]} {team}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-sm font-semibold mb-1 block">Home Score</label>
                <input
                  type="number"
                  name="home_score"
                  min="0"
                  value={formData.home_score}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="text-white/50 text-sm font-semibold mb-1 block">Away Score</label>
                <input
                  type="number"
                  name="away_score"
                  min="0"
                  value={formData.away_score}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-sm font-semibold mb-1 block">Stage</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="group">Group</option>
                  <option value="r32">Round of 32</option>
                  <option value="r16">Round of 16</option>
                  <option value="qf">Quarter-Finals</option>
                  <option value="sf">Semi-Finals</option>
                  <option value="final">Final</option>
                </select>
              </div>

              <div>
                <label className="text-white/50 text-sm font-semibold mb-1 block">Match Date</label>
                <input
                  type="date"
                  name="match_date"
                  value={formData.match_date}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold rounded-lg py-2.5 active:scale-95 transition-transform disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Result'}
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <h2 className="text-white text-xl font-bold mb-4">Results</h2>
          
          {loading && <p className="text-white/50 text-sm">Loading...</p>}
          
          {results.length === 0 ? (
            <p className="text-white/50 text-sm">No results entered yet</p>
          ) : (
            <div className="space-y-2">
              {results.map(result => (
                <div key={result.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{FLAGS[result.home_team] || '⚽'}</span>
                    <span className="text-white font-semibold text-sm">{result.home_team}</span>
                    <span className="text-white font-bold">{result.home_score}</span>
                    <span className="text-white/40">-</span>
                    <span className="text-white font-bold">{result.away_score}</span>
                    <span className="text-white font-semibold text-sm">{result.away_team}</span>
                    <span className="text-lg">{FLAGS[result.away_team] || '⚽'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">{result.stage.toUpperCase()}</span>
                    <span className="text-white/40 text-xs">{result.match_date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-white/50 font-semibold px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
