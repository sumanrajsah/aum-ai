"use client";
import React from "react";
import Image from "next/image";
import "./style.css";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="pp-body">
            <div className="pp-nav" onClick={() => window.history.back()}>
                <Image src="/0xai.png" className="pp-logo" alt="Logo" width={100} height={100} /><h3>0xXplorer Ai</h3>
            </div>
            <div className="pp-cont">
                <h2>Privacy Policy</h2>
                <br />
                <p><strong>Effective Date:</strong> March 7, 2025</p>
                <br />
                <h3>1. Data We Collect</h3>
                <ul>
                    <li>Wallet addresses for authentication.</li>
                    <li>Email addresses for communication and account-related notifications</li>
                    <li>AI interactions to improve service accuracy.</li>
                    <li>Analytics data (non-personal) to enhance platform performance.</li>
                </ul>
                <br />
                <h3>2. How We Use Data</h3>
                <ul>
                    <li>To provide AI-based insights, smart contract execution, and user engagement.</li>
                    <li>To enhance security and prevent fraud.</li>
                    <li>To comply with legal and regulatory obligations.</li>
                    <li>To communicate with users regarding platform updates, security alerts, and support.</li>
                </ul>
                <br />
                <h3>3. Data Sharing</h3>
                <ul>
                    <li>We do not sell user data.</li>
                    <li>Blockchain transactions are public by nature.</li>
                    <li>Data is stored securely Database.</li>
                </ul>
                <br />
                <h3>4. Security Measures</h3>
                <ul>
                    <li>We use encryption and secure storage to enhance security.</li>
                    <li>However, blockchain transactions and AI interactions are inherently transparent.</li>
                </ul>
                <br />
                <h3>5. User Rights</h3>
                <ul>
                    <li>User may request data access or deletion where applicable.</li>
                    <li>However, blockchain transactions cannot be erased.</li>
                </ul>
                <br />
                <h3>6. Cookies & Tracking</h3>
                <ul>
                    <li>We use analytics tools but do not track personally identifiable behavior.</li>
                </ul>
                <br />
                <h3>7. Policy Updates</h3>
                <ul>
                    <li>We may update this Privacy Policy, and continued use signifies acceptance.</li>
                </ul>
                <br />
                <h3>Contact Us</h3>
                <p>For questions, contact <Link style={{ color: 'blue' }} href="mailto:support@qubicsquare.tech">support@qubicsquare.tech</Link>.</p>
            </div>
        </div>
    );
}