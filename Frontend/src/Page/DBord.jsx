import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DBord.css";

// Mock data shaped the way the real API response will look —
// swap this for a getTeacherPapers() call once the backend exists.
const MOCK_SUBJECTS = {
  "Digital Electronics": {
    A: [
      { roll: "24CE001", name: "Aarav Patil", status: "pending" },
      { roll: "24CE002", name: "Sanika Kulkarni", status: "reviewed" },
      { roll: "24CE003", name: "Om Deshmukh", status: "ai" },
    ],
    B: [
      { roll: "24CE041", name: "Riya Joshi", status: "pending" },
      { roll: "24CE042", name: "Yash More", status: "pending" },
    ],
  },
  "Python Programming": {
    A: [
      { roll: "24CE001", name: "Aarav Patil", status: "reviewed" },
      { roll: "24CE002", name: "Sanika Kulkarni", status: "reviewed" },
    ],
  },
};

const STATUS_LABEL = { pending: "Pending", reviewed: "Reviewed", ai: "AI suggested" };

function StatusPill({ status }) {
  return <span className={`status-pill status-${status}`}>{STATUS_LABEL[status]}</span>;
}

function TeacherView({ name }) {
  const subjects = Object.keys(MOCK_SUBJECTS);
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const divisions = Object.keys(MOCK_SUBJECTS[activeSubject]);
  const [activeDivision, setActiveDivision] = useState(divisions[0]);

  // Re-sync division when subject changes (each subject has its own set of divisions)
  function selectSubject(subject) {
    setActiveSubject(subject);
    setActiveDivision(Object.keys(MOCK_SUBJECTS[subject])[0]);
  }

  const students = MOCK_SUBJECTS[activeSubject][activeDivision] || [];

  return (
    <>
      <div className="dash-subjects">
        {subjects.map((s) => (
          <button
            key={s}
            className={`subject-chip ${s === activeSubject ? "is-active" : ""}`}
            onClick={() => selectSubject(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="dash-divisions" role="tablist" aria-label="Division">
        {Object.keys(MOCK_SUBJECTS[activeSubject]).map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={d === activeDivision}
            className={`division-tab ${d === activeDivision ? "is-active" : ""}`}
            onClick={() => setActiveDivision(d)}
          >
            Division {d}
          </button>
        ))}
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Roll no.</th>
            <th>Student</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((st) => (
            <tr key={st.roll}>
              <td className="roll">{st.roll}</td>
              <td>{st.name}</td>
              <td><StatusPill status={st.status} /></td>
              <td className="ledger-action">
                <button className="btn-ghost">
                  {st.status === "reviewed" ? "View" : "Review"}
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan={4} className="ledger-empty">No papers in this division yet.</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

function AdminView() {
  // TODO: replace with getAdminOverview()
  const stats = [
    { label: "Teachers", value: 12 },
    { label: "Papers pending", value: 47 },
    { label: "Papers reviewed", value: 203 },
  ];
  const teachers = [
    { name: "Prasad Deshmukh", subject: "Digital Electronics", divisions: "A, B" },
    { name: "Nikita Sawant", subject: "Python Programming", divisions: "A" },
  ];

  return (
    <>
      <div className="dash-stats">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-value roll">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <h3 className="dash-section-title">Teachers</h3>
      <table className="ledger-table">
        <thead>
          <tr><th>Name</th><th>Subject</th><th>Divisions</th><th></th></tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.name}>
              <td>{t.name}</td>
              <td>{t.subject}</td>
              <td className="roll">{t.divisions}</td>
              <td className="ledger-action"><button className="btn-ghost">Manage</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "teacher";
  const name = localStorage.getItem("name") || "there";

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <span className="dash-brand">Exam Review Portal</span>
        <span className="dash-role roll">{role === "admin" ? "Admin" : "Teacher"}</span>
        <button className="btn-ghost dash-logout" onClick={handleLogout}>Log out</button>
      </aside>

      <main className="dash-main">
        <h2 className="dash-greeting">Welcome back, {name}</h2>
        {role === "admin" ? <AdminView /> : <TeacherView name={name} />}
      </main>
    </div>
  );
}
