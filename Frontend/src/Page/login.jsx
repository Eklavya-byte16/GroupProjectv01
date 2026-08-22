import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/client";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("teacher"); // "teacher" | "admin"
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with the real call once the backend exists.
      // const { token, user } = await login({ ...form, role });
      // localStorage.setItem("token", token);

      // Mock for now, so the flow is testable end to end:
      localStorage.setItem("role", role);
      localStorage.setItem("name", form.email.split("@")[0]);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Could not log in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Log in</h2>
        <p className="auth-subtitle">Access your subjects and papers.</p>

        <div className="role-toggle" role="tablist" aria-label="Login as">
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

        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@college.edu"
        />

        <label className="field-label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        {error && <p className="auth-error">{error}</p>}

        <button className="btn-primary auth-submit" type="submit" disabled={loading}>
          {loading ? "Logging in…" : `Log in as ${role === "teacher" ? "Teacher" : "Admin"}`}
        </button>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
