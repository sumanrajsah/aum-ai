"use client"
import React, { useEffect } from "react";
import Image from 'next/image'
import '../signup/style.css'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Oval } from 'react-loader-spinner'
import GoogleSignInButton from "../components/GSB";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../context/alertContext";
export default function CollabLogin() {
    const [credentials, setCredentials] = React.useState({ email: "", password: "" });
    const router = useRouter();
    const alertMessage = useAlert();

    const bufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };
    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const encodedPassword = new TextEncoder().encode(e.target.value);
        const hashBuffer = await window.crypto.subtle.digest("SHA-512", encodedPassword);
        const hashedPassword = bufferToHex(hashBuffer);
        // console.log(hashedPassword);
        setCredentials(prev => ({ ...prev, password: hashedPassword }));

    };

    async function handleLogin() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/login`, {
            method: "POST",
            credentials: "include", // VERY IMPORTANT: enables sending/receiving cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ credentials }),
        });
        console.log('Login response:', res);


        if (res?.ok) {
            alertMessage.success("Login successful");
            router.push("/");
        } else {
            alertMessage.warn("Invalid credentials")
        }
    }

    const { status, isAuthLoading } = useAuth()

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status]);

    return (
        <>
            {isAuthLoading ? <div className="collab-sbody"><Oval
                visible={true}
                height="50"
                width="50"
                color="gray"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                secondaryColor="gray"
            /><p>Loading...</p></div> : (status === "authenticated" ? <div className="collab-sbody">
                <h1>✅</h1>
                <h1>Authentocated</h1>
                <p>Redirecting to dashboard...</p>
            </div> : <div className="collab-sbody">
                <button className="collab-sbutton" onClick={() => { router.push('/signup') }} style={{ width: "auto" }}>Create an account</button>
                <div className="cs-heading">
                    <Image src={'/sitraone.png'} height={80} width={80} alt="sitraone" />
                    <br />
                    <h1>Login</h1>
                    <p>Enter your details</p>
                </div>
                <div className="cs-signup-cont">
                    <div className="cs-signup-box">
                        <label>Email Address</label>
                        <input placeholder="name@example.com" onChange={(e) => setCredentials({ ...credentials, email: (e.target.value).trim().toLowerCase() })} type="email" />
                    </div>
                    <div className="cs-signup-box">
                        <label>Password</label>
                        <input placeholder="..." onChange={(e) => { handlePasswordChange(e) }} type="password" />
                    </div>
                    <button className="collab-button" onClick={() => { handleLogin() }}>Submit</button>
                    <p>or</p>
                    <GoogleSignInButton className={'google-btn'} islogin={true} />
                </div>
                <ToastContainer theme="dark" />
            </div>)}
        </>
    );
}