import React, { useEffect, useState } from "react";
import api from "../utils/api";
import BadgeCard from "../components/BadgeCard";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [streaks, setStreaks] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [hRes, sRes, bRes] = await Promise.all([
        api.get("/habits/"),
        api.get("/habits/streaks/"),
        api.get("/habits/mybadges/"),
      ]);
      setHabits(hRes.data);
      setStreaks(sRes.data);
      setBadges(bRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Build fake aggregated data for chart: number of completions per day from last 7 days
  const chartData = (() => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10); // MM-DD
      map[key] = 0;
    }
    habits.forEach((h) => {
      (h.logs || []).forEach((l) => {
        if (l.completed) {
          const key = l.date.slice(5, 10);
          if (map[key] !== undefined) map[key] += 1;
        }
      });
    });
    return Object.keys(map).map((k) => ({ date: k, completions: map[k] }));
  })();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-semibold text-lg mb-3">Your habits</h2>
          {loading ? (
            <p>Loading...</p>
          ) : habits.length === 0 ? (
            <p className="text-slate-500">No habits yet. Add some in the Habits page.</p>
          ) : (
            <div className="space-y-3">
              {habits.slice(0, 4).map((h) => (
                <div key={h.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
                  <div>
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-slate-500">{h.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {streaks.find((s) => s.id === h.id)?.current_streak ?? 0}d
                    </div>
                    <div className="text-xs text-slate-400">current</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="font-medium mb-3">Recent badges</h3>
          <div className="space-y-2">
            {badges.length === 0 ? <p className="text-slate-500">No badges yet — keep streaking!</p> : badges.slice(0, 3).map((b) => <BadgeCard key={b.id} badge={b} />)}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="font-medium mb-3">Last 7 days — completions</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorComps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="completions" stroke="#7c3aed" fill="url(#colorComps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
