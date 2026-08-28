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
    // Always save the path, even if it's home (helps on mobile)
    if (currentPath !== '/' && !currentPath.includes('/dashboard') && !currentPath.includes('/auth/callback')) {
      localStorage.setItem('auth_redirect_url', currentPath)
    } else if (currentPath === '/') {
      // On mobile, don't clear it - let callback page decide
      // localStorage.removeItem('auth_redirect_url')
    }
    setShowAuthModal(true)
  }

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
        }
        setLoading(false)
      } catch (err) {
        console.error('Auth init error:', err)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes (handles OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }

      // Handle sign in event
      if (event === 'SIGNED_IN' && session?.user) {
        setShowAuthModal(false)
        // Redirect will be handled by AuthCallback page
      }

      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

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
