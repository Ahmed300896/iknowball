import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { groups, FLAGS } from "../data/teams"
import PageHeader from "../components/PageHeader"

function getFlag(team) { return FLAGS[team] || "⚽" }

export default function ChampionPick({ onBack, onLogout, username }) {
  var [selected, setSelected] = useState(null)
  var [savedPick, setSavedPick] = useState(null)
  var [saving, setSaving] = useState(false)
  var [savedMsg, setSavedMsg] = useState("")
  var [loading, setLoading] = useState(true)

  useEffect(function () {
    async function load() {
      var res = await supabase.auth.getUser()
      var user = res.data.user
      if (!user) { setLoading(false); return }
      var { data } = await supabase
        .from("champion_picks")
        .select("team")
        .eq("user_id", user.id)
        .single()
      if (data && data.team) {
        setSelected(data.team)
        setSavedPick(data.team)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!selected || saving) return
    setSaving(true)
    setSavedMsg("")
    var res = await supabase.auth.getUser()
    var user = res.data.user
    var { error } = await supabase
      .from("champion_picks")
      .upsert(
        { user_id: user.id, team: selected },
        { onConflict: "user_id" }
      )
    setSaving(false)
    if (error) {
      setSavedMsg("Error: " + error.message)
      return
    }
    setSavedPick(selected)
    setSavedMsg("Champion pick saved!")
    setTimeout(function () { setSavedMsg("") }, 2500)
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7494", fontFamily: "Oswald, sans-serif" }}>Loading…</p>
      </div>
    )
  }

  var isUnsaved = selected && selected !== savedPick

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 120 }}>
      <PageHeader title="CHAMPION PICK" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div style={{ padding: "20px 16px 0" }}>
        <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65, marginBottom: 24 }}>
          Pick one team to win the 2026 World Cup. You can update your pick until the tournament begins on June 11.
        </p>

        {groups.map(function (group) {
          return (
            <div key={group.id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ height: 2, width: 14, background: "#c9a84c", borderRadius: 1, flexShrink: 0 }} />
                <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", color: "#c9a84c" }}>
                  GROUP {group.id}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {group.teams.map(function (team) {
                  var isSel = selected === team
                  return (
                    <button
                      key={team}
                      type="button"
                      onClick={function () { setSelected(team); setSavedMsg("") }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        background: isSel ? "rgba(201,168,76,0.1)" : "#0d1224",
                        border: isSel ? "1px solid #c9a84c" : "1px solid #1e2540",
                        borderLeft: isSel ? "3px solid #c9a84c" : "3px solid #1e2540",
                        borderRadius: "0 6px 6px 0",
                        color: isSel ? "#c9a84c" : "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{getFlag(team)}</span>
                      <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.04em", flex: 1 }}>
                        {team}
                      </span>
                      {isSel && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="8" cy="8" r="7" fill="rgba(201,168,76,0.2)" stroke="#c9a84c" strokeWidth="1.5"/>
                          <path d="M5 8L7 10L11 6" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Fixed footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "#0a0e1a", borderTop: "1px solid #1e2540" }}>
        {selected && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>{getFlag(selected)}</span>
            <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 13, color: "#c9a84c", letterSpacing: "0.04em" }}>
              {selected}
            </span>
            {savedPick === selected && (
              <span style={{ fontSize: 10, color: "#3ddc84", fontFamily: "Oswald, sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}>✓ SAVED</span>
            )}
          </div>
        )}
        {savedMsg && (
          <p style={{ textAlign: "center", fontSize: 13, marginBottom: 8, color: savedMsg.startsWith("Error") ? "#e24b4a" : "#3ddc84" }}>
            {savedMsg}
          </p>
        )}
        <button
          type="button"
          disabled={!isUnsaved || saving}
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "11px 16px",
            background: isUnsaved && !saving ? "#c9a84c" : "#1e2540",
            color: isUnsaved && !saving ? "#0a0e1a" : "#6b7494",
            border: "none",
            borderRadius: 4,
            fontFamily: "Oswald, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: isUnsaved && !saving ? "pointer" : "not-allowed",
          }}
        >
          {saving ? "Saving…" : !selected ? "Select a Team" : !isUnsaved ? "Pick Saved" : "Save Champion Pick"}
        </button>
      </div>
    </div>
  )
}
