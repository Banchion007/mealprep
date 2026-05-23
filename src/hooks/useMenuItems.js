import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMenuItems() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('user_id', user.id)
        .order('tier', { ascending: true })
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setItems(data || [])
    } catch (err) {
      console.error('Error fetching menu items:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = useCallback(
    async (name, description, tier) => {
      if (!user) throw new Error('User not authenticated')
      if (!name.trim()) throw new Error('Item name is required')
      if (!tier) throw new Error('Tier is required')

      try {
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert([
            {
              user_id: user.id,
              name: name.trim(),
              description: description.trim() || '',
              tier,
            },
          ])

        if (insertError) throw insertError
        await fetchItems()
      } catch (err) {
        console.error('Error adding menu item:', err)
        throw err
      }
    },
    [user, fetchItems]
  )

  const deleteItem = useCallback(
    async (id) => {
      if (!user) throw new Error('User not authenticated')

      try {
        const { error: deleteError } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (deleteError) throw deleteError
        await fetchItems()
      } catch (err) {
        console.error('Error deleting menu item:', err)
        throw err
      }
    },
    [user, fetchItems]
  )

  const updateItem = useCallback(
    async (id, name, description, tier) => {
      if (!user) throw new Error('User not authenticated')
      if (!name.trim()) throw new Error('Item name is required')

      try {
        const { error: updateError } = await supabase
          .from('menu_items')
          .update({
            name: name.trim(),
            description: description.trim() || '',
            tier,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id)

        if (updateError) throw updateError
        await fetchItems()
      } catch (err) {
        console.error('Error updating menu item:', err)
        throw err
      }
    },
    [user, fetchItems]
  )

  return {
    items,
    loading,
    error,
    addItem,
    deleteItem,
    updateItem,
    refetch: fetchItems,
  }
}
