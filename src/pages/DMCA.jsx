import React, { useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Legal.css'

export default function DMCA() {
  useScrollAnimation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container legal-hero__inner fade-up">
          <h1>DMCA Takedown Policy</h1>
          <p className="legal-subtitle">Digital Millennium Copyright Act Compliance</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <section className="legal-section fade-up">
            <h2>1. Copyright Infringement Claims</h2>
            <p>
              Humble Chef respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). If you believe that content on our website or services infringes your copyright, you may submit a takedown notice following the procedure below.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>2. How to Submit a Takedown Notice</h2>
            <p>
              To submit a copyright infringement claim, please provide the following information in writing:
            </p>
            <ol>
              <li>Your name, address, phone number, and email address</li>
              <li>A detailed description of the copyrighted work you claim has been infringed</li>
              <li>The specific URL(s) or location(s) on our website where the allegedly infringing content appears</li>
              <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, their agent, or the law</li>
              <li>A statement under penalty of perjury that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf</li>
              <li>Your physical or electronic signature</li>
            </ol>
            <p>
              <strong>Send your notice to our Designated Copyright Agent:</strong>
            </p>
            <p>
              <strong>Email:</strong> humblechefbrian@gmail.com<br />
              <strong>Subject Line:</strong> "DMCA Takedown Notice"<br />
              <strong>Mailing Address:</strong> 3803 Ward Neal Rd, Bells, TX 75414
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>3. Our Response</h2>
            <p>
              Upon receipt of a valid DMCA takedown notice, we will:
            </p>
            <ol>
              <li>Promptly investigate the claim</li>
              <li>Remove or disable access to the allegedly infringing content (or restrict access if needed)</li>
              <li>Notify the content provider (if applicable) of the removal</li>
              <li>Provide you with confirmation of action taken</li>
            </ol>
            <p>
              We will process legitimate takedown notices within 10 business days.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>4. Counter-Notification</h2>
            <p>
              If you believe content was removed in error, you may submit a counter-notification. Your counter-notification must include:
            </p>
            <ol>
              <li>Your name, address, phone number, and email address</li>
              <li>A description of the removed content and where it was located</li>
              <li>A statement under penalty of perjury that you believe the removal was made in error</li>
              <li>Your signature</li>
            </ol>
            <p>
              Send counter-notifications to the same Designated Copyright Agent address above. We will reinstate the content 10-14 business days after receiving a valid counter-notification unless the claimant files an action for injunctive relief.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>5. Policy for Repeat Infringers</h2>
            <p>
              In accordance with DMCA requirements, we will terminate the accounts of users who are repeat infringers of copyright or other intellectual property rights.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>6. Designated Copyright Agent</h2>
            <p>
              Humble Chef's Designated DMCA Agent for copyright infringement claims is:
            </p>
            <p>
              <strong>Brian [Last Name]</strong><br />
              <strong>Humble Chef</strong><br />
              <strong>3803 Ward Neal Rd</strong><br />
              <strong>Bells, TX 75414</strong><br />
              <strong>Email:</strong> humblechefbrian@gmail.com<br />
              <strong>Phone:</strong> (903) 484-4470
            </p>
            <p>
              <em>
                <strong>IMPORTANT NOTE FOR USERS:</strong> Humble Chef's principal contact has not yet registered as a DMCA Designated Agent with the U.S. Copyright Office. This registration is required by law and must be completed by the company owner at <a href="https://www.copyright.gov" target="_blank" rel="noopener noreferrer">copyright.gov</a>. There is a small filing fee. Until registration is complete, this policy serves as notice of our commitment to DMCA compliance.
              </em>
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>7. False Claims</h2>
            <p>
              Please note that submitting a false DMCA takedown notice is illegal and subject to penalties under 17 U.S.C. § 512(f). If we determine that a takedown notice is knowingly false or materially misrepresents infringement, we may take legal action.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>8. User Content</h2>
            <p>
              Users of our Services (including those who submit recipes, reviews, or other content) agree that:
            </p>
            <ul>
              <li>They own or have authorization to use all content they submit</li>
              <li>Their content does not infringe third-party rights</li>
              <li>They will not submit content that violates copyright, trademark, patent, or trade secret laws</li>
            </ul>
            <p>
              By submitting content, you grant Humble Chef a license to display and use your content on our website and related services.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>9. Contact & Questions</h2>
            <p>
              If you have questions about our DMCA policy or need to report copyright infringement, please contact our Designated Agent at humblechefbrian@gmail.com or (903) 484-4470.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
