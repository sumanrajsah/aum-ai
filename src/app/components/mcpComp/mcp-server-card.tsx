"use client";
import React from "react"; // adjust import if needed
import "./mcp-card.css";

export default function MCPServerCard({ mcp }: { mcp: MCPServerInfo }) {
    return (
        <div className="mcp-server-card">
            {/* Header with gradient background */}
            <div className="card-header">
                <div className="header-content">
                    <h2 className="card-title">{mcp.label}</h2>
                    <span className={`auth-badge ${mcp.auth ? "auth-enabled" : "auth-disabled"}`}>
                        <span className="badge-icon">
                            {mcp.auth ? "🔒" : "🔓"}
                        </span>
                        {mcp.auth ? "Authenticated" : "No Auth"}
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="description">{mcp.description}</p>

            {/* Connection Details */}
            <div className="details-section">
                <div className="detail-item">
                    <div className="detail-label">
                        <span className="detail-icon">⚡</span>
                        Connection Type
                    </div>
                    <div className="detail-value">{mcp.config.type}</div>
                </div>

                <div className="detail-item">
                    <div className="detail-label">
                        <span className="detail-icon">🔗</span>
                        Endpoint
                    </div>
                    <div className="detail-value url-value">{mcp.config.url}</div>
                </div>
            </div>

            {/* Tools Section */}
            <div className="tools-section">
                <div className="tools-header">
                    <span className="tools-icon">🛠️</span>
                    <span className="tools-title">Available Tools</span>
                    <span className="tools-count">{mcp.tools.length}</span>
                </div>
                <div className="tools-grid">
                    {mcp.tools.map((tool, index) => (
                        <div className="tool-tag" key={index}>
                            {tool}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="card-footer">
                <div className="footer-item">
                    <span className="footer-icon">📅</span>
                    <div className="footer-text">
                        <div className="footer-label">Created</div>
                        <div className="footer-date">{new Date(mcp.created_on).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="footer-item">
                    <span className="footer-icon">🔄</span>
                    <div className="footer-text">
                        <div className="footer-label">Updated</div>
                        <div className="footer-date">{new Date(mcp.updated_on).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
