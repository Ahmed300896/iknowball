import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginScreen({ onLoginSuccess, onSwitchToSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    setLoading(true)
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (loginError) {
        setError(loginError.message || 'Login failed. Please check your credentials.')
        setLoading(false)
        return
      }

      if (data.user) {
        onLoginSuccess(data.user)
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
          Log in
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
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (error) setError('')
          }}
          placeholder="Password"
          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-white/60"
          disabled={loading}
        />

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold text-lg rounded-xl py-3 mt-2 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-white/20"></div>
          <p className="text-white/60 text-sm">or</p>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <button
          type="button"
          onClick={onSwitchToSignUp}
          disabled={loading}
          className="w-full bg-white/10 text-white font-bold text-lg rounded-xl py-3 border border-white/20 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
        >
          Sign up
        </button>
      </form>
    </div>
  )
}
