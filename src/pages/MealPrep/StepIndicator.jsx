/* ===================================================
   Step Indicator — horizontal progress bar
=================================================== */
import React from 'react'
import './StepIndicator.css'

export default function StepIndicator({ steps, current }) {
  return (
    <div className="step-indicator">
      {steps.map((label, i) => {
        const done    = i < current
        const active  = i === current
        return (
          <React.Fragment key={label}>
            <div className={`step-indicator__item${done ? ' done' : ''}${active ? ' active' : ''}`}>
              <div className="step-indicator__circle">
                {done ? (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="step-indicator__label">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`step-indicator__line${done ? ' done' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
