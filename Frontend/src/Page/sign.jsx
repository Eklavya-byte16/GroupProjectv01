import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/client";
import "./login.css"; // shared auth styling

const SUBJECTS = ["Engineering Mathematics", "Digital Electronics", "Python Programming", "Data Structures"];
const DIVISIONS = ["A", "B", "C", "D"];

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("teacher");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    subject: SUBJECTS[0],
    division: DIVISIONS[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Fill in your name, email, and password.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with the real call once the backend exists.
      // await signup({ ...form, role });

      // Mock for now:
      navigate("/login");
    } catch (err) {
      setError(err.message || "Could not create the account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Create an account</h2>
        <p className="auth-subtitle">Set up access to the review desk.</p>

        <div className="role-toggle" role="tablist" aria-label="Sign up as">
          <button
            type="button"
            role="tab"
            aria-selected={role === "teacher"}
            className={`role-option ${role === "teacher" ? "is-active" : ""}`}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "admin"}
            className={`role-option ${role === "admin" ? "is-active" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <label className="field-label" htmlFor="name">Full name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />

        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" />

        {role === "teacher" && (
          <div className="field-row">
            <div>
              <label className="field-label" htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="division">Division</label>
              <select id="division" name="division" value={form.division} onChange={handleChange}>
                {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}

        <label className="field-label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />

        <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />

        {error && <p className="auth-error">{error}</p>}

        <button className="btn-primary auth-submit" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
