import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import LoginScreen from './components/LoginScreen'
import SignUpScreen from './components/SignUpScreen'
import HomeScreen from './components/HomeScreen'
import GroupStage from './components/GroupStage'
import KnockoutScreen from './components/KnockoutScreen'
import PredictionsFeed from './components/PredictionsFeed'
import AdminScreen from './components/AdminScreen'
import ScorePredictor from './components/ScorePredictor'
import LeaderboardScreen from './components/LeaderboardScreen'
import AdminResultsScreen from './components/AdminResultsScreen'
import Admin from './pages/Admin'
import StartingXI from './pages/StartingXI'
import HowToPlay from './components/HowToPlay'
import ThirdPlacePicker from './components/ThirdPlacePicker'
import TeamSelectionScreen from './components/TeamSelectionScreen'
import { FLAGS } from './data/teams'

export default function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [authScreen, setAuthScreen] = useState('login')
  const [screen, setScreen] = useState('home')
  const [groupPicks, setGroupPicks] = useState(null)
  const [thirdPlacePicks, setThirdPlacePicks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wcChampion, setWcChampion] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        // Fetch username from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()
        
        if (profile?.username) {
          setUsername(profile.username)
        }
        setScreen('home')
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
          supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile?.username) {
                setUsername(profile.username)
              }
            })
          setScreen('home')
        } else {
          setUser(null)
          setUsername('')
          setScreen('home')
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  async function handleLoginSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
    setScreen('home')
    if (authUser?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', authUser.id)
        .single()

      if (profile?.username) {
        setUsername(profile.username)
      }
    }
  }

  async function handleSignUpSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
    setScreen('home')
    if (authUser?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', authUser.id)
        .single()

      if (profile?.username) {
        setUsername(profile.username)
      }
    }
  }

  async function handleWorldCupPredictor() {
    var { data } = await supabase.from("predictions").select("id, champion").eq("user_id", user.id).single()
    if (data) {
      setWcChampion(data.champion || null)
      setScreen("wc-already-submitted")
    } else {
      setScreen("groups")
    }
  }

  function handlePlay() {
    handleWorldCupPredictor()
  }

  function handleBackHome() {
    setScreen('home')
  }

  function handleViewPredictions() {
    setScreen('feed')
  }

  function handleGroupsNext(picks) {
    setGroupPicks(picks)
    setScreen('third-place')
  }

  function handleThirdPlaceConfirm(picks) {
    setThirdPlacePicks(picks)
    setScreen('knockout')
  }

  function handleKnockoutSubmit() {
    setScreen('feed')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setUsername('')
    setGroupPicks(null)
    setScreen('home')
    setAuthScreen('login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!user) {
    if (authScreen === 'signup') {
      return (
        <SignUpScreen
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={() => setAuthScreen('login')}
        />
      )
    }
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignUp={() => setAuthScreen('signup')}
      />
    )
  }

  if (screen === 'team-selection') {
    return <TeamSelectionScreen user={user} username={username} onTeamsSelected={() => setScreen('starting-xi')} onLogout={handleLogout} onBack={handleBackHome} />
  }

  if (screen === 'starting-xi') {
    return <StartingXI user={user} username={username} onBack={handleBackHome} onLogout={handleLogout} onTeamSelect={() => setScreen('team-selection')} currentScreen="starting-xi" onPredict={() => setScreen('score-predictor')} onRanks={() => setScreen('leaderboard')} />
  }

  if (screen === 'how-to-play') {
    return <HowToPlay onBack={handleBackHome} onLogout={handleLogout} username={username} />
  }

  if (screen === 'admin-panel') {
    return <Admin user={user} username={username} onBack={handleBackHome} onLogout={handleLogout} />
  }

  if (screen === 'leaderboard') {
    return <LeaderboardScreen user={user} username={username} onBack={handleBackHome} onLogout={handleLogout} currentScreen="leaderboard" onPredict={() => setScreen('score-predictor')} onRanks={() => setScreen('leaderboard')} />
  }

  if (screen === 'admin-results') {
    return <AdminResultsScreen user={user} username={username} onBack={handleBackHome} onLogout={handleLogout} />
  }

  if (screen === 'admin') {
    return <AdminScreen onBack={handleBackHome} onLogout={handleLogout} />
  }

  if (screen === 'score-predictor') {
    return <ScorePredictor user={user} username={username} onBack={handleBackHome} onLogout={handleLogout} currentScreen="score-predictor" onPredict={() => setScreen('score-predictor')} onRanks={() => setScreen('leaderboard')} />
  }

  if (screen === 'feed') {
    return <PredictionsFeed username={username} onLogout={handleLogout} onHome={handleBackHome} />
  }

  if (screen === 'third-place') {
    return (
      <ThirdPlacePicker
        groupPicks={groupPicks}
        onConfirm={handleThirdPlaceConfirm}
        onBack={() => setScreen('groups')}
        username={username}
        onLogout={handleLogout}
      />
    )
  }

  if (screen === 'knockout') {
    return (
      <KnockoutScreen
        username={username}
        user={user}
        groupPicks={groupPicks}
        thirdPlacePicks={thirdPlacePicks}
        onSubmit={handleKnockoutSubmit}
        onBack={() => setScreen('third-place')}
        onViewPredictions={handleViewPredictions}
        onHome={handleBackHome}
      />
    )
  }

  if (screen === "wc-already-submitted") {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "320px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ color: "#c9a84c", fontFamily: "Oswald, sans-serif", fontSize: "24px", marginBottom: "12px" }}>Your Pick Is Locked In!</h2>
          <p style={{ color: "#8b93ab", fontSize: "14px", marginBottom: wcChampion ? "20px" : "32px" }}>You have already submitted your World Cup Predictor. Come back after the group stage to see how you did.</p>
          {wcChampion && (
            <div style={{ background: "#141b30", border: "1px solid #2a3354", borderRadius: "8px", padding: "16px", marginBottom: "32px" }}>
              <p style={{ color: "#6b7494", fontFamily: "Oswald, sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>Your Champion Pick</p>
              <div style={{ fontSize: "36px", marginBottom: "6px" }}>{FLAGS[wcChampion] || "⚽"}</div>
              <p style={{ color: "#c9a84c", fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "0.06em" }}>{wcChampion}</p>
            </div>
          )}
          <button onClick={() => setScreen("home")} style={{ background: "#c9a84c", color: "#0d1117", border: "none", borderRadius: "8px", padding: "14px 32px", fontFamily: "Oswald, sans-serif", fontSize: "16px", cursor: "pointer", width: "100%" }}>BACK TO HOME</button>
        </div>
      </div>
    )
  }

  if (screen === 'groups') {
    return <GroupStage username={username} onNext={handleGroupsNext} onBack={handleBackHome} onHome={handleBackHome} />
  }

  return <HomeScreen user={user} username={username} onPlay={handlePlay} onLogout={handleLogout} onViewPredictions={handleViewPredictions} onAdmin={() => setScreen('admin-panel')} onScorePredictor={() => setScreen('score-predictor')} onLeaderboard={() => setScreen('leaderboard')} onStartingXI={() => setScreen('starting-xi')} onWorldCupPredictor={handleWorldCupPredictor} onHowToPlay={() => setScreen('how-to-play')} currentScreen="home" onPredict={() => setScreen('score-predictor')} onRanks={() => setScreen('leaderboard')} />
}
