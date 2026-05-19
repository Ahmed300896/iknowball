# iknowball — Project Map (CLAUDE.md)

## What This Project Is

iknowball (iknowball.com) is a web-based football fan platform built around the 2026 FIFA World Cup. It is NOT a betting app, NOT a bracket-only app, and NOT a media companion. It is a social prediction and challenge platform that helps distributed friend groups recreate the experience of watching football together.

## Current Build Phase

Phase 1 — Friday MVP (Prediction App)

- User enters a nickname (no account/password yet)
- User predicts group stage standings for all 12 groups (rank teams 1st to 4th)
- User picks 8 best third-place teams
- User picks knockout round winners R32 → R16 → QF → SF → Final
- Predictions saved to Supabase
- Friends can see each other's predictions

## Tech Stack

- Frontend: React (Vite)
- Styling: Tailwind CSS v3
- Database: Supabase (free tier)
- Hosting: Vercel
- No TypeScript — plain JavaScript only

## Workspace Routing

Working on UI components → go to src/CONTEXT.md
Working on planning next features → go to planning/CONTEXT.md

## Tournament Data

48 teams, 12 groups of 4. June 11 – July 19, 2026.

Group A: Mexico, South Korea, South Africa, Czechia
Group B: Canada, Switzerland, Qatar, Bosnia-Herzegovina
Group C: Brazil, Morocco, Scotland, Haiti
Group D: USA, Paraguay, Australia, Türkiye
Group E: Germany, Ecuador, Ivory Coast, Curaçao
Group F: Netherlands, Japan, Tunisia, Sweden
Group G: Belgium, Iran, Egypt, New Zealand
Group H: Spain, Uruguay, Saudi Arabia, Cape Verde
Group I: France, Senegal, Norway, Iraq
Group J: Argentina, Austria, Algeria, Jordan
Group K: Portugal, Colombia, Uzbekistan, DR Congo
Group L: England, Croatia, Panama, Ghana

Knockout: Top 2 from each group + 8 best 3rd place = 32 teams
R32 → R16 → QF → SF → Final

## Key Rules for Claude

- No TypeScript. Plain JavaScript only.
- Mobile-first.
- Small focused components — one job each.
- All Supabase logic in src/lib/ only.
- File names: kebab-case. Components: PascalCase.
- Always handle loading and error states.

## New Direction — Full Platform (as of May 2026)

### Vision

iknowball is expanding from a one-time prediction app into a full sports platform.
Goal: go viral during World Cup 2026. Multiple games, account system, leaderboards.

### Phase 1 — Account System (building now)

- Sign up / log in via Supabase Auth (email + password)
- User profile page (username, favourite team, country, avatar)
- All predictions and future game activity linked to user account
- Global leaderboard + friend group leaderboards

### Phase 2 — More Games (after accounts)

- Man of the match picks per game
- Score predictor
- Daily challenges
- More TBD

### Viral Features (add as we grow)

- Share prediction as image card (WhatsApp, Instagram)
- Friend groups with invite code
- Badges and achievements
- Daily streaks

### Supabase Plan

- Auth: Supabase built-in email/password auth
- New tables needed: profiles, groups, group_members, motm_picks
- predictions table: add user_id column to link to auth.users

### Rules

- No TypeScript. Plain JavaScript only.
- Mobile-first always.
- Supabase handles all auth and database — no custom backend.
