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
    let mounted = true
    let authTimeout

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            setLoading(false)
          } else {
            // Don't set loading to false yet - wait for auth state change listener
          }
          if (error) {
            console.error('Session fetch error:', error)
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('Auth init error:', err)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes (handles OAuth callback and session restoration)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        console.log('Auth event:', event, 'User:', session?.user?.email)

        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }

        // Handle all auth events
        if (event === 'SIGNED_IN' && session?.user) {
          setShowAuthModal(false)
          console.log('User signed in:', session.user.email)
        }

        // Set loading to false after any auth event
        setLoading(false)
      }
    })

    // Timeout fallback - if no auth event after 5 seconds, set loading to false
    authTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(false)
      }
    }, 5000)

    return () => {
      mounted = false
      clearTimeout(authTimeout)
      subscription?.unsubscribe()
    }
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
