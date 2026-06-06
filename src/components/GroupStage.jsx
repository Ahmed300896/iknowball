import { useState } from "react"
import { groupsMap, groupNames, FLAGS } from "../data/teams"

var POSITION_COLORS = ["#c9a84c", "#8b93ab", "#6b7494", "#3d4560"]
var POSITION_LABELS = ["1ST", "2ND", "3RD", "4TH"]

function getFlag(team) { return FLAGS[team] || "⚽" }

function TeamRow({ team, position, isFirst, isLast, onMoveUp, onMoveDown }) {
  var isEliminated = position === 4
  var isAdvancing = position <= 2
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      background: isAdvancing ? "rgba(201,168,76,0.06)" : "#0a0e1a",
      border: isAdvancing ? "1px solid rgba(201,168,76,0.2)" : "1px solid #1e2540",
      borderLeft: isAdvancing ? "3px solid #c9a84c" : position === 3 ? "3px solid #6b7494" : "3px solid #2a3354",
      borderRadius: "0 6px 6px 0",
      opacity: isEliminated ? 0.4 : 1,
    }}>
      <span style={{
        fontFamily: "Oswald, sans-serif",
        fontWeight: 700,
        fontSize: 9,
        letterSpacing: "0.12em",
        color: POSITION_COLORS[position - 1],
        width: 26,
        textAlign: "center",
        flexShrink: 0,
      }}>
        {POSITION_LABELS[position - 1]}
      </span>
      <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>
        {getFlag(team)}
      </span>
      <span style={{
        flex: 1,
        fontFamily: "Oswald, sans-serif",
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: "0.03em",
        color: isEliminated ? "#6b7494" : "#fff",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {team}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          style={{
            width: 26,
            height: 26,
            background: "none",
            border: "1px solid #1e2540",
            borderRadius: 4,
            color: isFirst ? "#2a3354" : "#c9a84c",
            cursor: isFirst ? "not-allowed" : "pointer",
            fontSize: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          style={{
            width: 26,
            height: 26,
            background: "none",
            border: "1px solid #1e2540",
            borderRadius: 4,
            color: isLast ? "#2a3354" : "#c9a84c",
            cursor: isLast ? "not-allowed" : "pointer",
            fontSize: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ▼
        </button>
      </div>
    </div>
  )
}

function GroupCard({ groupLetter, teams, onReorder }) {
  function move(index, direction) {
    var next = teams.slice()
    var swap = index + direction
    var tmp = next[index]
    next[index] = next[swap]
    next[swap] = tmp
    onReorder(groupLetter, next)
  }

  return (
    <div style={{
      background: "#0d1224",
      border: "1px solid #1e2540",
      borderRadius: 8,
      padding: "14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ height: 2, width: 14, background: "#c9a84c", borderRadius: 1, flexShrink: 0 }} />
        <span style={{
          fontFamily: "Oswald, sans-serif",
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#c9a84c",
        }}>
          Group {groupLetter}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {teams.map(function (team, i) {
          return (
            <TeamRow
              key={team}
              team={team}
              position={i + 1}
              isFirst={i === 0}
              isLast={i === teams.length - 1}
              onMoveUp={function () { move(i, -1) }}
              onMoveDown={function () { move(i, 1) }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function GroupStage({ username, onNext, onBack, onHome }) {
  var [picks, setPicks] = useState(function () {
    return Object.fromEntries(groupNames.map(function (g) { return [g, groupsMap[g].slice()] }))
  })

  function handleReorder(groupLetter, newOrder) {
    setPicks(function (prev) { return Object.assign({}, prev, { [groupLetter]: newOrder }) })
  }

  var allRanked = groupNames.every(function (g) { return picks[g] && picks[g].length === 4 })

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ height: 3, background: "#c9a84c" }} />
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #1e2540",
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", color: "#fff", margin: 0 }}>
          GROUP STAGE
        </p>
        <div style={{ width: 18 }} />
      </div>

      {/* Info strip */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e2540" }}>
        <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 4 }}>
          Pick your group standings
        </p>
        <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6, margin: "0 0 10px" }}>
          Use the arrows to rank each group 1st to 4th
        </p>
        <p style={{ fontSize: 11, color: "#3ddc84", fontWeight: 600, margin: "0 0 3px" }}>
          ✓ Top 2 from each group advance automatically
        </p>
        <p style={{ fontSize: 11, color: "#8b93ab", margin: 0 }}>
          ★ 3rd place teams compete for 8 wildcard spots
        </p>
      </div>

      {/* Group cards */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {groupNames.map(function (g) {
          return (
            <GroupCard key={g} groupLetter={g} teams={picks[g]} onReorder={handleReorder} />
          )
        })}
      </div>

      {/* Fixed footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "#0a0e1a", borderTop: "1px solid #1e2540" }}>
        <button
          type="button"
          onClick={function () { onNext(picks) }}
          disabled={!allRanked}
          style={{
            width: "100%",
            padding: "11px 16px",
            background: allRanked ? "#c9a84c" : "#1e2540",
            color: allRanked ? "#0a0e1a" : "#6b7494",
            border: "none",
            borderRadius: 4,
            fontFamily: "Oswald, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: allRanked ? "pointer" : "not-allowed",
          }}
        >
          Next — Pick 3rd Place Teams
        </button>
      </div>
    </div>
  )
}
