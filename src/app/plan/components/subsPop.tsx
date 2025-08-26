'use client';
import React, { useState, useEffect } from 'react';
import './popup.css';
import { useAuth } from '@/hooks/useAuth';

interface Plan {
    name: string;
    price: number;
    original?: number;
    discounted?: number;
    period: string;
    discount?: string;
    plan_id: string;
    offer_id?: string;
    features: Array<{ text: string; highlight: boolean }>;
}

interface SubscriptionPopupProps {
    plan: Plan | null;
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
    pricingData: {
        currency: string;
        symbol: string;
        gstIncluded: boolean;
    };
    onSetLoading: (loading: boolean) => void;
    onSetIsPopupOpen: (open: boolean) => void;
}

// Utility function to load Razorpay script
const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve((window as any).Razorpay);
        };
        document.body.appendChild(script);
    });
};

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({
    plan,
    isOpen,
    onClose,
    loading,
    pricingData,
    onSetLoading,
    onSetIsPopupOpen
}) => {
    const [step, setStep] = useState<'confirm' | 'processing' | 'verifying' | 'activating' | 'success'>('confirm');
    const [countdown, setCountdown] = useState(3);
    const { user } = useAuth();
    const formatPrice = (price: number) => {
        return `${pricingData.symbol}${price.toLocaleString('en-IN')}`;
    };

    const calculateSavings = () => {
        if (!plan?.original || !plan?.discounted) return 0;
        return plan.original - plan.discounted;
    };

    // Countdown timer for success step
    useEffect(() => {
        if (step === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (step === 'success' && countdown === 0) {
            window.location.href = '/dashboard';
        }
    }, [step, countdown]);

    async function subscriptionStatus(

    ): Promise<void> {
        const intervalMs = 5000;
        const timeoutMs = 300000
        const end = Date.now() + timeoutMs;

        async function check(): Promise<void> {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/status`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",   // ✅ include cookies/session
                    body: JSON.stringify({ uid: user?.uid }),
                });
                const data = await res.json();

                const status = data?.status || "unknown";
                // ✅ always return current status to caller
                if (status === 'verified') {
                    setStep('activating');
                }
                if (status === 'created') {
                    setStep('verifying');
                }
                if (status === 'active') {
                    setStep('success');
                }

                if (status === "active") return; // stop once active
            } catch (err) {
                console.error("Status check failed:", err);
            }

            if (Date.now() < end) {
                setTimeout(check, intervalMs); // wait 5s and check again
            } else {

            }
        }

        check();
    }


    const handleSubscription = async () => {
        if (!plan || !user) return;

        onSetLoading(true);
        setStep('processing');

        try {
            // 1. Ask backend to create subscription
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/subscriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan_id: plan.plan_id,
                    user_id: user.uid,
                    customer_email: user.email,
                    ...(plan.offer_id ? { offer_id: plan.offer_id } : {}),
                }),
            });

            const data = await resp.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const Razorpay = await loadRazorpay();

            // 2. Open Razorpay checkout
            const options = {
                key: data.key,
                subscription_id: data.subscription_id,
                name: "QUBICSQUARE",
                description: `${plan.name} Plan Subscription`,
                ...(plan.offer_id ? { offer_id: plan.offer_id } : {}),
                prefill: {
                    email: user.email || "user@example.com",
                    contact: "9999999999",
                },
                handler: async function (response: any) {
                    try {
                        // 3. Verify signature on server
                        const verify = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/verify`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...response,
                                user_id: user.uid,
                            }),
                        });

                        const verifyData = await verify.json();

                        if (!verifyData.ok) {
                            throw new Error("Verification failed");
                        }

                        // Success - show success step

                        subscriptionStatus()
                        // setStep('success');
                        onSetLoading(false);
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        onSetLoading(false);
                        setStep('confirm');
                        alert('Payment verification failed. Please try again.');
                    }
                },
                modal: {
                    ondismiss: async function () {
                        console.log("Payment modal closed");

                        try {
                            // Cancel subscription
                            const cancel = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/subscriptions/cancel`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    subscription_id: data.subscription_id,
                                    user_id: user.uid,
                                }),
                            });

                            const cancelData = await cancel.json();
                            if (!cancelData.ok) {
                                console.error("Failed to cancel subscription");
                            }
                        } catch (error) {
                            console.error("Error cancelling subscription:", error);
                        }

                        onSetLoading(false);
                        onSetIsPopupOpen(false);
                        setStep('confirm');
                    }
                },
                theme: {
                    color: "#6366f1"
                },
                retry: {
                    enabled: true,
                    max_count: 3
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Subscription failed:', error);
            onSetLoading(false);
            setStep('confirm');
            alert('Subscription failed. Please try again.');
        }
    };

    const handleClose = () => {
        setStep('confirm');
        setCountdown(3);
        onClose();
    };

    if (!isOpen || !plan) return null;

    return (
        <div className="sub-popup-overlay">
            <div className="sub-popup-container">
                {step === 'confirm' && (
                    <>
                        <div className="sub-popup-header">
                            <h2>Confirm Your Subscription</h2>
                            <button className="close-btn" onClick={handleClose}>×</button>
                        </div>

                        <div className="sub-popup-content">
                            <div className="plan-summary">
                                <div className="plan-name-badge">
                                    <span className="plan-name">{plan.name} Plan</span>
                                    {plan.discount && (
                                        <span className="discount-tag">{plan.discount}</span>
                                    )}
                                </div>

                                <div className="price-breakdown">
                                    {plan.discounted ? (
                                        <>
                                            <div className="price-row">
                                                <span>Original Price:</span>
                                                <span className="original-price">
                                                    {formatPrice(plan.original!)}
                                                </span>
                                            </div>
                                            <div className="price-row discount-row">
                                                <span>Discount Applied:</span>
                                                <span className="discount-amount">
                                                    -{formatPrice(calculateSavings())}
                                                </span>
                                            </div>
                                            <div className="price-row total-row">
                                                <span>Final Price:</span>
                                                <span className="final-price">
                                                    {formatPrice(plan.discounted)}{plan.period}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="price-row total-row">
                                            <span>Total:</span>
                                            <span className="final-price">
                                                {formatPrice(plan.price)}{plan.period}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {pricingData.gstIncluded && (
                                    <p className="gst-note">*Price includes all applicable taxes</p>
                                )}
                            </div>
                        </div>

                        <div className="sub-popup-footer">
                            <button
                                className="btn-secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleSubscription}
                                disabled={loading || !user}
                            >
                                {loading ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </>
                )}

                {step === 'processing' && (
                    <div className="processing-step">
                        <div className="processing-icon">
                            <div className="spinner"></div>
                        </div>
                        <h3>Processing Your Subscription</h3>
                        <p>Please complete your payment in the Razorpay window...</p>
                        <div className="processing-steps">
                            <div className="step active">
                                <span className="step-number">1</span>
                                <span>Payment Gateway</span>
                            </div>
                            <div className="step">
                                <span className="step-number">2</span>
                                <span>Verification</span>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <span>Activation</span>
                            </div>
                        </div>
                    </div>
                )}
                {step === 'verifying' && (
                    <div className="processing-step">
                        <div className="processing-icon">
                            <div className="spinner"></div>
                        </div>
                        <h3>Verifying Payment</h3>
                        <p>We are verifying your payment with Razorpay…</p>
                        <div className="processing-steps">
                            <div className="step">
                                <span className="step-number">1</span>
                                <span>Payment Gateway</span>
                            </div>
                            <div className="step active">
                                <span className="step-number">2</span>
                                <span>Verification</span>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <span>Activation</span>
                            </div>
                        </div>
                    </div>
                )}
                {step === 'activating' && (
                    <div className="processing-step">
                        <div className="processing-icon">
                            <div className="spinner"></div>
                        </div>
                        <h3>Activating Subscription</h3>
                        <p>We are activating your subscription...</p>
                        <div className="processing-steps">
                            <div className="step">
                                <span className="step-number">1</span>
                                <span>Payment Gateway</span>
                            </div>
                            <div className="step active">
                                <span className="step-number">2</span>
                                <span>Verification</span>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <span>Activation</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="success-step">
                        <div className="success-icon">
                            <div className="checkmark-circle">
                                <div className="checkmark"></div>
                            </div>
                        </div>
                        <h3>Subscription Activated!</h3>
                        <p>Welcome to {plan.name} plan. Your account has been upgraded successfully.</p>
                        <div className="success-details">
                            <div className="detail-item">
                                <span className="label">Plan:</span>
                                <span className="value">{plan.name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Amount:</span>
                                <span className="value">
                                    {plan.discounted ? formatPrice(plan.discounted) : formatPrice(plan.price)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Billing:</span>
                                <span className="value">Monthly</span>
                            </div>
                        </div>
                        <p className="redirect-note">Redirecting to dashboard in {countdown} seconds...</p>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Go to Dashboard Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPopup;