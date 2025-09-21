"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./GSB.css";
import { useAuth } from "@/hooks/useAuth";

interface GoogleSignInButtonProps {
    className?: string;
    islogin: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export default function GoogleSignInButton({
    className = "",
    islogin,
    onSuccess,
    onError,
}: GoogleSignInButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthLoading } = useAuth()

    const handleCredentialResponse = useCallback(
        async (response: any) => {
            const idToken = response.credential;
            setIsLoading(true);
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URI}/v1/auth/google`,
                    { idToken },
                    { withCredentials: true }
                );
                onSuccess?.(res.data);
                window.location.href = "/";
            } catch (err) {
                console.error("Google login failed", err);
                onError?.(err);
            } finally {
                setIsLoading(false);
            }
        },
        [onSuccess, onError]
    );

    useEffect(() => {
        const loadGoogleScript = () => {
            if (typeof window !== "undefined" && !(window as any).google) {
                const script = document.createElement("script");
                script.src = "https://accounts.google.com/gsi/client";
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    initializeGoogle();
                };
                document.head.appendChild(script);
            } else if ((window as any).google) {
                initializeGoogle();
            }
        };

        const initializeGoogle = () => {
            if ((window as any).google?.accounts?.id) {
                (window as any).google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                    callback: handleCredentialResponse,
                });

                // Render inline Google button inside container
                (window as any).google.accounts.id.renderButton(
                    document.getElementById("gsi-button"),
                    {
                        theme: "outline",
                        size: "large",
                        text: islogin ? "signin_with" : "signup_with",
                        shape: "rectangular",
                    }
                );
            }
        };

        loadGoogleScript();
    }, [handleCredentialResponse, islogin]);

    return (
        <>
            {isLoading && <div className="spinner"></div>}
            {!isLoading && <button id="gsi-button" style={{
                width: "100%",           // responsive container
                maxWidth: "500px"     // limit max size
            }}></button>}
        </>
    );
}
