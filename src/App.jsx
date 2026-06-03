import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import LoginScreen from './components/LoginScreen'
import SignUpScreen from './components/SignUpScreen'
import HomeScreen from './components/HomeScreen'
import GroupStage from './components/GroupStage'
import KnockoutScreen from './components/KnockoutScreen'
import PredictionsFeed from './components/PredictionsFeed'
import TeamSelectionScreen from './components/TeamSelectionScreen'

export default function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [authScreen, setAuthScreen] = useState('login')
  const [screen, setScreen] = useState('home')
  const [groupPicks, setGroupPicks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [needsTeamSelection, setNeedsTeamSelection] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        // Fetch username and favorite_teams from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, favorite_teams')
          .eq('id', session.user.id)
          .single()
        
        if (profile?.username) {
          setUsername(profile.username)
        }

        // Check if user has selected teams
        if (!profile?.favorite_teams || profile.favorite_teams.length === 0) {
          setNeedsTeamSelection(true)
          setScreen('team-selection')
        } else {
          setScreen('home')
        }
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
            .select('username, favorite_teams')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile?.username) {
                setUsername(profile.username)
              }
              if (!profile?.favorite_teams || profile.favorite_teams.length === 0) {
                setNeedsTeamSelection(true)
                setScreen('team-selection')
              } else {
                setScreen('home')
              }
            })
        } else {
          setUser(null)
          setUsername('')
          setScreen('home')
          setNeedsTeamSelection(false)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  async function handleLoginSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
    if (authUser?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, favorite_teams')
        .eq('id', authUser.id)
        .single()

      if (profile?.username) {
        setUsername(profile.username)
      }

      // Check if user has selected teams
      if (!profile?.favorite_teams || profile.favorite_teams.length === 0) {
        setNeedsTeamSelection(true)
        setScreen('team-selection')
      } else {
        setScreen('home')
      }
    }
  }

  async function handleSignUpSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
    if (authUser?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, favorite_teams')
        .eq('id', authUser.id)
        .single()

      if (profile?.username) {
        setUsername(profile.username)
      }

      // New user needs to select teams
      setNeedsTeamSelection(true)
      setScreen('team-selection')
    }
  }

  function handleTeamsSelected(selectedTeams) {
    setNeedsTeamSelection(false)
    setScreen('home')
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

  if (screen === 'team-selection') {
    return <TeamSelectionScreen user={user} onTeamsSelected={handleTeamsSelected} onLogout={handleLogout} />
  }

  return <HomeScreen username={username} onPlay={handlePlay} onLogout={handleLogout} onViewPredictions={handleViewPredictions} />
}
