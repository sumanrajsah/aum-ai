"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton({ className, islogin }: { className: any, islogin: boolean }) {
    return (
        <button
            onClick={() => signIn("google")}
            className={className}
        >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.15 0 6.12 1.13 8.47 3.04l6.47-6.47C34.92 2.29 29.72 0 24 0 14.62 0 6.48 5.83 2.71 14.26l7.71 5.98C12.19 13.11 17.61 9.5 24 9.5z"></path>
                <path fill="#34A853" d="M46.07 24.54c0-1.5-.13-2.97-.37-4.41H24v8.82h12.5c-.57 2.88-2.22 5.34-4.62 6.97l7.31 5.66c4.26-3.93 6.88-9.73 6.88-16.04z"></path>
                <path fill="#FBBC05" d="M9.26 28.72C8.32 26.56 7.82 24.16 7.82 21.5s.5-5.06 1.44-7.22l-7.71-5.98C.51 12.24 0 16.77 0 21.5s.51 9.26 1.55 13.2l7.71-5.98z"></path>
                <path fill="#EA4335" d="M24 48c6.48 0 11.91-2.15 15.88-5.84l-7.31-5.66c-2.09 1.42-4.74 2.27-8.57 2.27-6.39 0-11.81-3.61-14.58-8.74l-7.71 5.98C6.48 42.17 14.62 48 24 48z"></path>
            </svg>
            {islogin ? "Sign in" : "Sign Up"} with Google
        </button>
    );
}
