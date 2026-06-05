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

    if (!email.trim()) { setError('Email is required.'); return }
    if (!password.trim()) { setError('Password is required.'); return }
    if (!username.trim()) { setError('Username is required.'); return }
    if (username.trim().length > 30) { setError('Username must be 30 characters or less.'); return }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password })
      if (signUpError) { setError(signUpError.message || 'Sign up failed.'); setLoading(false); return }
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, username: username.trim(), created_at: new Date().toISOString() })
        if (profileError) { setError('Failed to save profile. Please try again.'); setLoading(false); return }
        onSignUpSuccess(data.user)
      }
    } catch (err) {
      setError(err.message || 'An error occurred.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#0a0e1a' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: '#c9a84c' }} />

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
          type="text"
          value={username}
          onChange={e => { setUsername(e.target.value); if (error) setError('') }}
          placeholder="Username"
          maxLength={30}
          disabled={loading}
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); if (error) setError('') }}
            placeholder="Password"
            style={{ paddingRight: 52 }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
            style={{ color: '#c9a84c' }}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {error && <p className="text-sm text-center" style={{ color: '#e24b4a' }}>{error}</p>}

        <button type="submit" className="btn-gold" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: '#1e2540' }} />
          <span className="text-xs" style={{ color: '#6b7494' }}>OR</span>
          <div className="flex-1 h-px" style={{ background: '#1e2540' }} />
        </div>

        <button type="button" className="btn-outline" onClick={onSwitchToLogin} disabled={loading}>
          Log in
        </button>
      </form>
    </div>
  )
}
