/* ===================================================
   Meal Prep Page — orchestrates the full ordering flow:
   Plan Selection → Step 1 (Prefs) → Step 2 (Meals)
   → Step 3 (Schedule) → Step 4 (Summary) → Confirmation
=================================================== */
import React, { useState, useCallback } from 'react'
import { PLANS } from './data'
import PlanSelection from './PlanSelection'
import StepIndicator from './StepIndicator'
import Step1Preferences from './Step1Preferences'
import Step2Meals from './Step2Meals'
import Step3Schedule from './Step3Schedule'
import Step4Summary from './Step4Summary'
import OrderSidebar from './OrderSidebar'
import Confirmation from './Confirmation'
import './MealPrep.css'

/* ── Phases ── */
const PHASE_SELECT = 'select'
const PHASE_STEPS  = 'steps'
const PHASE_DONE   = 'done'

const STEP_LABELS = ['Dietary Preferences', 'Meal Selection', 'Delivery Schedule', 'Order Summary']

/* ── Initial State ── */
const INIT_ORDER = {
  plan:          null,
  preferences:   [],
  selectedMeals: {},   // { mealId: count }
  schedule: {
    days:        [],
    timeWindow:  '',
    address:     '',
    city:        '',
    state:       '',
    zip:         '',
  },
}

export default function MealPrep() {
  const [phase,   setPhase]   = useState(PHASE_SELECT)
  const [step,    setStep]    = useState(0)
  const [order,   setOrder]   = useState(INIT_ORDER)
  const [orderNo, setOrderNo] = useState(null)

  /* ── Helpers ── */
  const totalMealsSelected = Object.values(order.selectedMeals).reduce((s, n) => s + n, 0)
  const quota = order.plan?.mealsPerWeek ?? 0

  const updateOrder = useCallback((patch) => {
    setOrder(prev => ({ ...prev, ...patch }))
  }, [])

  // Select plan → enter step flow
  const handleSelectPlan = (plan) => {
    // Clear meals when switching plans
    updateOrder({ plan, selectedMeals: {} })
    setStep(0)
    setPhase(PHASE_STEPS)
  }

  // Back from first step → return to plan selection
  const handleBack = () => {
    if (step === 0) {
      setPhase(PHASE_SELECT)
    } else {
      setStep(s => s - 1)
    }
  }

  const handleNext = () => {
    setStep(s => s + 1)
  }

  // Place order
  const handlePlaceOrder = () => {
    const num = `SAV-${Date.now().toString().slice(-6)}`
    setOrderNo(num)
    setPhase(PHASE_DONE)
  }

  // Start over
  const handleStartOver = () => {
    setOrder(INIT_ORDER)
    setStep(0)
    setOrderNo(null)
    setPhase(PHASE_SELECT)
  }

  /* ── Render phases ── */
  if (phase === PHASE_DONE) {
    return <Confirmation order={order} orderNo={orderNo} onStartOver={handleStartOver} />
  }

  if (phase === PHASE_SELECT) {
    return (
      <div className="mealprep-page">
        <section className="page-hero mealprep-hero">
          <div className="page-hero__overlay" />
          <img
            src="https://placehold.co/1600x500/1E1B4B/EEF2FF?text=Weekly+Meal+Prep"
            alt="Meal prep"
            className="page-hero__bg"
          />
          <div className="container page-hero__content">
            <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Meal Prep Plans</p>
            <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>Eat Well, Every Week</h1>
            <p style={{ color: 'rgba(255,251,245,0.8)', maxWidth: '520px', fontSize: '1.05rem' }}>
              Chef-crafted, macro-balanced meals delivered to your door. Pick your plan and customise everything.
            </p>
          </div>
        </section>
        <PlanSelection plans={PLANS} onSelect={handleSelectPlan} />
      </div>
    )
  }

  /* ── Step flow ── */
  return (
    <div className="mealprep-page">
      <section className="page-hero mealprep-hero mealprep-hero--compact">
        <div className="page-hero__overlay" />
        <img
          src="https://placehold.co/1600x300/1E1B4B/EEF2FF?text=Customize+Your+Plan"
          alt="Customize plan"
          className="page-hero__bg"
        />
        <div className="container page-hero__content">
          <h2 style={{ color: '#fff' }}>
            {order.plan?.name} Plan — {order.plan?.mealsPerWeek} meals/week
          </h2>
          <button
            className="btn btn-ghost btn-sm mealprep-change-plan"
            onClick={() => setPhase(PHASE_SELECT)}
          >
            Change Plan
          </button>
        </div>
      </section>

      <div className="container mealprep-flow">
        {/* Step indicator */}
        <StepIndicator steps={STEP_LABELS} current={step} />

        <div className="mealprep-body">
          {/* Main content */}
          <div className="mealprep-main">
            {step === 0 && (
              <Step1Preferences
                preferences={order.preferences}
                onChange={(prefs) => updateOrder({ preferences: prefs })}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
            {step === 1 && (
              <Step2Meals
                selectedMeals={order.selectedMeals}
                preferences={order.preferences}
                quota={quota}
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
                onBack={handleBack}
                onPlace={handlePlaceOrder}
              />
            )}
          </div>

          {/* Sidebar — shown on steps 1–3 (not summary which has its own) */}
          {step < 3 && (
            <OrderSidebar
              plan={order.plan}
              selectedMeals={order.selectedMeals}
              quota={quota}
              totalSelected={totalMealsSelected}
            />
          )}
        </div>
      </div>
    </div>
  )
}
