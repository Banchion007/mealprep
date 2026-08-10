import React, { useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Legal.css'

export default function TermsOfService() {
  useScrollAnimation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container legal-hero__inner fade-up">
          <h1>Terms of Service</h1>
          <p className="legal-subtitle">Last updated: August 10, 2026</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <section className="legal-section fade-up">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using the Humble Chef website and services (humblechef.com), you agree to be bound by these Terms of Service. If you do not agree, do not use our Services.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>2. Use License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use our website for lawful purposes related to ordering meal prep services and catering.
            </p>
            <p><strong>You agree not to:</strong></p>
            <ul>
              <li>Reproduce, distribute, or transmit any content without authorization</li>
              <li>Use automated tools to scrape or access the Services</li>
              <li>Attempt unauthorized access to the website or systems</li>
              <li>Upload viruses, malware, or harmful content</li>
              <li>Interfere with the proper functioning of the Services</li>
              <li>Engage in harassment, fraud, or illegal activity</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>3. Intellectual Property</h2>
            <p>
              All content on our website, including text, recipes, images, logos, and design (the "Content"), is the exclusive property of Humble Chef or our licensors. You may not use, reproduce, or distribute this Content without written permission.
            </p>
            <p>
              Recipes and meal ideas provided through our Services are for personal use only and may not be reproduced or sold commercially.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>4. User Accounts</h2>
            <p>
              To place orders, you may need to create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current information</li>
              <li>Maintain the confidentiality of your password</li>
              <li>Not share your account with others</li>
              <li>Accept responsibility for all activity on your account</li>
              <li>Notify us immediately of unauthorized access</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>5. Orders and Payments</h2>
            <h3>5.1 Order Acceptance</h3>
            <p>
              By placing an order, you are offering to purchase meals. We reserve the right to accept or decline any order. Accepted orders will be confirmed via email.
            </p>

            <h3>5.2 Pricing and Availability</h3>
            <p>
              All prices are subject to change without notice. We may limit quantities or restrict orders to certain regions. Prices include applicable taxes.
            </p>

            <h3>5.3 Payment</h3>
            <p>
              Payment is processed through Stripe (PCI-DSS compliant). By providing payment information, you authorize us to charge your card. Payment failures may result in order cancellation.
            </p>

            <h3>5.4 Cancellation and Refunds</h3>
            <p>
              <strong>Cancellation Policy:</strong> Orders may be cancelled up to 48 hours before the scheduled delivery date for a full refund. Cancellations within 48 hours are non-refundable.
            </p>
            <p>
              If an order is cancelled by us due to unavailability, you will receive a full refund within 5-7 business days.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>6. Delivery and Risk of Loss</h2>
            <p>
              Risk of loss for delivered meals passes to you upon delivery. We are not responsible for:
            </p>
            <ul>
              <li>Damage or spoilage after delivery</li>
              <li>Incorrect addresses provided by you</li>
              <li>Missed deliveries due to inaccessible locations</li>
              <li>Delays due to weather, traffic, or other unforeseen circumstances</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>7. Allergen and Dietary Information</h2>
            <p>
              We provide allergen and dietary information based on ingredient lists and preparation. However, we cannot guarantee zero cross-contamination in our kitchen. If you have severe allergies, please contact us before ordering.
            </p>
            <p>
              You assume all risk associated with dietary or allergen concerns. Humble Chef is not liable for allergic reactions.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>8. Limitation of Liability</h2>
            <p>
              <strong>TO THE FULLEST EXTENT PERMITTED BY LAW:</strong> Humble Chef is not liable for:
            </p>
            <ul>
              <li>Indirect, incidental, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, or data</li>
              <li>Service interruptions or delays</li>
              <li>Third-party claims arising from your use of our Services</li>
            </ul>
            <p>
              Our total liability is limited to the amount you paid for the applicable order.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              <strong>OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE."</strong> We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>10. Dispute Resolution & Arbitration</h2>
            <p>
              <strong>Binding Arbitration:</strong> Any dispute arising out of or relating to these Terms, your use of the Services, or your orders shall be resolved by binding arbitration administered by JAMS, rather than in court.
            </p>
            <p>
              <strong>Class Action Waiver:</strong> You agree that arbitration shall be conducted on an individual basis. You waive the right to pursue claims as part of a class action, class arbitration, or representative action.
            </p>
            <p>
              <em>Note:</em> Enforceability of arbitration and class waiver provisions varies by state and jurisdiction. We recommend consulting with a Texas-based attorney before agreeing to these Terms, as Texas law will govern.
            </p>
            <p>
              <strong>Exceptions:</strong> Small claims court actions and injunctive relief (for intellectual property infringement) are not subject to arbitration.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Humble Chef, its owners, employees, and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your use of the Services</li>
              <li>Your orders or communications</li>
              <li>Your infringement of third-party rights</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Texas, without regard to conflict-of-law principles. Any legal action shall take place in Bell County, Texas or through binding arbitration.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>13. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in effect.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>14. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Material changes will be communicated via email or prominent website notice. Your continued use of the Services constitutes acceptance.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>15. Contact Us</h2>
            <p>
              For questions about these Terms of Service:
            </p>
            <p>
              <strong>Email:</strong> humblechefbrian@gmail.com<br />
              <strong>Mailing Address:</strong> 3803 Ward Neal Rd, Bells, TX 75414<br />
              <strong>Phone:</strong> (903) 484-4470
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
