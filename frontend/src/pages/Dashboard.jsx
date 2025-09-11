import React, { useEffect, useState } from 'react'
import api from '../api'
import BadgeCard from '../components/BadgeCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [habits, setHabits] = useState([])
  const [badges, setBadges] = useState([])
  const [streaks, setStreaks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [hRes, bRes, sRes] = await Promise.all([
          api.get('/habits/'),
          api.get('/habits/mybadges/'),
          api.get('/habits/streaks/')
        ])
        setHabits(hRes.data || [])
        setBadges(bRes.data || [])
        setStreaks(sRes.data || [])
      } catch (err) {
        console.error(err)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const chartData = habits.map(h => {
    const st = streaks.find(s => s.habit_id === h.id) || { current: 0 }
    return { name: h.name.slice(0,10), streak: st.current || 0 }
  })

  return (
    <div className="grid">
      <div className="col-8">
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="h1">Dashboard</div>
              <div className="muted">Overview of your habits & streaks</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <Link to="/habits" className="btn btn-ghost">Manage Habits</Link>
              <Link to="/calendar" className="btn">Open Calendar</Link>
            </div>
          </div>

          <div style={{height:260, marginTop:18}}>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="streak" />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="muted">No habits yet. Add one to start tracking.</div>}
          </div>
        </div>

        <div style={{marginTop:16}} className="card">
          <div className="h1">Active Habits</div>
          <div className="habit-list" style={{marginTop:12}}>
            {habits.length ? habits.map(h => (
              <div key={h.id} className="habit-item">
                <div className="habit-meta">
                  <div className="habit-name">{h.name}</div>
                  <div className="muted">{h.description}</div>
                </div>
                <div className="habit-actions">
                  <Link to={`/habits`} className="btn btn-ghost">Open</Link>
                </div>
              </div>
            )) : <div className="muted">No habits — create one to begin your streaks.</div>}
          </div>
        </div>
      </div>

      <div className="col-4">
        <div className="card">
          <div className="h1">Badges</div>
          <div className="badge-grid" style={{marginTop:12}}>
            {badges.length ? badges.map(b => <BadgeCard key={b.id || b.title} badge={b} />) : <div className="muted">No badges yet</div>}
          </div>
        </div>

        <div className="card" style={{marginTop:16}}>
          <div className="h1">Quick actions</div>
          <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:8}}>
            <Link to="/habits" className="btn">Add Habit</Link>
            <Link to="/calendar" className="btn btn-ghost">Mark Today</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
