"use client";
import { useState, useEffect } from "react";
import "./style.css";
import { llmModels } from "../utils/models-list";

const videoPricing = {
    sora: {
        "480-square": [
            { range: [1, 5], credits: 1500 },
            { range: [6, 10], credits: 1500 },
            { range: [11, 15], credits: 1500 },
            { range: [16, 20], credits: 1500 },
        ],
        "480p": [
            { range: [1, 5], credits: 2000 },
            { range: [6, 10], credits: 2000 },
            { range: [11, 15], credits: 2000 },
            { range: [16, 20], credits: 2000 },
        ],
        "720-square": [
            { range: [1, 5], credits: 3000 },
            { range: [6, 10], credits: 3000 },
            { range: [11, 15], credits: 3000 },
            { range: [16, 20], credits: 3000 },
        ],
        "720p": [
            { range: [1, 5], credits: 4500 },
            { range: [6, 10], credits: 5000 },
            { range: [11, 15], credits: 6500 },
            { range: [16, 20], credits: 7500 },
        ],
        "1080-square": [
            { range: [1, 5], credits: 6000 },
            { range: [6, 10], credits: 7500 },
            { range: [11, 15], credits: 11000 },
            { range: [16, 20], credits: 13500 },
        ],
        "1080p": [
            { range: [1, 5], credits: 13000 },
            { range: [6, 10], credits: 18500 },
            { range: [11, 15], credits: 29000 },
            { range: [16, 20], credits: 36000 },
        ],
    },
    veo: {
        "Veo 3": 5000,
        "Veo 3 Audio": 7500,
        "Veo 3 Fast": 2500,
        "Veo 3 Fast Audio": 4000,
        "Veo 2": 5000,
    },
};

const imagePricing = {
    "Imagen 4": 400,
    "Imagen 4 Ultra": 600,
    "Imagen 4 Fast": 200,
    "Imagen 3": 400,
    "Imagen 3 Fast": 200,
    "DALL·E 3 (1024×1024, sd)": 400,
    "DALL·E 3 (1024×1792, sd)": 800,
    "DALL·E 3 (1024×1024, hd)": 800,
    "DALL·E 3 (1024×1792, hd)": 1200,
    "Stable Diffusion 3.5": 800,
    "Stable Image Ultra": 400,
    "Stable Image Core": 1400,
    "Bria 2.3 Fast": 275,
};

export default function PricingPage() {




    return (
        <div className="container">
            {/* Background Elements */}

            <header className="pricing-header">
                <h1 className="main-title">AI Models Pricing</h1>
                <p className="subtitle">Transparent pricing for image and video models</p>
                <div className="header-decoration"></div>
            </header>
            <section className="section">
                <h2 className="section-title">
                    <span className="emoji">🤖</span>
                    Large Language Models
                </h2>
                <div className="table-container">
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>Model Name</th>
                                <th>Input Credits</th>
                                <th>Output Credits</th>
                                <th>Tools</th>
                                <th>Media Support</th>
                            </tr>
                        </thead>
                        <tbody>
                            {llmModels.map((model, index) => (
                                <tr key={model.value} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <td className="model-name">{model.label}</td>
                                    <td className="credits">{model.inputCredits}</td>
                                    <td className="credits">{model.outputCredits}</td>
                                    <td className="feature-badge">
                                        <span className={`badge ${model.tools ? 'supported' : 'not-supported'}`}>
                                            {model.tools ? '✓' : '✗'}
                                        </span>
                                    </td>
                                    <td className="feature-badge">
                                        <span className={`badge ${model.mediaSupport ? 'supported' : 'not-supported'}`}>
                                            {model.mediaSupport ? '✓' : '✗'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* Image Models Table */}
            <section className="section">
                <h2 className="section-title">
                    <span className="emoji">🎨</span>
                    Image Generation Models
                </h2>
                <div className="table-container">
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>Model Name</th>
                                <th>Credits per Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(imagePricing).map(([name, credits], index) => (
                                <tr key={name} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <td className="model-name">{name}</td>
                                    <td className="credits">{credits + 50}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Video Models Table */}
            <section className="section">
                <h2 className="section-title">
                    <span className="emoji">🎬</span>
                    Video Generation Models
                </h2>
                <div className="table-container">
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>Model Name</th>
                                <th>Credits per Second</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(videoPricing.veo).map(([name, credits], index) => (
                                <tr key={name} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <td className="model-name">{name}</td>
                                    <td className="credits">{credits + 100}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Sora Detailed Pricing */}
            <section className="section">
                <h2 className="section-title">
                    <span className="emoji">📹</span>
                    Sora Detailed Pricing
                </h2>
                <div className="table-container">
                    <table className="pricing-table sora-table">
                        <thead>
                            <tr>
                                <th>Resolution</th>
                                <th>1–5s</th>
                                <th>6–10s</th>
                                <th>11–15s</th>
                                <th>16–20s</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(videoPricing.sora).map(([res, plans], index) => (
                                <tr key={res} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <td className="resolution-name">{res}</td>
                                    {plans.map((p, i) => (
                                        <td key={i} className="credits">
                                            <div className="credit-value">{p.credits + 100}</div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="footer">
                <div className="conversion-info">
                    <strong>💡 Credit Conversion:</strong> 10,000 credits = $1.00 USD
                </div>
                <div className="additional-info">
                    All prices are subject to change. Contact support for enterprise pricing.
                </div>
            </footer>
        </div>
    );
}