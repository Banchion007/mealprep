/* ===================================================
   Meal Prep Page — on-demand ordering flow:
   Step 1 (Prefs) → Step 2 (Meals)
   → Step 3 (Schedule) → Step 4 (Summary) → Confirmation
=================================================== */
import React, { useState, useCallback } from 'react'
import { MEALS } from './data'
import StepIndicator from './StepIndicator'
import Step1Preferences from './Step1Preferences'
import Step2Meals from './Step2Meals'
import Step3Schedule from './Step3Schedule'
import Step4Summary from './Step4Summary'
import OrderSidebar from './OrderSidebar'
import Confirmation from './Confirmation'
import { supabase } from '../../lib/supabase'
import './MealPrep.css'

const STEP_LABELS = ['Dietary Preferences', 'Meal Selection', 'Delivery Details', 'Order Summary']

const INIT_ORDER = {
  preferences:   [],
  selectedMeals: {},   // { mealId: count }
  schedule: {
    date:        '',
    timeWindow:  '',
    address:     '',
    city:        '',
    state:       '',
    zip:         '',
  },
}

/* Compute order total from selectedMeals */
export function calcOrderTotal(selectedMeals) {
  return Object.entries(selectedMeals).reduce((sum, [id, qty]) => {
    const meal = MEALS.find(m => m.id === id)
    return sum + (meal ? meal.price * qty : 0)
  }, 0)
}

export default function MealPrep() {
  const [step,    setStep]    = useState(0)
  const [order,   setOrder]   = useState(INIT_ORDER)
  const [orderNo, setOrderNo] = useState(null)
  const [isDone,  setIsDone]  = useState(false)
  const [placing, setPlacing] = useState(false)

  const updateOrder = useCallback((patch) => {
    setOrder(prev => ({ ...prev, ...patch }))
  }, [])

  const handleBack = () => setStep(s => s - 1)
  const handleNext = () => setStep(s => s + 1)

  const handlePlaceOrder = async (user) => {
    setPlacing(true)
    const num = `HC-${Date.now().toString().slice(-6)}`

    const mealItems = Object.entries(order.selectedMeals)
      .map(([id, qty]) => {
        const meal = MEALS.find(m => m.id === id)
        return meal ? { id, name: meal.name, qty, price: meal.price } : null
      })
      .filter(Boolean)

    const total = calcOrderTotal(order.selectedMeals)

    try {
      const { error } = await supabase.from('orders').insert({
        order_number:   num,
        user_id:        user.id,
        customer_name:  user.user_metadata?.full_name || user.email,
        customer_email: user.email,
        type:           'Meal Prep',
        items:          mealItems,
        total,
        delivery_date:  order.schedule.date,
        time_window:    order.schedule.timeWindow,
        address:        `${order.schedule.address}, ${order.schedule.city}, ${order.schedule.state} ${order.schedule.zip}`,
        preferences:    order.preferences,
        status:         'Pending',
      })
      if (error) throw error
    } catch (err) {
      console.error('Failed to save order:', err)
    }

    setOrderNo(num)
    setPlacing(false)
    setIsDone(true)
  }

  const handleStartOver = () => {
    setOrder(INIT_ORDER)
    setStep(0)
    setOrderNo(null)
    setIsDone(false)
  }

  if (isDone) {
    return <Confirmation order={order} orderNo={orderNo} onStartOver={handleStartOver} />
  }

  const orderTotal       = calcOrderTotal(order.selectedMeals)
  const totalMealsSelected = Object.values(order.selectedMeals).reduce((s, n) => s + n, 0)

  return (
    <div className="mealprep-page">
      <section className="page-hero mealprep-hero mealprep-hero--compact">
        <div className="page-hero__overlay" />
        <img
          src="https://placehold.co/1600x300/1E1B4B/EEF2FF?text=Order+Your+Meals"
          alt="Order meals"
          className="page-hero__bg"
        />
        <div className="container page-hero__content">
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Meal Prep</p>
          <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>Build Your Order</h1>
          <p style={{ color: 'rgba(255,251,245,0.8)', fontSize: '1rem' }}>
            Pick your meals, choose a delivery date, and we'll handle the rest.
          </p>
        </div>
      </section>

      <div className="container mealprep-flow">
        <StepIndicator steps={STEP_LABELS} current={step} />

        <div className="mealprep-body">
          <div className="mealprep-main">
            {step === 0 && (
              <Step1Preferences
                preferences={order.preferences}
                onChange={(prefs) => updateOrder({ preferences: prefs })}
                onBack={null}
                onNext={handleNext}
              />
            )}
            {step === 1 && (
              <Step2Meals
                selectedMeals={order.selectedMeals}
                preferences={order.preferences}
                onChange={(meals) => updateOrder({ selectedMeals: meals })}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
            {step === 2 && (
              <Step3Schedule
                schedule={order.schedule}
                onChange={(sched) => updateOrder({ schedule: sched })}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
            {step === 3 && (
              <Step4Summary
                order={order}
                orderTotal={orderTotal}
                placing={placing}
                onBack={handleBack}
                onPlace={handlePlaceOrder}
              />
            )}
          </div>

          {step < 3 && (
            <OrderSidebar
              selectedMeals={order.selectedMeals}
              orderTotal={orderTotal}
              totalSelected={totalMealsSelected}
            />
          )}
        </div>
      </div>
    </div>
  )
}
