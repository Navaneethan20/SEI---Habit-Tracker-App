import React from 'react'

export default function BadgeCard({ badge }) {
  return (
    <div className="badge card">
      <div style={{fontSize:18, fontWeight:700}}>{badge.title}</div>
      <div className="muted" style={{fontSize:12, marginTop:6}}>{badge.criteria}</div>
    </div>
  )
}
