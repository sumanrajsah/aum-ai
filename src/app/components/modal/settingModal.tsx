import { Children, useEffect, useRef, useState } from "react";
import './setting.css'
import { Brain, BrainCircuit, ChevronRight, CreditCard, IndianRupee, Layers, LogOut, Pickaxe, PlusCircle, Server, Settings, Telescope, User2, Wallet, Wrench, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "next-themes";
import { useAuth } from "../../../hooks/useAuth";
import { useAlert } from "../../../context/alertContext";

import { ReactNode } from "react";
import ChangePasswordModal from "./components/changePassword";
import EditProfileModal from "./components/editProfile";


const PLAN_PRICES: Record<string, string> = {
    free: "₹0/month",
    plus: "₹499/month",
    pro: "₹999/month",
    "pro+": "₹1999/month",
};
export const PLANS: Record<string, any> = {
    free: {
        name: 'Free',
        price: 0,
        original: null,
        discounted: null,
        period: 'forever',
        popular: false,
        earlyAccess: false,
        features: [
            { text: '200 credits per day', highlight: false },
            { text: '1 AI agent', highlight: false },
            { text: 'No workspace', highlight: false },
            { text: 'Basic models', highlight: false },
            { text: '50% platform fees', highlight: false },
            { text: '0% Discount on Top up', highlight: false }
        ],
        buttonText: 'Get Started Free',
        buttonStyle: 'secondary'
    },
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
        buttonText: 'Upgrade to Plus',
        buttonStyle: 'primary'
    },
    pro: {
        name: 'Pro',
        price: 999,
        original: 999,
        discounted: 249,
        period: '/month',
        popular: false,
        earlyAccess: true,
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
        buttonText: 'Get Early Access',
        buttonStyle: 'primary'
    },
    proPlus: {
        name: 'Pro+',
        price: 1999,
        original: 1999,
        discounted: 499,
        period: '/month',
        popular: false,
        earlyAccess: true,
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
        buttonText: 'Get Pro+ Access',
        buttonStyle: 'primary'
    }
};

const ModalSetting = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState<'account' | 'subscription' | 'profile' | 'memory'>('profile');
    const [openPasswordModal, setPasswordModal] = useState(false)
    const [openProfileModal, setProfileModal] = useState(false)
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
            } catch (err) {
                console.error("Billing fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchBilling();
    }, [user]);
    useEffect(() => {
        // Add fade-in animation
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            window.location.hash = '';
        }, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };
    const sections = [
        { id: 'profile', label: 'Profile', icon: Settings },
        { id: 'account', label: 'Account', icon: User2 },
        { id: 'subscription', label: 'Subscription', icon: CreditCard },
        { id: 'memory', label: 'Memory', icon: Brain }
    ];
    const price = user?.plan ? PLAN_PRICES[user.plan.toLowerCase()] : "Custom";
    const getPaymentIcon = (method: string) => {
        if (method.toLowerCase().includes("upi")) return <Wallet size={16} />;
        if (method.toLowerCase().includes("visa") || method.toLowerCase().includes("mastercard"))
            return <CreditCard size={16} />;
        if (method.toLowerCase().includes("rupee")) return <IndianRupee size={16} />;
        return <CreditCard size={16} />; // fallback
    };
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
    const renderContent = () => {
        switch (activeSection) {
            case 'account':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">Account Settings</h3>
                        <div className="settings-section">
                            <div className="setting-item">
                                <label className="setting-label">Email Address</label>
                                <input
                                    readOnly
                                    type="email"
                                    className="setting-input"
                                    placeholder="your.email@example.com"
                                    defaultValue={user?.email}
                                />
                            </div>
                            <div className="setting-item">
                                <label className="setting-label">Password</label>
                                <button className="setting-button-secondary" onClick={() => { setPasswordModal(true) }}>Change Password</button>
                            </div>
                            {/* <div className="setting-item">
                                <label className="setting-label">Two-Factor Authentication</label>
                                <div className="setting-toggle">
                                    <input type="checkbox" className="toggle-checkbox" />
                                    <span className="toggle-slider"></span>
                                </div>
                            </div> */}
                        </div>
                        {/* <div className="settings-section">
                            <h4 className="settings-subtitle">Danger Zone</h4>
                            <button className="setting-button-danger">Delete Account</button>
                        </div> */}
                    </div>
                );
            case 'subscription':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">Subscription</h3>
                        <div className="settings-section">
                            <div className="subscription-card">
                                <div className="subscription-header">
                                    <h4 className="subscription-plan" style={{ textTransform: 'uppercase' }}>
                                        {user?.plan
                                            ? user.plan === "pro-plus"
                                                ? "Pro+"
                                                : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
                                            : "Unknown"}
                                    </h4>
                                    {data.subscription && <span
                                        className={`subscription-status ${data.subscription?.status === "active" ? "active" : "inactive"
                                            }`}
                                    >   {data.subscription.status}
                                    </span>}
                                </div>
                                <div className="subscription-details">
                                    {user?.plan !== 'free' && <p className="subscription-price">{price}</p>}
                                    {data.subscription && data.subscription?.charge_at !== null ? <p className="subscription-next">
                                        Next billing on {formatDate(data.subscription?.charge_at)}
                                    </p> : <p className="subscription-next">
                                        Your Plan Will be canceled on {formatDate(data.subscription?.current_end)}
                                    </p>}
                                </div>
                            </div>
                            {data.subscription && (
                                <div className="setting-item">
                                    <label className="setting-label">Manage Subscription</label>
                                    <div className="payment-method">
                                        <button className="setting-button-secondary" onClick={() => router.push('/billing')}>Manage</button>
                                        <p style={{ fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>Need help?</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {user?.plan && (
                            <div className="settings-section">
                                <h4 className="features-title">Features in {PLANS[user.plan === "pro-plus" ? "proPlus" : user.plan].name}</h4>
                                <ul className="features-list">
                                    {PLANS[user.plan === "pro-plus" ? "proPlus" : user.plan].features.map(
                                        (feature: any, idx: number) => (
                                            <li
                                                key={idx}
                                                className={feature.highlight ? "highlight" : ""}
                                            >
                                                ✓ {feature.text}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                        {user?.plan !== 'pro-plus' && <div className="settings-section">
                            {user?.plan !== 'pro-plus' && <button className="setting-button-secondary" onClick={() => router.push('/plan')}>Upgrade Plan</button>}
                        </div>}
                    </div>
                );
            case 'profile':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">Profile Settings</h3>
                        <div className="settings-section">
                            <div className="setting-item">
                                <label className="setting-label">Display Name</label>
                                <input
                                    type="text"
                                    className="setting-input"
                                    placeholder="Your display name"
                                    defaultValue={user?.name}
                                    readOnly
                                />
                            </div>
                            <div className="setting-item">
                                <label className="setting-label">Username</label>
                                <input
                                    type="text"
                                    className="setting-input"
                                    placeholder="@username"
                                    defaultValue={user?.username}
                                    readOnly
                                />
                            </div>
                            <button className="setting-button-secondary" onClick={() => setProfileModal(!openProfileModal)}>Edit Info</button>
                        </div>
                    </div>
                );
            case 'memory':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">Memory Settings</h3>
                        <div className="settings-section">
                            <div className="setting-item">
                                <label className="setting-label">Conversation Memory</label>
                                <div className="setting-toggle">
                                    <input type="checkbox" className="toggle-checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </div>
                                <p className="setting-description">Remember context across conversations</p>
                            </div>
                            <div className="setting-item">
                                <label className="setting-label">Auto-save Conversations</label>
                                <div className="setting-toggle">
                                    <input type="checkbox" className="toggle-checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </div>
                            </div>
                            <div className="setting-item">
                                <label className="setting-label">Memory Duration</label>
                                <select className="setting-select">
                                    <option value="7">7 days</option>
                                    <option value="30" selected>30 days</option>
                                    <option value="90">90 days</option>
                                    <option value="365">1 year</option>
                                </select>
                            </div>
                        </div>
                        <div className="settings-section">
                            <div className="memory-usage">
                                <h4 className="settings-subtitle">Memory Usage</h4>
                                <div className="usage-bar">
                                    <div className="usage-fill" style={{ width: '65%' }}></div>
                                </div>
                                <p className="usage-text">6.5 GB of 10 GB used</p>
                            </div>
                            <button className="setting-button-danger">Clear All Memory</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {user && <ChangePasswordModal isOpen={openPasswordModal} onClose={() => setPasswordModal(!openPasswordModal)} userEmail={user?.email} />}
            {user && <EditProfileModal isOpen={openProfileModal} onClose={() => setProfileModal(!openProfileModal)} currentName={user?.name ?? ""} currentUsername={user.username} />}
            <div
                className={`modal-setting-body ${isVisible ? 'modal-setting-visible' : ''}`}
                onClick={handleBackdropClick}
            >
                <div className="modal-setting-wrapper">
                    <div className="modal-setting-cont">
                        <div className="settings-sidebar">
                            <div className="modal-setting-close-btn" onClick={handleClose}>
                                <X size={20} />
                            </div>
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                                        onClick={() => setActiveSection(section.id as 'account' | 'subscription' | 'profile' | 'memory')}
                                    >
                                        <Icon size={18} />
                                        <span>{section.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="settings-main">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ModalSetting;