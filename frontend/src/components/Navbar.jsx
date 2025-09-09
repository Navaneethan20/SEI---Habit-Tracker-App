import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            SEI
          </div>
          <div>
            <h1 className="text-lg font-semibold">SEI Habit Tracker</h1>
            <p className="text-xs text-slate-500">Build streaks — build habits</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link to="/" className="px-3 py-2 rounded-md hover:bg-slate-100 transition">
                Dashboard
              </Link>
              <Link to="/habits" className="px-3 py-2 rounded-md hover:bg-slate-100 transition">
                Habits
              </Link>
              <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-slate-100 transition">
                Profile
              </Link>
              <button onClick={logout} className="ml-3 px-3 py-2 bg-red-500 text-white rounded-md hover:scale-[0.99] transition transform shadow">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-md hover:bg-slate-100 transition">
                Login
              </Link>
              <Link to="/signup" className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:scale-[0.99] transition transform shadow">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
