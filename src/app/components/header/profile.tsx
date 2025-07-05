import { useEffect, useRef } from "react";
import './style.css'
import { BrainCircuit, LogOut, Pickaxe, Server, Settings, Telescope, User2, Wrench } from "lucide-react";
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
        <div className="profile-body" >
            <button className="profile-btn" onClick={() => { router.push('?profile=true') }}><User2 size={20} />Profile</button>
            <hr />
            <button className="profile-btn" onClick={() => { router.push('/agents/create') }}><BrainCircuit size={20} />Create AUM Agent</button>
            <button className="profile-btn" onClick={() => { router.push('/agents/explorer') }}><Telescope size={20} />Explorer</button>
            <hr />
            <button className="profile-btn" onClick={() => { router.push('/mcp') }}><Pickaxe size={20} />MCP</button>
            <button className="profile-btn" onClick={() => { router.push('?settings=true') }}><Settings size={20} />Settings</button>
            <ThemeToggle />
            <hr />
            <button className="logout-btn" onClick={handleLogout}><LogOut size={24} />Log out</button>
        </div>
    );
};

export default ProfileCont;
