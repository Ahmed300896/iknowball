export function calculatePoints(predicted, actual) {
  const { homeScore: ph, awayScore: pa } = predicted
  const { homeScore: ah, awayScore: aa } = actual

  if (ph === ah && pa === aa) return 3

  const predictedResult = Math.sign(ph - pa)
  const actualResult = Math.sign(ah - aa)
  if (predictedResult === actualResult) return 1

  return 0
}

const EXACT_SCORE_POINTS = {
  group: 5,
  r32: 10,
  r16: 20,
  qf: 35,
  sf: 50,
  final: 75,
}

export function calculateXIPoints(predictedPlayers, officialPlayers, matchType) {
  if (!predictedPlayers || !officialPlayers) return 0;
  var officialSet = new Set(officialPlayers.map(function(p) { return p.toLowerCase().trim(); }));
  var correct = predictedPlayers.filter(function(p) { return officialSet.has(p.toLowerCase().trim()); }).length;
  var pointsPerPlayer = matchType === 'group' ? 1 : 2;
  var bonus = correct >= 7 ? (matchType === 'group' ? 5 : 10) : 0;
  return (correct * pointsPerPlayer) + bonus;
}

export function calculateScorePoints(prediction, result, matchType) {
  if (
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore
  ) {
    return EXACT_SCORE_POINTS[matchType] ?? 0
  }
  return 0
}
