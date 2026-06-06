import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { groups, FLAGS } from "../data/teams"
import PageHeader from "./PageHeader"

export default function TeamSelectionScreen({ user, username, onTeamsSelected, onLogout, onBack }) {
  const [selected, setSelected] = useState([])
  const [savedTeams, setSavedTeams] = useState(null)
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(function () {
    async function loadExisting() {
      const { data } = await supabase
        .from("user_teams")
        .select("teams, locked")
        .eq("user_id", user.id)
        .single()
      if (data) {
        setSavedTeams(data.teams)
        setLocked(data.locked)
        if (!data.locked) setSelected(data.teams)
      }
      setLoading(false)
    }
    loadExisting()
  }, [user.id])

  function toggle(team) {
    if (locked) return
    if (selected.includes(team)) {
      setSelected(selected.filter(function (t) { return t !== team }))
    } else if (selected.length < 5) {
      setSelected([...selected, team])
    }
  }

  async function handleSave() {
    if (selected.length !== 5 || saving) return
    setSaving(true)
    setError("")
    try {
      const { error: upsertError } = await supabase
        .from("user_teams")
        .upsert(
          { user_id: user.id, teams: selected, locked: false },
          { onConflict: "user_id" }
        )
      if (upsertError) throw upsertError

      // Also keep profiles.favorite_teams in sync
      await supabase
        .from("profiles")
        .update({ favorite_teams: selected })
        .eq("id", user.id)

      onTeamsSelected(selected)
    } catch (err) {
      setError("Failed to save teams. Please try again.")
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

  // Locked view
  if (locked && savedTeams) {
    return (
      <div className="min-h-screen pb-20" style={{ background: "#0a0e1a" }}>
        <PageHeader title="My Teams" showBack onBack={onBack} username={username} onLogout={onLogout} />
        <div className="px-4 pt-8 text-center">
          <p className="eyebrow mb-3">Team Selection</p>
          <p className="text-white text-xl mb-2" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
            YOUR TEAMS ARE LOCKED IN
          </p>
          <p className="text-sm mb-8" style={{ color: "#8b93ab" }}>Team selection is locked for the tournament.</p>
          <div className="space-y-2 max-w-sm mx-auto">
            {savedTeams.map(function (team) {
              return (
                <div
                  key={team}
                  className="flex items-center gap-3 px-4 py-3 rounded"
                  style={{ background: "#0d1224", border: "1px solid #1e2540", borderLeft: "3px solid #c9a84c" }}
                >
                  <span className="text-xl">{FLAGS[team] || "⚽"}</span>
                  <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, color: "#fff", letterSpacing: "0.04em" }}>{team}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const isComplete = selected.length === 5

  return (
    <div className="min-h-screen pb-40" style={{ background: "#0a0e1a" }}>
      <PageHeader title="Pick Your Teams" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div className="px-4 pt-4 pb-2">
        <p className="eyebrow mb-1">Team Selection</p>
        <p className="text-sm" style={{ color: "#8b93ab" }}>
          Pick exactly 5 teams from the World Cup 2026 groups
        </p>
      </div>

      <div className="px-4 pb-4 space-y-5">
        {groups.map(function (group) {
          return (
            <div key={group.id}>
              <p className="eyebrow mb-2">Group {group.id}</p>
              <div className="grid grid-cols-2 gap-2">
                {group.teams.map(function (team) {
                  const isSelected = selected.includes(team)
                  const isDisabled = !isSelected && selected.length >= 5
                  return (
                    <button
                      key={team}
                      type="button"
                      onClick={function () { toggle(team) }}
                      disabled={isDisabled}
                      style={{
                        background: isSelected ? "rgba(201,168,76,0.12)" : "#0d1224",
                        border: isSelected ? "1px solid #c9a84c" : "1px solid #1e2540",
                        borderLeft: isSelected ? "3px solid #c9a84c" : "3px solid #1e2540",
                        borderRadius: "0 6px 6px 0",
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        opacity: isDisabled ? 0.4 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{FLAGS[team] || "⚽"}</span>
                      <span
                        style={{
                          fontFamily: "Oswald, sans-serif",
                          fontWeight: 600,
                          fontSize: 12,
                          letterSpacing: "0.04em",
                          color: isSelected ? "#c9a84c" : "#ffffff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
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
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selected.map(function (team) {
              return (
                <div
                  key={team}
                  className="flex items-center gap-1 px-2 py-1 rounded"
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid #c9a84c" }}
                >
                  <span style={{ fontSize: 13 }}>{FLAGS[team] || "⚽"}</span>
                  <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, fontWeight: 600, color: "#c9a84c", letterSpacing: "0.06em" }}>{team}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between mb-1">
          <span className="eyebrow">{selected.length} / 5 selected</span>
          {isComplete && <span style={{ color: "#3ddc84", fontSize: 11, fontFamily: "Oswald, sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}>READY TO LOCK IN</span>}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: (selected.length / 5 * 100) + "%", background: isComplete ? "#3ddc84" : "#c9a84c" }}
          />
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
