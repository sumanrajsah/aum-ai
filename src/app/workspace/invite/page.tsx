"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import './style.css'
import { useAuth } from "@/hooks/useAuth";

type Invite = {
    _id?: string;
    token: string;
    wid: string;
    inviter_uid: string;
    invitee_email?: string;     // legacy
    invitee_uid?: string;       // new
    status: "pending" | "accepted" | "revoked" | "expired";
    created_at?: string | number | { $date: string | number };
    expires_at?: string | number | { $date: string | number };
};

const formatDate = (input?: string | number | { $date: string | number }): string => {
    if (!input) return "N/A";
    const v = typeof input === "object" && "$date" in input ? (input as any).$date : input;
    const d = new Date(v);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function InvitesPage() {
    const { user } = useAuth();
    const sp = useSearchParams();
    const qpEmail = sp.get("email") || "";
    const [email, setEmail] = useState(qpEmail);
    const [loading, setLoading] = useState(false);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const inviteCountByStatus = useMemo(() => {
        const acc: Record<string, number> = { pending: 0, accepted: 0, revoked: 0, expired: 0 };
        invites.forEach(i => { acc[i.status] = (acc[i.status] || 0) + 1; });
        return acc;
    }, [invites]);

    const fetchInvites = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(null);
        setLoading(true);
        setInvites([]);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/workspace/invite/${user?.uid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            setInvites(Array.isArray(data.invites) ? data.invites : []);
        } catch (err: any) {
            setError(err?.message || "Failed to load invites");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.uid) fetchInvites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Copied");
        } catch {
            alert(text);
        }
    };

    const inviteUrl = (token: string) =>
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://app.example.com"}/invite/${token}`;

    if (!user?.uid) {
        return <div className="invites">
            <p>You must be logged in to see Invite.</p>
        </div>
    }

    return (
        <div className="invites">
            <div className="invites-header">
                <h1>Workspace Invites</h1>
            </div>

            <div className="invites-stats">
                <span>Pending: {inviteCountByStatus.pending}</span>
                <span>Accepted: {inviteCountByStatus.accepted}</span>
                <span>Revoked: {inviteCountByStatus.revoked}</span>
                <span>Expired: {inviteCountByStatus.expired}</span>
            </div>

            {error && <div className="invites-error">{error}</div>}
            {loading && <div className="invites-loading">Loading…</div>}

            {!loading && !error && (
                <div className="invites-table-wrap">
                    <table className="invites-table">
                        <thead>
                            <tr>
                                <th>Workspace ID</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Expires</th>
                                <th>Token</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invites.length > 0 ? (
                                invites.map((inv, idx) => (
                                    <tr key={inv.token + idx}>
                                        <td className="mono">{inv.wid}</td>
                                        <td>
                                            <span className={`badge ${inv.status}`}>{inv.status}</span>
                                        </td>
                                        <td>{formatDate(inv.created_at as any)}</td>
                                        <td>{formatDate(inv.expires_at as any)}</td>
                                        <td className="mono token"> {inv.status === 'pending' ? `${inv.token}` : '---'}</td>
                                        <td>
                                            {inv.status === 'pending' ? <button
                                                className="copy-btn"
                                                type="button"
                                                onClick={() => router.push(`/workspace/invite/${inv.token}`)}
                                                title="Open invite link"
                                            >
                                                Open
                                            </button> : '---'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="empty" colSpan={7}>
                                        No invites found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
