import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import schedule from '../data/schedule'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'

function formatDate(dateStr) {
  var p = dateStr.split('-').map(Number)
  return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

export default function StartingXI({ user, username, onBack, onLogout, currentScreen, onPredict, onRanks }) {
  var today = new Date().toLocaleDateString('en-CA')

  var [view, setView] = useState('matches')
  var [userTeams, setUserTeams] = useState([])
  var [matches, setMatches] = useState([])
  var [loadingTeams, setLoadingTeams] = useState(true)

  var [activeMatch, setActiveMatch] = useState(null)
  var [activeTeam, setActiveTeam] = useState('')
  var [players, setPlayers] = useState([])
  var [loadingPlayers, setLoadingPlayers] = useState(false)
  var [selected, setSelected] = useState([])
  var [saving, setSaving] = useState(false)
  var [message, setMessage] = useState('')

  useEffect(function () {
    async function fetchTeams() {
      var res = await supabase
        .from('user_teams')
        .select('teams')
        .eq('user_id', user.id)
        .single()

      if (res.data && res.data.teams) {
        var teams = res.data.teams
        setUserTeams(teams)
        var filtered = schedule.filter(function (m) {
          return m.date >= today && (teams.includes(m.home) || teams.includes(m.away))
        })
        setMatches(filtered)
      }
      setLoadingTeams(false)
    }
    fetchTeams()
  }, [user.id])

  async function handleMatchClick(match) {
    var team = userTeams.includes(match.home) ? match.home : match.away
    setActiveMatch(match)
    setActiveTeam(team)
    setSelected([])
    setMessage('')
    setLoadingPlayers(true)
    setView('players')

    var res = await supabase
      .from('players')
      .select('name, position, shirt_number')
      .eq('team_name', team)
      .order('shirt_number', { ascending: true })

    setPlayers(res.data ?? [])
    setLoadingPlayers(false)
  }

  function togglePlayer(name) {
    if (selected.includes(name)) {
      setSelected(selected.filter(function (n) { return n !== name }))
    } else if (selected.length < 11) {
      setSelected([...selected, name])
    }
  }

  async function handleSubmit() {
    if (selected.length !== 11 || saving) return
    setSaving(true)
    setMessage('')
    try {
      var res = await supabase
        .from('starting_xi_predictions')
        .upsert(
          { user_id: user.id, match_id: String(activeMatch.id), players: selected },
          { onConflict: 'user_id,match_id' }
        )
      if (res.error) throw res.error
      setMessage('Prediction saved!')
      setTimeout(function () {
        setView('matches')
        setActiveMatch(null)
        setPlayers([])
        setSelected([])
        setMessage('')
      }, 1000)
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── PLAYER VIEW ─────────────────────────────────────────────────────
  if (view === 'players' && activeMatch) {
    return (
      <div className='min-h-screen pb-24' style={{ background: '#0a0e1a' }}>
        <PageHeader
          title={activeTeam + ' XI'}
          showBack
          onBack={function () { setView('matches') }}
          username={username}
          onLogout={onLogout}
        />

        <div className='px-4 py-3' style={{ borderBottom: '1px solid #1e2540' }}>
          <p className='eyebrow mb-1'>Group {activeMatch.group} · {formatDate(activeMatch.date)}</p>
          <p style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 14, color: '#fff' }}>
            {activeMatch.home} vs {activeMatch.away}
          </p>
          <p style={{ fontSize: 11, color: '#8b93ab', marginTop: 3 }}>
            Pick {activeTeam}'s starting 11
          </p>
        </div>

        <div className='px-4 py-2.5' style={{ borderBottom: '1px solid #1e2540' }}>
          <div className='flex items-center justify-between mb-1.5'>
            <span className='eyebrow'>Selected</span>
            <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 13, color: selected.length === 11 ? '#3ddc84' : '#c9a84c' }}>
              {selected.length} / 11
            </span>
          </div>
          <div className='h-1 rounded-full overflow-hidden' style={{ background: '#1e2540' }}>
            <div
              className='h-full rounded-full transition-all duration-200'
              style={{ width: (selected.length / 11 * 100) + '%', background: selected.length === 11 ? '#3ddc84' : '#c9a84c' }}
            />
          </div>
        </div>

        <div className='px-4 py-4 space-y-2 pb-32'>
          {loadingPlayers ? (
            <p style={{ color: '#6b7494' }}>Loading players…</p>
          ) : players.length === 0 ? (
            <p style={{ color: '#8b93ab', textAlign: 'center', paddingTop: 40 }}>No players found for {activeTeam}.</p>
          ) : (
            players.map(function (p) {
              var isSel = selected.includes(p.name)
              var isDisabled = !isSel && selected.length >= 11
              return (
                <button
                  key={p.name}
                  type='button'
                  disabled={isDisabled}
                  onClick={function () { togglePlayer(p.name) }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    background: isSel ? 'rgba(201,168,76,0.1)' : '#0d1224',
                    border: isSel ? '1px solid #c9a84c' : '1px solid #1e2540',
                    borderLeft: isSel ? '3px solid #c9a84c' : '3px solid #1e2540',
                    borderRadius: '0 6px 6px 0',
                    opacity: isDisabled ? 0.3 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {p.shirt_number != null && (
                    <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 12, color: isSel ? '#c9a84c' : '#6b7494', width: 20, textAlign: 'center', flexShrink: 0 }}>
                      {p.shirt_number}
                    </span>
                  )}
                  <span style={{ flex: 1, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 13, color: isSel ? '#c9a84c' : '#fff' }}>
                    {p.name}
                  </span>
                  {p.position && (
                    <span style={{ fontSize: 10, color: '#6b7494', flexShrink: 0 }}>{p.position}</span>
                  )}
                </button>
              )
            })
          )}
        </div>

        <div className='fixed bottom-0 left-0 right-0 px-4 py-4' style={{ background: '#0a0e1a', borderTop: '1px solid #1e2540' }}>
          {message && (
            <p style={{ textAlign: 'center', fontSize: 13, marginBottom: 8, color: message.startsWith('Error') ? '#e24b4a' : '#3ddc84' }}>
              {message}
            </p>
          )}
          <button
            type='button'
            className='btn-gold'
            disabled={selected.length !== 11 || saving}
            onClick={handleSubmit}
          >
            {saving ? 'Saving…' : 'Submit Prediction'}
          </button>
        </div>
      </div>
    )
  }

  // ── MATCH LIST VIEW ─────────────────────────────────────────────────
  return (
    <div className='min-h-screen pb-20' style={{ background: '#0a0e1a' }}>
      <PageHeader title='Starting XI' showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div className='px-4 pt-5'>
        {loadingTeams ? (
          <div className='flex items-center justify-center pt-20'>
            <p style={{ color: '#6b7494' }}>Loading…</p>
          </div>
        ) : userTeams.length === 0 ? (
          <div className='text-center pt-16'>
            <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, color: '#fff', marginBottom: 8 }}>NO TEAMS SELECTED</p>
            <p style={{ fontSize: 13, color: '#8b93ab' }}>Pick your 5 teams to unlock Starting XI.</p>
          </div>
        ) : matches.length === 0 ? (
          <div className='text-center pt-16'>
            <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, color: '#fff', marginBottom: 8 }}>NO UPCOMING MATCHES</p>
            <p style={{ fontSize: 13, color: '#8b93ab' }}>Your teams have no upcoming group stage matches.</p>
          </div>
        ) : (
          <div className='space-y-3'>
            <div className='flex items-center gap-2 mb-4'>
              <div style={{ width: 3, height: 18, background: '#c9a84c', borderRadius: 2 }} />
              <p className='eyebrow'>Upcoming Matches</p>
            </div>
            {matches.map(function (match) {
              return (
                <button
                  key={match.id}
                  type='button'
                  onClick={function () { handleMatchClick(match) }}
                  className='card-fifa w-full text-left'
                >
                  <p className='eyebrow mb-1'>Group {match.group} · {formatDate(match.date)}</p>
                  <p style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 14, color: '#fff' }}>
                    {match.home} vs {match.away}
                  </p>
                  <p style={{ fontSize: 11, color: '#8b93ab', marginTop: 3 }}>
                    Tap to pick your XI
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav
        currentScreen={currentScreen ?? 'starting-xi'}
        onHome={onBack}
        onPredict={onPredict ?? function () {}}
        onRanks={onRanks ?? function () {}}
      />
    </div>
  )
}
