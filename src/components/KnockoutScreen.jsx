import { useState, useMemo } from "react"
import { FLAGS } from "../data/teams"
import { supabase } from "../lib/supabase"

var ROUNDS = [
  { key: "r32",   label: "Round of 32",    count: 16 },
  { key: "r16",   label: "Round of 16",    count: 8 },
  { key: "qf",    label: "Quarter-finals", count: 4 },
  { key: "sf",    label: "Semi-finals",    count: 2 },
  { key: "final", label: "Final",          count: 1 },
]

// Official FIFA 2026 R32 bracket.
// 24 automatic qualifiers: winners + runners-up from all 12 groups (M1-M12).
// 8 wildcard spots: the user-selected 3rd-place teams (M13-M16).
function buildR32Slots(groupPicks, thirdPlacePicks) {
  var w = function (g) { return groupPicks[g] ? groupPicks[g][0] : "?" }
  var r = function (g) { return groupPicks[g] ? groupPicks[g][1] : "?" }
  var tp = thirdPlacePicks || []
  return [
    [w("A"), r("B")],              // M1
    [w("C"), r("D")],              // M2
    [w("E"), r("F")],              // M3
    [w("G"), r("H")],              // M4
    [w("I"), r("J")],              // M5
    [w("K"), r("L")],              // M6
    [r("A"), w("B")],              // M7
    [r("C"), w("D")],              // M8
    [r("E"), w("F")],              // M9
    [r("G"), w("H")],              // M10
    [r("I"), w("J")],              // M11
    [r("K"), w("L")],              // M12
    [tp[0] || "?", tp[1] || "?"], // M13 - 3rd place wildcard
    [tp[2] || "?", tp[3] || "?"], // M14 - 3rd place wildcard
    [tp[4] || "?", tp[5] || "?"], // M15 - 3rd place wildcard
    [tp[6] || "?", tp[7] || "?"], // M16 - 3rd place wildcard
  ]
}

function getFlag(team) { return FLAGS[team] || "⚽" }

function MatchCard({ teamA, teamB, picked, onPick }) {
  return (
    <div style={{ background: "#0d1224", border: "1px solid #1e2540", borderRadius: 8, overflow: "hidden" }}>
      {[teamA, teamB].map(function (team, idx) {
        var isPicked = picked === team
        return (
          <div key={team}>
            {idx === 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 14px" }}>
                <div style={{ flex: 1, height: 1, background: "#1e2540" }} />
                <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 9, letterSpacing: "0.12em", color: "#3d4560" }}>VS</span>
                <div style={{ flex: 1, height: 1, background: "#1e2540" }} />
              </div>
            )}
            <button
              type="button"
              onClick={function () { onPick(team) }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 14px",
                width: "100%",
                textAlign: "left",
                background: isPicked ? "rgba(201,168,76,0.1)" : "transparent",
                border: "none",
                borderLeft: isPicked ? "3px solid #c9a84c" : "3px solid transparent",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1, width: 26, textAlign: "center", flexShrink: 0 }}>
                {getFlag(team)}
              </span>
              <span style={{
                flex: 1,
                fontFamily: "Oswald, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.04em",
                color: isPicked ? "#c9a84c" : "#fff",
              }}>
                {team}
              </span>
              {isPicked && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="7" fill="rgba(201,168,76,0.2)" stroke="#c9a84c" strokeWidth="1.5" />
                  <path d="M5 8L7 10L11 6" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default function KnockoutScreen({ username, groupPicks, thirdPlacePicks, onSubmit, onBack, onViewPredictions, onHome }) {
  var r32Slots = useMemo(function () { return buildR32Slots(groupPicks, thirdPlacePicks) }, [groupPicks, thirdPlacePicks])

  var [roundIndex, setRoundIndex] = useState(0)
  var [allPicks, setAllPicks] = useState(function () {
    return Object.fromEntries(ROUNDS.map(function (r) { return [r.key, Array(r.count).fill(null)] }))
  })
  var [successChampion, setSuccessChampion] = useState(null)
  var [showSuccess, setShowSuccess] = useState(false)
  var [saving, setSaving] = useState(false)
  var [saveError, setSaveError] = useState("")

  var currentRound = ROUNDS[roundIndex]
  var currentPicks = allPicks[currentRound.key]

  var matches = roundIndex === 0
    ? r32Slots
    : (function () {
        var prevPicks = allPicks[ROUNDS[roundIndex - 1].key]
        return Array.from({ length: currentRound.count }, function (_, i) {
          return [prevPicks[i * 2], prevPicks[i * 2 + 1]]
        })
      })()

  function handlePick(matchIndex, winner) {
    setAllPicks(function (prev) {
      return Object.assign({}, prev, {
        [currentRound.key]: prev[currentRound.key].map(function (p, i) { return i === matchIndex ? winner : p }),
      })
    })
  }

  var allPicked = currentPicks.every(function (p) { return p !== null })
  var isFinal = roundIndex === ROUNDS.length - 1

  async function handleNext() {
    if (!isFinal) {
      setRoundIndex(function (r) { return r + 1 })
      return
    }

    setSaving(true)
    setSaveError("")

    var champion = allPicks.final[0]
    var { error } = await supabase.from("predictions").insert({
      nickname: username,
      group_picks: groupPicks,
      knockout: {
        r32: allPicks.r32,
        r16: allPicks.r16,
        qf: allPicks.qf,
        sf: allPicks.sf,
        final: champion,
      },
      champion,
    })

    setSaving(false)

    if (error) {
      console.error("Supabase insert error:", error)
      setSaveError("Something went wrong. Please try again.")
      return
    }

    setSuccessChampion(champion)
    setShowSuccess(true)
  }

  // ── Success screen ───────────────────────────────────────────────────────

  if (showSuccess) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff" }}>
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
          <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", color: "#fff", margin: 0 }}>
            KNOCKOUT BRACKET
          </p>
          <div style={{ width: 18 }} />
        </div>

        <div style={{ padding: "32px 16px" }}>
          <div style={{ background: "#0d1224", border: "1px solid #1e2540", borderRadius: 12, padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, letterSpacing: "0.2em", color: "#c9a84c", marginBottom: 12 }}>
              PREDICTION SAVED
            </p>
            <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 24, color: "#fff", marginBottom: 24 }}>
              Your pick is locked in!
            </p>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, margin: "0 auto 16px",
            }}>
              {getFlag(successChampion)}
            </div>
            <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 16, color: "#c9a84c", letterSpacing: "0.06em", marginBottom: 28 }}>
              {successChampion}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  width: "100%", padding: "11px 16px",
                  background: "#c9a84c", color: "#0a0e1a",
                  border: "none", borderRadius: 4,
                  fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
                Back to Home
              </button>
              <button
                type="button"
                onClick={onViewPredictions}
                style={{
                  width: "100%", padding: "11px 16px",
                  background: "transparent", color: "#c9a84c",
                  border: "1px solid rgba(201,168,76,0.4)", borderRadius: 4,
                  fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
                See All Predictions
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main bracket screen ──────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 100 }}>
      {/* Header */}
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
        <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", color: "#fff", margin: 0 }}>
          KNOCKOUT BRACKET
        </p>
        <div style={{ width: 18 }} />
      </div>

      {/* Round info */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e2540" }}>
        <p style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, letterSpacing: "0.2em", color: "#6b7494", margin: "0 0 3px" }}>
          ROUND {roundIndex + 1} OF {ROUNDS.length}
        </p>
        <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", margin: 0 }}>
          {currentRound.label}
        </p>
        {roundIndex === 0 && (
          <p style={{ fontSize: 11, color: "#8b93ab", marginTop: 6, lineHeight: 1.6 }}>
            32 teams: 24 group qualifiers (1st &amp; 2nd from each group) + 8 best 3rd-place teams.
            3rd-place matchups are approximate — final pairings depend on which groups they qualify from.
          </p>
        )}
      </div>

      {/* Match cards */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {matches.map(function (pair, i) {
          return (
            <MatchCard
              key={i}
              teamA={pair[0]}
              teamB={pair[1]}
              picked={currentPicks[i]}
              onPick={function (winner) { handlePick(i, winner) }}
            />
          )
        })}
      </div>

      {/* Fixed footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "#0a0e1a", borderTop: "1px solid #1e2540" }}>
        {saveError && (
          <p style={{ textAlign: "center", fontSize: 12, color: "#e24b4a", marginBottom: 8 }}>{saveError}</p>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!allPicked || saving}
          style={{
            width: "100%",
            padding: "11px 16px",
            background: allPicked && !saving ? "#c9a84c" : "#1e2540",
            color: allPicked && !saving ? "#0a0e1a" : "#6b7494",
            border: "none",
            borderRadius: 4,
            fontFamily: "Oswald, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: allPicked && !saving ? "pointer" : "not-allowed",
          }}
        >
          {saving ? "Saving..." : isFinal ? "Submit My Prediction" : "Next Round"}
        </button>
      </div>
    </div>
  )
}
