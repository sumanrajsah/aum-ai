"use client";

import React, { useEffect, useState } from "react";
import './style.css'
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