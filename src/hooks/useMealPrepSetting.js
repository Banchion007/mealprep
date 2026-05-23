import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMealPrepSetting() {
  const { user } = useAuth()
  const [mealPrepEnabled, setMealPrepEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch initial value
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchSetting = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('app_settings')
          .select('meal_prep_enabled')
          .eq('user_id', user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (data) {
          setMealPrepEnabled(data.meal_prep_enabled)
        } else {
          // Create default settings if they don't exist
          const { data: newData, error: insertError } = await supabase
            .from('app_settings')
            .insert([
              {
                user_id: user.id,
                meal_prep_enabled: true,
              },
            ])
            .select()
            .single()

          if (insertError) throw insertError
          if (newData) setMealPrepEnabled(newData.meal_prep_enabled)
        }
      } catch (err) {
        console.error('Error fetching meal prep setting:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSetting()
  }, [user])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`app_settings:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            setMealPrepEnabled(payload.new.meal_prep_enabled)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  // Update setting in Supabase
  const toggleMealPrep = async () => {
    if (!user) return

    const newValue = !mealPrepEnabled
    setMealPrepEnabled(newValue)

    try {
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({
          meal_prep_enabled: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (updateError) throw updateError
    } catch (err) {
      console.error('Error updating meal prep setting:', err)
      // Revert on error
      setMealPrepEnabled(!newValue)
      setError(err.message)
    }
  }

  return { mealPrepEnabled, toggleMealPrep, loading, error }
}
