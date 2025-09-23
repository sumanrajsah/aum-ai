import { Children, useEffect, useRef, useState } from "react";
import './setting.css'
import { Brain, BrainCircuit, ChevronRight, CreditCard, IndianRupee, Layers, LogOut, Pickaxe, PlusCircle, Server, Settings, Telescope, Trash2, User2, Wallet, Wrench, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "next-themes";
import { useAuth } from "../../../hooks/useAuth";
import { useAlert } from "../../../context/alertContext";

import { ReactNode } from "react";
import ChangePasswordModal from "./components/changePassword";
import EditProfileModal from "./components/editProfile";
import SelectThemeButton from "../themeButton";
import DeleteMemoryModal from "./components/deleteMemoryModal";
import { getQuickAccess, updateQuickAccess } from "@/app/utils/quickAccess";
import BgButton from "../bgButton";
import { useSettingsStore } from "@/store/useSettingsStore";


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
    const [activeSection, setActiveSection] = useState<'account' | 'subscription' | 'system' | 'memory' | 'quick'>('system');
    const [openPasswordModal, setPasswordModal] = useState(false)
    const [openProfileModal, setProfileModal] = useState(false)
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quickAccess, setQuickAccess] = useState<any>(null);
    const [loadingQuickAccess, setLoadingQuickAccess] = useState(false);
    const { settings, setSettings } = useSettingsStore();

    type Memory = {
        memory_id: string;
        createdAt: string;
        metadata?: {
            facts?: string[] | "null";
            [key: string]: any;
        };
        [key: string]: any;
    };
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loadingMemories, setLoadingMemories] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; memoryId: string; text: string }>({ isOpen: false, memoryId: '', text: '' });

    async function refreshQuickAccess() {
        setLoadingQuickAccess(true);
        try {
            const data = await getQuickAccess(user!.uid);
            setQuickAccess(data);
            console.log(data);
        } catch {
            setQuickAccess(null);
        } finally {
            setLoadingQuickAccess(false);
        }
    }
    useEffect(() => {
        if (user?.uid)
            refreshQuickAccess();
    }, [user]);
    useEffect(() => {
        const fetchMemories = async () => {
            if (!user) return;

            try {
                setLoadingMemories(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/memory`, {
                    credentials: "include"
                });
                const data = await res.json();
                // console.log(data)
                setMemories(data.memory || []);
            } catch (err) {
                console.error("Failed to fetch memories", err);
            } finally {
                setLoadingMemories(false);
            }
        };

        if (user && activeSection === 'memory') fetchMemories();
    }, [user, activeSection]);
    useEffect(() => {
        const fetchBilling = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URI}/v1/payment/billing/${user?.uid}`,
                    { credentials: "include" } // if you use cookies for auth
                );
                const json = await res.json();
                setData(json);
            } catch (err) {
                //console.error("Billing fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (user && activeSection === 'subscription') fetchBilling();
    }, [user, activeSection]);
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
        { id: 'system', label: 'System', icon: Settings },
        { id: 'account', label: 'Account', icon: User2 },
        { id: 'subscription', label: 'Subscription', icon: CreditCard },
        { id: 'memory', label: 'Memory', icon: Brain },
        { id: 'quick', label: 'Quick Access', icon: Zap }
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
            case 'system':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">System Settings</h3>
                        <div className="settings-section">
                            <div className="setting-item">
                                <label className="setting-label">Theme</label>
                                <SelectThemeButton />
                            </div>
                            <div className="setting-item">
                                <label className="setting-label">Background</label>
                                <BgButton />
                            </div>
                        </div>

                    </div>
                );
            case 'subscription':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">Subscription</h3>
                        {loading && <p>
                            Loading...
                        </p>}
                        {!loading && <div className="settings-section">
                            <div className="subscription-card">
                                <div className="subscription-header">
                                    <h4 className="subscription-plan" style={{ textTransform: 'uppercase' }}>
                                        {user?.plan
                                            ? user.plan === "pro-plus"
                                                ? "Pro+"
                                                : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
                                            : "Unknown"}
                                    </h4>
                                    {user?.plan !== 'free' && data?.subscription && <span
                                        className={`subscription-status ${data.subscription?.status === "active" ? "active" : "inactive"
                                            }`}
                                    >   {data.subscription.status}
                                    </span>}
                                </div>
                                <div className="subscription-details">
                                    {user?.plan !== 'free' && <p className="subscription-price">{price}</p>}
                                    {user?.plan !== 'free' && <> {data?.subscription && data.subscription?.charge_at !== null ? <p className="subscription-next">
                                        Next billing on {formatDate(data.subscription?.charge_at)}
                                    </p> : <p className="subscription-next">
                                        Your Plan Will be canceled on {formatDate(data?.subscription?.current_end)}
                                    </p>}</>}
                                </div>
                            </div>
                            {user?.plan !== 'free' && data?.subscription && (
                                <div className="setting-item">
                                    <label className="setting-label">Manage Subscription</label>
                                    <div className="payment-method">
                                        <button className="setting-button-secondary" onClick={() => router.push('/billing')}>Manage</button>
                                        <p style={{ fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>Need help?</p>
                                    </div>
                                </div>
                            )}
                        </div>}
                        {!loading && user?.plan && (
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
                        {!loading && user?.plan !== 'pro-plus' && <div className="settings-section">
                            {user?.plan !== 'pro-plus' && <button className="setting-button-secondary" onClick={() => router.push('/plan')}>Upgrade Plan</button>}
                        </div>}
                    </div>
                );
            case 'memory':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">Memory Management</h3>
                        <div className="settings-section">
                            <div className="setting-item">
                                <label className="setting-label">Memory Storage</label>
                                <p className="setting-description">
                                    Remember your conversations across sessions for a more personalized experience.
                                </p>
                                <div className="setting-toggle">
                                    <input
                                        type="checkbox"
                                        className="toggle-checkbox"
                                        checked={settings.memory}
                                        onChange={(e) => setSettings({ memory: e.target.checked })}
                                    />
                                    <span className="toggle-slider"></span>
                                </div>
                            </div>
                        </div>


                        <div className="settings-section">
                            <div className="setting-item">
                                <label className="setting-label">Stored Memories</label>
                                <p className="setting-description">
                                    View and manage your stored conversation memories
                                </p>
                            </div>

                            {loadingMemories ? (
                                <div className="memory-loading">
                                    <p>Loading memories...</p>
                                </div>
                            ) : memories.length === 0 ? (
                                <div className="memory-empty">
                                    <p>No memories stored yet</p>
                                </div>
                            ) : (
                                <div className="memory-list">
                                    {memories.map((memory, index) => (
                                        <div key={memory.memory_id} className="memory-item">
                                            <div className="memory-row">
                                                <div className="memory-text">
                                                    {memory.text && memory.text !== "" ? (
                                                        <p>{memory.text}</p>
                                                    ) : (
                                                        <p className="no-facts">No description stored in this memory</p>
                                                    )}
                                                </div>
                                                <button
                                                    className="memory-delete-btn"
                                                    onClick={() =>
                                                        setDeleteModal({
                                                            isOpen: true,
                                                            memoryId: memory.memory_id,
                                                            text: memory.text || "No description available"
                                                        })
                                                    }
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'quick':
                return (
                    <div className="settings-content">
                        <h3 className="settings-title">Quick Access</h3>
                        <div className="settings-section">
                            <div className="setting-item">
                                <label className="setting-label">Manage Quick Access</label>
                                <p className="setting-description">
                                    Remove your favorite agents from Quick Access
                                </p>
                            </div>

                            {loadingQuickAccess ? (
                                <div className="memory-loading">
                                    <p>Loading quick access...</p>
                                </div>
                            ) : quickAccess?.agents?.length === 0 ? (
                                <div className="memory-empty">
                                    <p>No agents in quick access yet</p>
                                </div>
                            ) : (
                                <div className="memory-list">
                                    {quickAccess.agents.map((agent: any) => (
                                        <div key={agent.handle} className="memory-item">
                                            <div className="memory-row">
                                                <div className="memory-info">
                                                    <img
                                                        style={{ borderRadius: '30%' }}
                                                        src={agent.image}
                                                        alt={agent.name}
                                                        height={24}
                                                        width={24}
                                                    />
                                                    <div className="memory-text">
                                                        {agent.name}
                                                    </div>
                                                </div>

                                                <button
                                                    className="memory-delete-btn"
                                                    onClick={() => {
                                                        if (user) {
                                                            updateQuickAccess(user.uid, agent.aid, "remove").then(() =>
                                                                refreshQuickAccess()
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>


                );
            default:
                return null;
        }
    };

    return (
        <>
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
                                        onClick={() => setActiveSection(section.id as 'account' | 'subscription' | 'system' | 'memory' | 'quick')}
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
            {user && <ChangePasswordModal isOpen={openPasswordModal} onClose={() => setPasswordModal(!openPasswordModal)} userEmail={user?.email ?? ""} />}
            {user && <EditProfileModal isOpen={openProfileModal} onClose={() => setProfileModal(!openProfileModal)} currentName={user?.name ?? ""} currentUsername={user.username ?? ""} />}
            {user && <DeleteMemoryModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, memoryId: '', text: '' })}
                memoryTitle={deleteModal.text}
                memory_id={deleteModal.memoryId}
                onMemoryDelete={(memoryId) => {
                    // Handle successful deletion
                    console.log('Memory deleted:', memoryId);
                }}
            />}

        </>
    );
};

export default ModalSetting;