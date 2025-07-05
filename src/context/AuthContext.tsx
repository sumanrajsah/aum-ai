'use client'
// context/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; // adjust the import as per your folder structure

interface AuthContextType {
    user: { uid: string; name?: string; image?: string } | null;
    status: string;
    isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth();
    // useEffect(() => {
    //     if (auth.status === 'unauthenticated') {
    //         location.href = '/login';
    //     }
    // }, [auth.status])
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
