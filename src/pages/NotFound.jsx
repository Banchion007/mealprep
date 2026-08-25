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
        <div className="not-found__inner">
          <div className="not-found__photo">
            <figure className="not-found__figure">
              <img
                src="/our-story.png"
                alt="Humble Chef team"
                className="not-found__img"
              />
              <figcaption className="not-found__caption">Even our chefs get lost sometimes.</figcaption>
            </figure>
          </div>

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
                  <span className="not-found__link-icon">🏠</span>
                  Home
                </Link>
                <Link to="/meal-prep" className="not-found__link">
                  <span className="not-found__link-icon">🍱</span>
                  Meal Prep
                </Link>
                <Link to="/quote" className="not-found__link">
                  <span className="not-found__link-icon">📋</span>
                  Get a Quote
                </Link>
                <Link to="/contact" className="not-found__link">
                  <span className="not-found__link-icon">📧</span>
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
        </div>

        <div className="not-found__decoration">
          <div className="not-found__decoration-item" />
        </div>
      </div>
    </>
  )
}
