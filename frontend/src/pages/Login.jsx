import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await api.post("/auth/login/", { username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      nav("/");
    } catch (e) {
      setErr("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full p-2 border rounded-md" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded-md" />
          <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded-md">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="text-sm text-slate-500 mt-3">Don't have an account? <Link to="/signup" className="text-indigo-600">Create one</Link></p>
      </div>
    </div>
  );
}
