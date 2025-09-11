import React, { useState, useEffect } from 'react'

export default function HabitForm({ onSubmit, initial = null, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')

  useEffect(() => {
    setName(initial?.name || '')
    setDescription(initial?.description || '')
  }, [initial])

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return alert('Please enter habit name')
    onSubmit({ name, description })
    setName('')
    setDescription('')
  }

  return (
    <form className="form card" onSubmit={submit}>
      <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Habit name (e.g., Read 20 mins)" />
      <input className="input" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short description (optional)" />
      <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
        <button className="btn" type="submit">{initial ? 'Save' : 'Add Habit'}</button>
      </div>
    </form>
  )
}
