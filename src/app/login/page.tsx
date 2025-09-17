"use client"
import React, { useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(false)
    const bufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };
    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(hashedPassword);
        setCredentials(prev => ({ ...prev, password: e.target.value }));

    };

    async function handleLogin() {
        setLoading(true)
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
            setLoading(false)
            location.href = "/";
        } else {
            setLoading(false)
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
                <h1>Authenticated</h1>
                <p>Redirecting to dashboard...</p>
            </div> : <div className="collab-sbody">
                <button className="collab-sbutton" onClick={() => { router.push('/signup') }} style={{ width: "auto" }}>Create an account</button>
                <div className="cs-heading">
                    <Image src={'/sitraone.png'} height={50} width={50} alt="sitraone" />
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
                    {loading ? <><Oval
                        visible={true}
                        height="20"
                        width="20"
                        color="gray"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        secondaryColor="gray"
                    /><p>Wait...</p></> : <button className="collab-button" onClick={handleLogin} type="submit">Submit</button>}
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '20px', width: '100%' }}>
                        {!loading && (
                            <>
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                                        <span style={{ margin: '0 15px', color: '#666', fontSize: '0.9em' }}>or</span>
                                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                                    </div>
                                </div>
                                <GoogleSignInButton islogin={true} className="google-signup-button" />
                            </>
                        )}
                    </div>
                </div>
            </div>)}
        </>
    );
}