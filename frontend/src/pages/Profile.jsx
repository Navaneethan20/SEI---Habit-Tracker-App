import React, { useEffect, useState } from "react";
import api from "../utils/api";
import BadgeCard from "../components/BadgeCard";

export default function Profile() {
  const [badges, setBadges] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      // We didn't create a /auth/me endpoint in backend; use token payload - or fetch user via a simple endpoint
      // For now we get badges and habits and build a simple summary
      const res = await api.get("/habits/mybadges/");
      setBadges(res.data);

      const hRes = await api.get("/habits/");
      const habits = hRes.data;
      const total = habits.length;
      const totalLogs = habits.reduce((acc, h) => acc + (h.logs?.length || 0), 0);
      setUser({ total_habits: total, total_logs: totalLogs });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div className="space-y-2">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Total habits</div>
            <div className="text-2xl font-bold">{user?.total_habits ?? 0}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Total logs</div>
            <div className="text-2xl font-bold">{user?.total_logs ?? 0}</div>
          </div>
        </div>
      </div>

      <aside className="bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="font-medium mb-3">My badges</h3>
        {badges.length === 0 ? <p className="text-slate-500">No badges yet. Keep going!</p> : <div className="space-y-2">{badges.map((b) => <BadgeCard key={b.id} badge={b} />)}</div>}
      </aside>
    </div>
  );
}
