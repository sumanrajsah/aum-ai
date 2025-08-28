import { useEffect, useRef } from "react";
import './profile.css'
import { BrainCircuit, LogOut, Pickaxe, Server, Settings, Telescope, User2, Wrench, Mail, UserCircle, ScrollText, Headset } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "next-themes";
import { useAuth } from "../../../hooks/useAuth";
import { useAlert } from "../../../context/alertContext";

const ProfileCont = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const { user } = useAuth()
    const alertMessage = useAlert()

    // Function to get user initials
    const getUserInitials = (name: string | undefined) => {
        if (!name) return 'U';

        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }

        const firstInitial = nameParts[0].charAt(0).toUpperCase();
        const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

        return firstInitial + lastInitial;
    };

    async function handleLogout() {
        console.log('Logging out', user);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/logout`, {
            method: "POST",
            credentials: "include", // VERY IMPORTANT: enables sending/receiving cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user }),
        });
        console.log('Logout response:', res);

        if (res?.ok) {
            alertMessage.success("✅ Logout successful");
            router.push("/login");
        } else {
            alertMessage.warn("⚠️ Logout failed");
        }
    }

    return (
        <div className="profile-sidebar-body">
            {/* User Details Section */}
            <div className="user-details">
                <div className="user-avatar">
                    {user?.image ? (
                        <img
                            src={user.image}
                            alt="Profile"
                            className="avatar-image"
                            onError={(e) => {
                                // Hide the image and show initials if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                                if ((e.target as HTMLImageElement).nextSibling && (e.target as HTMLImageElement).nextSibling instanceof HTMLElement) {
                                    ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
                                }
                            }}
                        />
                    ) : null}
                    <div
                        className="avatar-initials"
                        style={{
                            display: user?.image ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(94, 129, 173, 0.2)',
                            color: 'rgba(94, 129, 173, 1)',
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '50%'
                        }}
                    >
                        {getUserInitials(user?.name)}
                    </div>

                </div>
                <span className="plan" style={{ textTransform: 'uppercase', fontWeight: '600' }}>{user?.plan === 'pro-plus' ? 'pro+' : `${user?.plan}`}</span>
                <div className="user-info">
                    <div className="user-name">
                        {user?.name || 'User'}
                    </div>
                    <div className="user-email">
                        {user?.email || 'user@example.com'}
                    </div>
                </div>
            </div>

            <hr />
            <button className="profile-btn" onClick={() => { router.push('/plan') }}>
                <User2 size={20} />Upgrade Plan
            </button>
            <hr />
            {/* <button className="profile-btn" onClick={() => { router.push('?settings=true') }}>
                <Settings size={20} />Settings
            </button> */}
            <ThemeToggle />

            <hr />
            <button className="profile-btn" onClick={() => { router.push('term-and-condition') }}>
                <ScrollText size={20} />Terms & Policies
            </button>
            <button className="profile-btn" onClick={() => { window.open('https://t.me/aumai_customer_support', '_blank') }}>
                <Headset size={20} />Support
            </button>
            <hr />

            <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={24} />Log out
            </button>
        </div>
    );
};

export default ProfileCont;