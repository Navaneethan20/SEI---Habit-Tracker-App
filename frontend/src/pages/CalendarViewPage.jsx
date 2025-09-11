import React, { useEffect, useState } from 'react'
import api from '../api'
import CalendarView from '../components/CalendarView'
import dayjs from 'dayjs'

export default function CalendarViewPage(){
  const [habits, setHabits] = useState([])
  const [selectedHabitId, setSelectedHabitId] = useState(null)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    async function load(){
      try{
        const hRes = await api.get('/habits/');
        setHabits(hRes.data || []);
        if (hRes.data && hRes.data.length) setSelectedHabitId(hRes.data[0].id);

        // Fetch logs for all habits
        let allLogs = [];
        for (const habit of hRes.data || []) {
          const lRes = await api.get(`/habits/${habit.id}/logs/`);
          allLogs = allLogs.concat(lRes.data || []);
        }
        setLogs(allLogs);
      }catch(err){ console.error(err) }
    }
    load()
  }, [])

  const habitLogs = logs.filter(l => l.habit === selectedHabitId).map(l => ({ date: l.date }))

  async function toggleDate(dateStr){
    if (!selectedHabitId) return
    try{
      await api.post(`/habits/${selectedHabitId}/logs/`, { date: dateStr })
      // reload logs for all habits
      let allLogs = [];
      for (const habit of habits || []) {
        const lRes = await api.get(`/habits/${habit.id}/logs/`);
        allLogs = allLogs.concat(lRes.data || []);
      }
      setLogs(allLogs);
    }catch(err){ console.error(err) }
  }

  return (
    <div>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div className="h1">Calendar</div>
            <div className="muted">Tap a date to toggle completion</div>
          </div>

          <div>
            <select className="input" value={selectedHabitId || ''} onChange={(e)=>setSelectedHabitId(Number(e.target.value))}>
              <option value="">-- Select habit --</option>
              {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <CalendarView logs={habitLogs} month={dayjs()} onToggle={toggleDate} />
        </div>
      </div>
    </div>
  )
}
