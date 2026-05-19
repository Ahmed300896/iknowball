import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SignUpScreen({ onSignUpSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    if (!password.trim()) {
      setError('Password is required.')
      return
    }
    if (!username.trim()) {
      setError('Username is required.')
      return
    }
    if (username.trim().length > 30) {
      setError('Username must be 30 characters or less.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (signUpError) {
        setError(signUpError.message || 'Sign up failed.')
        setLoading(false)
        return
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username.trim(),
            created_at: new Date().toISOString(),
          })

        if (profileError) {
          setError('Failed to save profile. Please try again.')
          setLoading(false)
          return
        }

        onSignUpSuccess(data.user)
      }
    } catch (err) {
      setError(err.message || 'An error occurred.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <p className="text-white text-2xl font-bold tracking-tight mb-16">iknowball</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-3xl font-bold text-center mb-6">
          Create account
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          placeholder="Email"
          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-white/60"
          autoFocus
          disabled={loading}
        />

        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            if (error) setError('')
          }}
          placeholder="Username"
          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-white/60"
          maxLength={30}
          disabled={loading}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            placeholder="Password"
            className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 pr-12 text-lg focus:outline-none focus:border-white/60"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 text-sm font-semibold"
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold text-lg rounded-xl py-3 mt-2 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-white/20"></div>
          <p className="text-white/60 text-sm">or</p>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={loading}
          className="w-full bg-white/10 text-white font-bold text-lg rounded-xl py-3 border border-white/20 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
        >
          Log in
        </button>
      </form>
    </div>
  )
}
