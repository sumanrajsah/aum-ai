// app/dashboard/billing/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import BillingDashboard from "./billing";
import { useAuth } from "@/hooks/useAuth";

export default function BillingPage() {
    const { user, status } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URI}/v1/payment/billing/${user?.uid}`,
                    { credentials: "include" } // if you use cookies for auth
                );
                const json = await res.json();
                setData(json);
                console.log(json)
            } catch (err) {
                console.error("Billing fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBilling();
    }, [user]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            location.href = '/login'
        }
    })

    if (loading) return <p>Loading billing info...</p>;
    if (!data) return <p>Error fetching billing info</p>;
    if (data.subscription === null) return <p>No Subscription Found</p>;

    return <BillingDashboard user={data.user} subscription={data.subscription} payment={data.payment} invoices={data.invoices} />;
}
