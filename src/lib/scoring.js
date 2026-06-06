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

export function calculateScorePoints(prediction, result, matchType) {
  if (
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore
  ) {
    return EXACT_SCORE_POINTS[matchType] ?? 0
  }
  return 0
}
