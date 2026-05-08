import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FLAGS, groupNames } from '../data/teams'

function PredictionCard({ prediction }) {
  const { nickname, champion, group_picks } = prediction

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-white font-bold text-lg">{nickname}</span>
        {champion && (
          <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1">
            <span className="text-base leading-none">{FLAGS[champion] ?? '🏳️'}</span>
            <span className="text-yellow-300 text-sm font-semibold">{champion}</span>
          </div>
        )}
      </div>

      {group_picks && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {groupNames.map(g => {
            const picks = group_picks[g]
            if (!picks) return null
            const [first, second] = picks
            return (
              <div key={g} className="flex items-center gap-2">
                <span className="text-white/30 text-xs font-bold w-4">{g}</span>
                <span className="text-white/80 text-xs truncate">
                  {FLAGS[first] ?? '🏳️'} {first}
                </span>
                <span className="text-white/30 text-xs">/</span>
                <span className="text-white/50 text-xs truncate">
                  {FLAGS[second] ?? '🏳️'} {second}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function PredictionsFeed({ nickname }) {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPredictions() {
      const { data, error } = await supabase
        .from('predictions')
        .select('nickname, champion, group_picks, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch predictions:', error)
        setError('Could not load predictions.')
      } else {
        setPredictions(data)
      }
      setLoading(false)
    }

    fetchPredictions()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">iknowball</span>
        <span className="text-white/40 text-sm">{nickname}</span>
      </div>

      <div className="px-4 pt-6 pb-4">
        <h1 className="text-white text-2xl font-bold">Predictions</h1>
        <p className="text-white/40 text-sm mt-1">See what everyone thinks</p>
      </div>

      <div className="px-4 pb-12 flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center pt-16">
            <span className="text-white/30 text-sm">Loading...</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center pt-16">
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {!loading && !error && predictions.length === 0 && (
          <div className="flex flex-col items-center pt-16 gap-3">
            <span className="text-4xl">⚽</span>
            <p className="text-white font-semibold">No predictions yet</p>
            <p className="text-white/40 text-sm text-center">
              You're the first one here. Share the link with your friends.
            </p>
          </div>
        )}

        {!loading && !error && predictions.map((p, i) => (
          <PredictionCard key={p.id ?? i} prediction={p} />
        ))}
      </div>
    </div>
  )
}
