import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import schedule from "../data/schedule"

var TIER1 = ["Argentina", "France", "England", "Brazil", "Portugal", "Spain", "Belgium", "Netherlands", "Germany", "Italy"]
var TIER2 = ["Croatia", "Denmark", "Uruguay", "Switzerland", "USA", "Mexico", "Colombia", "Senegal", "Morocco", "Japan", "Poland", "Serbia", "South Korea", "Ecuador", "Australia"]
var TIER3 = ["Canada", "Ghana", "Cameroon", "Tunisia", "Egypt", "Nigeria", "Ivory Coast", "Chile", "Peru", "Paraguay", "Costa Rica", "Saudi Arabia", "Iran", "Wales", "New Zealand"]

var UPPER_SET = new Set(TIER1.concat(TIER2, TIER3))
var ALL_TEAMS = Array.from(new Set(schedule.flatMap(function (m) { return [m.home, m.away] })))
var TIER4 = ALL_TEAMS.filter(function (t) { return !UPPER_SET.has(t) }).sort()

var TIERS = [
  { id: 1, teams: TIER1, limit: 2, label: "Tier 1", desc: "Top 10 FIFA ranked" },
  { id: 2, teams: TIER2, limit: 1, label: "Tier 2", desc: "Ranked 11–25" },
  { id: 3, teams: TIER3, limit: 1, label: "Tier 3", desc: "Ranked 26–40" },
  { id: 4, teams: TIER4, limit: 1, label: "Tier 4", desc: "Other qualifiers" },
]

var POSITION_LABELS = ["GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD", "FWD"]

function groupByDate(matches) {
  var map = {}
  matches.forEach(function (m) {
    if (!map[m.date]) map[m.date] = []
    map[m.date].push(m)
  })
  return Object.keys(map).sort().map(function (date) {
    return { date: date, matches: map[date] }
  })
}

function formatDate(dateStr) {
  var parts = dateStr.split("-").map(Number)
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  })
}

function BackHeader({ title, onBack, subtitle }) {
  return (
    <div>
      <div style={{ height: 3, background: "#c9a84c" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #1e2540" }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", color: "#fff", margin: 0 }}>
            {title}
          </p>
          {subtitle && (
            <p style={{ fontSize: 11, color: "#8b93ab", margin: 0, marginTop: 1 }}>{subtitle}</p>
          )}
        </div>
        <div style={{ width: 18 }} />
      </div>
    </div>
  )
}

function FooterButton({ label, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "11px 16px",
        background: disabled ? "#1e2540" : "#c9a84c",
        color: disabled ? "#6b7494" : "#0a0e1a",
        border: "none",
        borderRadius: 4,
        fontFamily: "Oswald, sans-serif",
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  )
}

export default function StartingXI({ onBack }) {
  var [phase, setPhase] = useState(null)
  var [userId, setUserId] = useState(null)
  var [userTeams, setUserTeams] = useState([])
  var [picks, setPicks] = useState({ 1: [], 2: [], 3: [], 4: [] })
  var [filteredMatches, setFilteredMatches] = useState([])
  var [predictions, setPredictions] = useState({})
  var [selectedMatch, setSelectedMatch] = useState(null)
  var [selectedTeam, setSelectedTeam] = useState("")
  var [players, setPlayers] = useState(Array(11).fill(""))
  var [saving, setSaving] = useState(false)
  var [locking, setLocking] = useState(false)
  var [savedMsg, setSavedMsg] = useState("")

  useEffect(function () {
    async function init() {
      var authRes = await supabase.auth.getUser()
      var user = authRes.data.user
      if (!user) { setPhase(1); return }
      setUserId(user.id)

      var { data: selRow } = await supabase
        .from("team_selections")
        .select("teams")
        .eq("user_id", user.id)
        .single()

      if (selRow && selRow.teams && selRow.teams.length > 0) {
        var teams = selRow.teams
        setUserTeams(teams)
        loadMatchesAndPredictions(user.id, teams)
        setPhase(2)
      } else {
        setPhase(1)
      }
    }
    init()
  }, [])

  async function loadMatchesAndPredictions(uid, teams) {
    var myMatches = schedule.filter(function (m) {
      return teams.some(function (t) {
        return t.trim().toLowerCase() === m.home.trim().toLowerCase() ||
          t.trim().toLowerCase() === m.away.trim().toLowerCase()
      })
    })
    setFilteredMatches(myMatches)

    var { data: preds } = await supabase
      .from("starting_xi_predictions")
      .select("match_id, players")
      .eq("user_id", uid)

    var predMap = {}
    ;(preds || []).forEach(function (row) {
      predMap[String(row.match_id)] = row.players
    })
    setPredictions(predMap)
  }

  // ── Phase 1 helpers ──────────────────────────────────────────────────────

  function togglePick(team, tierId) {
    var limit = TIERS.find(function (t) { return t.id === tierId }).limit
    setPicks(function (prev) {
      var cur = prev[tierId]
      if (cur.includes(team)) {
        return Object.assign({}, prev, { [tierId]: cur.filter(function (t) { return t !== team }) })
      }
      if (cur.length >= limit) return prev
      return Object.assign({}, prev, { [tierId]: cur.concat([team]) })
    })
  }

  var allPicked = picks[1].concat(picks[2], picks[3], picks[4])
  var pickComplete = picks[1].length === 2 && picks[2].length === 1 && picks[3].length === 1 && picks[4].length === 1

  async function handleLockTeams() {
    if (!pickComplete || locking || !userId) return
    setLocking(true)
    var { error } = await supabase
      .from("team_selections")
      .upsert({ user_id: userId, teams: allPicked, locked: true }, { onConflict: "user_id" })
    if (error) { setLocking(false); return }
    setUserTeams(allPicked)
    await loadMatchesAndPredictions(userId, allPicked)
    setLocking(false)
    setPhase(2)
  }

  // ── Phase 3 helpers ──────────────────────────────────────────────────────

  function openMatch(match) {
    var found = userTeams.find(function (t) {
      return t.trim().toLowerCase() === match.home.trim().toLowerCase() ||
        t.trim().toLowerCase() === match.away.trim().toLowerCase()
    })
    var team = found ? found.trim() : ""
    var existing = predictions[String(match.id)] || []
    setSelectedMatch(match)
    setSelectedTeam(team)
    setPlayers(Array(11).fill("").map(function (_, i) { return existing[i] || "" }))
    setSavedMsg("")
    setPhase(3)
  }

  function setPlayer(index, value) {
    setPlayers(function (prev) {
      var next = prev.slice()
      next[index] = value
      return next
    })
  }

  async function handleSubmitXI() {
    if (saving || !userId) return
    setSaving(true)
    setSavedMsg("")
    var { error } = await supabase
      .from("starting_xi_predictions")
      .upsert(
        { user_id: userId, match_id: String(selectedMatch.id), team: selectedTeam, players: players },
        { onConflict: "user_id,match_id" }
      )
    setSaving(false)
    if (error) { setSavedMsg("Error: " + error.message); return }
    setPredictions(function (prev) {
      return Object.assign({}, prev, { [String(selectedMatch.id)]: players })
    })
    setSavedMsg("Saved!")
    setTimeout(function () { setPhase(2); setSelectedMatch(null); setSavedMsg("") }, 800)
  }

  // ── RENDER: Loading ──────────────────────────────────────────────────────

  if (phase === null) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7494", fontFamily: "Oswald, sans-serif", letterSpacing: "0.08em" }}>Loading...</p>
      </div>
    )
  }

  // ── RENDER: Phase 1 — Team Selection ────────────────────────────────────

  if (phase === 1) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 160 }}>
        <BackHeader title="STARTING XI" onBack={onBack} />

        <div style={{ padding: "16px 16px 0" }}>
          <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 4 }}>
            Pick Your 5 Teams
          </p>
          <p style={{ fontSize: 12, color: "#8b93ab", marginBottom: 20, lineHeight: 1.6 }}>
            Pick 2 from Tier 1, then 1 each from Tiers 2, 3, and 4.
          </p>

          {TIERS.map(function (tier) {
            var tierPicks = picks[tier.id]
            var done = tierPicks.length === tier.limit
            return (
              <div key={tier.id} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", color: "#c9a84c" }}>
                      {tier.label.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, color: "#6b7494", marginLeft: 6 }}>· {tier.desc}</span>
                  </div>
                  <span style={{
                    fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em",
                    padding: "3px 8px", borderRadius: 3,
                    background: done ? "rgba(61,220,132,0.12)" : "rgba(201,168,76,0.1)",
                    border: done ? "1px solid #3ddc84" : "1px solid #c9a84c",
                    color: done ? "#3ddc84" : "#c9a84c",
                  }}>
                    {done ? "✓ DONE" : tierPicks.length + "/" + tier.limit}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {tier.teams.map(function (team) {
                    var isSel = tierPicks.includes(team)
                    var isDisabled = !isSel && done
                    return (
                      <button
                        key={team}
                        type="button"
                        onClick={function () { togglePick(team, tier.id) }}
                        disabled={isDisabled}
                        style={{
                          background: isSel ? "rgba(201,168,76,0.12)" : "#0d1224",
                          border: isSel ? "1px solid #c9a84c" : "1px solid #1e2540",
                          borderLeft: isSel ? "3px solid #c9a84c" : "3px solid #1e2540",
                          borderRadius: "0 6px 6px 0",
                          padding: "9px 12px",
                          display: "flex",
                          alignItems: "center",
                          opacity: isDisabled ? 0.35 : 1,
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          textAlign: "left",
                          width: "100%",
                        }}
                      >
                        <span style={{
                          fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 12,
                          letterSpacing: "0.04em", color: isSel ? "#c9a84c" : "#fff",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {team}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "#0a0e1a", borderTop: "1px solid #1e2540" }}>
          {allPicked.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
              {allPicked.map(function (team) {
                return (
                  <span key={team} style={{
                    fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 10,
                    color: "#c9a84c", background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.3)", borderRadius: 3,
                    padding: "3px 7px", letterSpacing: "0.06em",
                  }}>
                    {team}
                  </span>
                )
              })}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, letterSpacing: "0.14em", color: "#6b7494" }}>
              {allPicked.length} / 5 SELECTED
            </span>
            {pickComplete && (
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, letterSpacing: "0.1em", color: "#3ddc84", fontWeight: 700 }}>
                READY
              </span>
            )}
          </div>
          <FooterButton
            label={locking ? "Saving..." : "Lock My Teams"}
            disabled={!pickComplete || locking}
            onClick={handleLockTeams}
          />
        </div>
      </div>
    )
  }

  // ── RENDER: Phase 3 — Starting XI Predictor ──────────────────────────────

  if (phase === 3 && selectedMatch) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 100 }}>
        <BackHeader
          title={selectedMatch.home + " vs " + selectedMatch.away}
          onBack={function () { setPhase(2); setSelectedMatch(null); setSavedMsg("") }}
          subtitle={selectedTeam + " · " + formatDate(selectedMatch.date)}
        />

        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, padding: "10px 12px", marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: "#8b93ab", margin: 0, lineHeight: 1.6 }}>
              Squad lists will be available after the FIFA squad submission deadline. For now, enter player names manually.
            </p>
          </div>

          {players.map(function (val, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 11, color: "#6b7494", width: 18, textAlign: "right", flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.1em", color: "#c9a84c", width: 28, flexShrink: 0 }}>
                  {POSITION_LABELS[i]}
                </span>
                <input
                  type="text"
                  value={val}
                  onChange={function (e) { setPlayer(i, e.target.value) }}
                  placeholder={"Player " + (i + 1)}
                  style={{
                    flex: 1,
                    background: "#0d1224",
                    border: "1px solid #1e2540",
                    borderRadius: 4,
                    padding: "8px 10px",
                    color: "#fff",
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 13,
                    letterSpacing: "0.02em",
                    outline: "none",
                  }}
                />
              </div>
            )
          })}
        </div>

        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "#0a0e1a", borderTop: "1px solid #1e2540" }}>
          {savedMsg && (
            <p style={{ textAlign: "center", fontSize: 13, marginBottom: 8, color: savedMsg.startsWith("Error") ? "#e24b4a" : "#3ddc84" }}>
              {savedMsg}
            </p>
          )}
          <FooterButton
            label={saving ? "Saving..." : "Submit XI"}
            disabled={saving}
            onClick={handleSubmitXI}
          />
        </div>
      </div>
    )
  }

  // ── RENDER: Phase 2 — My Matches ─────────────────────────────────────────

  var today = new Date().toLocaleDateString("en-CA")
  var grouped = groupByDate(filteredMatches)

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 80 }}>
      <BackHeader title="STARTING XI" onBack={onBack} />

      <div style={{ padding: "10px 16px", borderBottom: "1px solid #1e2540" }}>
        <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6, margin: 0 }}>
          Pick the starting 11 players for your team before each match kicks off. Submit before the game starts.
        </p>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {filteredMatches.length === 0 ? (
          <p style={{ color: "#8b93ab", fontSize: 14, textAlign: "center", paddingTop: 40 }}>
            No matches scheduled for your teams.
          </p>
        ) : (
          grouped.map(function (group) {
            return (
              <div key={group.date} style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", color: "#c9a84c", marginBottom: 8, textTransform: "uppercase" }}>
                  {formatDate(group.date)}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {group.matches.map(function (match) {
                    var isPast = match.date < today
                    var hasPred = !!predictions[String(match.id)]
                    return (
                      <div
                        key={match.id}
                        style={{
                          background: "#0d1224",
                          border: "1px solid #1e2540",
                          borderLeft: "3px solid " + (isPast ? "#2a3354" : "#c9a84c"),
                          borderRadius: "0 6px 6px 0",
                          padding: "12px 14px",
                          opacity: isPast ? 0.55 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b7494", marginBottom: 3 }}>
                            Group {match.group}
                          </p>
                          <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 14, color: "#fff", letterSpacing: "0.02em" }}>
                            {match.home} vs {match.away}
                          </p>
                        </div>

                        {hasPred && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                            <circle cx="10" cy="10" r="9" fill="rgba(61,220,132,0.15)" stroke="#3ddc84" strokeWidth="1.5" />
                            <path d="M6.5 10L8.5 12L13.5 7" stroke="#3ddc84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}

                        {!isPast && !hasPred && (
                          <button
                            type="button"
                            onClick={function () { openMatch(match) }}
                            style={{
                              background: "#c9a84c", color: "#0a0e1a", border: "none",
                              borderRadius: 3, fontFamily: "Oswald, sans-serif", fontWeight: 600,
                              fontSize: 10, letterSpacing: "0.1em", padding: "5px 10px",
                              cursor: "pointer", textTransform: "uppercase", flexShrink: 0,
                            }}
                          >
                            PREDICT XI
                          </button>
                        )}

                        {!isPast && hasPred && (
                          <button
                            type="button"
                            onClick={function () { openMatch(match) }}
                            style={{
                              background: "transparent", color: "#c9a84c",
                              border: "1px solid rgba(201,168,76,0.4)", borderRadius: 3,
                              fontFamily: "Oswald, sans-serif", fontWeight: 600,
                              fontSize: 10, letterSpacing: "0.1em", padding: "5px 10px",
                              cursor: "pointer", textTransform: "uppercase", flexShrink: 0,
                            }}
                          >
                            EDIT
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
