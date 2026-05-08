import { useState } from 'react'

export default function NicknameScreen({ onSubmit }) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nickname.trim()
    if (!trimmed) {
      setError('Enter a nickname to continue.')
      return
    }
    setError('')
    onSubmit(trimmed)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <p className="text-white text-2xl font-bold tracking-tight mb-16">iknowball</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-3xl font-bold text-center mb-2">
          What do your friends call you?
        </h1>

        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            if (error) setError('')
          }}
          placeholder="Your nickname"
          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-white/60"
          autoFocus
          maxLength={30}
        />

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-white text-black font-bold text-lg rounded-xl py-3 mt-2 active:scale-95 transition-transform"
        >
          Let's go
        </button>
      </form>
    </div>
  )
}
