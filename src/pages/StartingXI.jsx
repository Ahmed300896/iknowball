import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import allMatches from "../data/schedule"
import { FLAGS } from "../data/teams"
import PageHeader from "../components/PageHeader"
import BottomNav from "../components/BottomNav"

// teams.js stores "USA"; schedule.js and players table use "United States"
var NAME_MAP = { "USA": "United States" }
function canon(name) { return NAME_MAP[name] || name }

// Build a flag lookup that works for both teams.js and schedule.js names
var FLAG_LOOKUP = Object.assign({}, FLAGS, { "United States": FLAGS["USA"] })
function flag(name) { return FLAG_LOOKUP[name] || "" }

function formatDate(dateStr) {
  var p = dateStr.split("-").map(Number)
  return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  })
}

var POS_ORDER = ["GK", "DEF", "MID", "FWD", "Unknown"]

export default function StartingXI({ user, username, onBack, onLogout, currentScreen, onPredict, onRanks }) {
  var today = new Date().toLocaleDateString("en-CA")

  // VIEW 1 state
  var [userTeams, setUserTeams] = useState(null)
  var [predMap, setPredMap] = useState({}) // String(match_id) → players[]
  var [loading, setLoading] = useState(true)

  // VIEW 2 state
  var [activeMatch, setActiveMatch] = useState(null)
  var [players, setPlayers] = useState([])
  var [loadingPlayers, setLoadingPlayers] = useState(false)
  var [selected, setSelected] = useState([])
  var [saving, setSaving] = useState(false)
  var [msg, setMsg] = useState("")

  useEffect(function () {
    async function load() {
      var teamsRes = await supabase
        .from("user_teams")
        .select("teams")
        .eq("user_id", user.id)
        .single()

      if (!teamsRes.data) { setLoading(false); return }
      setUserTeams(teamsRes.data.teams)

      var predsRes = await supabase
        .from("starting_xi_predictions")
        .select("match_id, players")
        .eq("user_id", user.id)

      var map = {}
      ;(predsRes.data ?? []).forEach(function (row) {
        map[String(row.match_id)] = row.players
      })
      setPredMap(map)
      setLoading(false)
    }
    load()
  }, [user.id])

  // Upcoming matches involving any of the user's teams
  var upcomingMatches = []
  if (userTeams) {
    var canonTeams = userTeams.map(canon)
    upcomingMatches = allMatches
      .filter(function (m) {
        return m.date >= today && (canonTeams.includes(m.home) || canonTeams.includes(m.away))
      })
      .map(function (m) {
        var myTeam = userTeams.find(function (t) { return canon(t) === m.home })
          || userTeams.find(function (t) { return canon(t) === m.away })
        return Object.assign({}, m, { myTeam: myTeam })
      })
  }

  async function openMatch(match) {
    setActiveMatch(match)
    setMsg("")
    setSelected(predMap[String(match.id)] ?? [])
    setLoadingPlayers(true)
    setPlayers([])
    var res = await supabase
      .from("players")
      .select("name, position, shirt_number")
      .eq("team", canon(match.myTeam))
      .order("shirt_number", { ascending: true })
    setPlayers(res.data ?? [])
    setLoadingPlayers(false)
  }

  function togglePlayer(name) {
    if (selected.includes(name)) {
      setSelected(selected.filter(function (n) { return n !== name }))
    } else if (selected.length < 11) {
      setSelected([...selected, name])
    }
  }

  async function handleSubmit() {
    if (selected.length !== 11 || saving) return
    setSaving(true)
    setMsg("")
    try {
      var res = await supabase
        .from("starting_xi_predictions")
        .upsert(
          { user_id: user.id, match_id: String(activeMatch.id), players: selected },
          { onConflict: "user_id,match_id" }
        )
      if (res.error) throw res.error
      var key = String(activeMatch.id)
      setPredMap(function (prev) {
        return Object.assign({}, prev, { [key]: selected })
      })
      setMsg("Prediction saved!")
      setTimeout(function () { setActiveMatch(null) }, 1000)
    } catch (err) {
      setMsg("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── VIEW 2 — Player picker ──────────────────────────────────────────
  if (activeMatch) {
    var grouped = {}
    players.forEach(function (p) {
      var pos = p.position || "Unknown"
      if (!grouped[pos]) grouped[pos] = []
      grouped[pos].push(p)
    })

    return (
      <div className="min-h-screen pb-24" style={{ background: "#0a0e1a" }}>
        <PageHeader
          title={activeMatch.myTeam + " XI"}
          showBack
          onBack={function () { setActiveMatch(null) }}
          username={username}
          onLogout={onLogout}
        />

        {/* Match context */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #1e2540" }}>
          <p className="eyebrow mb-1">
            Group {activeMatch.group} · {formatDate(activeMatch.date)}
          </p>
          <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 14, color: "#fff" }}>
            {flag(activeMatch.home)} {activeMatch.home}
            <span style={{ color: "#6b7494" }}> vs </span>
            {flag(activeMatch.away)} {activeMatch.away}
          </p>
          <p style={{ fontSize: 11, color: "#8b93ab", marginTop: 3 }}>
            Predicting {activeMatch.myTeam}'s starting lineup
          </p>
        </div>

        {/* Counter */}
        <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #1e2540" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="eyebrow">Players selected</span>
            <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 13, color: selected.length === 11 ? "#3ddc84" : "#c9a84c" }}>
              {selected.length} / 11
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: (selected.length / 11 * 100) + "%",
                background: selected.length === 11 ? "#3ddc84" : "#c9a84c",
              }}
            />
          </div>
        </div>

        {/* Player list */}
        <div className="px-4 py-4 space-y-5 pb-32">
          {loadingPlayers ? (
            <p style={{ color: "#6b7494" }}>Loading squad…</p>
          ) : players.length === 0 ? (
            <div className="text-center pt-8">
              <p style={{ fontFamily: "Oswald, sans-serif", color: "#fff", fontSize: 16, marginBottom: 6 }}>NO SQUAD DATA</p>
              <p style={{ fontSize: 13, color: "#8b93ab" }}>Player data for {activeMatch.myTeam} hasn't been imported yet.</p>
            </div>
          ) : (
            POS_ORDER.map(function (pos) {
              if (!grouped[pos] || grouped[pos].length === 0) return null
              return (
                <div key={pos}>
                  <p className="eyebrow mb-2">{pos === "Unknown" ? "Other" : pos}</p>
                  <div className="space-y-1.5">
                    {grouped[pos].map(function (p) {
                      var isSel = selected.includes(p.name)
                      var isDisabled = !isSel && selected.length >= 11
                      return (
                        <button
                          key={p.name}
                          type="button"
                          disabled={isDisabled}
                          onClick={function () { togglePlayer(p.name) }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 14px",
                            background: isSel ? "rgba(201,168,76,0.1)" : "#0d1224",
                            border: isSel ? "1px solid #c9a84c" : "1px solid #1e2540",
                            borderLeft: isSel ? "3px solid #c9a84c" : "3px solid #1e2540",
                            borderRadius: "0 6px 6px 0",
                            opacity: isDisabled ? 0.3 : 1,
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            textAlign: "left",
                          }}
                        >
                          {p.shirt_number != null && (
                            <span style={{
                              fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 12,
                              color: isSel ? "#c9a84c" : "#6b7494", width: 20, textAlign: "center", flexShrink: 0,
                            }}>
                              {p.shirt_number}
                            </span>
                          )}
                          <span style={{
                            flex: 1, fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13,
                            color: isSel ? "#c9a84c" : "#fff", letterSpacing: "0.02em",
                          }}>
                            {p.name}
                          </span>
                          {isSel && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                              <circle cx="7" cy="7" r="6.5" stroke="#c9a84c" strokeWidth="1"/>
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

        {/* Fixed submit footer */}
        <div
          className="fixed bottom-0 left-0 right-0 px-4 py-4"
          style={{ background: "#0a0e1a", borderTop: "1px solid #1e2540" }}
        >
          {msg && (
            <p style={{ textAlign: "center", fontSize: 13, marginBottom: 8, color: msg.startsWith("Error") ? "#e24b4a" : "#3ddc84" }}>
              {msg}
            </p>
          )}
          <button
            type="button"
            className="btn-gold"
            disabled={selected.length !== 11 || saving}
            onClick={handleSubmit}
          >
            {saving ? "Saving…" : "Submit Prediction"}
          </button>
        </div>
      </div>
    )
  }

  // ── VIEW 1 — Match list ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-20" style={{ background: "#0a0e1a" }}>
      <PageHeader title="Starting XI" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div className="px-4 pt-5">
        {loading ? (
          <div className="flex items-center justify-center pt-20">
            <p style={{ color: "#6b7494" }}>Loading…</p>
          </div>
        ) : !userTeams ? (
          <div className="text-center pt-16">
            <p style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, color: "#fff", marginBottom: 8 }}>NO TEAMS SELECTED</p>
            <p style={{ fontSize: 13, color: "#8b93ab" }}>Pick your 5 teams first to unlock Starting XI.</p>
          </div>
        ) : upcomingMatches.length === 0 ? (
          <div className="text-center pt-16">
            <p style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, color: "#fff", marginBottom: 8 }}>NO UPCOMING MATCHES</p>
            <p style={{ fontSize: 13, color: "#8b93ab" }}>Your teams have no more scheduled group stage matches.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 3, height: 18, background: "#c9a84c", borderRadius: 2 }} />
              <p className="eyebrow">Upcoming Matches</p>
            </div>
            {upcomingMatches.map(function (match) {
              var hasPred = !!predMap[String(match.id)]
              return (
                <button
                  key={match.id}
                  type="button"
                  onClick={function () { openMatch(match) }}
                  className="card-fifa w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow mb-1">Group {match.group} · {formatDate(match.date)}</p>
                      <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13, color: "#fff", letterSpacing: "0.02em" }}>
                        {flag(match.home)} {match.home}
                        <span style={{ color: "#6b7494" }}> vs </span>
                        {flag(match.away)} {match.away}
                      </p>
                      <p style={{ fontSize: 11, color: "#8b93ab", marginTop: 3 }}>
                        Predict {match.myTeam}'s XI
                      </p>
                    </div>
                    {hasPred ? (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="10" fill="rgba(61,220,132,0.12)" stroke="#3ddc84" strokeWidth="1.5"/>
                        <path d="M7 11L9.5 13.5L15 8" stroke="#3ddc84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span style={{
                        flexShrink: 0, fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 11,
                        letterSpacing: "0.08em", background: "#c9a84c", color: "#0a0e1a",
                        padding: "4px 8px", borderRadius: 3,
                      }}>
                        PICK
                      </span>
                    )}
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
        onPredict={onPredict ?? function () {}}
        onRanks={onRanks ?? function () {}}
      />
    </div>
  )
}
