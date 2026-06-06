import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { FLAGS } from "../data/teams"
import PageHeader from "./PageHeader"

var TIER_1 = ["Argentina", "France", "Spain", "England", "Brazil", "Portugal", "Belgium", "Netherlands", "Germany"]
var TIER_2 = ["Croatia", "Denmark", "Switzerland", "USA", "Mexico", "Senegal", "Morocco", "Japan", "Uruguay", "Colombia", "Poland", "Australia", "Ecuador", "Ghana", "Wales"]
var TIER_3 = ["Cameroon", "Serbia", "South Korea", "Canada", "Tunisia", "Qatar", "Iran", "Saudi Arabia", "South Africa", "Czechia", "Haiti", "Ivory Coast", "Algeria", "Norway", "Austria"]

var TIERS = [
  { id: 1, label: "TIER 1", description: "Elite nations", teams: TIER_1, limit: 2 },
  { id: 2, label: "TIER 2", description: "Strong nations", teams: TIER_2, limit: 3 },
  { id: 3, label: "TIER 3", description: "Rising nations", teams: TIER_3, limit: 1 },
]

function getFlag(team) { return FLAGS[team] || "⚽" }

function tierForTeam(team) {
  if (TIER_1.includes(team)) return 1
  if (TIER_2.includes(team)) return 2
  if (TIER_3.includes(team)) return 3
  return 4
}

export default function TeamSelectionScreen({ user, username, onTeamsSelected, onLogout, onBack }) {
  var [picks, setPicks] = useState({ 1: [], 2: [], 3: [] })
  var [savedTeams, setSavedTeams] = useState(null)
  var [locked, setLocked] = useState(false)
  var [loading, setLoading] = useState(true)
  var [saving, setSaving] = useState(false)
  var [error, setError] = useState("")

  useEffect(function () {
    async function loadExisting() {
      var res = await supabase
        .from("user_teams")
        .select("teams, locked")
        .eq("user_id", user.id)
        .single()
      if (res.data) {
        setSavedTeams(res.data.teams)
        setLocked(res.data.locked)
        if (!res.data.locked && res.data.teams) {
          var restored = { 1: [], 2: [], 3: [] }
          res.data.teams.forEach(function (team) {
            var t = tierForTeam(team)
            restored[t] = [...restored[t], team]
          })
          setPicks(restored)
        }
      }
      setLoading(false)
    }
    loadExisting()
  }, [user.id])

  function toggle(team, tierId) {
    if (locked) return
    var limit = tierId === 1 ? 2 : tierId === 2 ? 3 : 1
    setPicks(function (prev) {
      var current = prev[tierId]
      if (current.includes(team)) {
        return Object.assign({}, prev, { [tierId]: current.filter(function (t) { return t !== team }) })
      }
      if (current.length >= limit) return prev
      return Object.assign({}, prev, { [tierId]: [...current, team] })
    })
  }

  var allSelected = [].concat(picks[1], picks[2], picks[3])
  var isComplete = picks[1].length === 2 && picks[2].length === 3 && picks[3].length === 1

  async function handleSave() {
    if (!isComplete || saving) return
    setSaving(true)
    setError("")
    try {
      var { error: upsertError } = await supabase
        .from("user_teams")
        .upsert(
          { user_id: user.id, teams: allSelected, locked: false },
          { onConflict: "user_id" }
        )
      if (upsertError) throw upsertError
      await supabase
        .from("profiles")
        .update({ favorite_teams: allSelected })
        .eq("id", user.id)
      onTeamsSelected(allSelected)
    } catch (err) {
      setError("Failed to save. Please try again.")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e1a" }}>
        <p style={{ color: "#6b7494" }}>Loading…</p>
      </div>
    )
  }

  if (locked && savedTeams) {
    return (
      <div className="min-h-screen pb-20" style={{ background: "#0a0e1a" }}>
        <PageHeader title="My Teams" showBack onBack={onBack} username={username} onLogout={onLogout} />
        <div className="px-4 pt-8 text-center">
          <p className="eyebrow mb-3">Team Selection</p>
          <p className="text-xl mb-2" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, color: "#fff" }}>YOUR TEAMS ARE LOCKED IN</p>
          <p className="text-sm mb-8" style={{ color: "#8b93ab" }}>Team selection is locked for the tournament.</p>
          <div className="space-y-2 max-w-sm mx-auto">
            {savedTeams.map(function (team) {
              return (
                <div key={team} className="flex items-center gap-3 px-4 py-3 rounded"
                  style={{ background: "#0d1224", border: "1px solid #1e2540", borderLeft: "3px solid #c9a84c" }}>
                  <span className="text-xl">{getFlag(team)}</span>
                  <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, color: "#fff", letterSpacing: "0.04em" }}>{team}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-48" style={{ background: "#0a0e1a" }}>
      <PageHeader title="Pick Your Teams" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div className="px-4 pt-4 pb-2">
        <p className="eyebrow mb-1">Team Selection</p>
        <p className="text-sm" style={{ color: "#8b93ab" }}>
          Pick 2 from Tier 1, 3 from Tier 2, and 1 from Tier 3
        </p>
      </div>

      <div className="px-4 pb-4 space-y-6">
        {TIERS.map(function (tier) {
          var tierPicks = picks[tier.id]
          var remaining = tier.limit - tierPicks.length
          var tierDone = remaining === 0
          return (
            <div key={tier.id}>
              {/* Tier header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="eyebrow">{tier.label}</span>
                  <span style={{ fontSize: 10, color: "#6b7494", marginLeft: 6 }}>· {tier.description}</span>
                </div>
                <span
                  style={{
                    fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 11,
                    letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 3,
                    background: tierDone ? "rgba(61,220,132,0.12)" : "rgba(201,168,76,0.1)",
                    border: tierDone ? "1px solid #3ddc84" : "1px solid #c9a84c",
                    color: tierDone ? "#3ddc84" : "#c9a84c",
                  }}
                >
                  {tierDone ? "✓ DONE" : "PICK " + tier.limit}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {tier.teams.map(function (team) {
                  var isSel = tierPicks.includes(team)
                  var isDisabled = !isSel && tierDone
                  return (
                    <button
                      key={team}
                      type="button"
                      onClick={function () { toggle(team, tier.id) }}
                      disabled={isDisabled}
                      style={{
                        background: isSel ? "rgba(201,168,76,0.12)" : "#0d1224",
                        border: isSel ? "1px solid #c9a84c" : "1px solid #1e2540",
                        borderLeft: isSel ? "3px solid #c9a84c" : "3px solid #1e2540",
                        borderRadius: "0 6px 6px 0",
                        padding: "9px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        opacity: isDisabled ? 0.35 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{getFlag(team)}</span>
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

      {/* Fixed footer */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-4 space-y-3"
        style={{ background: "#0a0e1a", borderTop: "1px solid #1e2540" }}
      >
        {/* Selected pills */}
        {allSelected.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allSelected.map(function (team) {
              return (
                <div key={team} className="flex items-center gap-1 px-2 py-1 rounded"
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid #c9a84c" }}>
                  <span style={{ fontSize: 12 }}>{getFlag(team)}</span>
                  <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, fontWeight: 600, color: "#c9a84c", letterSpacing: "0.06em" }}>{team}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="eyebrow">{allSelected.length} / 6 selected</span>
          {isComplete && <span style={{ color: "#3ddc84", fontSize: 11, fontFamily: "Oswald, sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}>READY</span>}
        </div>

        <div className="h-1 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: (allSelected.length / 6 * 100) + "%", background: isComplete ? "#3ddc84" : "#c9a84c" }} />
        </div>

        {error && <p style={{ color: "#e24b4a", fontSize: 12 }}>{error}</p>}

        <button
          type="button"
          className="btn-gold"
          disabled={!isComplete || saving}
          onClick={handleSave}
        >
          {saving ? "Saving…" : "Lock In My Teams"}
        </button>
      </div>
    </div>
  )
}
