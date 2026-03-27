/* ===================================================
   MealPrepSummary — Order review + Stripe payment
   Backend: Supabase Edge Function "create-payment-intent"
   Env vars required:
     VITE_STRIPE_PUBLISHABLE_KEY  (frontend)
     STRIPE_SECRET_KEY            (Supabase secret, never in frontend)
=================================================== */
import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { DELIVERY_WINDOWS } from './data'
import { useAuth } from '../../contexts/AuthContext'
import { useMenu } from '../../contexts/MenuContext'
import { supabase } from '../../lib/supabase'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDateDisplay(dateKey) {
  if (!dateKey) return ''
  const d = new Date(dateKey + 'T12:00:00')
  const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]
  return `${weekday}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function calcTotal(selectedMeals, meals) {
  return Object.entries(selectedMeals).reduce((sum, [id, qty]) => {
    const meal = meals.find(m => m.id === id)
    return sum + (meal ? meal.price * qty : 0)
  }, 0)
}

/* ── Stripe card element appearance ── */
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: 'Montserrat, ui-sans-serif, sans-serif',
      fontWeight: '500',
      color: '#1a1641',
      letterSpacing: '0.01em',
      '::placeholder': { color: '#94a3b8' },
      iconColor: '#1a1641',
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626',
    },
  },
  hidePostalCode: true,
}

/* ── Inner payment form (must be inside <Elements>) ── */
function PaymentForm({ total, mealItems, delivery, user, saveOrder, onDone }) {
  const stripe   = useStripe()
  const elements = useElements()

  const [cardName,   setCardName]   = useState('')
  const [nameError,  setNameError]  = useState('')
  const [cardError,  setCardError]  = useState('')
  const [payError,   setPayError]   = useState('')
  const [placing,    setPlacing]    = useState(false)

  const addressStr = `${delivery.address.street}, ${delivery.address.city}, ${delivery.address.state} ${delivery.address.zip}`

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return

    // Validate name
    if (!cardName.trim()) {
      setNameError('Name on card is required')
      return
    }
    setNameError('')
    setPayError('')
    setPlacing(true)

    try {
      // 1. Ask backend to create a PaymentIntent
      const { data, error: fnError } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: total },
      })
      if (fnError || !data?.clientSecret) {
        throw new Error(fnError?.message || 'Could not reach payment server')
      }

      // 2. Confirm the card payment in the browser (card never touches your server)
      const cardElement = elements.getElement(CardElement)
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: cardName.trim() },
          },
        }
      )

      if (stripeError) {
        setCardError(stripeError.message)
        setPlacing(false)
        return
      }

      // 3. Payment succeeded — save order record
      const orderNum = `HC-${Date.now().toString().slice(-7)}`

      if (saveOrder && user) {
        await supabase.from('orders').insert({
          order_number:   orderNum,
          user_id:        user.id,
          customer_name:  user.user_metadata?.full_name || user.email,
          customer_email: user.email,
          type:           'Meal Prep',
          items:          mealItems.map(m => ({ id: m.id, name: m.name, qty: m.qty, price: m.price })),
          total:          parseFloat(total.toFixed(2)),
          delivery_date:  delivery.date,
          time_window:    delivery.timeWindow,
          address:        addressStr,
          status:         'Confirmed',
          stripe_payment_intent: paymentIntent.id,
        })
      }

      onDone(orderNum, total)
    } catch (err) {
      console.error(err)
      setPayError(err.message || 'Something went wrong. Please try again.')
      setPlacing(false)
    }
  }

  return (
    <div className="mp-payment-form">
      <div className="mp-payment-form__header">
        <h4>Payment</h4>
        <div className="mp-card-icons">
          <span className="mp-card-icon">VISA</span>
          <span className="mp-card-icon">MC</span>
          <span className="mp-card-icon">AMEX</span>
        </div>
      </div>

      {/* Name on card */}
      <div className="mp-field">
        <label className="mp-field__label" htmlFor="card-name">Name on card</label>
        <input
          id="card-name"
          type="text"
          className={`mp-field__input${nameError ? ' mp-field__input--error' : ''}`}
          placeholder="Jane Smith"
          value={cardName}
          onChange={e => { setCardName(e.target.value); setNameError('') }}
        />
        {nameError && <span className="mp-field-error">{nameError}</span>}
      </div>

      {/* Stripe CardElement */}
      <div className="mp-field">
        <label className="mp-field__label">Card details</label>
        <div className={`mp-stripe-card-wrap${cardError ? ' mp-stripe-card-wrap--error' : ''}`}>
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={e => {
              if (e.error) setCardError(e.error.message)
              else setCardError('')
            }}
          />
        </div>
        {cardError && <span className="mp-field-error">{cardError}</span>}
      </div>

      {payError && (
        <div className="mp-pay-error">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {payError}
        </div>
      )}

      <button
        className="btn btn-primary mp-place-btn"
        onClick={handlePlaceOrder}
        disabled={placing || !stripe}
      >
        {placing ? (
          <>
            <span className="mp-spinner" />
            Processing…
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Place Order · ${total.toFixed(2)}
          </>
        )}
      </button>

      <p className="mp-secure-note">
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Secured by Stripe · 256-bit SSL
      </p>
    </div>
  )
}

/* ── Main summary component ── */
export default function MealPrepSummary({ selectedMeals, delivery, onBack, onDone }) {
  const { user } = useAuth()
  const { meals } = useMenu()
  const [saveOrder, setSaveOrder] = useState(true)
  useScrollAnimation('.fade-up', meals.length)

  const subtotal     = calcTotal(selectedMeals, meals)
  const tax          = subtotal * 0.0825
  const delivery_fee = subtotal >= 50 ? 0 : 5.99
  const total        = subtotal + tax + delivery_fee

  const mealItems = Object.entries(selectedMeals)
    .map(([id, qty]) => {
      const meal = meals.find(m => m.id === id)
      return meal ? { ...meal, qty } : null
    })
    .filter(Boolean)

  const timeLabel = DELIVERY_WINDOWS.find(w => w.id === delivery.timeWindow)?.time || ''

  return (
    <div className="mp-summary">
      <div className="mp-summary__header fade-up">
        <button className="mp-back-btn" onClick={onBack}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Delivery
        </button>
        <h1 className="mp-summary__title">Review & Pay</h1>
        <p className="mp-summary__sub">Check your order before placing it.</p>
      </div>

      <div className="mp-summary__body fade-up">
        {/* Left — order details */}
        <div className="mp-summary__left">
          {/* Meals */}
          <div className="mp-summary-card">
            <h3 className="mp-summary-card__title">Your Meals</h3>
            <div className="mp-summary-meals">
              {mealItems.map(meal => (
                <div key={meal.id} className="mp-summary-meal-row">
                  <img src={meal.img} alt={meal.name} className="mp-summary-meal-img" />
                  <div className="mp-summary-meal-info">
                    <p className="mp-summary-meal-name">{meal.name}</p>
                    <p className="mp-summary-meal-cal">{meal.calories} cal</p>
                  </div>
                  <div className="mp-summary-meal-right">
                    <span className="mp-summary-meal-qty">×{meal.qty}</span>
                    <span className="mp-summary-meal-price">${(meal.price * meal.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery details */}
          <div className="mp-summary-card">
            <h3 className="mp-summary-card__title">Delivery Details</h3>
            <div className="mp-summary-delivery">
              <div className="mp-summary-delivery-row">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>
                  {delivery.address.street}, {delivery.address.city}, {delivery.address.state} {delivery.address.zip}
                </span>
              </div>
              <div className="mp-summary-delivery-row">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{formatDateDisplay(delivery.date)}</span>
              </div>
              <div className="mp-summary-delivery-row">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{timeLabel}</span>
              </div>
            </div>
          </div>

          {/* Save order toggle */}
          {user && (
            <label className="mp-save-toggle">
              <div
                className={`mp-toggle${saveOrder ? ' mp-toggle--on' : ''}`}
                role="checkbox"
                aria-checked={saveOrder}
                tabIndex={0}
                onClick={() => setSaveOrder(v => !v)}
                onKeyDown={e => e.key === ' ' && setSaveOrder(v => !v)}
              >
                <div className="mp-toggle__thumb" />
              </div>
              <span>Save this order to my account history</span>
            </label>
          )}
        </div>

        {/* Right — pricing + payment */}
        <div className="mp-summary__right">
          <div className="mp-summary-card mp-price-card">
            <h3 className="mp-summary-card__title">Order Total</h3>
            <div className="mp-price-rows">
              <div className="mp-price-row">
                <span>Subtotal ({mealItems.reduce((s, m) => s + m.qty, 0)} meals)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mp-price-row">
                <span>Delivery fee</span>
                <span>
                  {delivery_fee === 0
                    ? <span className="mp-free">Free</span>
                    : `$${delivery_fee.toFixed(2)}`}
                </span>
              </div>
              {delivery_fee > 0 && (
                <p className="mp-price-note">Free delivery on orders $50+</p>
              )}
              <div className="mp-price-row">
                <span>Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="mp-price-row mp-price-row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Stripe Elements wrapper */}
            <Elements stripe={stripePromise}>
              <PaymentForm
                total={total}
                mealItems={mealItems}
                delivery={delivery}
                user={user}
                saveOrder={saveOrder}
                meals={meals}
                onDone={onDone}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  )
}
