"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

interface User {
    uid: string;
    plan: string | "free";
    name?: string;
    image?: string;
    email?: string;
    username?: string;
}

interface GuestUser {
    guest?: boolean;
    credits?: { dailyLimit: number; used: number };
}

type Status = "authenticated" | "unauthenticated" | "pending";

interface AuthContextType {
    user: User | null;
    guestUser: GuestUser | null;
    status: Status;
    isAuthLoading: boolean;
    setLoading: (loading: boolean) => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const auth = useAuth();

    useEffect(() => {
        if (auth.status === "unauthenticated" && !pathname.includes('/login') && !pathname.includes('/signup')) {
            location.href = "/login";
        }
        if (auth.user && auth.user.plan === "free" && pathname.includes("/workspace")) {
            location.href = "/plan";
        }
    }, [auth.status, auth.user, pathname]);

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
    return context;
};
