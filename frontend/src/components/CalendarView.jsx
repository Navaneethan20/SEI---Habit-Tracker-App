import React from 'react'
import dayjs from 'dayjs'

/**
 * props:
 *  - logs: array of { date: 'YYYY-MM-DD', completed: true }
 *  - month: dayjs object (current month)
 *  - onToggle(dateString)
 */

function genDays(month) {
  const start = month.startOf('month')
  const end = month.endOf('month')
  const days = []
  for (let d = start.date(); d <= end.date(); d++) {
    days.push(month.date(d))
  }
  return days
}

export default function CalendarView({ logs = [], month = null, onToggle }) {
  const m = month || dayjs()
  const days = genDays(m)
  const doneSet = new Set(logs.map(l => l.date))

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <div className="muted">{m.format('MMMM YYYY')}</div>
      </div>

      <div className="calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="day" style={{fontWeight:700, background:'transparent', border:'none', color:'var(--muted)'}}>{d}</div>
        ))}
        {days.map(day => {
          const dateStr = day.format('YYYY-MM-DD')
          const done = doneSet.has(dateStr)
          return (
            <div key={dateStr} className={`day ${done ? 'done' : ''}`} onClick={() => onToggle && onToggle(dateStr)} style={{cursor: 'pointer'}}>
              <div>{day.format('D')}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
