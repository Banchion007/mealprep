import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const SETTINGS_KEY = 'global'

export function useMealPrepSetting() {
  const { isAdmin } = useAuth()
  const [mealPrepEnabled, setMealPrepEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchSetting = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('site_settings')
          .select('meal_prep_enabled')
          .eq('key', SETTINGS_KEY)
          .maybeSingle()

        if (fetchError) throw fetchError
        if (!cancelled && data) setMealPrepEnabled(data.meal_prep_enabled)
      } catch (err) {
        console.error('Error fetching meal prep setting:', err)
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSetting()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('site_settings_global')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: `key=eq.${SETTINGS_KEY}`,
        },
        (payload) => {
          if (payload.new?.meal_prep_enabled !== undefined) {
            setMealPrepEnabled(payload.new.meal_prep_enabled)
          }
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const toggleMealPrep = async () => {
    if (!isAdmin) return

    const newValue = !mealPrepEnabled
    setMealPrepEnabled(newValue)

    try {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({
          meal_prep_enabled: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq('key', SETTINGS_KEY)

      if (updateError) throw updateError
    } catch (err) {
      console.error('Error updating meal prep setting:', err)
      setMealPrepEnabled(!newValue)
      setError(err.message)
    }
  }

  return { mealPrepEnabled, toggleMealPrep, loading, error }
}
