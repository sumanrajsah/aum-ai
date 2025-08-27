"use client";

import React, { useEffect, useState } from "react";
// @ts-ignore
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/context/ChatContext";

type Bucket = {
    remaining?: number;
    used?: number;
    total?: number; // plan
    limit?: number; // free
    earned?: number; // referral
    lastReset?: string; // ISO
};

type Credits = {
    _id: {
        $oid: string;
    };
    uid: string;
    freeCredits?: Bucket;
    planCredits?: Bucket;
    referralCredits?: Bucket;
    lastUpdated?: string;
    version?: number;
};

const n = (v?: number) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

const formatNextReset = (lastResetStr?: string) => {
    if (!lastResetStr) return "N/A";

    const lastReset = new Date(lastResetStr);
    const nextReset = new Date(lastReset);
    nextReset.setDate(nextReset.getDate() + 1); // Add 1 day for next reset

    const now = new Date();
    const timeDiff = nextReset.getTime() - now.getTime();

    if (timeDiff <= 0) {
        return "Available now";
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
};

export default function CreditsPage() {
    const { user } = useAuth();
    const [data, setData] = useState<Credits | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const { setCredits } = useChat();

    useEffect(() => {
        if (!user) return;

        const fetchCredits = async () => {
            setLoading(true);
            setErr(null);
            setData(null);

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URI}/v1/user/credits`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (error: any) {
                setErr(error.message || "Failed to fetch credits");
            } finally {
                setLoading(false);
            }
        };

        fetchCredits();
    }, [user]);

    // Compute totals
    const f = data?.freeCredits,
        p = data?.planCredits,
        r = data?.referralCredits;
    const remaining = n(f?.remaining) + n(p?.remaining) + n(r?.remaining);
    const used = n(f?.used) + n(p?.used) + n(r?.used);
    const totalCapacity = n(p?.total) + n(f?.limit) + n(r?.earned);

    useEffect(() => {
        if (data && user) {
            setCredits(
                n(data.planCredits?.remaining) +
                n(data.freeCredits?.remaining) +
                n(data.referralCredits?.remaining)
            );
        } else {
            setCredits(0);
        }
    }, [data, user]);

    return (
        <div className="credits-container">
            <style jsx>{`
                .credits-container {
                    min-height: 100vh;
                    font-family: 'Poppins', sans-serif;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }

                .credits-header {
                    text-align: center;
                    max-width: 600px;
                }

                .credits-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, rgb(var(--bg-color1)), rgba(var(--bg-color1), 0.7));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .credits-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.7;
                    font-weight: 400;
                }

                .credits-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    width: 100%;
                    max-width: 800px;
                }

                .credit-card {
                    padding: 2rem;
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(var(--bg-color1), 0.2);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                html.light .credit-card {
                    background: rgba(255, 255, 255, 0.8);
                    box-shadow: 0 8px 32px rgba(var(--bg-color1), 0.1);
                }

                html.dark .credit-card {
                    background: rgba(21, 24, 29, 0.8);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .credit-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(var(--bg-color1), 0.4);
                }

                .credit-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, rgb(var(--bg-color1)), rgba(var(--bg-color1), 0.5));
                }

                .card-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: rgb(var(--bg-color1));
                }

                .credit-value {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, rgb(var(--bg-color1)), rgba(var(--bg-color1), 0.7));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                }

                .credit-label {
                    font-size: 0.9rem;
                    opacity: 0.6;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }

                .progress-container {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    border-radius: 12px;
                    border: 1px solid rgba(var(--bg-color1), 0.1);
                }

                html.light .progress-container {
                    background: rgba(var(--bg-color1), 0.05);
                }

                html.dark .progress-container {
                    background: rgba(var(--bg-color1), 0.1);
                }

                .progress-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    opacity: 0.7;
                }

                .progress-bar {
                    height: 8px;
                    background: rgba(var(--bg-color1), 0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, rgb(var(--bg-color1)), rgba(var(--bg-color1), 0.8));
                    border-radius: 4px;
                    transition: width 0.8s ease;
                    position: relative;
                }

                .progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    padding: 4rem;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(var(--bg-color1), 0.2);
                    border-top: 3px solid rgb(var(--bg-color1));
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-state {
                    padding: 2rem;
                    text-align: center;
                    color: #ff4757;
                    border: 1px solid rgba(255, 71, 87, 0.2);
                    border-radius: 12px;
                    background: rgba(255, 71, 87, 0.05);
                }

                @media (max-width: 768px) {
                    .credits-container {
                        padding: 1rem;
                    }
                    
                    .credits-title {
                        font-size: 2rem;
                    }
                    
                    .credit-value {
                        font-size: 2.5rem;
                    }
                    
                    .credits-cards {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }

                @media (min-width: 769px) {
                    .credits-cards {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>

            <div className="credits-header">
                <h1 className="credits-title">Credits Dashboard</h1>
                <p className="credits-subtitle">
                    Monitor your remaining credits across all categories
                </p>
            </div>

            {loading && (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your credits...</p>
                </div>
            )}

            {err && (
                <div className="error-state">
                    <h3>Error Loading Credits</h3>
                    <p>{err}</p>
                </div>
            )}

            {data && !loading && (
                <>
                    <div className="credits-cards">
                        <div className="credit-card">
                            <h2 className="card-title">Free Credits</h2>
                            <div className="credit-value">
                                {n(data.freeCredits?.remaining).toLocaleString()}
                            </div>
                            <div className="credit-label">
                                Resets in: {formatNextReset(data.freeCredits?.lastReset)}
                            </div>
                        </div>

                        <div className="credit-card">
                            <h2 className="card-title">Plan Credits</h2>
                            <div className="credit-value">
                                {n(data.planCredits?.remaining).toLocaleString()}
                            </div>
                            <div className="credit-label">Subscription Credits</div>
                        </div>

                        <div className="credit-card">
                            <h2 className="card-title">Referral Credits</h2>
                            <div className="credit-value">
                                {n(data.referralCredits?.remaining).toLocaleString()}
                            </div>
                            <div className="credit-label">Earned from Referrals</div>
                        </div>
                    </div>

                    <div className="credit-card" style={{ width: '100%', maxWidth: '800px' }}>
                        <h2 className="card-title">Total Overview</h2>
                        <div className="progress-container">
                            <div className="progress-stats">
                                <span>Total Remaining: {remaining.toLocaleString()}</span>
                                <span>Total Used: {used.toLocaleString()}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${totalCapacity > 0 ? Math.min(100, (used / totalCapacity) * 100) : 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!data && !err && !loading && (
                <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.6 }}>
                    <p>No credit data available</p>
                </div>
            )}
        </div>
    );
}