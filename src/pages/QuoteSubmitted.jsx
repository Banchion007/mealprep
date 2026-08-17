import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { pageMetadata, getCanonicalUrl, SITE_NAME, DEFAULT_OG_IMAGE } from '../lib/seo'
import './QuoteSubmitted.css'

export default function QuoteSubmitted() {
  useEffect(() => {
    // Google conversion tracking - fires when page loads
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: '/quote/submitted',
        page_title: 'Quote Submitted - Humble Chef'
      })
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Quote Submitted | Humble Chef</title>
        <meta name="description" content="Your catering quote request has been submitted successfully." />
        <link rel="canonical" href={getCanonicalUrl('/quote/submitted')} />
        <meta property="og:title" content="Quote Submitted" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="quote-submitted">
        <div className="quote-submitted__container">
          <div className="quote-submitted__icon">✓</div>
          <h1 className="quote-submitted__title">Your Quote Request Has Been Submitted!</h1>
          <p className="quote-submitted__subtitle">
            We'll review your selections and reach out within 1–2 business days.
          </p>

          <div className="quote-submitted__note">
            A confirmation email has been sent to your inbox.
          </div>

          <div className="quote-submitted__buttons">
            <Link to="/" className="btn btn-primary btn-lg">
              Go Back to Home
            </Link>
            <Link to="/quote" className="btn btn-outline btn-lg">
              Start a New Quote
            </Link>
          </div>

          <div className="quote-submitted__next-steps">
            <h3>What Happens Next?</h3>
            <ul>
              <li>We'll review your selections and preferences</li>
              <li>Our team will contact you to confirm details</li>
              <li>We'll provide a final quote and timeline</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
