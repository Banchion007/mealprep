import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MEALS } from '../pages/MealPrep/data'

const MenuContext = createContext({ meals: MEALS, loading: false })

export function MenuProvider({ children }) {
  const [meals, setMeals] = useState(MEALS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('weekly_menu')
      .select('meals')
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        if (data?.meals?.length > 0) {
          setMeals(data.meals)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
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
