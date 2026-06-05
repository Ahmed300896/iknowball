export function calculatePoints(predicted, actual) {
  const { homeScore: ph, awayScore: pa } = predicted
  const { homeScore: ah, awayScore: aa } = actual

  if (ph === ah && pa === aa) return 3

  const predictedResult = Math.sign(ph - pa)
  const actualResult = Math.sign(ah - aa)
  if (predictedResult === actualResult) return 1

  return 0
}
