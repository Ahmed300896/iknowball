import { supabase } from "./supabase.js"
import { calculateScorePoints, calculateXIPoints } from "./scoring.js"

export async function saveResult(matchId, homeScore, awayScore, matchType) {
  const { error } = await supabase
    .from("match_results")
    .upsert(
      { match_id: matchId, home_score: homeScore, away_score: awayScore, match_type: matchType },
      { onConflict: "match_id" }
    )
  if (error) throw error
}

export async function calculateAndSaveUserPoints(matchId) {
  const { data: resultRow, error: resultError } = await supabase
    .from("match_results")
    .select("home_score, away_score, match_type")
    .eq("match_id", matchId)
    .single()

  if (resultError) throw resultError
  if (!resultRow) throw new Error("No result found for match_id " + matchId)

  const actual = {
    homeScore: resultRow.home_score,
    awayScore: resultRow.away_score,
  }
  const matchType = resultRow.match_type

  const { data: predictionRows, error: predError } = await supabase
    .from("score_predictions")
    .select("user_id, predictions")

  if (predError) throw predError

  const upserts = []

  for (const row of (predictionRows ?? [])) {
    const pred = row.predictions?.[matchId] ?? row.predictions?.[String(matchId)]
    if (!pred) continue

    const points = calculateScorePoints(
      { homeScore: pred.homeScore, awayScore: pred.awayScore },
      actual,
      matchType
    )

    upserts.push({
      user_id: row.user_id,
      match_id: matchId,
      points: points,
      game: "score_predictor",
    })
  }

  if (upserts.length === 0) return

  const { error: upsertError } = await supabase
    .from("user_points")
    .upsert(upserts, { onConflict: "user_id,match_id,game" })

  if (upsertError) throw upsertError
}

export async function calculateAndSaveXIPoints(matchId) {
  var { data: resultRows, error: resultError } = await supabase
    .from('starting_xi_results')
    .select('team, players')
    .eq('match_id', String(matchId));
  if (resultError) throw resultError;
  if (!resultRows || resultRows.length === 0) return;

  var matchTypeRes = await supabase
    .from('match_results')
    .select('match_type')
    .eq('match_id', matchId)
    .single();
  var matchType = matchTypeRes.data?.match_type ?? 'group';

  var officialByTeam = {};
  resultRows.forEach(function(r) { officialByTeam[r.team] = r.players; });

  var { data: predRows, error: predError } = await supabase
    .from('starting_xi_predictions')
    .select('user_id, team, players')
    .eq('match_id', String(matchId));
  if (predError) throw predError;

  var upserts = [];
  (predRows ?? []).forEach(function(row) {
    var official = officialByTeam[row.team];
    if (!official) return;
    var points = calculateXIPoints(row.players, official, matchType);
    upserts.push({ user_id: row.user_id, match_id: matchId, points: points, game: 'starting_xi_' + row.team });
  });

  if (upserts.length === 0) return;
  var { error: upsertError } = await supabase
    .from('user_points')
    .upsert(upserts, { onConflict: 'user_id,match_id,game' });
  if (upsertError) throw upsertError;
}
