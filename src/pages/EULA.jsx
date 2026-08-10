import React, { useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Legal.css'

export default function EULA() {
  useScrollAnimation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container legal-hero__inner fade-up">
          <h1>End User License Agreement (EULA)</h1>
          <p className="legal-subtitle">Last updated: August 10, 2026</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <section className="legal-section fade-up">
            <h2>1. License Grant</h2>
            <p>
              Humble Chef grants you a limited, personal, non-exclusive, non-transferable license to use the Humble Chef website and mobile-optimized services (the "Application") for the purpose of ordering meal prep and catering services. This license does not include:
            </p>
            <ul>
              <li>The right to modify, adapt, or create derivative works</li>
              <li>The right to reverse engineer or decompile the Application</li>
              <li>The right to sell, rent, or lease the Application</li>
              <li>The right to remove or alter copyright notices or proprietary markings</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>2. Ownership</h2>
            <p>
              Humble Chef retains all right, title, and interest in the Application, including all software, source code, design, graphics, logos, trademarks, and content. All rights not expressly granted to you are reserved.
            </p>
            <p>
              You may only use the Application as provided and as intended for lawful meal prep and catering ordering.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>3. Updates and Modifications</h2>
            <p>
              Humble Chef reserves the right to update, modify, or discontinue the Application at any time with or without notice. We are not liable for any loss of data or functionality resulting from updates or modifications.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>4. Restrictions</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Application for any unlawful or unauthorized purpose</li>
              <li>Copy, reproduce, or distribute the Application or its components</li>
              <li>Attempt to modify, decompile, disassemble, or reverse engineer the Application</li>
              <li>Use the Application to develop a competing service</li>
              <li>Access the Application through automated tools or scripts</li>
              <li>Interfere with or disrupt the Application's servers or networks</li>
              <li>Remove or obscure any copyright, trademark, or proprietary notices</li>
              <li>Sell, license, or transfer your license to others</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>5. Intellectual Property Rights</h2>
            <h3>5.1 Our Content</h3>
            <p>
              All recipes, photographs, descriptions, meal planning guides, and other content provided through the Application are the intellectual property of Humble Chef or our partners. You may not reproduce, distribute, or use this content without written permission.
            </p>

            <h3>5.2 User Content</h3>
            <p>
              If you submit reviews, comments, recipes, or other content through the Application, you grant Humble Chef a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>6. Third-Party Software</h2>
            <p>
              The Application may contain third-party software and libraries. Such software is provided under its own license terms. You may review license information in our application documentation.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              <strong>THE APPLICATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.</strong> We disclaim all warranties including:
            </p>
            <ul>
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Title</li>
              <li>Accuracy or completeness</li>
            </ul>
            <p>
              We do not warrant that the Application will be error-free, uninterrupted, or secure.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>8. Limitation of Liability</h2>
            <p>
              <strong>TO THE FULLEST EXTENT PERMITTED BY LAW:</strong> Humble Chef shall not be liable for:
            </p>
            <ul>
              <li>Indirect, incidental, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, or data</li>
              <li>Service interruptions or delays</li>
              <li>Unauthorized access or use of the Application</li>
            </ul>
            <p>
              Our total liability is limited to the amount you paid for services in the past 12 months.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>9. Termination</h2>
            <p>
              This EULA is effective until terminated. Your rights under this EULA will terminate automatically if you:
            </p>
            <ul>
              <li>Violate any term of this agreement</li>
              <li>Attempt to reverse engineer or misuse the Application</li>
              <li>Engage in unauthorized commercial use</li>
            </ul>
            <p>
              Upon termination, you must cease all use of the Application and destroy any copies in your possession.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>10. Governing Law</h2>
            <p>
              This EULA is governed by the laws of the State of Texas without regard to conflict-of-law principles.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>11. Entire Agreement</h2>
            <p>
              This EULA, together with our Privacy Policy and Terms of Service, constitutes the entire agreement between you and Humble Chef regarding the Application and supersedes all prior agreements and understandings.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this EULA:
            </p>
            <p>
              <strong>Email:</strong> humblechefbrian@gmail.com<br />
              <strong>Mailing Address:</strong> 3803 Ward Neal Rd, Bells, TX 75414
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
