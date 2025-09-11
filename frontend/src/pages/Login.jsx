import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.username || !form.password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login/", {
        username: form.username,
        password: form.password,
      });


      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      console.log("Login successful, redirecting to dashboard...");

      setTimeout(() => {
      nav("/dashboard");
    }, 100);
    } catch (err) {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="card" style={{ maxWidth: "420px", margin: "40px auto" }}>
        <h2 className="h1" style={{ textAlign: "center" }}>
          Sign In
        </h2>

        {error && (
          <div style={{ color: "var(--danger)", marginBottom: "12px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
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

          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: "14px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent-2)", fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
