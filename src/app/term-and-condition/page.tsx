'use client'
// pages/terms-and-privacy.js
import { useState } from 'react';
import Head from 'next/head';

export default function TermsAndPrivacy() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <>
      <Head>
        <title>Legal Information - Aum AI</title>
        <meta
          name="description"
          content="Terms of Service, Privacy Policy, Acceptable Use, and Refund Policy for Aum AI (Qubicsquare Technologies Private Limited)"
        />
      </Head>

      <div className="terms-container">
        {/* Header */}
        <div className="terms-header">
          <div className="header-content">
            <h1>Legal Information</h1>
            <p>Review Terms of Service, Privacy Policy, Acceptable Use, and Refund Policy</p>
            <div className="last-updated">Last Updated: December 28, 2024</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="tab-navigation">
          <div className="tab-container">
            <button className={`tab-button ${activeTab === "terms" ? "active" : ""}`} onClick={() => setActiveTab("terms")}>Terms of Service</button>
            <button className={`tab-button ${activeTab === "privacy" ? "active" : ""}`} onClick={() => setActiveTab("privacy")}>Privacy Policy</button>
            <button className={`tab-button ${activeTab === "acceptable" ? "active" : ""}`} onClick={() => setActiveTab("acceptable")}>Acceptable Use</button>
            <button className={`tab-button ${activeTab === "refund" ? "active" : ""}`} onClick={() => setActiveTab("refund")}>Refund Policy</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Terms of Service */}
          {activeTab === "terms" && (
            <div className="content-section">
              <div className="section-header"><h2>Terms of Service</h2></div>
              <div className="terms-content">

                <section className="legal-section">
                  <h3>1. Acceptance</h3>
                  <p>
                    By using Aum AI (SitrAi), operated by Qubicsquare Technologies Private Limited, you agree to these Terms.
                    Aum AI is a platform where users can interact with AI models, create and deploy low/no-code AI
                    agents, list agents, MCPs, and prompts on our marketplace, and use persistent memory features.
                  </p>
                </section>

                <section className="legal-section">
                  <h3>2. Services</h3>
                  <ul>
                    <li>Live chat with AI models on our platform</li>
                    <li>Low/No-code tools to build and publish AI agents</li>
                    <li>Marketplace to list and sell AI agents, MCPs, and prompts</li>
                    <li>Persistent memory that stores chat history for continuity</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>3. Eligibility</h3>
                  <ul>
                    <li>Minimum age 18</li>
                    <li>Legal capacity to contract</li>
                    <li>No restrictions under applicable laws</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>4. Accounts</h3>
                  <ul>
                    <li>Provide accurate details</li>
                    <li>Maintain confidentiality of login</li>
                    <li>Responsible for all account activity</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>5. Credits</h3>
                  <ul>
                    <li>Purchased via Razorpay only</li>
                    <li>Non-refundable, non-transferable</li>
                    <li>No monetary value outside the platform</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>6. User Content & IP</h3>
                  <ul>
                    <li>Users retain rights to their AI agents, MCPs, and prompts</li>
                    <li>By publishing, you grant us license to host, display, and distribute on the Platform</li>
                    <li>Platform code, design, and trademarks remain the property of Qubicsquare Technologies</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>7. Restrictions</h3>
                  <ul>
                    <li>No illegal, harmful, or deceptive AI agents</li>
                    <li>No violation of intellectual property laws</li>
                    <li>No market manipulation, fake accounts, or rating abuse</li>
                    <li>No attempts to reverse-engineer or exploit persistent memory features</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>8. Disclaimer & Liability</h3>
                  <p>
                    Aum AI is provided “as is.” No warranties on accuracy, uptime, or availability. Liability is
                    capped at amounts paid in the last 12 months. No indirect or consequential liability.
                  </p>
                </section>

                <section className="legal-section">
                  <h3>9. Termination</h3>
                  <p>
                    We may suspend/terminate accounts for violations. Users may request deletion of their accounts,
                    but credits and stored data may be forfeited.
                  </p>
                </section>

                <section className="legal-section">
                  <h3>10. Governing Law</h3>
                  <p>These Terms are governed by Indian law. Courts of Delhi have exclusive jurisdiction.</p>
                </section>
              </div>
            </div>
          )}

          {/* Privacy Policy */}
          {activeTab === "privacy" && (
            <div className="content-section">
              <div className="section-header"><h2>Privacy Policy</h2></div>
              <div className="terms-content">

                <section className="legal-section">
                  <h3>1. Data We Collect</h3>
                  <ul>
                    <li>User-provided: name, email, uploaded AI agents, prompts, MCPs, chats</li>
                    <li>Payment info via Razorpay (not stored by us)</li>
                    <li>Device/browser info, IP, logs, cookies, usage analytics</li>
                    <li>Stored securely in Redis, MongoDB, and encrypted servers</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>2. How We Use Data</h3>
                  <ul>
                    <li>Operate and maintain live AI chat and marketplace</li>
                    <li>Provide persistent memory across sessions</li>
                    <li>Authenticate users and prevent fraud</li>
                    <li>Improve features and analytics</li>
                    <li>Communicate updates and support responses</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>3. Sharing</h3>
                  <ul>
                    <li>Service providers: Razorpay, hosting, analytics, email</li>
                    <li>Legal obligations and rights protection</li>
                    <li>User consent where applicable</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>4. Security</h3>
                  <ul>
                    <li>Encryption in transit and at rest</li>
                    <li>PCI DSS compliant Razorpay integration</li>
                    <li>Role-based access controls and audits</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>5. User Rights</h3>
                  <h4>5.1 GDPR (EU)</h4>
                  <ul>
                    <li>Access, correction, deletion</li>
                    <li>Restrict or object to processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent anytime</li>
                  </ul>
                  <h4>5.2 CCPA (California)</h4>
                  <ul>
                    <li>Right to know data collected</li>
                    <li>Right to request deletion</li>
                    <li>Opt-out of data sale (we do not sell personal data)</li>
                  </ul>
                  <h4>5.3 All Users</h4>
                  <ul>
                    <li>Delete chat history directly</li>
                    <li>Email support@sitrai.com for account deletion</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>6. Retention</h3>
                  <ul>
                    <li>Account: active + 3 years</li>
                    <li>Transactions: 7 years</li>
                    <li>Analytics: indefinite (aggregated)</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* Acceptable Use */}
          {activeTab === "acceptable" && (
            <div className="content-section">
              <div className="section-header"><h2>Acceptable Use Policy</h2></div>
              <div className="terms-content">
                <section className="legal-section">
                  <h3>1. Allowed Uses</h3>
                  <ul>
                    <li>Chatting with AI models responsibly</li>
                    <li>Building and publishing lawful AI agents, MCPs, and prompts</li>
                    <li>Posting fair and honest reviews</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>2. Prohibited Uses</h3>
                  <ul>
                    <li>Illegal or fraudulent activities</li>
                    <li>Harmful AI (malware, deepfakes, deceptive bots)</li>
                    <li>Adult content, hate speech, or violence promotion</li>
                    <li>Exploiting persistent memory to harvest or misuse data</li>
                  </ul>
                </section>

                <section className="legal-section">
                  <h3>3. Enforcement</h3>
                  <ul>
                    <li>Content removal for violations</li>
                    <li>Suspension or termination</li>
                    <li>Possible reporting to law enforcement</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* Refund Policy */}
          {activeTab === "refund" && (
            <div className="content-section">
              <div className="section-header"><h2>Refund and Cancellation Policy</h2></div>
              <div className="terms-content">
                <section className="legal-section">
                  <h3>1. Credit Purchases</h3>
                  <ul>
                    <li>All purchases final and non-refundable</li>
                    <li>No refunds for unused/expired credits</li>
                    <li>Exceptions: unauthorized payments or technical errors</li>
                  </ul>
                </section>
                <section className="legal-section">
                  <h3>2. Refund Process</h3>
                  <ul>
                    <li>Email support@sitrai.com within 48 hours</li>
                    <li>Provide transaction details</li>
                    <li>Refunds (if approved) via Razorpay in 5–10 business days</li>
                  </ul>
                </section>
                <section className="legal-section">
                  <h3>3. Disputes</h3>
                  <ul>
                    <li>Resolve with support team first</li>
                    <li>If unresolved, arbitration in Delhi, India</li>
                    <li>Chargebacks may result in account suspension</li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="contact-section">
          <div className="contact-header"><h2>Contact Information</h2></div>
          <div className="contact-grid">
            <div className="contact-item"><h4>Customer Support</h4><p>Email: support@sitrai.com</p></div>
            <div className="contact-item"><h4>Legal Inquiries</h4><p>Email: legal@qubicsquare.tech</p></div>
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