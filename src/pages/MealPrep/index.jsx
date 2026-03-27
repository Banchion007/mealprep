/* ===================================================
   MealPrep — Flow controller
   Screens: start → menu → delivery → summary → done
=================================================== */
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MenuProvider } from '../../contexts/MenuContext'
import MealPrepStart    from './MealPrepStart'
import MealPrepMenu     from './MealPrepMenu'
import MealPrepDelivery from './MealPrepDelivery'
import MealPrepSummary  from './MealPrepSummary'
import Confirmation     from './Confirmation'
import './MealPrep.css'

const SCREENS = ['start', 'menu', 'delivery', 'summary', 'done']

const STEP_LABELS = [
  { key: 'menu',     label: 'Menu' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'summary',  label: 'Payment' },
]

const INIT_DELIVERY = {
  address:    { street: '', city: '', state: '', zip: '' },
  date:       '',
  timeWindow: '',
}

export default function MealPrep() {
  const { user, setShowAuthModal } = useAuth()
  const [screen,        setScreen]        = useState('start')
  const [selectedMeals, setSelectedMeals] = useState({})
  const [delivery,      setDelivery]      = useState(INIT_DELIVERY)
  const [orderNo,       setOrderNo]       = useState(null)
  const [orderTotal,    setOrderTotal]    = useState(0)

  // If user signs in while at start screen, auto-advance to menu
  useEffect(() => {
    if (user && screen === 'start') {
      // Don't auto-advance; wait for explicit button click
    }
  }, [user])

  const handleStart = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setScreen('menu')
  }

  // After auth modal closes with a user logged in
  useEffect(() => {
    if (user && screen === 'start') {
      // Still let them click the button; don't force-advance
    }
  }, [user, screen])

  const handleDone = (num, total) => {
    setOrderNo(num)
    setOrderTotal(total)
    setScreen('done')
  }

  const handleStartOver = () => {
    setSelectedMeals({})
    setDelivery(INIT_DELIVERY)
    setOrderNo(null)
    setOrderTotal(0)
    setScreen('start')
  }

  const currentStepIdx = STEP_LABELS.findIndex(s => s.key === screen)

  return (
    <MenuProvider>
      {screen === 'start' ? (
        <MealPrepStart onStart={handleStart} />
      ) : screen === 'done' ? (
        <Confirmation
          order={{ selectedMeals, schedule: delivery }}
          orderNo={orderNo}
          orderTotal={orderTotal}
          onStartOver={handleStartOver}
        />
      ) : (
        <div className="mp-flow">
          {/* Progress bar */}
          <div className="mp-progress-bar">
            <div className="mp-progress-bar__inner">
              <button
                className="mp-progress-bar__back"
                onClick={() => setScreen(screen === 'menu' ? 'start' : screen === 'delivery' ? 'menu' : 'delivery')}
                aria-label="Go back"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>

              <div className="mp-steps">
                {STEP_LABELS.map((s, i) => (
                  <React.Fragment key={s.key}>
                    <div className={`mp-step${i < currentStepIdx ? ' mp-step--done' : i === currentStepIdx ? ' mp-step--active' : ''}`}>
                      <div className="mp-step__dot">
                        {i < currentStepIdx ? (
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <span className="mp-step__label">{s.label}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={`mp-step__line${i < currentStepIdx ? ' mp-step__line--done' : ''}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="mp-progress-bar__spacer" />
            </div>
          </div>

          {/* Screen content */}
          {screen === 'menu' && (
            <MealPrepMenu
              selectedMeals={selectedMeals}
              onChange={setSelectedMeals}
              onNext={() => setScreen('delivery')}
            />
          )}
          {screen === 'delivery' && (
            <MealPrepDelivery
              delivery={delivery}
              selectedMeals={selectedMeals}
              onChange={setDelivery}
              onBack={() => setScreen('menu')}
              onNext={() => setScreen('summary')}
            />
          )}
          {screen === 'summary' && (
            <MealPrepSummary
              selectedMeals={selectedMeals}
              delivery={delivery}
              onBack={() => setScreen('delivery')}
              onDone={handleDone}
            />
          )}
        </div>
      )}
    </MenuProvider>
  )
}
