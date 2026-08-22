import { useNavigate } from "react-router-dom";
import "./Home.css";

// Purely decorative — a row of marked answer-sheet ticks/crosses,
// standing in for a hero image without needing any real assets yet.
function LedgerStrip() {
  const marks = ["✓", "✓", "✕", "✓", "AI", "✓"];
  return (
    <div className="ledger-strip">
      {marks.map((m, i) => (
        <span
          key={i}
          className={`ledger-mark ${m === "AI" ? "is-ai" : m === "✕" ? "is-cross" : "is-check"}`}
        >
          {m}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="home-nav">
        <span className="home-brand">Exam Review Portal</span>
        <div className="home-nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Log in</button>
          <button className="btn-primary" onClick={() => navigate("/signup")}>Sign up</button>
        </div>
      </header>

      <main className="home-hero">
        <LedgerStrip />
        <h1 className="home-headline">Every paper gets a second pair of eyes.</h1>
        <p className="home-sub">
          A shared desk for teachers and admins to mark, review, and track exam
          papers by subject and division — built to hand off the first pass to
          an AI reviewer once it's ready, with teachers always making the final call.
        </p>
        <div className="home-cta">
          <button className="btn-primary" onClick={() => navigate("/signup")}>Get started</button>
          <button className="btn-ghost" onClick={() => navigate("/login")}>I already have an account</button>
        </div>
      </main>

      <section className="home-features">
        <div className="home-feature">
          <span className="home-feature-index roll">01</span>
          <h3>Role-based access</h3>
          <p>Teachers and admins sign in separately, each seeing only what their role needs.</p>
        </div>
        <div className="home-feature">
          <span className="home-feature-index roll">02</span>
          <h3>Division-wise sorting</h3>
          <p>Every subject's papers are grouped by division, so nothing gets reviewed out of order.</p>
        </div>
        <div className="home-feature">
          <span className="home-feature-index roll">03</span>
          <h3>AI-assisted review</h3>
          <p className="home-feature-soon">Coming soon — an AI first pass, with teachers reviewing every suggestion.</p>
        </div>
      </section>

      <footer className="home-footer">
        <span>Exam Review Portal — built for teachers, by the group.</span>
      </footer>
    </div>
  );
}
