/* ===================================================
   useScrollAnimation — adds .visible class when
   elements enter the viewport
=================================================== */
import { useEffect } from 'react'

export function useScrollAnimation(selector = '.fade-up') {
  useEffect(() => {
    const els = document.querySelectorAll(selector)
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}
