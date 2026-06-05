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

    if (!email.trim()) { setError('Email is required.'); return }
    if (!password.trim()) { setError('Password is required.'); return }

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
      if (data.user) onLoginSuccess(data.user)
    } catch (err) {
      setError(err.message || 'An error occurred.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#0a0e1a' }}>
      {/* Gold top line */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: '#c9a84c' }} />

      {/* Wordmark */}
      <div className="mb-2 text-center">
        <span
          className="text-4xl"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.04em', color: '#fff' }}
        >
          iknow<span style={{ color: '#c9a84c' }}>ball</span>
        </span>
      </div>
      <p className="eyebrow mb-10">FIFA WORLD CUP 2026</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); if (error) setError('') }}
          placeholder="Email address"
          autoFocus
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); if (error) setError('') }}
          placeholder="Password"
          disabled={loading}
        />

        {error && <p className="text-sm text-center" style={{ color: '#e24b4a' }}>{error}</p>}

        <button type="submit" className="btn-gold" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: '#1e2540' }} />
          <span className="text-xs" style={{ color: '#6b7494' }}>OR</span>
          <div className="flex-1 h-px" style={{ background: '#1e2540' }} />
        </div>

        <button type="button" className="btn-outline" onClick={onSwitchToSignUp} disabled={loading}>
          Create account
        </button>
      </form>
    </div>
  )
}
