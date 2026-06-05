# iKnowBall — Project Context

## Project Overview

iKnowBall is a World Cup 2026 social prediction platform. Users predict match scores, starting lineups, and build fantasy squads for the tournament. Live at **iknowball2026.vercel.app**, GitHub repo: **Ahmed300896/iknowball**.

---

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v3, plain JavaScript (no TypeScript)
- **Backend**: Supabase (Postgres + Auth + RLS)
- **Hosting**: Vercel
- **Routing**: App-level `screen` state string in App.jsx (no React Router)
- **Styling**: Dark theme throughout — `bg-black`, `bg-white/5`, `border-white/10`

---

## What Is Built and Working

### Auth
- Signup, login, logout
- `profiles` table with `username`, `favorite_teams`
- Team selection screen (5 teams by FIFA tier: 2 from top 10, 1 from 11–25, 1 from 26–40, 1 from the rest)

### Score Predictor (Game 1)
- "Predict Today's Games" view — filters schedule.js by today's date
- 72 matches across June 11–27 in `src/data/schedule.js`
- Per-match submit buttons with idle / saving / saved / error state
- Saves to `score_predictions` Supabase table (JSONB `predictions` column, one row per user)
- Upserts via `onConflict: 'user_id'`
- Pre-fills saved predictions on load
- "No games today" fallback showing next match date
- Progress bar: X / 72 predictions set

### Leaderboard
- Fetches `score_predictions` + `profiles` + `match_results` in parallel
- Calculates points using `calculatePoints` from `src/lib/scoring.js`
- Exact score = 3 pts, correct result = 1 pt, wrong = 0 pts
- Sorted by points desc, prediction count as tiebreaker
- Gold / silver / bronze medal styling for top 3
- Current user row highlighted in blue; pinned as sticky footer if outside top 10

### Admin Results Entry
- Route: `admin-results`
- Only accessible to admin user ID `0d3be115-d531-4146-9256-120dc7d047bc`
- Shows all 72 matches grouped by date
- Per-match score inputs with Save button; upserts to `match_results` table
- Admin link visible only to admin user at bottom of HomeScreen

### Scoring Logic
- `src/lib/scoring.js` — `calculatePoints(predicted, actual)`
- Both args: `{ homeScore, awayScore }`
- `src/data/results.js` — empty placeholder (superseded by live `match_results` table)

### Data Files
- `src/data/schedule.js` — 72 fixtures, team names match `schedule.js` exactly (e.g. "United States" not "USA")
- `src/data/teams.js` — 48 teams in 12 groups (A–L), FLAGS map, derived exports: `groupsMap`, `groupNames`, `allTeams`

### Players Table (Supabase)
- Table exists: `id`, `team`, `name`, `position` (nullable), `shirt_number`
- Currently empty — populated by running `scripts/import-players.js`

---

## Supabase Tables

| Table | Key Columns |
|---|---|
| `profiles` | `id` (uuid, FK auth.users), `username`, `favorite_teams` (text[]) |
| `score_predictions` | `user_id` (unique), `predictions` (jsonb) |
| `match_results` | `match_id` (integer PK), `home_score`, `away_score` |
| `players` | `id` (uuid), `team`, `name`, `position` (nullable), `shirt_number` |

---

## Admin Credentials

- **Admin user ID**: `0d3be115-d531-4146-9256-120dc7d047bc`
- **Admin email**: `6tydegree+admin@gmail.com`

---

## Player Import Script

- `scripts/import-players.js` — fetches squads from api-football free tier
- API key: `30bf6241f337108030c5019d7d7f65c1`
- Supabase service role key passed as `SUPABASE_SERVICE_KEY` env var
- Strategy: 1 bulk call for WC 2022 team IDs + individual searches for the ~22 teams not in WC 2022 + 48 squad fetches = ~71 total API calls (free tier: 100/day)
- Idempotent — skips teams already in DB
- **Run tomorrow morning** (daily quota resets at midnight UTC):
  ```bash
  SUPABASE_SERVICE_KEY=<service_role_key> node scripts/import-players.js
  ```

---

## What Is Next

1. **Run player import** — tomorrow morning once daily API quota resets
2. **Game 2 — Starting 11**: pick starting lineup for each of your 5 teams before each match; 7+ correct = points, else 0
3. **Game 3 — iKnowBall FPL**: 15-player fantasy squad from your 5 chosen teams, locked before June 11, players earn points from real performances
4. **Friend groups and challenges**
