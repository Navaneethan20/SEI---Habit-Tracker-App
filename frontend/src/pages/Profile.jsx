import React, { useEffect, useState } from 'react'
import api from '../api'

// Helper to decode JWT and get username
function getUsernameFromToken() {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username || payload.user_name || payload.email || 'User';
  } catch {
    return 'User';
  }
}

export default function Profile(){
  const [streaks, setStreaks] = useState([])
  const username = getUsernameFromToken();

  useEffect(() => {
    async function load(){
      try{
        const sRes = await api.get('/habits/streaks/');
        setStreaks(sRes.data || []);
      }catch(err){ console.error(err) }
    }
    load()
  }, [])

  return (
    <div className="card" style={{maxWidth:800, margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="h1">Profile</div>
          <div className="muted">Manage your account</div>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <div style={{display:'flex', gap:16, alignItems:'center'}}>
          <div style={{width:88, height:88, borderRadius:16, background:'linear-gradient(90deg,var(--accent), var(--accent-2))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#022'}}>U</div>
          <div>
            <div style={{fontWeight:800, fontSize:18}}>{username}</div>
          </div>
        </div>

        <div style={{marginTop:18}}>
          <div className="h1">Streaks</div>
          <div style={{display:'flex', gap:12, marginTop:8, flexWrap:'wrap'}}>
            {streaks.length ? streaks.map((s, idx) => (
              <div key={s.habit_id || idx} className="card" style={{minWidth:140}}>
                <div style={{fontWeight:700}}>{s.habit_name || s.habit_id}</div>
                <div className="muted">Current: {s.current} | Best: {s.best}</div>
              </div>
            )) : <div className="muted">No streak data</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
