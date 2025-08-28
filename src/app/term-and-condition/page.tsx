'use client'
// pages/terms-and-privacy.js
import { useState } from 'react';
import Head from 'next/head';

export default function TermsAndPrivacy() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <>
      <Head>
        <title>Terms of Service & Privacy Policy - AI Agent Marketplace</title>
        <meta name="description" content="Terms of Service, Privacy Policy, and legal information for AI Agent Marketplace" />
      </Head>

      <div className="terms-container">
        {/* Header */}
        <div className="terms-header">
          <div className="header-content">
            <h1>Legal Information</h1>
            <p>Please review our terms of service and privacy policy</p>
            <div className="last-updated">
              Last Updated: December 28, 2024
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <div className="tab-container">
            <button
              className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              Terms of Service
            </button>
            <button
              className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy Policy
            </button>
            <button
              className={`tab-button ${activeTab === 'acceptable' ? 'active' : ''}`}
              onClick={() => setActiveTab('acceptable')}
            >
              Acceptable Use
            </button>
            <button
              className={`tab-button ${activeTab === 'refund' ? 'active' : ''}`}
              onClick={() => setActiveTab('refund')}
            >
              Refund Policy
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Terms of Service */}
          {activeTab === 'terms' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Terms of Service</h2>
              </div>

              <div className="terms-content">
                <section className="legal-section">
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By accessing or using our AI Agent Marketplace ("Platform", "Service", "we", "us", "our"),
                    you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these
                    Terms, you may not use our Service.
                  </p>
                </section>

                <section className="legal-section">
                  <h3>2. Description of Service</h3>
                  <p>
                    Our Platform is a marketplace where users can buy, sell, and trade AI agents using our
                    proprietary credit system. Payments are processed through Razorpay's secure payment gateway.
                  </p>
                </section>

                <section className="legal-section">
                  <h3>3. Eligibility</h3>
                  <ul>
                    <li>You must be at least 18 years old to use our Service</li>
                    <li>You must have the legal capacity to enter into binding agreements</li>
                    <li>You must not be prohibited from using our Service under applicable laws</li>
                    <li>Business users must have proper authorization to represent their organization</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>4. User Accounts</h3>
                  <h4>4.1 Account Creation</h4>
                  <ul>
                    <li>You must provide accurate, complete, and current information</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                  </ul>

                  <h4>4.2 Account Types</h4>
                  <ul>
                    <li><strong>Individual Users:</strong> Personal accounts for individual use</li>
                    <li><strong>Business Users:</strong> Commercial accounts for organizations</li>
                    <li><strong>Developer/Seller Accounts:</strong> For users who create and sell AI agents</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>5. Platform Credits System</h3>
                  <h4>5.1 Credit Purchase</h4>
                  <ul>
                    <li>Credits are purchased using real money through Razorpay</li>
                    <li>Credits have no expiration date unless stated otherwise</li>
                    <li>Credit purchases are non-refundable except as required by law</li>
                    <li>Minimum and maximum credit purchase limits may apply</li>
                  </ul>

                  <h4>5.2 Credit Usage</h4>
                  <ul>
                    <li>Credits can be used to purchase AI agents on the Platform</li>
                    <li>Credits cannot be transferred between accounts without authorization</li>
                    <li>Credits cannot be redeemed for cash or real money</li>
                    <li>We reserve the right to adjust credit values with 30 days notice</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>6. Prohibited Activities</h3>
                  <p>You may not:</p>
                  <ul>
                    <li>Upload malicious, harmful, or illegal AI agents</li>
                    <li>Attempt to reverse engineer or copy other users' AI agents</li>
                    <li>Use the Platform for money laundering or fraudulent activities</li>
                    <li>Create multiple accounts to circumvent restrictions</li>
                    <li>Manipulate reviews or ratings</li>
                    <li>Violate intellectual property rights of others</li>
                    <li>Share account credentials with unauthorized parties</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>7. Limitation of Liability</h3>
                  <p>
                    To the maximum extent permitted by law, our total liability shall not exceed the amount
                    you paid us in the 12 months preceding the claim. We are not liable for indirect,
                    incidental, or consequential damages.
                  </p>
                </section>

                <section className="legal-section">
                  <h3>8. Termination</h3>
                  <p>
                    We may terminate accounts for Terms violations or suspend accounts pending investigation.
                    You may terminate your account at any time, though remaining credits may be forfeited
                    upon termination.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Privacy Policy</h2>
              </div>

              <div className="terms-content">
                <section className="legal-section">
                  <h3>1. Information We Collect</h3>
                  <h4>1.1 Information You Provide</h4>
                  <ul>
                    <li>Account registration information (name, email, phone number)</li>
                    <li>Payment information (processed by Razorpay, not stored by us)</li>
                    <li>Profile information and preferences</li>
                    <li>AI agents and content you upload</li>
                    <li>Communications with our support team</li>
                  </ul>

                  <h4>1.2 Information Automatically Collected</h4>
                  <ul>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                    <li>Usage patterns and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Error logs and performance data</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>2. How We Use Your Information</h3>
                  <h4>2.1 Platform Operations</h4>
                  <ul>
                    <li>Providing and maintaining the Service</li>
                    <li>Processing transactions and payments</li>
                    <li>Authenticating users and preventing fraud</li>
                    <li>Providing customer support</li>
                    <li>Communicating service updates and notifications</li>
                  </ul>

                  <h4>2.2 Improvement and Analytics</h4>
                  <ul>
                    <li>Analyzing usage patterns to improve the Platform</li>
                    <li>Developing new features and services</li>
                    <li>Conducting research and analytics</li>
                    <li>Personalizing your experience</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>3. Information Sharing and Disclosure</h3>
                  <h4>3.1 Service Providers</h4>
                  <ul>
                    <li>Payment processors (Razorpay)</li>
                    <li>Cloud hosting providers</li>
                    <li>Analytics services</li>
                    <li>Customer support tools</li>
                    <li>Email service providers</li>
                  </ul>

                  <h4>3.2 Legal Requirements</h4>
                  <ul>
                    <li>Complying with legal obligations</li>
                    <li>Protecting our rights and property</li>
                    <li>Investigating fraud or security issues</li>
                    <li>Responding to government requests</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>4. Data Security</h3>
                  <ul>
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits and assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Employee training on data protection</li>
                    <li>PCI DSS compliant payment processing through Razorpay</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>5. Your Privacy Rights</h3>
                  <h4>5.1 Access and Portability</h4>
                  <ul>
                    <li>Right to access your personal information</li>
                    <li>Right to obtain copies of your data</li>
                    <li>Right to data portability in machine-readable format</li>
                  </ul>

                  <h4>5.2 Correction and Deletion</h4>
                  <ul>
                    <li>Right to correct inaccurate information</li>
                    <li>Right to delete your account and personal data</li>
                    <li>Right to request restriction of processing</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>6. Data Retention</h3>
                  <ul>
                    <li>Account information: Retained while your account is active plus 3 years</li>
                    <li>Transaction records: Retained for 7 years for tax and legal purposes</li>
                    <li>Usage analytics: Aggregated data retained indefinitely</li>
                    <li>Marketing data: Deleted upon unsubscribe or account deletion</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* Acceptable Use Policy */}
          {activeTab === 'acceptable' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Acceptable Use Policy</h2>
              </div>

              <div className="terms-content">
                <section className="legal-section">
                  <h3>1. Permitted Uses</h3>
                  <ul>
                    <li>Creating and selling legitimate AI agents</li>
                    <li>Purchasing AI agents for lawful purposes</li>
                    <li>Providing honest reviews and feedback</li>
                    <li>Participating in community discussions</li>
                    <li>Using the Platform for its intended commercial purposes</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>2. Prohibited Uses</h3>
                  <h4>2.1 Illegal Activities</h4>
                  <ul>
                    <li>Money laundering or terrorist financing</li>
                    <li>Fraud, theft, or identity theft</li>
                    <li>Violation of export control laws</li>
                    <li>Infringement of intellectual property rights</li>
                    <li>Any activity prohibited by applicable law</li>
                  </ul>

                  <h4>2.2 Harmful Content</h4>
                  <ul>
                    <li>AI agents that spread malware or viruses</li>
                    <li>Agents designed to harm or deceive users</li>
                    <li>Content promoting violence or hatred</li>
                    <li>Adult content or pornographic material</li>
                    <li>Agents that violate privacy or data protection laws</li>
                  </ul>

                  <h4>2.3 Market Manipulation</h4>
                  <ul>
                    <li>Creating fake reviews or ratings</li>
                    <li>Manipulating search results or rankings</li>
                    <li>Price fixing or anticompetitive behavior</li>
                    <li>Using multiple accounts to circumvent limits</li>
                    <li>Engaging in wash trading or artificial transactions</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>3. Enforcement</h3>
                  <ul>
                    <li>Violations may result in account suspension or termination</li>
                    <li>We may remove content that violates this policy</li>
                    <li>Repeat offenders may be permanently banned</li>
                    <li>Law enforcement may be notified of illegal activities</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* Refund Policy */}
          {activeTab === 'refund' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Refund and Cancellation Policy</h2>
              </div>

              <div className="terms-content">
                <section className="legal-section">
                  <h3>1. Credit Purchases</h3>
                  <h4>1.1 No Refunds Policy</h4>
                  <ul>
                    <li>Credit purchases are generally non-refundable</li>
                    <li>Exceptions may be made for technical errors or unauthorized transactions</li>
                    <li>Refund requests must be made within 48 hours of purchase</li>
                  </ul>

                  <h4>1.2 Refund Process</h4>
                  <ul>
                    <li>Contact customer support with transaction details</li>
                    <li>Provide reason for refund request</li>
                    <li>Allow 5-10 business days for processing</li>
                    <li>Refunds processed through original payment method</li>
                  </ul>
                </section>

                {/* <section className="legal-section">
                  <h3>2. AI Agent Purchases</h3>
                  <h4>2.1 Satisfaction Guarantee</h4>
                  <ul>
                    <li>7-day satisfaction guarantee for AI agent purchases</li>
                    <li>Agent must fail to perform as described</li>
                    <li>Must provide evidence of non-functionality</li>
                    <li>Refunds issued in Platform credits</li>
                  </ul>

                  <h4>2.2 Refund Conditions</h4>
                  <ul>
                    <li>Agent has not been significantly modified or integrated</li>
                    <li>No refunds for change of mind or buyer's remorse</li>
                    <li>No refunds for agents that work but don't meet expectations</li>
                    <li>Developer may offer updates or fixes instead of refund</li>
                  </ul>
                </section> */}

                <section className="legal-section">
                  <h3>2. Dispute Resolution</h3>
                  <ul>
                    <li>Disputes handled through internal mediation first</li>
                    <li>Unresolved disputes may be escalated to arbitration</li>
                    <li>Chargebacks may result in account suspension</li>
                    <li>Alternative dispute resolution available</li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="contact-section">
          <div className="contact-header">
            <h2>Contact Information</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-item">
              <h4>Customer Support</h4>
              <p>Email: support@sitrai.com</p>
              {/* <p>Live Chat: Available on the Platform</p>
              <p>Business Hours: Monday-Friday, 9 AM - 6 PM IST</p> */}
            </div>
            <div className="contact-item">
              <h4>Legal Inquiries</h4>
              <p>Email: legal@qubicsquare.tech</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .terms-container {
          min-height: 100vh;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .terms-header {
          background: linear-gradient(135deg, rgba(var(--bg-color1), 0.1) 0%, rgba(var(--bg-color1), 0.05) 100%);
          padding: 4rem 2rem 2rem;
          text-align: center;
          border-bottom: 1px solid rgba(var(--bg-color1), 0.1);
        }

        .header-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, rgb(var(--bg-color1)), rgba(var(--bg-color1), 0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-content p {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 2rem;
        }

        .last-updated {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(var(--bg-color1), 0.1);
          border: 1px solid rgba(var(--bg-color1), 0.2);
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .tab-navigation {
          background: rgba(var(--bg-color1), 0.05);
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(var(--bg-color1), 0.1);
        }

        .tab-container {
          display: flex;
          gap: 0.5rem;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 0.75rem 1.5rem;
          border: 1px solid rgba(var(--bg-color1), 0.2);
          background: transparent;
          border-radius: 25px;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        html.light .tab-button {
          color: #0E1111;
        }

        html.dark .tab-button {
          color: whitesmoke;
        }

        .tab-button:hover {
          background: rgba(var(--bg-color1), 0.1);
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: rgb(var(--bg-color1));
          color: white;
          border-color: rgb(var(--bg-color1));
        }

        .content-area {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .content-section {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: 600;
          background: linear-gradient(135deg, rgb(var(--bg-color1)), rgba(var(--bg-color1), 0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .terms-content {
          line-height: 1.7;
        }

        .legal-section {
          margin-bottom: 3rem;
          padding: 2rem;
          background: rgba(var(--bg-color1), 0.03);
          border: 1px solid rgba(var(--bg-color1), 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .legal-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(var(--bg-color1), 0.15);
        }

        .legal-section h3 {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: rgb(var(--bg-color1));
          border-bottom: 2px solid rgba(var(--bg-color1), 0.2);
          padding-bottom: 0.5rem;
        }

        .legal-section h4 {
          font-size: 1.1rem;
          font-weight: 500;
          margin: 1.5rem 0 0.5rem;
          color: rgba(var(--bg-color1), 0.8);
        }

        .legal-section p {
          margin-bottom: 1rem;
        }

        .legal-section ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .legal-section li {
          margin-bottom: 0.5rem;
          position: relative;
        }

        .legal-section li::marker {
          color: rgb(var(--bg-color1));
        }

        .legal-section strong {
          color: rgb(var(--bg-color1));
          font-weight: 600;
        }

        .contact-section {
          background: rgba(var(--bg-color1), 0.05);
          margin-top: 4rem;
          padding: 3rem 2rem;
          border-top: 1px solid rgba(var(--bg-color1), 0.1);
        }

        .contact-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .contact-header h2 {
          font-size: 1.8rem;
          font-weight: 600;
          background: linear-gradient(135deg, rgb(var(--bg-color1)), rgba(var(--bg-color1), 0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-item {
          background: rgba(var(--bg-color1), 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(var(--bg-color1), 0.1);
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(var(--bg-color1), 0.15);
        }

        .contact-item h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: rgb(var(--bg-color1));
        }

        .contact-item p {
          margin-bottom: 0.5rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .terms-header {
            padding: 2rem 1rem;
          }

          .header-content h1 {
            font-size: 2rem;
          }

          .tab-navigation {
            padding: 1rem;
          }

          .tab-container {
            justify-content: center;
          }

          .tab-button {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }

          .content-area {
            padding: 2rem 1rem;
          }

          .legal-section {
            padding: 1.5rem;
          }

          .legal-section h3 {
            font-size: 1.2rem;
          }

          .contact-section {
            padding: 2rem 1rem;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .header-content h1 {
            font-size: 1.8rem;
          }

          .tab-button {
            padding: 0.5rem 0.8rem;
            font-size: 0.85rem;
          }

          .legal-section {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}