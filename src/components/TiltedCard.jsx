import { useRef, useState } from 'react'
import './TiltedCard.css'

/**
 * Wraps any card content with a mouse-tracking 3D tilt effect (Reactbits Tilted Card).
 * className is applied to the outer figure (use it for grid/fade-up placement classes).
 */
export default function TiltedCard({ children, className = '' }) {
  const innerRef = useRef(null)
  const [tiltStyle, setTiltStyle] = useState({})

  const handleMouseMove = (e) => {
    const el = innerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setTiltStyle({
      transform: `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 0.08s ease-out',
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)',
      transition: 'transform 0.5s ease-out',
    })
  }

  return (
    <div className={`tilted-card-figure ${className}`}>
      <div
        ref={innerRef}
        className="tilted-card-inner"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
      >
        {children}
      </div>
    </div>
  )
}
