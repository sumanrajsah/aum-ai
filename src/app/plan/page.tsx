'use client';
import React, { useEffect, useState } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionPopup from './components/subsPop';
import { stat } from 'fs';
// Import the popup component

declare global { interface Window { Razorpay?: any } }
const pricingData = {
    currency: 'INR',
    symbol: '₹',
    region: 'India',
    flag: '🇮🇳',
    gstIncluded: true,
    plans: {
        plus: {
            name: 'Plus',
            price: 499,
            original: null,
            discounted: null,
            period: '/month',
            popular: false,
            earlyAccess: false,
            features: [
                { text: '200 credits per day', highlight: false },
                { text: '+50K credits', highlight: true },
                { text: 'Unlimited AI agents', highlight: true },
                { text: '3 Workspaces', highlight: false },
                { text: 'All models unlocked', highlight: true },
                { text: '30% platform fees', highlight: false },
                { text: '5% Discount on Top up', highlight: true }
            ],
            buttonText: 'Get Plus Plan',
            buttonStyle: 'primary',
            link: 'plus',
            plan_id: 'plan_R9OLfO0iomjpBl'
        },
        pro: {
            name: 'Pro',
            price: 999,
            original: 999,
            discounted: null,
            period: '/month',
            popular: true,
            earlyAccess: false,
            earlyAccessText: '🚀 Early Access - Limited Time',
            discount: '75% OFF',
            features: [
                { text: '200 credits per day', highlight: false },
                { text: '+100K credits', highlight: true },
                { text: 'Unlimited AI agents', highlight: true },
                { text: '5 Workspaces', highlight: false },
                { text: 'All models unlocked', highlight: true },
                { text: '25% platform fees', highlight: false },
                { text: '10% Discount on Top up', highlight: true }
            ],
            buttonText: 'Get Pro Plan',
            buttonStyle: 'primary',
            link: 'pro',
            plan_id: 'plan_RAc3jUVpeKvSUB',
            offer_id: "offer_RAc2QK56PuiJm5"
        },
        proPlus: {
            name: 'Pro+',
            price: 1999,
            original: 1999,
            discounted: null,
            period: '/month',
            popular: false,
            earlyAccess: false,
            earlyAccessText: '🚀 Early Access - Limited Time',
            discount: '75% OFF',
            features: [
                { text: '200 credits per day', highlight: false },
                { text: '+200K credits', highlight: true },
                { text: 'Unlimited AI agents', highlight: true },
                { text: '10+ Workspaces', highlight: true },
                { text: 'All models unlocked', highlight: true },
                { text: '20% platform fees', highlight: true },
                { text: '15% Discount on Top up', highlight: true }
            ],
            buttonText: 'Get Pro+ Plan',
            buttonStyle: 'primary',
            link: 'pro-plus',
            plan_id: 'plan_RAc40zHJYd1d1T',
            offer_id: "offer_RAc2QK56PuiJm5"
        }
    }
};
// Keep the same loadRazorpay function
async function loadRazorpay(): Promise<any> {
    if (typeof window === "undefined") throw new Error("SSR");
    if (window.Razorpay) return window.Razorpay;
    await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.body.appendChild(s);
    });
    return window.Razorpay!;
}


const PricingPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    // Add popup state management
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URI}/v1/payment/billing/${user?.uid}`,
                    { credentials: "include" } // if you use cookies for auth
                );
                const json = await res.json();
                console.log(json, json.subscription)
                setData({
                    name: pricingData.plans.plus.link,
                    price: pricingData.plans.plus.price,
                    plan_id: pricingData.plans.plus.plan_id,
                    renewalDate: json.subscription.next_due ?? "",
                    period: json.subscription.current_end,
                    subscription_id: json.subscription.subscription_id,
                    status: json.subscription.status
                });
            } catch (err) {
                console.error("Billing fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchBilling();
        }
    }, [user]);



    const formatPrice = (price: any) => {
        return price === 0 ? 'Free' : `${pricingData.symbol}${price.toLocaleString('en-IN')}`;
    };

    // Handle plan selection - opens popup instead of direct subscription
    const handlePlanSelection = (planKey: string) => {
        const plan = pricingData.plans[planKey as keyof typeof pricingData.plans];
        setSelectedPlan(plan);
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setSelectedPlan(null);
        setLoading(false);
    };

    return (
        <div className="pricing-page">
            <div className="pricing-container">
                <header className="pricing-header">
                    <h1 className="pricing-title">Choose Your Plan</h1>
                    <p className="pricing-subtitle">
                        Scale your AI workflow with the perfect plan for your needs
                    </p>
                    {pricingData.gstIncluded && (
                        <p className="gst-note">*All prices include GST</p>
                    )}
                </header>

                <div className="pricing-grid">
                    {Object.entries(pricingData.plans)
                        .filter(([key]) => {
                            if (!user) return true; // show all if not logged in
                            if (user.plan === "pro-plus") {
                                return key !== "plus" && key !== "pro";
                            }
                            if (user.plan === "pro") {
                                return key !== "plus" && key !== 'pro-plus';
                            }

                            return true;
                        })
                        .map(([key, plan]) => (
                            <div
                                key={key}
                                className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.earlyAccess ? 'early-access' : ''}`}
                            >
                                {plan.popular && <div className="popular-badge">Most Popular</div>}

                                <div className="card-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="price-section">
                                        {/* {plan.discounted && (
                                            <div className="discount-badge">{plan.discount}</div>
                                        )} */}
                                        <div className="price-display">
                                            {plan.discounted ? (
                                                <>
                                                    <span className="original-price">
                                                        {formatPrice(plan.original)}
                                                    </span>
                                                    <span className="discounted-price">
                                                        {formatPrice(plan.discounted)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="current-price">
                                                    {formatPrice(plan.price)}
                                                </span>
                                            )}
                                            <span className="period">{plan.period}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="features-list">
                                    {plan.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className={`feature-item ${feature.highlight ? 'highlighted' : ''}`}
                                        >
                                            <div className="feature-icon">
                                                ✓
                                            </div>
                                            <span className="feature-text">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {user?.plan === plan.link && <button
                                    className={`plan-button secondary`}
                                    disabled={loading}
                                >
                                    Current Plan
                                </button>}
                                {user?.plan !== plan.link && <button
                                    className={`plan-button ${plan.buttonStyle}`}
                                    onClick={() => handlePlanSelection(key)}
                                    disabled={loading}
                                >
                                    {loading && selectedPlan?.plan_id === plan.plan_id ? 'Processing...' : plan.buttonText}
                                </button>}

                            </div>
                        ))}
                </div>
            </div>

            {/* Add the SubscriptionPopup component */}
            <SubscriptionPopup
                plan={selectedPlan}
                isOpen={isPopupOpen}
                currentPlan={data}
                onClose={handlePopupClose}
                loading={loading}
                onSetLoading={setLoading}
                onSetIsPopupOpen={setIsPopupOpen}
                isUpgrade={data}
                planInfo={pricingData}
                pricingData={{
                    currency: pricingData.currency,
                    symbol: pricingData.symbol,
                    gstIncluded: pricingData.gstIncluded
                }}
            />
        </div>
    );
};

export default PricingPage;