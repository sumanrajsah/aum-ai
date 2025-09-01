"use client";
import React from "react";
import "./style.css";
import { useAlert } from "@/context/alertContext";

export default function BillingDashboard({ user, subscription, payment, invoices }: any) {
    const alert = useAlert();
    const formatDate = (dateObj: any) => {
        if (!dateObj) return "N/A";

        let date: Date;

        if (typeof dateObj === "number") {
            // Razorpay timestamp in seconds
            date = new Date(dateObj * 1000);
        } else if (dateObj.$date) {
            // Mongo Extended JSON
            date = new Date(dateObj.$date);
        } else {
            // ISO string or already a Date
            date = new Date(dateObj);
        }

        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };


    const formatCurrency = (amount: number) => {
        return `₹${(amount / 100).toFixed(2)}`;
    };

    const getStatusClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'status-active';
            case 'cancelled':
            case 'canceled': return 'status-cancelled';
            case 'expired': return 'status-expired';
            case 'pending': return 'status-pending';
            case 'captured':
            case 'paid': return 'status-success';
            case 'failed': return 'status-failed';
            default: return 'status-default';
        }
    };

    async function cancelSub() {
        if (!user?.subscription?.subscription_id) {
            console.error("No subscription to cancel");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/payment/subscriptions/pause`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        subscription_id: user.subscription.subscription_id,
                        user_id: user.uid,
                    }),
                }
            );

            const json = await res.json();
            if (json.ok) {
                alert.success("Subscription cancelled successfully");
            } else {
                alert.error(json.error || "Failed to cancel subscription");
            }
        } catch (err) {
            console.error("Cancel request failed:", err);
            alert.error("Error while cancelling subscription");
        }
    }
    async function renewSub() {
        if (!user?.subscription?.subscription_id) {
            console.error("No subscription to cancel");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/payment/subscriptions/resume`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        subscription_id: user.subscription.subscription_id,
                        user_id: user.uid,
                    }),
                }
            );

            const json = await res.json();
            if (json.ok) {
                alert.success("Subscription Renewed successfully");
            } else {
                alert.error(json.error || "Failed to renew subscription");
            }
        } catch (err) {
            console.error("Renew request failed:", err);
            alert.error("Error while renewing subscription");
        }
    }

    // fallback invoice history
    const sampleInvoices = invoices || [
        {
            date: payment?.created_at || new Date(),
            amount: payment?.amount || 0,
            status: payment?.status || "Paid",
            plan: user?.plan || "Unknown"
        }
    ];

    // Map plan display
    const PLAN_LABELS: Record<string, string> = {
        "pro-plus": "Pro+",
        "pro": "Pro",
        "plus": "Plus",
        "free": "Free"
    };
    const planName = user?.plan ? PLAN_LABELS[user.plan] || user.plan : "Unknown";

    return (
        <div className="billing-container">
            {/* Current Subscription */}
            <div className="section">
                <h2 className="section-title">Current Subscription</h2>
                <div className="subscription-box">
                    <div className="plan-header">
                        {subscription?.status && <span className={`subscription-status-b ${subscription?.status}`}>
                            {subscription?.status}
                        </span>}
                        <h3 className="plan-name">{planName} Subscription</h3>
                        <p className="plan-price">{formatCurrency(payment?.amount || 0)} per month</p>
                    </div>
                    {subscription?.charge_at !== null ? <p className="next-billing">
                        Next billing on {formatDate(subscription?.charge_at)}
                    </p> : <p className="next-billing">
                        Your Plan Will be canceled on {formatDate(subscription?.current_end)}
                    </p>}
                    {subscription?.status === 'active' ? (
                        <div className="subscription-actions">
                            <button className="subscription-btn cancel" onClick={cancelSub}>
                                Cancel Subscription
                            </button>
                        </div>
                    ) : (
                        <div className="subscription-actions">
                            <button className="subscription-btn renew" onClick={renewSub}>
                                Renew Subscription
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Method */}
            <div className="section">
                <h2 className="section-title">Payment Method</h2>
                <div className="payment-box">
                    <span className="payment-method">
                        {payment?.method?.toUpperCase() || "UPI"} {payment?.vpa ? `(${payment.vpa})` : ""}
                    </span>
                </div>
                {/* <a href="#" className="update-info-btn">Edit payment method</a> */}
            </div>

            {/* Billing Info */}
            <div className="section">
                <h2 className="section-title">Billing Information</h2>
                <div className="billing-info">
                    <p>
                        <strong>Name</strong>
                        {user?.billing_info?.name || user?.name || "N/A"}
                    </p>
                    <p>
                        <strong>Billing address</strong>
                        {user?.billing_info?.address
                            ? (
                                <>
                                    {user.billing_info.address.line1 || "Hno22"}<br />
                                    {user.billing_info.address.line2 || "Najafgarh 110043"}<br />
                                    {user.billing_info.address.city || "Delhi Division"}<br />
                                    {user.billing_info.address.country || "IN"}
                                </>
                            ) : (
                                <>
                                    Hno22<br />
                                    Najafgarh 110043<br />
                                    Delhi Division<br />
                                    IN
                                </>
                            )}
                    </p>
                </div>
                {/* <a href="#" className="update-info-btn">Update information</a> */}
            </div>

            {/* Invoice History */}
            {invoices && <div className="section">
                <h2 className="section-title">Invoice History</h2>
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv: any, i: number) => (
                            <tr key={i}>
                                <td>{formatDate(inv.date)}</td>
                                <td>{formatCurrency(inv.amount)}</td>
                                <td>
                                    <span className={`status ${inv.status.toLowerCase()}`}>
                                        {inv.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {sampleInvoices.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: 'rgba(var(--bg-color1), 0.6)' }}>
                                    No invoices found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>}
        </div>
    );
}
