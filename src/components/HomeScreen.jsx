import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import TeamSelectionScreen from './TeamSelectionScreen'
import HowToPlay from './HowToPlay'
import BottomNav from './BottomNav'
import PageHeader from './PageHeader'

const ADMIN_ID = '0d3be115-d531-4146-9256-120dc7d047bc'
const WC_START = '2026-06-11'

function daysUntil(dateStr) {
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="2" y="5" width="8" height="6" rx="1" stroke="#6b7494" strokeWidth="1.2"/>
      <path d="M4 5V3.5C4 2.4 4.9 1.5 6 1.5C7.1 1.5 8 2.4 8 3.5V5" stroke="#6b7494" strokeWidth="1.2"/>
    </svg>
  )
}

function ScorePredictorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#c9a84c" strokeWidth="1.5"/>
      <path d="M7 10L9 12L13 8" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Starting11Icon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="2.5" stroke="#c9a84c" strokeWidth="1.5"/>
      <path d="M5 17C5 14.5 7.2 12.5 10 12.5C12.8 12.5 15 14.5 15 17" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="3" x2="14" y2="9" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function FantasyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L11.8 7.2H17.3L12.7 10.5L14.6 15.7L10 12.4L5.4 15.7L7.3 10.5L2.7 7.2H8.2L10 2Z"
        stroke="#6b7494" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 3H14V10C14 12.2 12.2 14 10 14C7.8 14 6 12.2 6 10V3Z" stroke="#c9a84c" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6 5H3.5C3.5 5 3 8.5 6 9.5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 5H16.5C16.5 5 17 8.5 14 9.5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 14V17" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 17H13" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function HomeScreen({
  user, username, onPlay, onLogout, onViewPredictions,
  onAdmin, onScorePredictor, onLeaderboard, onStartingXI, onChampionPick, onHowToPlay,
  currentScreen, onPredict, onRanks,
}) {
  const [showTeamSelection, setShowTeamSelection] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  const daysLeft = daysUntil(WC_START)
  const tournamentLive = daysLeft <= 0
  const isAdmin = user?.id === ADMIN_ID

  useEffect(() => {
    // ensure user id tracking, no-op
  }, [user?.id])

  function handleTeamsSelected() {
    setShowTeamSelection(false)
  }

  if (showTeamSelection) {
    return (
      <TeamSelectionScreen
        user={user}
        username={username}
        onTeamsSelected={handleTeamsSelected}
        onLogout={onLogout}
        onBack={() => setShowTeamSelection(false)}
      />
    )
  }

  if (showHowToPlay) {
    return <HowToPlay onBack={() => setShowHowToPlay(false)} onLogout={onLogout} />
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0e1a' }}>
      <PageHeader title="iKnowBall" username={username} onLogout={onLogout} />

      {/* How to Play — top of page */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "10px 16px", borderBottom: "1px solid #1e2540" }}>
        <button
          type="button"
          onClick={onHowToPlay}
          style={{ background: "none", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 4, cursor: "pointer", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#c9a84c", padding: "5px 10px", textTransform: "uppercase" }}
        >
          ? How to Play
        </button>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Welcome block */}
        <div>
          <p className="eyebrow mb-1">Welcome back</p>
          <h2 className="text-3xl text-white" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
            {username}
          </h2>
        </div>

        {/* Countdown card */}
        <div
          className="flex items-center gap-4 rounded-lg overflow-hidden"
          style={{ background: '#0d1224', border: '1px solid #1e2540', padding: '16px' }}
        >
          {tournamentLive ? (
            <div className="flex-1">
              <p className="eyebrow">Status</p>
              <p className="text-2xl mt-1" style={{ fontFamily: 'Oswald, sans-serif', color: '#c9a84c', fontWeight: 700 }}>
                LIVE NOW
              </p>
            </div>
          ) : (
            <>
              <div className="text-center shrink-0">
                <p className="text-5xl tabular-nums" style={{ fontFamily: 'Oswald, sans-serif', color: '#c9a84c', fontWeight: 700, lineHeight: 1 }}>
                  {daysLeft}
                </p>
                <p className="eyebrow mt-1">DAYS</p>
              </div>
              <div className="w-px self-stretch" style={{ background: '#1e2540' }} />
              <div>
                <p className="eyebrow">Kickoff</p>
                <p className="text-base text-white mt-0.5" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}>
                  World Cup 2026
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#6b7494' }}>Jun 11</p>
              </div>
            </>
          )}
        </div>

        {/* Games section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 3, height: 18, background: '#c9a84c', borderRadius: 2 }} />
            <p className="eyebrow">Games</p>
          </div>

          <div className="space-y-2">
            {/* Score Predictor — ACTIVE */}
            <button
              type="button"
              onClick={onScorePredictor}
              className="card-fifa w-full text-left flex items-center gap-3"
            >
              <div
                className="flex items-center justify-center rounded shrink-0"
                style={{ width: 38, height: 38, background: '#141b30' }}
              >
                <ScorePredictorIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}>
                  SCORE PREDICTOR
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8b93ab' }}>Predict today's results</p>
              </div>
              <span
                className="shrink-0 px-2 py-1 rounded text-xs"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.08em', background: '#c9a84c', color: '#0a0e1a' }}
              >
                PLAY
              </span>
            </button>

            {/* Starting XI — ACTIVE */}
            <button
              type="button"
              onClick={onStartingXI}
              className="card-fifa w-full text-left flex items-center gap-3"
            >
              <div className="flex items-center justify-center rounded shrink-0" style={{ width: 38, height: 38, background: '#141b30' }}>
                <Starting11Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}>
                  STARTING XI
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8b93ab' }}>Pick the lineups</p>
              </div>
              <span
                className="shrink-0 px-2 py-1 rounded text-xs"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.08em', background: '#c9a84c', color: '#0a0e1a' }}
              >
                PLAY
              </span>
            </button>

            {/* Fantasy XI — LOCKED */}
            <div
              className="w-full flex items-center gap-3"
              style={{ background: '#0d1224', border: '1px solid #1e2540', borderLeft: '3px solid #2a3354', borderRadius: '0 6px 6px 0', padding: '14px 16px', opacity: 0.7 }}
            >
              <div className="flex items-center justify-center rounded shrink-0" style={{ width: 38, height: 38, background: '#141b30' }}>
                <FantasyIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}>
                  FANTASY XI
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8b93ab' }}>Build your squad</p>
              </div>
              <span
                className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.08em', border: '1px solid #2a3354', color: '#6b7494' }}
              >
                <LockIcon /> SOON
              </span>
            </div>

            {/* Champion Pick — ACTIVE */}
            <button
              type="button"
              onClick={onChampionPick}
              className="card-fifa w-full text-left flex items-center gap-3"
            >
              <div className="flex items-center justify-center rounded shrink-0" style={{ width: 38, height: 38, background: '#141b30' }}>
                <TrophyIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}>
                  CHAMPION PICK
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8b93ab' }}>Pick your World Cup winner</p>
              </div>
              <span
                className="shrink-0 px-2 py-1 rounded text-xs"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, letterSpacing: '0.08em', background: '#c9a84c', color: '#0a0e1a' }}
              >
                PLAY
              </span>
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <button type="button" className="btn-outline" onClick={onLeaderboard}>
          View Leaderboard
        </button>

        {/* Admin link — admin only */}
        {isAdmin && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={onAdmin}
              className="text-xs"
              style={{ color: '#c9a84c', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.1em', opacity: 0.6 }}
            >
              ADMIN
            </button>
          </div>
        )}
      </div>

      <BottomNav
        currentScreen={currentScreen ?? 'home'}
        onHome={() => {}}
        onPredict={onPredict ?? onScorePredictor}
        onRanks={onRanks ?? onLeaderboard}
      />
    </div>
  )
}
