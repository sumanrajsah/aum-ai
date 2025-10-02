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
    const { isAuthLoading } = useAuth();

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

    const handleGoogleSignIn = useCallback(() => {
        if ((window as any).google?.accounts?.id) {
            // Trigger Google One Tap prompt
            (window as any).google.accounts.id.prompt();
        }
    }, []);

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
                    auto_select: false,
                });
            }
        };

        loadGoogleScript();
    }, [handleCredentialResponse]);

    return (
        <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`${className}`}
            type="button"
        >
            {isLoading ? (
                <div className="spinner"></div>
            ) : (
                <>
                    <svg
                        className="google-icon"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                                fill="#4285F4"
                                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                                fill="#34A853"
                                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                                fill="#EA4335"
                                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                        </g>
                    </svg>

                </>
            )}
        </button>
    );
}