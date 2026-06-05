import { createClient } from '@supabase/supabase-js'

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL         = 'https://szsalcjummwfgqrvzkqa.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const API_KEY              = '30bf6241f337108030c5019d7d7f65c1'
const API_BASE             = 'https://v3.football.api-sports.io'

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── Teams: [ourName, apiSearchName] ──────────────────────────────────────
const TEAMS = [
  ['Mexico',                 'Mexico'],
  ['South Korea',            'South Korea'],
  ['South Africa',           'South Africa'],
  ['Czechia',                'Czech Republic'],
  ['Canada',                 'Canada'],
  ['Bosnia & Herzegovina',   'Bosnia-Herzegovina'],
  ['Qatar',                  'Qatar'],
  ['Switzerland',            'Switzerland'],
  ['Brazil',                 'Brazil'],
  ['Morocco',                'Morocco'],
  ['Haiti',                  'Haiti'],
  ['Scotland',               'Scotland'],
  ['United States',          'USA'],
  ['Paraguay',               'Paraguay'],
  ['Australia',              'Australia'],
  ['Turkiye',                'Turkiye'],
  ['Germany',                'Germany'],
  ['Curacao',                'Curacao'],
  ['Ivory Coast',            'Ivory Coast'],
  ['Ecuador',                'Ecuador'],
  ['Netherlands',            'Netherlands'],
  ['Japan',                  'Japan'],
  ['Sweden',                 'Sweden'],
  ['Tunisia',                'Tunisia'],
  ['Spain',                  'Spain'],
  ['Cape Verde',             'Cape Verde Islands'],
  ['Saudi Arabia',           'Saudi Arabia'],
  ['Uruguay',                'Uruguay'],
  ['Belgium',                'Belgium'],
  ['Egypt',                  'Egypt'],
  ['Iran',                   'Iran'],
  ['New Zealand',            'New Zealand'],
  ['France',                 'France'],
  ['Senegal',                'Senegal'],
  ['Iraq',                   'Iraq'],
  ['Norway',                 'Norway'],
  ['Argentina',              'Argentina'],
  ['Algeria',                'Algeria'],
  ['Austria',                'Austria'],
  ['Jordan',                 'Jordan'],
  ['Portugal',               'Portugal'],
  ['DR Congo',               'Congo DR'],
  ['Uzbekistan',             'Uzbekistan'],
  ['Colombia',               'Colombia'],
  ['England',                'England'],
  ['Croatia',                'Croatia'],
  ['Ghana',                  'Ghana'],
  ['Panama',                 'Panama'],
]

// ─── Helpers ───────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))

function mapPosition(pos) {
  if (!pos) return null
  const p = pos.toLowerCase()
  if (p === 'g'  || p === 'goalkeeper') return 'GK'
  if (p === 'd'  || p === 'defender')   return 'DEF'
  if (p === 'm'  || p === 'midfielder') return 'MID'
  if (p === 'f'  || p === 'attacker' || p === 'forward') return 'FWD'
  return pos.toUpperCase()
}

// Every API call goes through here — sleeps BEFORE each call to respect 10 req/min
async function apiGet(path) {
  await sleep(7000)
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'x-apisports-key': API_KEY },
  })
  const json = await res.json()
  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(JSON.stringify(json.errors))
  }
  return json
}

async function checkQuota() {
  const res = await fetch(`${API_BASE}/status`, { headers: { 'x-apisports-key': API_KEY } })
  const json = await res.json()
  const used  = json.response?.requests?.current ?? 0
  const limit = json.response?.requests?.limit_day ?? 100
  return { used, limit, remaining: limit - used }
}

// Step 1: bulk-fetch all WC 2022 team IDs in one call (season 2022 is free-tier accessible)
// Returns map of { normalisedName → teamId }
async function fetchWC2022TeamIds() {
  const json = await apiGet(`/teams?league=1&season=2022`)
  const map = {}
  for (const entry of (json.response ?? [])) {
    const name = entry.team?.name
    const id   = entry.team?.id
    if (name && id) map[name] = id
  }
  return map
}

// Search by name for teams not found via the WC 2022 bulk fetch
async function findTeamId(searchName) {
  const json = await apiGet(`/teams?name=${encodeURIComponent(searchName)}`)
  const results = json.response ?? []
  const national = results.find(r => r.team?.national === true)
  return (national ?? results[0])?.team?.id ?? null
}

async function fetchSquad(teamId) {
  const json = await apiGet(`/players/squads?team=${teamId}`)
  return json.response?.[0]?.players ?? []
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const { used, limit, remaining } = await checkQuota()
  console.log(`API quota: ${used}/${limit} used today — ${remaining} remaining`)

  if (remaining < 10) {
    console.error('Daily quota exhausted. Try again tomorrow.')
    process.exit(1)
  }

  // Bulk-fetch WC 2022 team IDs in one call — covers most of our 48 teams
  console.log('Fetching WC 2022 team IDs (1 call)...')
  let wc2022map = {}
  try {
    wc2022map = await fetchWC2022TeamIds()
    console.log(`  → ${Object.keys(wc2022map).length} team IDs loaded from WC 2022\n`)
  } catch (err) {
    console.warn(`  ⚠ WC 2022 bulk fetch failed (${err.message}), will search individually\n`)
  }

  let totalInserted = 0
  const failed = []

  for (let i = 0; i < TEAMS.length; i++) {
    const [ourName, searchName] = TEAMS[i]
    process.stdout.write(`[${i + 1}/${TEAMS.length}] ${ourName} ... `)

    // Skip if already imported (idempotent)
    const { count } = await supabase
      .from('players')
      .select('id', { count: 'exact', head: true })
      .eq('team', ourName)

    if (count > 0) {
      console.log(`skipped (${count} already in DB)`)
      continue
    }

    // Try to find team ID from WC 2022 bulk map first, then fall back to individual search
    let teamId = wc2022map[searchName]
      ?? Object.entries(wc2022map).find(([k]) => k.toLowerCase() === searchName.toLowerCase())?.[1]
      ?? null

    if (!teamId) {
      try {
        teamId = await findTeamId(searchName)
      } catch (err) {
        console.log(`✗ lookup: ${err.message}`)
        failed.push({ team: ourName, reason: err.message })
        continue
      }
    }

    if (!teamId) {
      console.log(`✗ not found (searched "${searchName}")`)
      failed.push({ team: ourName, reason: `"${searchName}" not found in API` })
      continue
    }

    process.stdout.write(`(id:${teamId}) `)

    // Fetch squad
    let players
    try {
      players = await fetchSquad(teamId)
    } catch (err) {
      console.log(`✗ squad: ${err.message}`)
      failed.push({ team: ourName, reason: err.message })
      continue
    }

    if (!players.length) {
      console.log(`✗ empty squad (id ${teamId})`)
      failed.push({ team: ourName, reason: 'empty squad' })
      continue
    }

    const rows = players.map(p => ({
      name:         p.name,
      position:     mapPosition(p.pos) ?? null,  // null if API doesn't provide position
      shirt_number: p.number ?? null,
      team:         ourName,
    }))

    const { error } = await supabase.from('players').insert(rows)
    if (error) {
      console.log(`✗ DB: ${error.message}`)
      failed.push({ team: ourName, reason: error.message })
    } else {
      totalInserted += rows.length
      console.log(`✓ ${rows.length} players (team id ${teamId})`)
    }
  }

  console.log('\n─────────────────────────────────────────────────')
  console.log(`Players inserted this run: ${totalInserted}`)
  if (failed.length) {
    console.log(`\nFailed (${failed.length}) — re-run to retry:`)
    failed.forEach(f => console.log(`  • ${f.team}: ${f.reason}`))
  } else {
    console.log('All 48 teams imported successfully.')
  }
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
