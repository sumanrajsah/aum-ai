import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    uid: string;
    plan: string | "free";
    name?: string;
    image?: string;
    email: string;
    username: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(() => {
        // load cached user instantly
        if (typeof window !== "undefined") {
            const cached = localStorage.getItem("auth-user");
            return cached ? JSON.parse(cached) : null;
        }
        return null;
    });

    const [status, setStatus] = useState<
        "authenticated" | "unauthenticated" | "pending"
    >(user ? "authenticated" : "pending");
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URI}/v1/auth/me`,
                    { withCredentials: true }
                );
                setUser(res.data);
                setStatus("authenticated");
                localStorage.setItem("auth-user", JSON.stringify(res.data));
            } catch {
                setUser(null);
                setStatus("unauthenticated");
                localStorage.removeItem("auth-user");
            } finally {
                setLoading(false);
            }
        };

        // always validate in background
        fetchUser();
    }, []);

    return { user, status, isAuthLoading: loading };
};
