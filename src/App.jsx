import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import LoginScreen from './components/LoginScreen'
import SignUpScreen from './components/SignUpScreen'
import NicknameScreen from './components/NicknameScreen'
import GroupStage from './components/GroupStage'
import KnockoutScreen from './components/KnockoutScreen'
import PredictionsFeed from './components/PredictionsFeed'

export default function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [authScreen, setAuthScreen] = useState('login')
  const [screen, setScreen] = useState('nickname')
  const [nickname, setNickname] = useState('')
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
          setNickname(profile.username)
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
                setNickname(profile.username)
              }
            })
        } else {
          setUser(null)
          setUsername('')
          setScreen('nickname')
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  function handleLoginSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
  }

  function handleSignUpSuccess(authUser) {
    setUser(authUser)
    setAuthScreen('login')
  }

  function handleNicknameSubmit(name) {
    setNickname(name)
    setScreen('groups')
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
    setNickname('')
    setScreen('nickname')
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
    return <PredictionsFeed nickname={nickname} onLogout={handleLogout} />
  }

  if (screen === 'knockout') {
    return (
      <KnockoutScreen
        nickname={nickname}
        groupPicks={groupPicks}
        onSubmit={handleKnockoutSubmit}
      />
    )
  }

  if (screen === 'groups') {
    return <GroupStage nickname={nickname} onNext={handleGroupsNext} />
  }

  return <NicknameScreen onSubmit={handleNicknameSubmit} onViewFeed={() => setScreen('feed')} />
}
