/* ===================================================
   AuthContext — provides user session state and
   surfaces the auth modal globally.
   - Persistent sessions (Supabase maintains session in localStorage)
   - Redirect to last visited page after login
=================================================== */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isAdminUser } from '../lib/admin'
import AuthModal from '../components/AuthModal'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,          setUser]          = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [redirectUrl,   setRedirectUrl]   = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Store current location when auth modal opens (for redirect after login)
  const handleOpenAuthModal = () => {
    // Save current location to localStorage so it persists through OAuth redirect
    const currentPath = location.pathname + location.search
    // Don't save auth-related or root paths
    if (currentPath !== '/' && !currentPath.includes('/dashboard')) {
      localStorage.setItem('auth_redirect_url', currentPath)
    } else {
      localStorage.removeItem('auth_redirect_url')
    }
    setShowAuthModal(true)
  }

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (err) {
        console.error('Auth init error:', err)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        // User just logged in
        setShowAuthModal(false)

        // Redirect to the page they were trying to access
        // First check localStorage (survives OAuth redirect), then state
        const savedRedirectUrl = localStorage.getItem('auth_redirect_url')
        const finalRedirectUrl = savedRedirectUrl || redirectUrl

        if (finalRedirectUrl) {
          navigate(finalRedirectUrl)
          localStorage.removeItem('auth_redirect_url')
          setRedirectUrl(null)
        } else if (isAdminUser(session?.user)) {
          // Admin users go to dashboard by default
          navigate('/dashboard')
        }
      }
    })

    return () => subscription?.unsubscribe()
  }, [navigate, redirectUrl])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const isAdmin = isAdminUser(user)

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      showAuthModal,
      setShowAuthModal: handleOpenAuthModal,
      signOut
    }}>
      {children}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
