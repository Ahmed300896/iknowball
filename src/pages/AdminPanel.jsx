import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import matches from "../data/schedule"
import { saveResult, calculateAndSaveUserPoints } from "../lib/resultsHelper"
import PageHeader from "../components/PageHeader"

const ADMIN_EMAIL = "sayemahmed300896@gmail.com"

function formatMatchLabel(m) {
  const [y, mo, d] = m.date.split("-")
  const date = new Date(Number(y), Number(mo) - 1, Number(d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  return m.home + " vs " + m.away + " — " + date
}

export default function AdminPanel({ user, username, onBack, onLogout }) {
  const isAdmin = user?.email === ADMIN_EMAIL

  const [selectedMatchId, setSelectedMatchId] = useState("")
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(true)

  useEffect(function() {
    if (!isAdmin) return
    fetchResults()
  }, [isAdmin])

  async function fetchResults() {
    setLoadingResults(true)
    const { data } = await supabase
      .from("match_results")
      .select("match_id, home_score, away_score, match_type")
      .order("match_id", { ascending: true })
    setResults(data ?? [])
    setLoadingResults(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedMatchId) return
    setSaving(true)
    setMessage(null)
    try {
      const id = Number(selectedMatchId)
      await saveResult(id, Number(homeScore), Number(awayScore), "group")
      await calculateAndSaveUserPoints(id)
      setMessage({ ok: true, text: "Result saved and points calculated!" })
      fetchResults()
    } catch (err) {
      setMessage({ ok: false, text: "Error: " + err.message })
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ background: "#0a0e1a" }}
      >
        <p
          style={{
            fontFamily: "Oswald, sans-serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.1em",
            color: "#e24b4a",
          }}
        >
          ACCESS DENIED
        </p>
        <button
          type="button"
          className="btn-outline"
          style={{ width: "auto", padding: "8px 24px" }}
          onClick={onBack}
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "#0a0e1a" }}>
      <PageHeader
        title="Admin Panel"
        showBack
        onBack={onBack}
        username={username}
        onLogout={onLogout}
      />

      <div className="px-4 pt-6 space-y-8">
        {/* Enter result form */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 3, height: 18, background: "#c9a84c", borderRadius: 2 }} />
            <p className="eyebrow">Enter Match Result</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="eyebrow block mb-2">Match</label>
              <select
                value={selectedMatchId}
                onChange={function(e) { setSelectedMatchId(e.target.value) }}
                required
                style={{
                  background: "#141b30",
                  border: "1px solid #2a3354",
                  color: "#ffffff",
                  borderRadius: 4,
                  padding: "10px 12px",
                  width: "100%",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                }}
              >
                <option value="">Select a match…</option>
                {matches.map(function(m) {
                  return (
                    <option key={m.id} value={m.id}>
                      {formatMatchLabel(m)}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-2">Home Score</label>
                <input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={function(e) { setHomeScore(e.target.value) }}
                  style={{
                    background: "#141b30",
                    border: "1px solid #2a3354",
                    color: "#ffffff",
                    borderRadius: 4,
                    padding: "10px 12px",
                    width: "100%",
                    fontSize: 16,
                  }}
                />
              </div>
              <div>
                <label className="eyebrow block mb-2">Away Score</label>
                <input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={function(e) { setAwayScore(e.target.value) }}
                  style={{
                    background: "#141b30",
                    border: "1px solid #2a3354",
                    color: "#ffffff",
                    borderRadius: 4,
                    padding: "10px 12px",
                    width: "100%",
                    fontSize: 16,
                  }}
                />
              </div>
            </div>

            {message && (
              <p
                style={{
                  fontSize: 13,
                  color: message.ok ? "#3ddc84" : "#e24b4a",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              className="btn-gold"
              disabled={saving || !selectedMatchId}
            >
              {saving ? "Saving…" : "Save Result & Calculate Points"}
            </button>
          </form>
        </div>

        {/* Results table */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 3, height: 18, background: "#c9a84c", borderRadius: 2 }} />
            <p className="eyebrow">Entered Results</p>
          </div>

          {loadingResults ? (
            <p style={{ color: "#6b7494", fontSize: 14 }}>Loading…</p>
          ) : results.length === 0 ? (
            <p style={{ color: "#6b7494", fontSize: 14 }}>No results entered yet.</p>
          ) : (
            <div style={{ border: "1px solid #1e2540", borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0d1224", borderBottom: "1px solid #1e2540" }}>
                    <th
                      className="eyebrow"
                      style={{ padding: "10px 12px", textAlign: "left" }}
                    >
                      ID
                    </th>
                    <th
                      className="eyebrow"
                      style={{ padding: "10px 12px", textAlign: "left" }}
                    >
                      Match
                    </th>
                    <th
                      className="eyebrow"
                      style={{ padding: "10px 12px", textAlign: "center" }}
                    >
                      Score
                    </th>
                    <th
                      className="eyebrow"
                      style={{ padding: "10px 12px", textAlign: "left" }}
                    >
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(function(r, i) {
                    const match = matches.find(function(m) { return m.id === r.match_id })
                    return (
                      <tr
                        key={r.match_id}
                        style={{
                          borderBottom: i < results.length - 1 ? "1px solid #1e2540" : "none",
                          background: "#0a0e1a",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#6b7494",
                            fontSize: 13,
                            fontFamily: "Oswald, sans-serif",
                          }}
                        >
                          {r.match_id}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#ffffff", fontSize: 12 }}>
                          {match ? match.home + " vs " + match.away : "Match " + r.match_id}
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            fontFamily: "Oswald, sans-serif",
                            fontWeight: 700,
                            color: "#c9a84c",
                            fontSize: 15,
                          }}
                        >
                          {r.home_score} – {r.away_score}
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#6b7494",
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {r.match_type ?? "group"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
