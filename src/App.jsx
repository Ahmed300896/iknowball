import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import LoginScreen from './components/LoginScreen'
import SignUpScreen from './components/SignUpScreen'
import GroupStage from './components/GroupStage'
import KnockoutScreen from './components/KnockoutScreen'
import PredictionsFeed from './components/PredictionsFeed'

export default function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [authScreen, setAuthScreen] = useState('login')
  const [screen, setScreen] = useState('groups')
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
        } else {
          setUser(null)
          setUsername('')
          setScreen('groups')
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  async function loadUsername(userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()

    if (profile?.username) {
      setUsername(profile.username)
    }
  }

  async function handleLoginSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
    if (authUser?.id) {
      await loadUsername(authUser.id)
    }
  }

  async function handleSignUpSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
    if (authUser?.id) {
      await loadUsername(authUser.id)
    }
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
    setScreen('groups')
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
    return <PredictionsFeed username={username} onLogout={handleLogout} />
  }

  if (screen === 'knockout') {
    return (
      <KnockoutScreen
        username={username}
        groupPicks={groupPicks}
        onSubmit={handleKnockoutSubmit}
        onLogout={handleLogout}
      />
    )
  }

  return <GroupStage username={username} onNext={handleGroupsNext} onLogout={handleLogout} />
}
