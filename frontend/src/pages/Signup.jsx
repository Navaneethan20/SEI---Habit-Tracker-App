import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // signup
      await api.post("/auth/signup/", form);

      // auto-login
      const res = await api.post("/auth/login/", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      nav("/dashboard");
    } catch (err) {
      setError("Signup failed. Try different username/email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="card" style={{ maxWidth: "420px", margin: "40px auto" }}>
        <h2 className="h1" style={{ textAlign: "center" }}>
          Create Account
        </h2>

        {error && <div style={{ color: "var(--danger)", marginBottom: "12px" }}>{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="input"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input"
          />
          <input
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input"
          />

          <button type="submit" disabled={loading} className="btn" style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: "14px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-2)", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
