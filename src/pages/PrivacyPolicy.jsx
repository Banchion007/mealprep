import React, { useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Legal.css'

export default function PrivacyPolicy() {
  useScrollAnimation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container legal-hero__inner fade-up">
          <h1>Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: August 10, 2026</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <section className="legal-section fade-up">
            <h2>1. Introduction</h2>
            <p>
              Humble Chef ("we," "our," "us," or "Company") operates the humblechef.com website and related services (the "Services"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>2. Information We Collect</h2>
            <p>We collect information you provide directly and information collected automatically:</p>
            <h3>2.1 Information You Provide Directly</h3>
            <ul>
              <li><strong>Account Information:</strong> Full name, email address, phone number, delivery address, password (hashed)</li>
              <li><strong>Order Information:</strong> Meal selections, dietary preferences, delivery dates, payment details (processed by Stripe; we do not store full card numbers)</li>
              <li><strong>Contact Form Submissions:</strong> Name, email, phone, event details, message content (sent via Resend email service)</li>
              <li><strong>Profile Information:</strong> Display name, saved recipes, grocery lists, preferences</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Log Data:</strong> IP address, browser type, pages visited, time and date stamps, device information</li>
              <li><strong>Cookies & Tracking:</strong> Session cookies for authentication (essential, no third-party tracking cookies)</li>
              <li><strong>Analytics:</strong> We use Vercel Analytics to measure site performance; no personally identifiable information is stored</li>
            </ul>

            <h3>2.3 Third-Party Services</h3>
            <p>Our Services integrate with:</p>
            <ul>
              <li><strong>Supabase (PostgreSQL):</strong> Stores user accounts, orders, recipes, delivery profiles, and site settings</li>
              <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant; we never see full card numbers)</li>
              <li><strong>Resend:</strong> Email delivery for contact form submissions and order updates</li>
              <li><strong>Vercel:</strong> Hosting and analytics (basic performance metrics only)</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Create and maintain your account</li>
              <li>Process and fulfill meal prep orders</li>
              <li>Send order confirmations, delivery updates, and account notifications</li>
              <li>Respond to inquiries and support requests</li>
              <li>Prevent fraud and improve security</li>
              <li>Improve website performance and user experience</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>4. Data Retention</h2>
            <p>
              We retain your information as long as your account is active. After account deletion:
            </p>
            <ul>
              <li>Personal identification data is anonymized or deleted within 30 days</li>
              <li>Order records may be retained for 7 years for tax and legal compliance</li>
              <li>Payment information is not retained (handled by Stripe)</li>
            </ul>
          </section>

          <section className="legal-section fade-up">
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul>
              <li>Row-Level Security (RLS) in our database to prevent unauthorized data access</li>
              <li>HTTPS encryption for all data in transit</li>
              <li>Hashed passwords and secure authentication via Supabase Auth</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to Stripe and Resend API keys (server-side only)</li>
            </ul>
            <p>
              No security system is impenetrable. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>6. Artificial Intelligence Disclosure</h2>
            <p>
              Currently, our Services do not use AI models (such as Claude API) in customer-facing features. If we integrate AI in the future, we will update this policy and disclose AI usage near relevant features.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>7. Your Rights and Choices</h2>
            <h3>7.1 Access and Download</h3>
            <p>
              You have the right to download all your personal data. Visit your <a href="/account">Account Settings</a> and use the "Download My Data" feature to export your profile, orders, recipes, and preferences as JSON.
            </p>

            <h3>7.2 Deletion and Account Termination</h3>
            <p>
              You may delete your account and all associated personal data at any time from your <a href="/account">Account Settings</a>. This action is irreversible. Completed orders will be anonymized for tax purposes but not deleted.
            </p>

            <h3>7.3 Correction and Updates</h3>
            <p>
              You can update your profile information (name, delivery address) directly in your <a href="/account">Account Settings</a>.
            </p>

            <h3>7.4 Cookie Management</h3>
            <p>
              We only use essential session cookies. You can disable cookies in your browser, but this may affect site functionality.
            </p>

            <h3>7.5 CCPA / GDPR Rights (if applicable)</h3>
            <p>
              If you are a California or European resident, you have the right to access, delete, and export your personal data as described above. Contact us at humblechefbrian@gmail.com with "PRIVACY REQUEST" in the subject line.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before providing information.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of material changes via email or prominent notice on the website. Your continued use of the Services constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="legal-section fade-up">
            <h2>10. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices:
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
