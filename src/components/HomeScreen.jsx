export default function HomeScreen({ username, onPlay, onLogout }) {
  const initials = username
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-lg">iknowball</span>
        <button
          type="button"
          onClick={onLogout}
          className="text-white/70 text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10"
        >
          Logout
        </button>
      </div>

      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
            {initials || 'IK'}
          </div>
          <div>
            <p className="text-white/40 text-sm">Welcome back,</p>
            <p className="text-white text-2xl font-bold mt-1">{username}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-xl font-bold">Games</h2>
            <span className="text-white/40 text-sm">1 available</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
            <div>
              <p className="text-white text-lg font-bold">World Cup Predictor</p>
              <p className="text-white/50 text-sm mt-2">
                Pick your group standings, knockout winners and champion
              </p>
            </div>
            <button
              type="button"
              onClick={onPlay}
              className="w-full bg-white text-black font-bold rounded-2xl py-3 active:scale-95 transition-transform"
            >
              Play
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-xl font-bold">Leaderboard</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 text-white/50">
            Leaderboard coming soon
          </div>
        </div>
      </div>
    </div>
  )
}
