import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing-hero card">
      <div className="hero-left">
        <div className="kicker">Build habits. Keep streaks. Feel great.</div>
        <h1 className="h1" style={{fontSize:32, marginTop:12}}>SEI Habit Tracker — make good habits sticky</h1>
        <p className="muted" style={{marginTop:12}}>
          Add daily habits, track completion with a calendar, celebrate streaks and earn badges.
          Designed to be simple, delightful and focused.
        </p>
        <div className="hero-cta">
          <Link to="/signup" className="btn">Start Free — Create Account</Link>
          <Link to="/login" className="btn btn-ghost" style={{marginLeft:10}}>Already have account</Link>
        </div>
      </div>

      <div style={{width:360}}>
        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:800, fontSize:18, marginBottom:8}}>Today's snapshot</div>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
            <div>
              <div className="muted">Active habits</div>
              <div style={{fontWeight:700, fontSize:20}}>4</div>
            </div>
            <div>
              <div className="muted">Longest streak</div>
              <div style={{fontWeight:700, fontSize:20}}>12</div>
            </div>
          </div>
          <div style={{marginTop:12}} className="muted">Small wins add up — aim for one small habit today 💪</div>
        </div>
      </div>
    </div>
  )
}
