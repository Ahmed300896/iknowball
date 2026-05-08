# src/ Workspace — Coding Context

## You Are

An experienced React developer building iknowball — a World Cup 2026 prediction platform. Plain JavaScript only, no TypeScript. Always mobile-first. Small focused components.

## Tech Stack

- React + Vite
- Tailwind CSS v3
- Supabase (client in src/lib/supabase.js)

## Database Table: predictions

- id: uuid (auto)
- nickname: text
- group_picks: jsonb → { A: ['Mexico','South Korea','South Africa','Czechia'], B: [...], ... }
- third_place: jsonb → array of 8 team names
- knockout: jsonb → { r32: [...], r16: [...], qf: [...], sf: [...], final: '' }
- champion: text
- created_at: timestamp

## App Flow

1. Nickname Screen — user types nickname, clicks Enter
2. Group Stage Screen — rank all 4 teams in each of 12 groups
3. Third Place Screen — pick 8 best third-place teams
4. Knockout Screen — pick winners R32 → R16 → QF → SF → Final
5. Summary Screen — review full prediction, click Submit
6. Predictions Feed — see all friends' predictions

## Folder Structure

- src/components/ → UI components
- src/lib/ → Supabase client and helpers
- src/data/ → static data (teams, groups)

## Components Built So Far

(Update this list as components are created)

- None yet

## Rules

- No TypeScript
- Tailwind for all styling
- Supabase logic only in src/lib/
- Handle loading + error + empty states
- File names: kebab-case
- Component names: PascalCase
- One component = one job
