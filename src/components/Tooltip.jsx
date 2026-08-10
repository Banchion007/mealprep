/* ===================================================
   Tooltip — simple hover/focus tooltip component
=================================================== */
import React, { useState } from 'react'
import './Tooltip.css'

export function Tooltip({ children, label, side = 'top' }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="tooltip-wrapper">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div className={`tooltip tooltip--${side}`} role="tooltip">
          {label}
        </div>
      )}
    </div>
  )
}
