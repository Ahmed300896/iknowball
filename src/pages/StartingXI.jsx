import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import schedule from "../data/schedule";

var SCHEDULE = schedule;

export default function StartingXI() {
  const [view, setView] = useState("matches");
  const [userTeams, setUserTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [existingPredictions, setExistingPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(function () {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const today = new Date().toLocaleDateString("en-CA");

      // Fetch user's teams
      const { data: teamsRow } = await supabase
        .from("user_teams")
        .select("teams")
        .eq("user_id", user.id)
        .single();

      const teams = teamsRow?.teams ?? [];
      setUserTeams(teams);

      // Filter schedule to upcoming matches involving user's teams
      const upcoming = (SCHEDULE || []).filter(function (m) {
        return m.date >= today && (teams.includes(m.home) || teams.includes(m.away));
      });
      setMatches(upcoming);

      // Fetch all existing predictions for this user
      const { data: preds } = await supabase
        .from("starting_xi_predictions")
        .select("match_id, players")
        .eq("user_id", user.id);

      const predObj = {};
      (preds ?? []).forEach(function (row) {
        predObj[String(row.match_id)] = row.players;
      });
      setExistingPredictions(predObj);

      setLoading(false);
    }
    init();
  }, []);

  async function handleMatchClick(match) {
    const team = userTeams.includes(match.home) ? match.home : match.away;
    setSelectedMatch(match);
    setSelectedPlayers(existingPredictions[String(match.id)] ?? []);
    setSavedMsg("");
    setView("players");
    setLoadingPlayers(true);

    const { data } = await supabase
      .from("players")
      .select("name, position, shirt_number")
      .eq("team_name", team)
      .order("shirt_number", { ascending: true });

    setPlayers(data ?? []);
    setLoadingPlayers(false);
  }

  function togglePlayer(name) {
    if (selectedPlayers.includes(name)) {
      setSelectedPlayers(selectedPlayers.filter(function (n) { return n !== name; }));
    } else if (selectedPlayers.length < 11) {
      setSelectedPlayers([...selectedPlayers, name]);
    }
  }

  async function handleSubmit() {
    if (selectedPlayers.length !== 11 || saving) return;
    setSaving(true);
    setSavedMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("starting_xi_predictions")
      .upsert(
        {
          user_id: user.id,
          match_id: String(selectedMatch.id),
          players: selectedPlayers,
        },
        { onConflict: "user_id,match_id" }
      );

    setSaving(false);

    if (error) {
      setSavedMsg("Error: " + error.message);
      return;
    }

    setExistingPredictions(function (prev) {
      const next = Object.assign({}, prev);
      next[String(selectedMatch.id)] = selectedPlayers;
      return next;
    });
    setSavedMsg("Prediction saved!");
    setTimeout(function () {
      setView("matches");
      setSelectedMatch(null);
      setPlayers([]);
      setSelectedPlayers([]);
      setSavedMsg("");
    }, 1000);
  }

  // ── PLAYER VIEW ──────────────────────────────────────────────────────────
  if (view === "players" && selectedMatch) {
    const userTeam = userTeams.includes(selectedMatch.home) ? selectedMatch.home : selectedMatch.away;

    return (
      <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 100 }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid #1e2540", padding: "14px 16px" }}>
          <button
            type="button"
            onClick={function () { setView("matches"); }}
            style={{ background: "none", border: "none", color: "#c9a84c", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", marginBottom: 8 }}
          >
            ← BACK
          </button>
          <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "0.04em" }}>
            {selectedMatch.home} vs {selectedMatch.away}
          </p>
          <p style={{ fontSize: 12, color: "#8b93ab", marginTop: 3 }}>
            Pick {userTeam}'s starting 11
          </p>
        </div>

        {/* Counter */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #1e2540", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Selected</span>
          <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 14, color: selectedPlayers.length === 11 ? "#3ddc84" : "#c9a84c" }}>
            {selectedPlayers.length} / 11
          </span>
        </div>

        {/* Players */}
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {loadingPlayers ? (
            <p style={{ color: "#6b7494", fontSize: 14 }}>Loading players…</p>
          ) : players.length === 0 ? (
            <p style={{ color: "#8b93ab", fontSize: 14, textAlign: "center", paddingTop: 40 }}>
              No players found for {userTeam}.
            </p>
          ) : (
            players.map(function (p) {
              const isSel = selectedPlayers.includes(p.name);
              const isDisabled = !isSel && selectedPlayers.length >= 11;
              return (
                <button
                  key={p.name}
                  type="button"
                  disabled={isDisabled}
                  onClick={function () { togglePlayer(p.name); }}
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
                    opacity: isDisabled ? 0.3 : 1,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {p.shirt_number != null && (
                    <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 12, color: isSel ? "#c9a84c" : "#6b7494", width: 20, textAlign: "center", flexShrink: 0 }}>
                      {p.shirt_number}
                    </span>
                  )}
                  <span style={{ flex: 1, fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.02em" }}>
                    {p.name}
                  </span>
                  {p.position && (
                    <span style={{ fontSize: 10, color: "#6b7494", flexShrink: 0 }}>{p.position}</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Submit footer */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "#0a0e1a", borderTop: "1px solid #1e2540" }}>
          {savedMsg && (
            <p style={{ textAlign: "center", fontSize: 13, marginBottom: 8, color: savedMsg.startsWith("Error") ? "#e24b4a" : "#3ddc84" }}>
              {savedMsg}
            </p>
          )}
          <button
            type="button"
            disabled={selectedPlayers.length !== 11 || saving}
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "11px 16px",
              background: selectedPlayers.length === 11 && !saving ? "#c9a84c" : "#1e2540",
              color: selectedPlayers.length === 11 && !saving ? "#0a0e1a" : "#6b7494",
              border: "none",
              borderRadius: 4,
              fontFamily: "Oswald, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: selectedPlayers.length === 11 && !saving ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving…" : "Submit Prediction"}
          </button>
        </div>
      </div>
    );
  }

  // ── MATCH LIST VIEW ──────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", padding: "20px 16px 80px" }}>
      <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: "0.06em", marginBottom: 4 }}>
        STARTING XI
      </p>

      {loading ? (
        <p style={{ color: "#6b7494", fontSize: 14, marginTop: 40, textAlign: "center" }}>Loading…</p>
      ) : userTeams.length === 0 ? (
        <p style={{ color: "#8b93ab", fontSize: 14, marginTop: 40, textAlign: "center" }}>
          No teams selected. Pick your 5 teams first.
        </p>
      ) : matches.length === 0 ? (
        <p style={{ color: "#8b93ab", fontSize: 14, marginTop: 40, textAlign: "center" }}>
          No upcoming matches for your teams.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {matches.map(function (match) {
            const hasPred = !!existingPredictions[String(match.id)];
            return (
              <div
                key={match.id}
                onClick={function () { handleMatchClick(match); }}
                style={{
                  background: "#0d1224",
                  border: "1px solid #1e2540",
                  borderLeft: "3px solid #c9a84c",
                  borderRadius: "0 6px 6px 0",
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 4 }}>
                    Group {match.group} · {match.date}
                  </p>
                  <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 14, color: "#fff", letterSpacing: "0.02em" }}>
                    {match.home} vs {match.away}
                  </p>
                </div>
                {hasPred && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="10" fill="rgba(61,220,132,0.15)" stroke="#3ddc84" strokeWidth="1.5"/>
                    <path d="M7 11L9.5 13.5L15 8" stroke="#3ddc84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
