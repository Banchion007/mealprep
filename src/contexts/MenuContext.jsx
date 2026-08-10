import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MEALS } from '../pages/MealPrep/data'

const MenuContext = createContext({ meals: MEALS, loading: false })

export function MenuProvider({ children }) {
  const [meals, setMeals] = useState(MEALS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        // First try to fetch real menu items from database
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('active', true)
          .order('tier', { ascending: true })
          .order('created_at', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          // Transform database schema to component schema
          const transformed = data.map(item => ({
            id: item.id,
            name: item.name,
            desc: item.description || '',
            img: item.image_url || 'https://placehold.co/280x160?text=Meal',
            tags: item.dietary_tags || [],
            price: parseFloat(item.price) || 0,
            calories: item.calories || 0,
            protein: item.protein || 0,
            carbs: item.carbs || 0,
            fat: item.fat || 0,
            tier: item.tier || 'Essentials',
          }))
          setMeals(transformed)
          return
        }
      } catch (err) {
        console.warn('[MenuContext] menu_items fetch failed:', err.message)
      }

      // Fallback to hardcoded MEALS if database fetch fails
      setMeals(MEALS)
    }

    fetchMeals().finally(() => setLoading(false))
  }, [])

  return (
    <MenuContext.Provider value={{ meals, loading }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  return useContext(MenuContext)
}
