import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import schedule from "../data/schedule"
import squads from "../data/squads.js"
import { calculateAndSaveUserPoints } from "../lib/resultsHelper"
import PageHeader from "../components/PageHeader"

var ADMIN_ID = "18dac4ab-2689-459d-8491-6000801e0c1e"

var TYPE_LABELS = {
  "group": "Group Stage",
  "r32": "Round of 32",
  "r16": "Round of 16",
  "qf": "Quarter-final",
  "sf": "Semi-final",
  "final": "Final",
}

function detectMatchType(match) {
  if (match.group) return "group"
  var parts = match.date.split("-")
  var md = Number(parts[1]) * 100 + Number(parts[2])
  if (md >= 628 && md <= 703) return "r32"
  if (md >= 704 && md <= 707) return "r16"
  if (md >= 709 && md <= 711) return "qf"
  if (md >= 714 && md <= 715) return "sf"
  if (md === 719) return "final"
  return "group"
}

// Maps schedule team names to squads.js keys
var SQUAD_NAME_MAP = {
  "South Korea": "Korea Republic",
  "DR Congo": "Congo DR",
  "Cape Verde": "Cabo Verde",
  "Ivory Coast": "Cote D'Ivoire",
  "Iran": "IR Iran",
  "Bosnia & Herzegovina": "Bosnia And Herzegovina",
  "Turkiye": "Turkiye",
  "Curacao": "Curacao",
  "United States": "USA",
}

function getSquadPlayers(teamName) {
  var key = SQUAD_NAME_MAP[teamName] || teamName
  var s = squads[key]
  if (!s) return []
  return [].concat(s.GK || [], s.DF || [], s.MF || [], s.FW || [])
}

function formatDate(dateStr) {
  var parts = dateStr.split("-").map(Number)
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  })
}

function groupMatchesByDate() {
  var map = {}
  schedule.forEach(function (m) {
    if (!map[m.date]) map[m.date] = []
    map[m.date].push(m)
  })
  return Object.keys(map).sort().map(function (date) {
    return { date: date, matches: map[date] }
  })
}

var inputStyle = {
  background: "#141b30",
  border: "1px solid #2a3354",
  color: "#fff",
  borderRadius: 4,
  padding: "10px 12px",
  width: "100%",
  fontFamily: "Oswald, sans-serif",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
}

var labelStyle = {
  fontFamily: "Oswald, sans-serif",
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: "0.16em",
  color: "#6b7494",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
}

function goldBtn(enabled) {
  return {
    width: "100%",
    padding: "11px 16px",
    background: enabled ? "#c9a84c" : "#1e2540",
    color: enabled ? "#0a0e1a" : "#6b7494",
    border: "none",
    borderRadius: 4,
    fontFamily: "Oswald, sans-serif",
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: enabled ? "pointer" : "not-allowed",
  }
}

function SectionHeading({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 3, height: 18, background: "#c9a84c", borderRadius: 2 }} />
      <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", color: "#c9a84c" }}>
        {label}
      </span>
    </div>
  )
}

function Card({ children }) {
  return (
    <div style={{ background: "#0d1224", border: "1px solid #1e2540", borderRadius: 8, padding: "16px" }}>
      {children}
    </div>
  )
}

// Searchable player picker for one team
function TeamPicker({ teamName, selected, onToggle, search, onSearch }) {
  var all = getSquadPlayers(teamName)
  var filtered = search.trim()
    ? all.filter(function (p) { return p.toLowerCase().includes(search.trim().toLowerCase()) })
    : all

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", letterSpacing: "0.04em" }}>
          {teamName}
        </span>
        <span style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 13,
          color: selected.length === 11 ? "#3ddc84" : "#c9a84c",
        }}>
          {selected.length} / 11
        </span>
      </div>

      <input
        type="text"
        placeholder="Search players..."
        value={search}
        onChange={function (e) { onSearch(e.target.value) }}
        style={{ ...inputStyle, marginBottom: 8 }}
      />

      {all.length === 0 ? (
        <p style={{ fontSize: 12, color: "#6b7494", padding: "8px 0" }}>No squad data for {teamName}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 260, overflowY: "auto" }}>
          {filtered.map(function (player) {
            var isSel = selected.includes(player)
            var isDisabled = !isSel && selected.length >= 11
            return (
              <button
                key={player}
                type="button"
                disabled={isDisabled}
                onClick={function () { onToggle(player) }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: isSel ? "rgba(201,168,76,0.1)" : "#0a0e1a",
                  border: isSel ? "1px solid #c9a84c" : "1px solid #1e2540",
                  borderLeft: isSel ? "3px solid #c9a84c" : "3px solid #1e2540",
                  borderRadius: "0 4px 4px 0",
                  color: isSel ? "#c9a84c" : "#fff",
                  opacity: isDisabled ? 0.3 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  textAlign: "left",
                  width: "100%",
                  fontFamily: "Oswald, sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.02em",
                  flexShrink: 0,
                }}
              >
                <span style={{ flex: 1 }}>{player}</span>
                {isSel && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="6" cy="6" r="5.5" fill="rgba(201,168,76,0.2)" stroke="#c9a84c" strokeWidth="1.2"/>
                    <path d="M3.5 6L5 7.5L8.5 4" stroke="#c9a84c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p style={{ fontSize: 12, color: "#6b7494", padding: "8px 0" }}>No players match "{search}"</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Admin({ user, username, onBack, onLogout }) {
  var isAdmin = user?.id === ADMIN_ID
  var grouped = groupMatchesByDate()

  // ── Section 1 state ──────────────────────────────────────────────────────
  var [scoreMatchId, setScoreMatchId] = useState("")
  var [homeScore, setHomeScore] = useState("")
  var [awayScore, setAwayScore] = useState("")
  var [scoreSaving, setScoreSaving] = useState(false)
  var [scoreMsg, setScoreMsg] = useState(null)
  var [existingResults, setExistingResults] = useState({})

  // ── Section 2 state ──────────────────────────────────────────────────────
  var [xiMatchId, setXiMatchId] = useState("")
  var [xiPicks, setXiPicks] = useState({ home: [], away: [] })
  var [xiSearch, setXiSearch] = useState({ home: "", away: "" })
  var [xiSaving, setXiSaving] = useState("") // "home" | "away" | ""
  var [xiMsg, setXiMsg] = useState(null)

  // Load all existing score results on mount
  useEffect(function () {
    if (!isAdmin) return
    supabase.from("match_results")
      .select("match_id, home_score, away_score, match_type")
      .then(function (res) {
        var map = {}
        ;(res.data || []).forEach(function (r) {
          map[String(r.match_id)] = r
        })
        setExistingResults(map)
      })
  }, [isAdmin])

  // Pre-fill score inputs when a match is selected in Section 1
  useEffect(function () {
    if (!scoreMatchId) { setHomeScore(""); setAwayScore(""); return }
    var existing = existingResults[String(scoreMatchId)]
    if (existing) {
      setHomeScore(String(existing.home_score))
      setAwayScore(String(existing.away_score))
    } else {
      setHomeScore("")
      setAwayScore("")
    }
    setScoreMsg(null)
  }, [scoreMatchId, existingResults])

  // Load existing XI results when a match is selected in Section 2
  useEffect(function () {
    if (!xiMatchId) { setXiPicks({ home: [], away: [] }); return }
    var match = schedule.find(function (m) { return String(m.id) === String(xiMatchId) })
    if (!match) return
    setXiPicks({ home: [], away: [] })
    setXiMsg(null)
    supabase.from("starting_xi_results")
      .select("team, players")
      .eq("match_id", String(xiMatchId))
      .then(function (res) {
        var picks = { home: [], away: [] }
        ;(res.data || []).forEach(function (row) {
          if (row.team === match.home) picks.home = row.players || []
          if (row.team === match.away) picks.away = row.players || []
        })
        setXiPicks(picks)
      })
  }, [xiMatchId])

  // ── Section 1: save score result ─────────────────────────────────────────
  async function handleSaveScore(e) {
    e.preventDefault()
    if (!scoreMatchId || homeScore === "" || awayScore === "") return
    setScoreSaving(true)
    setScoreMsg(null)
    try {
      var id = Number(scoreMatchId)
      var match = schedule.find(function (m) { return String(m.id) === String(scoreMatchId) })
      var matchType = match ? detectMatchType(match) : "group"
      var { error } = await supabase.from("match_results").upsert(
        {
          match_id: id,
          home_score: Number(homeScore),
          away_score: Number(awayScore),
          match_type: matchType,
          match_date: match ? match.date : null,
          home_team: match ? match.home : null,
          away_team: match ? match.away : null,
        },
        { onConflict: "match_id" }
      )
      if (error) throw error
      await calculateAndSaveUserPoints(id)
      setExistingResults(function (prev) {
        return Object.assign({}, prev, {
          [String(id)]: { match_id: id, home_score: Number(homeScore), away_score: Number(awayScore), match_type: matchType },
        })
      })
      setScoreMsg({ ok: true, text: "Result saved and points calculated!" })
    } catch (err) {
      setScoreMsg({ ok: false, text: "Error: " + err.message })
    } finally {
      setScoreSaving(false)
    }
  }

  // ── Section 2: toggle XI player ──────────────────────────────────────────
  function toggleXiPlayer(side, player) {
    setXiPicks(function (prev) {
      var cur = prev[side]
      if (cur.includes(player)) {
        return Object.assign({}, prev, { [side]: cur.filter(function (p) { return p !== player }) })
      }
      if (cur.length >= 11) return prev
      return Object.assign({}, prev, { [side]: cur.concat([player]) })
    })
  }

  // ── Section 2: save XI result ────────────────────────────────────────────
  async function handleSaveXI(side) {
    var match = schedule.find(function (m) { return String(m.id) === String(xiMatchId) })
    if (!match || xiPicks[side].length !== 11) return
    var team = side === "home" ? match.home : match.away
    setXiSaving(side)
    setXiMsg(null)
    try {
      var { error } = await supabase.from("starting_xi_results")
        .upsert(
          { match_id: String(xiMatchId), team: team, players: xiPicks[side] },
          { onConflict: "match_id,team" }
        )
      if (error) throw error
      setXiMsg({ ok: true, text: team + " XI saved successfully!" })
    } catch (err) {
      setXiMsg({ ok: false, text: "Error: " + err.message })
    } finally {
      setXiSaving("")
    }
  }

  // ── ACCESS DENIED ─────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "0.1em", color: "#e24b4a" }}>
          ACCESS DENIED
        </p>
        <button
          type="button"
          onClick={onBack}
          style={{ background: "transparent", border: "1px solid #c9a84c", color: "#c9a84c", borderRadius: 4, fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", padding: "8px 24px", cursor: "pointer", textTransform: "uppercase" }}
        >
          Go Back
        </button>
      </div>
    )
  }

  var scoreMatch = scoreMatchId ? schedule.find(function (m) { return String(m.id) === String(scoreMatchId) }) : null
  var xiMatch = xiMatchId ? schedule.find(function (m) { return String(m.id) === String(xiMatchId) }) : null
  var scoreCanSave = !scoreSaving && scoreMatchId && homeScore !== "" && awayScore !== ""

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", paddingBottom: 60, color: "#fff" }}>
      <PageHeader title="ADMIN PANEL" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div style={{ padding: "24px 16px 0", maxWidth: 600, margin: "0 auto" }}>

        {/* ── SECTION 1: Score Predictor Results ──────────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <SectionHeading label="Score Predictor Results" />
          <Card>
            <form onSubmit={handleSaveScore} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <div>
                <label style={labelStyle}>Select Match</label>
                <select
                  value={scoreMatchId}
                  onChange={function (e) { setScoreMatchId(e.target.value) }}
                  style={inputStyle}
                >
                  <option value="">Choose a match...</option>
                  {grouped.map(function (g) {
                    return (
                      <optgroup key={g.date} label={formatDate(g.date)}>
                        {g.matches.map(function (m) {
                          var done = !!existingResults[String(m.id)]
                          return (
                            <option key={m.id} value={m.id}>
                              {m.home} vs {m.away}{done ? " ✓" : ""}
                            </option>
                          )
                        })}
                      </optgroup>
                    )
                  })}
                </select>
              </div>

              {scoreMatch && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", gap: 8, alignItems: "end" }}>
                    <div>
                      <label style={labelStyle}>{scoreMatch.home}</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={homeScore}
                        onChange={function (e) { setHomeScore(e.target.value) }}
                        placeholder="0"
                        required
                        style={{ ...inputStyle, fontSize: 28, fontWeight: 700, textAlign: "center", padding: "8px" }}
                      />
                    </div>
                    <div style={{ textAlign: "center", paddingBottom: 10, fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 20, color: "#2a3354" }}>–</div>
                    <div>
                      <label style={labelStyle}>{scoreMatch.away}</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={awayScore}
                        onChange={function (e) { setAwayScore(e.target.value) }}
                        placeholder="0"
                        required
                        style={{ ...inputStyle, fontSize: 28, fontWeight: 700, textAlign: "center", padding: "8px" }}
                      />
                    </div>
                  </div>

                  <p style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, color: "#6b7494", letterSpacing: "0.06em", margin: 0 }}>
                    {"Match Type: "}
                    <span style={{ color: "#c9a84c", fontWeight: 600 }}>
                      {TYPE_LABELS[detectMatchType(scoreMatch)] || detectMatchType(scoreMatch)}
                    </span>
                  </p>
                </>
              )}

              {scoreMsg && (
                <p style={{ fontSize: 12, fontFamily: "Oswald, sans-serif", color: scoreMsg.ok ? "#3ddc84" : "#e24b4a" }}>
                  {scoreMsg.text}
                </p>
              )}

              <button type="submit" disabled={!scoreCanSave} style={goldBtn(scoreCanSave)}>
                {scoreSaving ? "Saving..." : "Save Result & Calculate Points"}
              </button>
            </form>
          </Card>
        </div>

        {/* ── SECTION 2: Starting XI Results ──────────────────────────────── */}
        <div>
          <SectionHeading label="Starting XI Results" />

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Select Match</label>
            <select
              value={xiMatchId}
              onChange={function (e) { setXiMatchId(e.target.value) }}
              style={inputStyle}
            >
              <option value="">Choose a match...</option>
              {grouped.map(function (g) {
                return (
                  <optgroup key={g.date} label={formatDate(g.date)}>
                    {g.matches.map(function (m) {
                      return (
                        <option key={m.id} value={m.id}>
                          {m.home} vs {m.away}
                        </option>
                      )
                    })}
                  </optgroup>
                )
              })}
            </select>
          </div>

          {xiMsg && (
            <p style={{ fontSize: 12, fontFamily: "Oswald, sans-serif", color: xiMsg.ok ? "#3ddc84" : "#e24b4a", marginBottom: 12 }}>
              {xiMsg.text}
            </p>
          )}

          {xiMatch && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["home", "away"].map(function (side) {
                var teamName = side === "home" ? xiMatch.home : xiMatch.away
                var picks = xiPicks[side]
                var canSave = picks.length === 11 && !xiSaving
                return (
                  <Card key={side}>
                    <TeamPicker
                      teamName={teamName}
                      selected={picks}
                      onToggle={function (p) { toggleXiPlayer(side, p) }}
                      search={xiSearch[side]}
                      onSearch={function (v) {
                        setXiSearch(function (prev) { return Object.assign({}, prev, { [side]: v }) })
                      }}
                    />
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        disabled={!canSave}
                        onClick={function () { handleSaveXI(side) }}
                        style={goldBtn(canSave)}
                      >
                        {xiSaving === side ? "Saving..." : "Save " + teamName + " XI"}
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
