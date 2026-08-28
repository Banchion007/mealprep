/* ===================================================
   AuthCallback — handles OAuth redirect from Supabase
   Waits for auth state to settle before redirecting
=================================================== */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Wait for auth state to settle, then redirect
    // On mobile with slow networks, this may take up to 2 seconds
    if (!loading) {
      // Small delay to ensure session is fully established
      const timer = setTimeout(() => {
        const savedRedirectUrl = localStorage.getItem('auth_redirect_url')
        const finalUrl = savedRedirectUrl || '/'

        // Clean up
        localStorage.removeItem('auth_redirect_url')

        // Redirect
        navigate(finalUrl, { replace: true })
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [loading, navigate])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f8f8'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
        <p style={{ color: '#666', fontSize: '1rem' }}>Signing you in...</p>
      </div>
    </div>
  )
}
