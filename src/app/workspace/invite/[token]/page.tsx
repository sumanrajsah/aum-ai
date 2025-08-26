"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./style.css";
import { useAuth } from "@/hooks/useAuth";

type ApiResp =
    | { message: string; wid?: string }
    | { error: string };

export default function InviteTokenPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const resolvedParams = React.use(params);
    const token = resolvedParams.token;
    const sp = useSearchParams();

    const { user } = useAuth();
    const [uid, setUid] = useState<string>('');
    useEffect(() => {
        if (user) {
            setUid(user.uid);
        }
    }, [user]);

    // Try to get uid from URL ?uid=, then localStorage, else manual input

    const [loading, setLoading] = useState<null | "accept" | "revoke">(null);
    const [result, setResult] = useState<string>("");
    const [wid, setWid] = useState<string>("");


    const post = async (path: string) => {
        setResult("");
        try {
            const res = await fetch(path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: { token, uid } }),
            });
            const json = (await res.json()) as ApiResp;
            if (!res.ok) {
                setResult(("error" in json && json.error) || `HTTP ${res.status}`);
                setWid("");
                return;
            }
            setResult(("message" in json && json.message) || "Success!");
            if ("wid" in json && json.wid) setWid(json.wid);
        } catch (e: any) {
            setResult(e?.message || "Request failed");
            setWid("");
        } finally {
            setLoading(null);
        }
    };

    const onAccept = async () => {
        if (!uid) return setResult("User ID is required");
        setLoading("accept");
        await post(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/workspace/invite/accept`);
    };

    const onRevoke = async () => {
        if (!uid) return setResult("User ID is required");
        setLoading("revoke");
        await post(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/workspace/invite/revoke`);
    };

    const inviteLink =
        `${process.env.NEXT_PUBLIC_APP_BASE_URL || "https://app.example.com"}/invite/${token}`;

    return (
        <div className="invite-action">
            <div className="card">
                <h1>Workspace Invitation</h1>


                <div className="actions">
                    <button
                        className="primary"
                        onClick={onAccept}
                        disabled={!uid || loading !== null}
                    >
                        {loading === "accept" ? "Accepting..." : "Accept Invitation"}
                    </button>

                    <button
                        className="danger"
                        onClick={onRevoke}
                        disabled={!uid || loading !== null}
                        title="Only owners/admins can revoke invitations"
                    >
                        {loading === "revoke" ? "Revoking..." : "Revoke Invitation"}
                    </button>
                </div>

                {result && (
                    <div className={`result ${result.includes("failed") || result.includes("error") || result.includes("required") ? "bad" : "ok"}`}>
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
}