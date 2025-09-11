import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" style={{textDecoration:'none'}}>
        <div className="logo">SEI</div>
        <div style={{display:'flex', flexDirection:'column', lineHeight:1}}>
          <strong style={{fontSize:14}}>SEI Habit</strong>
          <span style={{fontSize:12, color:'var(--muted)'}}>Streaks & Gains</span>
        </div>
      </Link>

      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/profile">Profile</Link>

        {token ? (
          <button className="btn btn-ghost" onClick={handleLogout} style={{padding:'8px 10px'}}>Logout</button>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/signup" className="btn">Get Started</Link>
          </>
        )}
      </nav>
    </header>
  )
}
