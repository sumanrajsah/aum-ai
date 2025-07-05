"use client";
import React from "react";
import Image from "next/image";
import "./style.css";
import Link from "next/link";

export default function TermAndCondition() {
  return (
    <div className="tc-body">
      <div className="tc-nav" onClick={() => window.history.back()}>
        <Image src="/0xai.png" className="logo" alt="Logo" width={100} height={100} /><h3>0xXplorer Ai</h3>
      </div>
      <div className="tc-cont">
        <h2>Terms & Conditions</h2>
        <br />
        <p><strong>Effective Date:</strong> March 7, 2025</p>
        <br />
        <p>Welcome to Qubicsquare Technologies Private Limited ("Company", "we", "us", "our"). By accessing and using our services, including 0xXplorer AI ("Platform"), you agree to comply with these Terms & Conditions ("Terms").</p>
        <br />
        <h3>1. Acceptance of Terms</h3>
        <p>By using our Platform, you agree to be bound by these Terms. If you do not agree, do not use our services.</p>
        <br />
        <h3>2. Eligibility</h3>
        <ul>
          <li>Users must be at least 18 years old or meet the legal age requirement in their jurisdiction.</li>
          <li>By using our services, you confirm that your blockchain transactions and AI interactions comply with applicable laws.</li>
        </ul>
        <br />
        <h3>3. User Responsibilities</h3>
        <ul>
          <li>Users must secure their wallet and account credentials.</li>
          <li>Transactions on the blockchain are irreversible. We do not offer refunds for cryptocurrency transactions.</li>
          <li>AI-generated insights are informational only, not financial or legal advice.</li>
        </ul>
        <br />
        <h3>4. Intellectual Property</h3>
        <ul>
          <li>We retain ownership of all proprietary software, AI models, algorithms, and trademarks.</li>
          <li>User-generated content remains the property of the respective user, but by posting, you grant us a license to use it within our ecosystem.</li>
        </ul>
        <br />
        <h3>5. Privacy and Data Handling</h3>
        <ul>
          <li>We collect minimal personal data, primarily wallet addresses, email addresses, interactions, and analytics.</li>
          <li>Data is stored securely in Database</li>
        </ul>
        <br />
        <h3>6. Third-Party Services</h3>
        <ul>
          <li>We integrate with Polygon CDK, MongoDB, Reown AppKit, and Wagmi.</li>
          <li>We are not responsible for third-party failures, hacks, or vulnerabilities.</li>
        </ul>
        <br />
        <h3>7. Liability Disclaimer</h3>
        <ul>
          <li>We provide services "as is" with no guarantees of uninterrupted access.</li>
          <li>We are not liable for losses due to blockchain network failures, smart contract bugs, or AI misinterpretations.</li>
          <li>Users must verify AI-generated insights before acting on them.</li>
        </ul>
        <br />
        <h3>8. Dispute Resolution</h3>
        <ul>
          <li>Governed by Indian law.</li>
          <li>Disputes will be resolved through arbitration under the Singapore International Arbitration Centre (SIAC) rules.</li>
        </ul>
        <br />
        <h3>9. Termination</h3>
        <ul>
          <li>We may terminate access for users violating these Terms or engaging in fraudulent activities.</li>
        </ul>
        <br />
        <h3>10. Amendments</h3>
        <ul>
          <li>We reserve the right to modify these Terms. Continued use after updates constitutes acceptance.</li>
        </ul>
        <br />
        <h3>Contact Us</h3>
        <p>For questions, contact <Link style={{ color: 'blue' }} href="mailto:support@qubicsquare.tech">support@qubicsquare.tech</Link>.</p>
      </div>
    </div>
  );
}