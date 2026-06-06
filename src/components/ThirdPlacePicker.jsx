import { useState } from "react"
import { FLAGS } from "../data/teams"
import PageHeader from "./PageHeader"

var GROUP_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

function getFlag(team) { return FLAGS[team] || "⚽" }

export default function ThirdPlacePicker({ groupPicks, onConfirm, onBack, username, onLogout }) {
  var thirdPlaceTeams = GROUP_LETTERS.map(function (g) {
    return { group: g, team: groupPicks[g] ? groupPicks[g][2] : "?" }
  })

  var [selected, setSelected] = useState([])

  function toggle(team) {
    if (selected.includes(team)) {
      setSelected(selected.filter(function (t) { return t !== team }))
    } else if (selected.length < 8) {
      setSelected(selected.concat([team]))
    }
  }

  var remaining = 8 - selected.length

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 100 }}>
      <PageHeader
        title="PICK 8 THIRD PLACE TEAMS"
        showBack
        onBack={onBack}
        username={username}
        onLogout={onLogout}
      />

      {/* Subtitle + counter */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e2540" }}>
        <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6, margin: "0 0 8px" }}>
          Select 8 from the 12 third-place finishers to advance to the Round of 32
        </p>
        <span style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 14,
          color: selected.length === 8 ? "#3ddc84" : "#c9a84c",
        }}>
          {selected.length} / 8 selected
        </span>
      </div>

      {/* Team list */}
      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {thirdPlaceTeams.map(function (item) {
          var isSel = selected.includes(item.team)
          var isDisabled = !isSel && selected.length >= 8
          return (
            <button
              key={item.group}
              type="button"
              disabled={isDisabled}
              onClick={function () { toggle(item.team) }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                background: isSel ? "rgba(201,168,76,0.1)" : "#0d1224",
                border: isSel ? "1px solid #c9a84c" : "1px solid #1e2540",
                borderLeft: isSel ? "3px solid #c9a84c" : "3px solid #1e2540",
                borderRadius: "0 6px 6px 0",
                opacity: isDisabled ? 0.35 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              <span style={{
                fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 10,
                letterSpacing: "0.16em", color: "#6b7494", width: 16, flexShrink: 0,
              }}>
                {item.group}
              </span>
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
                {getFlag(item.team)}
              </span>
              <span style={{
                fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13,
                letterSpacing: "0.04em", color: isSel ? "#c9a84c" : "#fff", flex: 1,
              }}>
                {item.team}
              </span>
              <span style={{ fontSize: 10, color: "#6b7494", flexShrink: 0 }}>
                3rd · Group {item.group}
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

      {/* Fixed footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "#0a0e1a", borderTop: "1px solid #1e2540" }}>
        <button
          type="button"
          disabled={selected.length !== 8}
          onClick={function () { onConfirm(selected) }}
          style={{
            width: "100%",
            padding: "11px 16px",
            background: selected.length === 8 ? "#c9a84c" : "#1e2540",
            color: selected.length === 8 ? "#0a0e1a" : "#6b7494",
            border: "none",
            borderRadius: 4,
            fontFamily: "Oswald, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: selected.length === 8 ? "pointer" : "not-allowed",
          }}
        >
          {selected.length === 8
            ? "Confirm — Go to Round of 32"
            : "Select " + remaining + " more team" + (remaining === 1 ? "" : "s")}
        </button>
      </div>
    </div>
  )
}
