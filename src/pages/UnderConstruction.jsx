/* ===================================================
   Under Construction — placeholder for disabled features
=================================================== */
import React from 'react'
import { Link } from 'react-router-dom'

export default function UnderConstruction() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, oklch(0.95 0.02 280) 0%, oklch(0.98 0.01 50) 100%)',
    }}>
      <div style={{ maxWidth: '500px' }}>
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" style={{ marginBottom: '2rem', opacity: 0.7 }}>
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M12 11v6M12 11H8M12 11h4"/>
          <circle cx="12" cy="5" r="0.5" fill="var(--color-primary)"/>
        </svg>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 700 }}>
          Under Construction
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          The Meal Prep ordering system is currently being prepared and will be available soon. We're working hard to bring you an amazing experience!
        </p>

        <Link
          to="/"
          className="btn btn-primary"
          style={{ display: 'inline-block' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
