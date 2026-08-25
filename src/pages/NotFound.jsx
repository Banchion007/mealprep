import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './NotFound.css'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Humble Chef</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="not-found">
        <div className="not-found__container">
          <div className="not-found__code">404</div>

          <h1 className="not-found__title">Page Not Found</h1>

          <p className="not-found__message">
            Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
          </p>

          <div className="not-found__suggestions">
            <p className="not-found__label">Here are some helpful links:</p>
            <nav className="not-found__links">
              <Link to="/" className="not-found__link">
                <svg className="not-found__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </Link>
              <Link to="/meal-prep" className="not-found__link">
                <svg className="not-found__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                  <path d="M16 5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8z" />
                  <path d="M9 9h6" />
                  <path d="M9 13h6" />
                </svg>
                Meal Prep
              </Link>
              <Link to="/quote" className="not-found__link">
                <svg className="not-found__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                </svg>
                Get a Quote
              </Link>
              <Link to="/contact" className="not-found__link">
                <svg className="not-found__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 6" />
                </svg>
                Contact Us
              </Link>
            </nav>
          </div>

          <div className="not-found__cta">
            <p className="not-found__cta-text">Can't find what you're looking for?</p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="not-found__decoration">
          <div className="not-found__decoration-item" />
        </div>
      </div>
    </>
  )
}
