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

interface UserInfo {
    name: string;
    contact: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
}

// Add this interface to your existing interfaces
interface CurrentPlan {
    name: string;
    price: number;
    period: string;
    plan_id: string;
    renewalDate: string;
    subscription_id: string;
}

// Add these props to your SubscriptionPopupProps interface
interface SubscriptionPopupProps {
    planInfo: any;
    plan: Plan | null;
    currentPlan?: CurrentPlan | null; // Add this
    isUpgrade?: boolean; // Add this
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
    planInfo,
    plan,
    currentPlan,
    isUpgrade,
    isOpen,
    onClose,
    loading,
    pricingData,
    onSetLoading,
    onSetIsPopupOpen
}) => {
    const [step, setStep] = useState<'confirm' | 'user-info' | 'processing' | 'verifying' | 'activating' | 'success' | 'failed' | 'cancelled'>('confirm');
    const { user } = useAuth();
    const [countdown, setCountdown] = useState(3);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [customerId, setCustomerId] = useState();
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: user?.name ?? "",
        contact: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        }
    });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const formatPrice = (price: number) => {
        return `${pricingData.symbol}${price.toLocaleString('en-IN')}`;
    };

    const calculateSavings = () => {
        if (!plan?.original || !plan?.discounted) return 0;
        return plan.original - plan.discounted;
    };

    // Validation functions
    const validatecontact = (contact: string): boolean => {
        const contactRegex = /^[6-9]\d{9}$/;
        return contactRegex.test(contact);
    };

    const validatePincode = (pincode: string): boolean => {
        const pincodeRegex = /^\d{6}$/;
        return pincodeRegex.test(pincode);
    };

    const validateUserInfo = (): boolean => {
        const errors: { [key: string]: string } = {};

        // contact validation
        if (!userInfo.name.trim()) {
            errors.contact = 'Name is required';
        }
        if (!userInfo.contact.trim()) {
            errors.contact = 'contact number is required';
        } else if (!validatecontact(userInfo.contact)) {
            errors.contact = 'Please enter a valid 10-digit contact number';
        }

        // Address validation
        if (!userInfo.address.line1.trim()) {
            errors.line1 = 'Address line 1 is required';
        }
        if (!userInfo.address.city.trim()) {
            errors.city = 'City is required';
        }
        if (!userInfo.address.state.trim()) {
            errors.state = 'State is required';
        }
        if (!userInfo.address.pincode.trim()) {
            errors.pincode = 'Pincode is required';
        } else if (!validatePincode(userInfo.address.pincode)) {
            errors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleUpgrade = async () => {
        let c;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/customer/get/${user?.uid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await res.json();
            console.log(data)
            setCustomerId(data.customer.id);
            c = data.customer.id;
            setUserInfo({
                name: data.customer.name,
                contact: data.customer.contact,
                address: data.customer.address || {
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India'
                }
            })
        }
        catch (e) {

        }
        if (c) {
            try {
                setStep('processing');
                await cancelSub();
                await handleSubscription();
            } catch (e) {
                console.log(e)
            }
        } else {
            setStep('user-info')
        }
    }
    const handleUserInfoSubmit = async () => {
        if (validateUserInfo()) {

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/customer/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ uid: user?.uid, name: userInfo.name, contact: userInfo.contact, address: userInfo.address, email: user?.email }),
                });
            }
            catch (e) {

            }
            setStep('processing');
            handleSubscription();
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (field.startsWith('address.')) {
            const addressField = field.split('.')[1];
            setUserInfo(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setUserInfo(prev => ({
                ...prev,
                [field]: value
            }));
        }

        // Clear validation error for this field
        if (validationErrors[field] || validationErrors[field.split('.')[1]]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                delete newErrors[field.split('.')[1]];
                return newErrors;
            });
        }
    };

    // Countdown timer for success step
    useEffect(() => {
        if (step === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (step === 'success' && countdown === 0) {
            window.location.href = '/';
        }
    }, [step, countdown]);

    async function subscriptionStatus(): Promise<void> {
        const intervalMs = 5000;
        const timeoutMs = 300000;
        const end = Date.now() + timeoutMs;

        async function check(): Promise<void> {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/status`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ uid: user?.uid }),
                });
                const data = await res.json();

                const status = data?.status || "unknown";

                if (status === 'verified') {
                    setStep('activating');
                }
                if (status === 'created') {
                    setStep('verifying');
                }
                if (status === 'active') {
                    setStep('success');
                    return;
                }
                if (status === 'failed') {
                    setStep('failed');
                    setErrorMessage(data?.message || 'Payment verification failed');
                    onSetLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Status check failed:", err);
                if (Date.now() >= end) {
                    setStep('failed');
                    setErrorMessage('Status check timeout. Please contact support.');
                    onSetLoading(false);
                    return;
                }
            }

            if (Date.now() < end) {
                setTimeout(check, intervalMs);
            } else {
                setStep('failed');
                setErrorMessage('Payment status check timed out. Please contact support.');
                onSetLoading(false);
            }
        }

        check();
    }
    async function cancelSub() {
        if (!currentPlan?.subscription_id) {
            console.error("No subscription to cancel");
            return;
        }



        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/payment/subscriptions/cancel`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // if you use cookies for auth
                    body: JSON.stringify({
                        subscription_id: currentPlan?.subscription_id,
                        user_id: user?.uid,
                    }),
                }
            );

            const json = await res.json();

            if (json.ok) {
                alert("Subscription cancelled successfully");
                // Optionally refresh billing info here
            } else {
                alert(json.error || "Failed to cancel subscription");
            }
        } catch (err) {
            console.error("Cancel request failed:", err);
            alert("Error while cancelling subscription");
        } finally {

        }
    }
    const handleSubscription = async () => {
        if (!plan || !user) return;

        onSetLoading(true);
        setErrorMessage('');

        try {
            // 1. Ask backend to create subscription with user info
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/payment/subscriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan_id: plan.plan_id,
                    user_id: user.uid,
                    customer_email: user.email,
                    customer_id: customerId,
                    contact: userInfo.contact,
                    billing_address: userInfo.address,
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
                    contact: userInfo.contact,
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
                            throw new Error(verifyData.message || "Verification failed");
                        }

                        subscriptionStatus();
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        setStep('failed');
                        setErrorMessage(error instanceof Error ? error.message : 'Payment verification failed');
                        onSetLoading(false);
                    }
                },
                modal: {
                    ondismiss: async function () {
                        console.log("Payment modal closed - User cancelled");

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

                        setStep('cancelled');
                        onSetLoading(false);
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
            setStep('failed');
            setErrorMessage(error instanceof Error ? error.message : 'Subscription failed');
            onSetLoading(false);
        }
    };
    console.log(currentPlan)

    const handleClose = () => {
        setStep('confirm');
        setCountdown(3);
        setErrorMessage('');
        setValidationErrors({});
        setUserInfo({
            name: '',
            contact: '',
            address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            }
        });
        onClose();
    };

    const handleRetry = () => {
        setStep('confirm');
        setErrorMessage('');
        onSetLoading(false);
    };

    const handleBackToConfirm = () => {
        setStep('confirm');
        setValidationErrors({});
    };

    const calculateProration = (): number => {
        if (!currentPlan) return 0;

        // Calculate days remaining in current billing cycle
        const today = new Date();
        const renewalDate = new Date(currentPlan.renewalDate);
        const daysRemaining = Math.max(0, Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

        // Assuming monthly billing, calculate daily rate
        const dailyRate = currentPlan.price / 30;
        return Math.round(dailyRate * daysRemaining);
    };

    const calculateUpgradeAmount = (): number => {
        if (!plan || !currentPlan) return plan?.price || 0;

        const newPlanPrice = plan.discounted || plan.price;
        const prorationCredit = calculateProration();

        return Math.max(0, newPlanPrice - prorationCredit);
    };

    if (!isOpen || !plan) return null;

    return (
        <div className="sub-popup-overlay">
            <div className="sub-popup-container">
                {step === 'confirm' && isUpgrade && currentPlan && (
                    <>
                        <div className="upgrade-simple">
                            <h2>Upgrade Your Plan</h2>

                            <div className="upgrade-row">
                                <span>Current Plan:</span>
                                <span>{currentPlan.name} — {formatPrice(currentPlan.price)} <br />{new Date(currentPlan.period).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}</span>
                            </div>

                            <div className="upgrade-row">
                                <span>Renews on:</span>
                                <span>
                                    {new Date(currentPlan.renewalDate).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>

                            <div className="upgrade-row arrow">↓ Upgrade To ↓</div>

                            <div className="upgrade-row">
                                <span>New Plan:</span>
                                <span>
                                    {plan.name} — <s>{formatPrice(plan.original ?? 0)}</s> <strong>{formatPrice(plan.discounted ?? 0)}</strong>{plan.period}
                                </span>
                            </div>

                            <div className="upgrade-row">
                                <span>Savings:</span>
                                <span>Save {formatPrice((plan.original ?? 0) - (plan.discounted ?? 0))} per month</span>
                            </div>

                            <div className="benefits">
                                <h4>What you’ll get:</h4>
                                <ul>
                                    {plan.features.map((f, i) => (
                                        <li key={i} className={f.highlight ? 'highlight' : ''}> {f.text}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="upgrade-instructions">
                                <h4>How Upgrade Works</h4>
                                <ul>
                                    <li>Your current subscription will be cancelled immediately</li>
                                    <li>A new subscription with your selected plan will start today</li>
                                    <li>Any unused credits from your old plan will remain active and expire at the next billing date</li>
                                    <li>Future billing will follow the new plan cycle from today’s date</li>
                                </ul>
                            </div>


                            <div className="upgrade-actions">
                                <button className="btn-secondary" onClick={handleClose}>Cancel</button>
                                <button className="btn-primary" onClick={handleUpgrade}>Upgrade Now</button>
                            </div>
                        </div>

                    </>
                )}

                {step === 'confirm' && !isUpgrade && (
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
                                onClick={() => setStep('user-info')}
                                disabled={loading || !user}
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {step === 'user-info' && (
                    <>
                        <div className="sub-popup-header">
                            <h2>Billing Information</h2>
                            <button className="close-btn" onClick={handleClose}>×</button>
                        </div>

                        <div className="sub-popup-content">
                            <div className="user-info-form">
                                <div className="form-section">
                                    <h4>Contact Information</h4>
                                    <div className="form-group">
                                        <label htmlFor="name">Billing Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={userInfo.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter Billing Name"
                                            className={validationErrors.name ? 'error' : ''}
                                        />
                                        {validationErrors.name && (
                                            <span className="error-text">{validationErrors.name}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contact">contact Number *</label>
                                        <input
                                            type="tel"
                                            id="contact"
                                            value={userInfo.contact}
                                            onChange={(e) => handleInputChange('contact', e.target.value)}
                                            placeholder="Enter 10-digit contact number"
                                            maxLength={10}
                                            className={validationErrors.contact ? 'error' : ''}
                                        />
                                        {validationErrors.contact && (
                                            <span className="error-text">{validationErrors.contact}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4>Billing Address</h4>
                                    <div className="form-group">
                                        <label htmlFor="line1">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            id="line1"
                                            value={userInfo.address.line1}
                                            onChange={(e) => handleInputChange('address.line1', e.target.value)}
                                            placeholder="House/Flat number, Street name"
                                            className={validationErrors.line1 ? 'error' : ''}
                                        />
                                        {validationErrors.line1 && (
                                            <span className="error-text">{validationErrors.line1}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="line2">Address Line 2</label>
                                        <input
                                            type="text"
                                            id="line2"
                                            value={userInfo.address.line2}
                                            onChange={(e) => handleInputChange('address.line2', e.target.value)}
                                            placeholder="Area, Landmark (Optional)"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="city">City *</label>
                                            <input
                                                type="text"
                                                id="city"
                                                value={userInfo.address.city}
                                                onChange={(e) => handleInputChange('address.city', e.target.value)}
                                                placeholder="City"
                                                className={validationErrors.city ? 'error' : ''}
                                            />
                                            {validationErrors.city && (
                                                <span className="error-text">{validationErrors.city}</span>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="state">State *</label>
                                            <input
                                                type="text"
                                                id="state"
                                                value={userInfo.address.state}
                                                onChange={(e) => handleInputChange('address.state', e.target.value)}
                                                placeholder="State"
                                                className={validationErrors.state ? 'error' : ''}
                                            />
                                            {validationErrors.state && (
                                                <span className="error-text">{validationErrors.state}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="pincode">Pincode *</label>
                                            <input
                                                type="text"
                                                id="pincode"
                                                value={userInfo.address.pincode}
                                                onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                                                placeholder="123456"
                                                maxLength={6}
                                                className={validationErrors.pincode ? 'error' : ''}
                                            />
                                            {validationErrors.pincode && (
                                                <span className="error-text">{validationErrors.pincode}</span>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="country">Country</label>
                                            <select
                                                id="country"
                                                value={userInfo.address.country}
                                                onChange={(e) => handleInputChange('address.country', e.target.value)}
                                            >
                                                <option value="India">India</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="plan-summary-mini">
                                    <div className="mini-plan-info">
                                        <span className="mini-plan-name">{plan.name} Plan</span>
                                        <span className="mini-plan-price">
                                            {plan.discounted ? formatPrice(plan.discounted) : formatPrice(plan.price)}{plan.period}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sub-popup-footer">
                            <button
                                className="btn-secondary"
                                onClick={handleBackToConfirm}
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleUserInfoSubmit}
                                disabled={loading}
                            >
                                Proceed to Payment
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
                            <div className="step completed">
                                <span className="step-number">✓</span>
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
                        <p>Payment verified Successfully</p>
                        <p>We are activating your subscription...</p>
                        <div className="processing-steps">
                            <div className="step completed">
                                <span className="step-number">✓</span>
                                <span>Payment Gateway</span>
                            </div>
                            <div className="step completed">
                                <span className="step-number">✓</span>
                                <span>Verification</span>
                            </div>
                            <div className="step active">
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

                {step === 'failed' && (
                    <div className="error-step">
                        <div className="error-icon">
                            <div className="error-circle">
                                <div className="error-x">×</div>
                            </div>
                        </div>
                        <h3>Payment Failed</h3>
                        <p className="error-message">
                            {errorMessage || 'Your payment could not be processed. Please try again.'}
                        </p>
                        <div className="error-details">
                            <p>Don't worry, no charges have been made to your account.</p>
                            <p>You can try again or contact our support team for assistance.</p>
                        </div>
                        <div className="error-actions">
                            <button
                                className="btn-secondary"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleRetry}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {step === 'cancelled' && (
                    <div className="cancelled-step">
                        <div className="cancelled-icon">
                            <div className="cancelled-circle">
                                <div className="cancelled-dash">−</div>
                            </div>
                        </div>
                        <h3>Payment Cancelled</h3>
                        <p>You have cancelled the payment process.</p>
                        <div className="cancelled-details">
                            <p>No charges have been made to your account.</p>
                            <p>You can restart the subscription process anytime.</p>
                        </div>
                        <div className="cancelled-actions">
                            <button
                                className="btn-secondary"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleRetry}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPopup;