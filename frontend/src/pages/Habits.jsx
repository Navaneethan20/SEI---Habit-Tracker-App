import React, { useEffect, useState } from 'react'
import api from '../api'
import HabitForm from '../components/HabitForm'
import dayjs from 'dayjs'

export default function Habits(){
  const [habits, setHabits] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [logs, setLogs] = useState({}) // { habitId: [{date,...}] }

  useEffect(() => {
    load()
  }, [])

  async function load(){
    try{
      const hRes = await api.get('/habits/');
      setHabits(hRes.data || []);
      // Fetch logs for each habit
      const grouped = {};
      for (const habit of hRes.data || []) {
        const lRes = await api.get(`/habits/${habit.id}/logs/`);
        grouped[habit.id] = lRes.data || [];
      }
      setLogs(grouped);
    }catch(err){ console.error(err) }
  }

  async function addHabit(payload){
    try{
      const res = await api.post('/habits/', payload)
      setHabits(prev => [res.data, ...prev])
      setShowForm(false)
    }catch(err){ console.error(err); alert('Could not add') }
  }

  async function updateHabit(id, payload){
    try{
      const res = await api.put(`/habits/${id}/`, payload)
      setHabits(prev => prev.map(h => h.id === id ? res.data : h))
      setEditing(null)
    }catch(err){ console.error(err) }
  }

  async function deleteHabit(id){
    if(!confirm('Delete habit?')) return
    try{
      await api.delete(`/habits/${id}/`)
      setHabits(prev => prev.filter(h => h.id !== id))
    }catch(err){ console.error(err) }
  }

  async function toggleCompletion(habitId, dateStr=null){
    const date = dateStr || dayjs().format('YYYY-MM-DD')
    try{
      const res = await api.post(`/habits/${habitId}/logs/`, { date })
      // refresh logs
      load()
    }catch(err){
      console.error(err)
      alert('Could not mark completion')
    }
  }

  return (
    <div>
      <div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="h1">Habits</div>
          <div className="muted">Create, edit and mark completion</div>
        </div>
        <div>
          <button className="btn" onClick={() => setShowForm(s => !s)}>{showForm ? 'Close' : 'Add Habit'}</button>
        </div>
      </div>

      {showForm && <div style={{marginTop:12}}><HabitForm onSubmit={addHabit} /></div>}

      <div style={{marginTop:12}} className="card">
        <div className="habit-list">
          {habits.length ? habits.map(h => (
            <div key={h.id} className="habit-item">
              <div className="habit-meta">
                <div style={{display:'flex', flexDirection:'column'}}>
                  <div className="habit-name">{h.name}</div>
                  <div className="muted">{h.description}</div>
                </div>
              </div>

              <div className="habit-actions">
                <button className="btn btn-ghost" onClick={() => { setEditing(h); setShowForm(true) }}>Edit</button>
                <button className="btn" onClick={() => toggleCompletion(h.id)}>Mark Today</button>
                <button className="btn btn-ghost" onClick={() => deleteHabit(h.id)}>Delete</button>
              </div>
            </div>
          )) : <div className="muted">No habits yet</div>}
        </div>
      </div>

      {editing && <div style={{marginTop:12}} className="card">
        <h3 className="h1">Edit</h3>
        <HabitForm initial={editing} onSubmit={(data)=>updateHabit(editing.id, data)} onCancel={() => {setEditing(null); setShowForm(false)}} />
      </div>}
    </div>
  )
}
