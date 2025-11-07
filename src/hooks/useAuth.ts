import { useEffect, useState } from "react";
import axios from "axios";
import { getFingerprint } from "@/app/utils/fp";
import { useSettingsStore } from "@/store/useSettingsStore";

interface User { uid: string; plan: string | "free"; name?: string; image?: string; email?: string; username?: string }
interface GuestUser { guest?: boolean; credits?: { dailyLimit: number; used: number } }
type Status = "authenticated" | "unauthenticated" | "pending";

// Module-level singleton
let sharedUser: User | null = null;
let sharedGuestUser: GuestUser | null = null;
let sharedStatus: Status = "pending";
let fetching: Promise<void> | null = null;

// subscribers for reactive updates
const listeners: Function[] = [];
const notify = () => listeners.forEach(fn => fn({ user: sharedUser, guestUser: sharedGuestUser, status: sharedStatus }));

export const fetchAuth = async () => {
    if (fetching) return fetching;
    fetching = (async () => {
        try {
            const visitorId = await getFingerprint();
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/me`, {
                withCredentials: true,
                headers: { "x-visitor-id": visitorId },
            });

            if (res.data.guest) {
                sharedGuestUser = res.data;
            } else {
                sharedUser = res.data;
                sharedStatus = "authenticated";
            }

            localStorage.setItem("auth-user", JSON.stringify(sharedUser));
            localStorage.setItem("guest-user", JSON.stringify(sharedGuestUser));
        } catch {
            sharedUser = null;
            sharedGuestUser = null;
            sharedStatus = "unauthenticated";
            localStorage.removeItem("auth-user");
            localStorage.removeItem("guest-user");
        } finally {
            notify();
        }
    })();
    return fetching;
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(sharedUser);
    const [guestUser, setGuestUser] = useState<GuestUser | null>(sharedGuestUser);
    const [status, setStatus] = useState<Status>(sharedStatus);
    const [isAuthLoading, setLoading] = useState(false);
    const { init: initSettings } = useSettingsStore();

    useEffect(() => {
        const listener = (newState: { user: User | null; guestUser: GuestUser | null; status: Status }) => {
            setUser(newState.user);
            setGuestUser(newState.guestUser);
            setStatus(newState.status);
            setLoading(false);
        };

        listeners.push(listener);

        // fetch only once
        fetchAuth();
        initSettings();

        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    }, []);
    // console.log({ user, guestUser, status, loading });

    return { user, guestUser, status, setUser, setStatus, isAuthLoading, setLoading };
};
