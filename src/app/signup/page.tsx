"use client"
import React, { use, useEffect } from "react";
import Image from 'next/image'
import './style.css'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';

import { Oval } from "react-loader-spinner";
import GoogleSignInButton from "../components/GSB";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "@/context/alertContext";

type SignUpForm = {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}
export default function CollabSignUp() {
    const [formData, setFormData] = React.useState<SignUpForm>({
        email: "",
        password: "",
        name: "",
        confirmPassword: ""
    });
    const router = useRouter();
    const alert = useAlert();

    const bufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };
    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "password" | "confirmPassword") => {
        if ("password" === field) {
            const encodedPassword = new TextEncoder().encode(e.target.value);
            const hashBuffer = await window.crypto.subtle.digest("SHA-512", encodedPassword);
            const hashedPassword = bufferToHex(hashBuffer);
            // console.log(hashedPassword);
            setFormData(prev => ({ ...prev, password: hashedPassword }));
        }
        else {
            const encodedPassword = new TextEncoder().encode(e.target.value);
            const hashBuffer = await window.crypto.subtle.digest("SHA-512", encodedPassword);
            const hashedPassword = bufferToHex(hashBuffer);
            // console.log(hashedPassword);
            setFormData(prev => ({ ...prev, confirmPassword: hashedPassword }));
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        if (!formData.email || !formData.password || !formData.name) {
            alert.warn("Please fill all the fields")
            return
        }
        if (formData.password !== formData.confirmPassword) {
            alert.warn("Passwords do not match")
            return;
        }
        e.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data)
        if (data.message === "success") {


            router.push("/login");

        }
        else {
            alert.warn("User already exists")
        }
    }

    const { user, status, isAuthLoading } = useAuth()
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/login");
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
                <button className="collab-sbutton" onClick={() => { router.push('/login') }} style={{ width: "auto" }}>Login</button>
                <div className="cs-heading">
                    <Image src={'/sitraone.png'} height={50} width={50} alt="sitraone" />
                    <br />
                    <h1>Create an account</h1>
                    <p>Enter your details</p>
                </div>
                <div className="cs-signup-cont" >
                    <div className="cs-signup-box">
                        <label>Name</label>
                        <input
                            placeholder="0xXplorer Ai"
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            type="text"
                        />
                    </div>
                    <div className="cs-signup-box">
                        <label>Email Address</label>
                        <input placeholder="name@example.com" onChange={(e) => setFormData(prev => ({ ...prev, email: (e.target.value).trim().toLowerCase() }))} type="email" />
                    </div>
                    <div className="cs-signup-box">
                        <label>Password</label>
                        <input placeholder="..." onChange={(e) => handlePasswordChange(e, "password")} type="password" />
                    </div>
                    <div className="cs-signup-box">
                        <label>Confirm Password</label>
                        <input placeholder="..." type="password" onChange={(e) => handlePasswordChange(e, "confirmPassword")} />
                    </div>
                    <button className="collab-button" onClick={handleSubmit} type="submit">Submit</button>
                    <p>or</p>
                    <GoogleSignInButton className={'google-btn'} islogin={false} />
                </div>
                <ToastContainer theme="dark" />
            </div>)}
        </>
    );
}