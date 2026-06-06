import PageHeader from "./PageHeader"

var TIER_1_TEAMS = ["Argentina", "France", "Spain", "England", "Brazil", "Portugal", "Belgium", "Netherlands", "Germany"]

function SectionHeading({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ height: 2, width: 18, background: "#c9a84c", borderRadius: 1, flexShrink: 0 }} />
      <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c" }}>
        {label}
      </span>
    </div>
  )
}

function Card({ children, faded }) {
  return (
    <div style={{
      background: "#0d1224",
      border: "1px solid #1e2540",
      borderRadius: 8,
      padding: "16px",
      opacity: faded ? 0.65 : 1,
    }}>
      {children}
    </div>
  )
}

function AllOrNothing({ text }) {
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 6, padding: "10px 12px", marginBottom: 14 }}>
      <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", color: "#c9a84c" }}>ALL OR NOTHING</span>
      <p style={{ fontSize: 12, color: "#8b93ab", marginTop: 4, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}

function PointsRow({ label, value, first }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: first ? 0 : 8,
      marginTop: first ? 0 : 8,
      borderTop: first ? "none" : "1px solid #1e2540",
    }}>
      <span style={{ fontSize: 13, color: "#8b93ab" }}>{label}</span>
      <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 13, color: "#c9a84c" }}>{value}</span>
    </div>
  )
}

export default function HowToPlay({ onBack, onLogout, username }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", paddingBottom: 60 }}>
      <PageHeader title="HOW TO PLAY" showBack onBack={onBack} username={username} onLogout={onLogout} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 0" }}>

        {/* ── YOUR 6 TEAMS ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeading label="Your 6 Teams" />
          <Card>
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65, marginBottom: 16 }}>
              Pick 6 teams before the tournament begins using a tier system. Your selection is locked before June 11 and cannot be changed.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              <div style={{ borderLeft: "3px solid #c9a84c", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", color: "#c9a84c" }}>TIER 1 — PICK 2</span>
                  <span style={{ fontSize: 10, color: "#6b7494" }}>Elite nations</span>
                </div>
                <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6 }}>
                  {TIER_1_TEAMS.join(", ")}
                </p>
              </div>

              <div style={{ borderLeft: "3px solid #4a5568", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", color: "#fff" }}>TIER 2 — PICK 3</span>
                  <span style={{ fontSize: 10, color: "#6b7494" }}>Strong nations</span>
                </div>
                <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6 }}>
                  USA, Mexico, Japan, Senegal, Croatia, Uruguay, Colombia, Norway, Canada, Switzerland and more
                </p>
              </div>

              <div style={{ borderLeft: "3px solid #2d3748", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", color: "#6b7494" }}>TIER 3 — PICK 1</span>
                  <span style={{ fontSize: 10, color: "#6b7494" }}>Underdogs</span>
                </div>
                <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6 }}>
                  Smaller nations, first-time qualifiers, and tournament dark horses
                </p>
              </div>

            </div>
          </Card>
        </div>

        {/* ── SCORE PREDICTOR ───────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeading label="Score Predictor" />
          <Card>
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65, marginBottom: 14 }}>
              Predict the exact scoreline for every World Cup match. Predictions must be submitted before kickoff — after that they are locked.
            </p>
            <AllOrNothing text="Get the exact score right = full points. Any other result = 0 points." />
            <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.14em", color: "#6b7494", marginBottom: 10 }}>POINTS PER CORRECT SCORE</p>
            <PointsRow label="Group stage" value="5 pts" first />
            <PointsRow label="Round of 32" value="10 pts" />
            <PointsRow label="Round of 16" value="20 pts" />
            <PointsRow label="Quarter-finals" value="35 pts" />
            <PointsRow label="Semi-finals" value="50 pts" />
            <PointsRow label="Final" value="75 pts" />
          </Card>
        </div>

        {/* ── STARTING XI ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeading label="Starting XI" />
          <Card>
            {[
              {
                n: "1",
                title: "Pick Your 6 Teams",
                text: "Before June 11, select 6 teams to follow: 2 from the top 10 ranked nations, 3 from the next tier, and 1 from the rest. Your picks lock when the tournament starts.",
              },
              {
                n: "2",
                title: "Predict the Starting XI",
                text: "Before each of your 6 teams' matches, pick exactly 11 players from their squad. You must submit before kickoff — no changes once the match starts.",
              },
              {
                n: "3",
                title: "Score Points",
                text: "Earn 1 point per correct player. Predict 7 or more correctly to earn a bonus. Points are worth more in the knockout rounds than the group stage.",
              },
            ].map(function (step, i) {
              return (
                <div key={step.n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 2 ? 14 : 0 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 11, color: "#c9a84c" }}>
                      {step.n}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", color: "#fff", margin: "0 0 4px" }}>
                      {step.title}
                    </p>
                    <p style={{ fontSize: 12, color: "#8b93ab", lineHeight: 1.6, margin: 0 }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              )
            })}
          </Card>
        </div>

        {/* ── WORLD CUP PREDICTOR ───────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeading label="World Cup Predictor" />
          <Card>
            <p style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", color: "#fff", margin: "0 0 10px" }}>
              WORLD CUP PREDICTOR
            </p>
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65, margin: 0 }}>
              Before the tournament starts, predict the group stage standings for all 12 groups. The top 2 from each group advance automatically, plus the 8 best 3rd-place teams. Then predict the knockout bracket all the way to the Final. Points are weighted heavily toward the later rounds.
            </p>
          </Card>
        </div>

        {/* ── LEADERBOARD ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeading label="Leaderboard" />
          <Card>
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65 }}>
              Points from Score Predictor, Starting XI, and World Cup Predictor all combine into one total score. The leaderboard ranks every player in your league so you can track who is pulling ahead round by round.
            </p>
          </Card>
        </div>

      </div>
    </div>
  )
}
