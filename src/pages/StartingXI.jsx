import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import allMatches from "../data/schedule"
import { FLAGS } from "../data/teams"
import PageHeader from "../components/PageHeader"
import BottomNav from "../components/BottomNav"

// teams.js uses "USA"; schedule.js and players table use "United States"
const SCHEDULE_NAME = { "USA": "United States" }
function toScheduleName(n) { return SCHEDULE_NAME[n] || n }

function formatDate(dateStr) {
  var parts = dateStr.split("-").map(Number)
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  })
}

export default function StartingXI({ user, username, onBack, onLogout, currentScreen, onPredict, onRanks }) {
  const today = new Date().toLocaleDateString("en-CA")

  const [userTeams, setUserTeams] = useState(null)
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [existingPredictions, setExistingPredictions] = useState({})

  // Player picker state
  const [activeMatch, setActiveMatch] = useState(null)
  const [activeUserTeam, setActiveUserTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(function () {
    async function load() {
      const { data: teamsRow } = await supabase
        .from("user_teams")
        .select("teams")
        .eq("user_id", user.id)
        .single()

      if (!teamsRow) { setLoadingTeams(false); return }
      setUserTeams(teamsRow.teams)

      // Pre-fetch existing predictions for upcoming matches
      const { data: preds } = await supabase
        .from("starting_xi_predictions")
        .select("match_id, players")
        .eq("user_id", user.id)

      var map = {}
      ;(preds ?? []).forEach(function (p) { map[p.match_id] = p.players })
      setExistingPredictions(map)

      setLoadingTeams(false)
    }
    load()
  }, [user.id])

  // Compute upcoming matches for user's teams
  var upcomingMatches = []
  if (userTeams) {
    upcomingMatches = allMatches.filter(function (m) {
      if (m.date < today) return false
      var schedHome = toScheduleName(m.home)
      var schedAway = toScheduleName(m.away)
      return userTeams.some(function (t) {
        var ts = toScheduleName(t)
        return ts === schedHome || ts === schedAway
      })
    }).map(function (m) {
      var schedHome = toScheduleName(m.home)
      // Find which of user's teams is in this match (prefer home)
      var userTeam = userTeams.find(function (t) { return toScheduleName(t) === schedHome })
        ?? userTeams.find(function (t) { return toScheduleName(t) === toScheduleName(m.away) })
      return Object.assign({}, m, { userTeam: userTeam })
    })
  }

  async function openMatch(match) {
    setActiveMatch(match)
    setActiveUserTeam(match.userTeam)
    setSaveMessage("")
    setSelectedPlayers(existingPredictions[match.id] ?? [])
    setLoadingPlayers(true)
    setPlayers([])

    var playerTeamName = toScheduleName(match.userTeam)
    var { data } = await supabase
      .from("players")
      .select("name, position, shirt_number")
      .eq("team", playerTeamName)
      .order("shirt_number", { ascending: true })

    setPlayers(data ?? [])
    setLoadingPlayers(false)
  }

  function togglePlayer(name) {
    if (selectedPlayers.includes(name)) {
      setSelectedPlayers(selectedPlayers.filter(function (n) { return n !== name }))
    } else if (selectedPlayers.length < 11) {
      setSelectedPlayers([...selectedPlayers, name])
    }
  }

  async function handleSubmit() {
    if (selectedPlayers.length !== 11 || saving) return
    setSaving(true)
    setSaveMessage("")
    try {
      var { error } = await supabase
        .from("starting_xi_predictions")
        .upsert(
          { user_id: user.id, match_id: activeMatch.id, players: selectedPlayers },
          { onConflict: "user_id,match_id" }
        )
      if (error) throw error
      setExistingPredictions(function (prev) {
        var next = Object.assign({}, prev)
        next[activeMatch.id] = selectedPlayers
        return next
      })
      setSaveMessage("Prediction saved!")
      setTimeout(function () { setActiveMatch(null) }, 1200)
    } catch (err) {
      setSaveMessage("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Player picker view ──────────────────────────────────────────────
  if (activeMatch) {
    var schedHome = toScheduleName(activeMatch.home)
    var schedAway = toScheduleName(activeMatch.away)
    var opponentName = toScheduleName(activeMatch.userTeam) === schedHome ? activeMatch.away : activeMatch.home

    // Group players by position
    var byPos = { GK: [], DEF: [], MID: [], FWD: [], Unknown: [] }
    players.forEach(function (p) {
      var pos = p.position || "Unknown"
      if (!byPos[pos]) byPos[pos] = []
      byPos[pos].push(p)
    })
    var posOrder = ["GK", "DEF", "MID", "FWD", "Unknown"]

    return (
      <div className="min-h-screen pb-20" style={{ background: "#0a0e1a" }}>
        <PageHeader title={"Pick XI · " + (activeMatch.userTeam || "")} showBack onBack={function () { setActiveMatch(null) }} username={username} onLogout={onLogout} />

        {/* Match context */}
        <div className="px-4 pt-3 pb-3" style={{ borderBottom: "1px solid #1e2540" }}>
          <p className="eyebrow mb-0.5">Group {activeMatch.group} · {formatDate(activeMatch.date)}</p>
          <p className="text-white text-sm" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}>
            {activeMatch.home} vs {activeMatch.away}
          </p>
          <p className="text-xs mt-1" style={{ color: "#8b93ab" }}>
            Predicting {activeMatch.userTeam}'s starting lineup
          </p>
        </div>

        {/* Selection counter */}
        <div className="px-4 py-2" style={{ borderBottom: "1px solid #1e2540" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="eyebrow">Players selected</span>
            <span style={{ fontFamily: "Oswald, sans-serif", color: selectedPlayers.length === 11 ? "#3ddc84" : "#c9a84c", fontWeight: 700, fontSize: 13 }}>
              {selectedPlayers.length} / 11
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: (selectedPlayers.length / 11 * 100) + "%", background: selectedPlayers.length === 11 ? "#3ddc84" : "#c9a84c" }}
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-5">
          {loadingPlayers ? (
            <p style={{ color: "#6b7494" }}>Loading squad…</p>
          ) : players.length === 0 ? (
            <div className="text-center pt-10">
              <p className="text-white mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>NO SQUAD DATA</p>
              <p className="text-sm" style={{ color: "#8b93ab" }}>Player data for {activeMatch.userTeam} hasn't been imported yet.</p>
            </div>
          ) : (
            posOrder.map(function (pos) {
              if (!byPos[pos] || byPos[pos].length === 0) return null
              return (
                <div key={pos}>
                  <p className="eyebrow mb-2">{pos === "Unknown" ? "Other" : pos}</p>
                  <div className="space-y-1.5">
                    {byPos[pos].map(function (p) {
                      var isSel = selectedPlayers.includes(p.name)
                      var isDisabled = !isSel && selectedPlayers.length >= 11
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={function () { togglePlayer(p.name) }}
                          disabled={isDisabled}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            background: isSel ? "rgba(201,168,76,0.1)" : "#0d1224",
                            border: isSel ? "1px solid #c9a84c" : "1px solid #1e2540",
                            borderLeft: isSel ? "3px solid #c9a84c" : "3px solid #1e2540",
                            borderRadius: "0 6px 6px 0",
                            padding: "10px 14px",
                            opacity: isDisabled ? 0.35 : 1,
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            textAlign: "left",
                          }}
                        >
                          {p.shirt_number != null && (
                            <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 13, color: isSel ? "#c9a84c" : "#6b7494", width: 22, textAlign: "center", flexShrink: 0 }}>
                              {p.shirt_number}
                            </span>
                          )}
                          <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13, color: isSel ? "#c9a84c" : "#ffffff", flex: 1, letterSpacing: "0.02em" }}>
                            {p.name}
                          </span>
                          {isSel && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                              <circle cx="7" cy="7" r="6" fill="rgba(201,168,76,0.2)" stroke="#c9a84c" strokeWidth="1"/>
                              <path d="M4 7L6 9L10 5" stroke="#c9a84c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Submit footer */}
        <div
          className="fixed bottom-0 left-0 right-0 px-4 py-4 space-y-2"
          style={{ background: "#0a0e1a", borderTop: "1px solid #1e2540" }}
        >
          {saveMessage && (
            <p style={{ fontSize: 13, color: saveMessage.startsWith("Error") ? "#e24b4a" : "#3ddc84", textAlign: "center" }}>
              {saveMessage}
            </p>
          )}
          <button
            type="button"
            className="btn-gold"
            disabled={selectedPlayers.length !== 11 || saving}
            onClick={handleSubmit}
          >
            {saving ? "Saving…" : "Submit Prediction"}
          </button>
        </div>
      </div>
    )
  }

  // ── Match list view ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-20" style={{ background: "#0a0e1a" }}>
      <PageHeader title="Starting XI" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div className="px-4 pt-5 pb-4">
        {loadingTeams ? (
          <div className="flex items-center justify-center pt-20">
            <p style={{ color: "#6b7494" }}>Loading…</p>
          </div>
        ) : !userTeams ? (
          <div className="text-center pt-16 space-y-3">
            <p className="text-white text-lg" style={{ fontFamily: "Oswald, sans-serif" }}>NO TEAMS SELECTED</p>
            <p className="text-sm" style={{ color: "#8b93ab" }}>Pick your 5 teams first to unlock Starting XI predictions.</p>
          </div>
        ) : upcomingMatches.length === 0 ? (
          <div className="text-center pt-16">
            <p className="text-white text-lg mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>NO UPCOMING MATCHES</p>
            <p className="text-sm" style={{ color: "#8b93ab" }}>Your teams have no more scheduled group stage matches.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 3, height: 18, background: "#c9a84c", borderRadius: 2 }} />
              <p className="eyebrow">Upcoming Matches</p>
            </div>
            {upcomingMatches.map(function (match) {
              var hasPrediction = !!existingPredictions[match.id]
              var homeFlag = FLAGS[match.home] || "⚽"
              var awayFlag = FLAGS[match.away] || "⚽"
              var userTeamFlag = FLAGS[match.userTeam] || "⚽"
              return (
                <button
                  key={match.id}
                  type="button"
                  onClick={function () { openMatch(match) }}
                  className="card-fifa w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow mb-1">Group {match.group} · {formatDate(match.date)}</p>
                      <p className="text-white text-sm" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, letterSpacing: "0.02em" }}>
                        {homeFlag} {match.home} <span style={{ color: "#6b7494" }}>vs</span> {awayFlag} {match.away}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#8b93ab" }}>
                        Predicting {userTeamFlag} {match.userTeam}
                      </p>
                    </div>
                    <span
                      className="shrink-0 px-2 py-1 rounded text-xs self-center"
                      style={{
                        fontFamily: "Oswald, sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        background: hasPrediction ? "transparent" : "#c9a84c",
                        color: hasPrediction ? "#c9a84c" : "#0a0e1a",
                        border: hasPrediction ? "1px solid #c9a84c" : "none",
                      }}
                    >
                      {hasPrediction ? "EDIT" : "PICK"}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav
        currentScreen={currentScreen ?? "starting-xi"}
        onHome={onBack}
        onPredict={onPredict ?? (function () {})}
        onRanks={onRanks ?? (function () {})}
      />
    </div>
  )
}
