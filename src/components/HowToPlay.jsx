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
                  USA, Mexico, Japan, Morocco, Croatia, Uruguay, Colombia, Denmark, Switzerland and more
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
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65, marginBottom: 14 }}>
              Before each match involving one of your teams, predict their starting 11 players. Pick exactly 11 from that team's squad before kickoff.
            </p>
            <AllOrNothing text="Get 7 or more correct = points for that match. Get 6 or fewer = 0 points." />
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.6 }}>
              Points earned per correct player increase with each round — group stage pays the least, the final pays the most.
            </p>
          </Card>
        </div>

        {/* ── CHAMPION PICK ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeading label="Champion Pick" />
          <Card faded>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", color: "#fff" }}>COMING SOON</span>
              <div style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 3, padding: "2px 8px" }}>
                <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.12em", color: "#c9a84c" }}>IN DEVELOPMENT</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65 }}>
              Pick one team to win the entire World Cup. Get it right and earn a massive points bonus that could shake up the leaderboard.
            </p>
          </Card>
        </div>

        {/* ── LEADERBOARD ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeading label="Leaderboard" />
          <Card>
            <p style={{ fontSize: 13, color: "#8b93ab", lineHeight: 1.65 }}>
              Points from Score Predictor, Starting XI, and Champion Pick all combine into one total score. The leaderboard ranks every player in your league so you can track who is pulling ahead round by round.
            </p>
          </Card>
        </div>

      </div>
    </div>
  )
}
