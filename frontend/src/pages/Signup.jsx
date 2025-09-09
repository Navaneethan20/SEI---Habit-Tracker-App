import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    if (password !== password2) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/signup/", { username, email, password, password2 });
      // auto-login
      const res = await api.post("/auth/login/", { username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      nav("/");
    } catch (e) {
      setErr("Signup failed. Try different username/email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full p-2 border rounded-md" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded-md" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded-md" />
          <input value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirm password" type="password" className="w-full p-2 border rounded-md" />
          <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded-md">{loading ? "Creating..." : "Create account"}</button>
        </form>
        <p className="text-sm text-slate-500 mt-3">Already have an account? <Link to="/login" className="text-indigo-600">Sign in</Link></p>
      </div>
    </div>
  );
}
