/* ===================================================
   AuthContext — provides user session state and
   surfaces the auth modal globally.
=================================================== */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AuthModal from '../components/AuthModal'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,          setUser]          = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Listen to Supabase auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Subscribe to future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      // Close auth modal on successful sign-in
      if (session?.user) setShowAuthModal(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  const isAdmin = !!user && adminEmails.includes(user.email?.toLowerCase())

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, showAuthModal, setShowAuthModal, signOut }}>
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
