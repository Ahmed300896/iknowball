export default function HowToPlay({ onBack, onLogout }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-white font-bold text-lg hover:opacity-70"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="text-white/70 text-sm font-semibold px-3 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-20 space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">How to Play</h1>
          <p className="text-white/50 text-sm">Master all 4 games and climb the leaderboard</p>
        </div>

        {/* Game 1 */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <h2 className="text-white text-xl font-bold mb-3">Game 1: World Cup Predictor</h2>
          <p className="text-white/70 text-sm mb-4">
            Predict group stage standings and knockout match winners, then pick your champion.
          </p>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-white font-semibold mb-1">Group Stage:</p>
              <ul className="text-white/60 space-y-1 ml-2">
                <li>• Correct qualifier (1st or 2nd): <span className="text-white font-bold">2 pts</span></li>
                <li>• Correct position bonus: <span className="text-white font-bold">1 pt</span></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Knockout Rounds:</p>
              <ul className="text-white/60 space-y-1 ml-2">
                <li>• Round of 32: <span className="text-white font-bold">2 pts</span></li>
                <li>• Round of 16: <span className="text-white font-bold">4 pts</span></li>
                <li>• Quarter-finals: <span className="text-white font-bold">8 pts</span></li>
                <li>• Semi-finals: <span className="text-white font-bold">15 pts</span></li>
                <li>• Final: <span className="text-white font-bold">25 pts</span></li>
                <li>• Champion bonus: <span className="text-white font-bold">50 pts</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Game 2 */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <h2 className="text-white text-xl font-bold mb-3">Game 2: Starting 11</h2>
          <p className="text-white/70 text-sm mb-4">
            Predict the starting lineup before each match for your 5 selected teams. Get 7+ out of 11 correct to earn points.
          </p>
          <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-3">
            <p className="text-white/80 text-sm">
              <span className="font-bold">All or Nothing:</span> You must get 7 or more correct to earn any points for that match. Get 6 or less = 0 points.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Points per correct prediction:</p>
            <ul className="text-white/60 space-y-1 ml-2">
              <li>• Group stage: <span className="text-white font-bold">10 pts</span></li>
              <li>• Round of 32: <span className="text-white font-bold">20 pts</span></li>
              <li>• Round of 16: <span className="text-white font-bold">35 pts</span></li>
              <li>• Quarter-finals: <span className="text-white font-bold">50 pts</span></li>
              <li>• Semi-finals: <span className="text-white font-bold">75 pts</span></li>
              <li>• Final: <span className="text-white font-bold">100 pts</span></li>
            </ul>
          </div>
        </div>

        {/* Game 3 */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <h2 className="text-white text-xl font-bold mb-3">Game 3: Score Predictor</h2>
          <p className="text-white/70 text-sm mb-4">
            Predict the exact scoreline for every World Cup match. Precision is rewarded.
          </p>
          <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-3">
            <p className="text-white/80 text-sm">
              <span className="font-bold">Exact Match Only:</span> You must predict the exact final score (including extra time if applicable). Wrong score = 0 points.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Points per correct prediction:</p>
            <ul className="text-white/60 space-y-1 ml-2">
              <li>• Group stage: <span className="text-white font-bold">5 pts</span></li>
              <li>• Round of 32: <span className="text-white font-bold">10 pts</span></li>
              <li>• Round of 16: <span className="text-white font-bold">20 pts</span></li>
              <li>• Quarter-finals: <span className="text-white font-bold">35 pts</span></li>
              <li>• Semi-finals: <span className="text-white font-bold">50 pts</span></li>
              <li>• Final: <span className="text-white font-bold">75 pts</span></li>
            </ul>
          </div>
        </div>

        {/* Game 4 */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <h2 className="text-white text-xl font-bold mb-3">Game 4: iknowball FPL</h2>
          <p className="text-white/70 text-sm mb-4">
            Build a 15-player fantasy squad from your 5 selected teams. Players earn points based on real match performances throughout the tournament.
          </p>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-white font-semibold mb-1">Squad Requirements:</p>
              <p className="text-white/60 ml-2">15 players total from your 5 teams</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Points System:</p>
              <ul className="text-white/60 space-y-1 ml-2">
                <li>• Clean sheet (GK): <span className="text-white font-bold">+4 pts</span></li>
                <li>• Clean sheet (DEF): <span className="text-white font-bold">+3 pts</span></li>
                <li>• Goal (DEF): <span className="text-white font-bold">+5 pts</span></li>
                <li>• Goal (MID): <span className="text-white font-bold">+4 pts</span></li>
                <li>• Goal (FWD): <span className="text-white font-bold">+3 pts</span></li>
                <li>• Assist: <span className="text-white font-bold">+2 pts</span></li>
                <li>• 60+ minutes played: <span className="text-white font-bold">+2 pts</span></li>
                <li>• Under 60 minutes played: <span className="text-white font-bold">+1 pt</span></li>
                <li>• Yellow card: <span className="text-white font-bold">-1 pt</span></li>
                <li>• Red card: <span className="text-white font-bold">-2 pts</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-4">
          <h2 className="text-white text-xl font-bold mb-3">Tips to Win</h2>
          <ul className="text-white/70 text-sm space-y-2 ml-2">
            <li>• <span className="font-semibold">Stay informed:</span> Watch pre-tournament analysis and team news</li>
            <li>• <span className="font-semibold">Study team form:</span> Recent performance and player fitness matter</li>
            <li>• <span className="font-semibold">Don't procrastinate:</span> Lock in your predictions before match kickoff</li>
            <li>• <span className="font-semibold">Diversify:</span> Play multiple games to maximize your score</li>
            <li>• <span className="font-semibold">Track leaders:</span> Check the leaderboard to see what's working</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
