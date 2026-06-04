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

export default function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [authScreen, setAuthScreen] = useState('login')
  const [screen, setScreen] = useState('home')
  const [groupPicks, setGroupPicks] = useState(null)
  const [loading, setLoading] = useState(true)

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

  function handlePlay() {
    setScreen('groups')
  }

  function handleBackHome() {
    setScreen('home')
  }

  function handleViewPredictions() {
    setScreen('feed')
  }

  function handleGroupsNext(picks) {
    setGroupPicks(picks)
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

  if (screen === 'leaderboard') {
    return <LeaderboardScreen user={user} onBack={handleBackHome} onLogout={handleLogout} />
  }

  if (screen === 'admin') {
    return <AdminScreen onBack={handleBackHome} onLogout={handleLogout} />
  }

  if (screen === 'score-predictor') {
    return <ScorePredictor user={user} username={username} onBack={handleBackHome} onLogout={handleLogout} />
  }

  if (screen === 'feed') {
    return <PredictionsFeed username={username} onLogout={handleLogout} onHome={handleBackHome} />
  }

  if (screen === 'knockout') {
    return (
      <KnockoutScreen
        username={username}
        groupPicks={groupPicks}
        onSubmit={handleKnockoutSubmit}
        onBack={handleBackHome}
        onViewPredictions={handleViewPredictions}
        onHome={handleBackHome}
      />
    )
  }

  if (screen === 'groups') {
    return <GroupStage username={username} onNext={handleGroupsNext} onBack={handleBackHome} onHome={handleBackHome} />
  }

  return <HomeScreen user={user} username={username} onPlay={handlePlay} onLogout={handleLogout} onViewPredictions={handleViewPredictions} onAdmin={() => setScreen('admin')} onScorePredictor={() => setScreen('score-predictor')} onLeaderboard={() => setScreen('leaderboard')} />
}
