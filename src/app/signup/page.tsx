"use client"
import React, { use, useEffect, useState } from "react";
import Image from 'next/image'
import './style.css'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';

import { Oval } from "react-loader-spinner";
import GoogleSignInButton from "../components/GSB";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "@/context/alertContext";

type UserInfoForm = {
    name: string;
    username: string;
    dateOfBirth: string;
}

type CredentialsForm = {
    email: string;
    password: string;
    confirmPassword: string;
}

type SignUpForm = UserInfoForm & CredentialsForm;

export default function CollabSignUp() {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [passwordStrength, setPasswordStrength] = useState<{ score: number, level: string }>({ score: 0, level: "Weak" });
    const [userInfo, setUserInfo] = useState<UserInfoForm>({
        name: "",
        username: "",
        dateOfBirth: ""
    });
    const [credentials, setCredentials] = useState<CredentialsForm>({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const alert = useAlert();

    const bufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };
    const checkPasswordStrength = (password: string) => {
        const minLength = /.{8,}/;             // at least 8 chars
        const upper = /[A-Z]/;                 // uppercase
        const lower = /[a-z]/;                 // lowercase
        const number = /[0-9]/;                // digit
        const special = /[^A-Za-z0-9]/;        // special char

        const passed = [
            minLength.test(password),
            upper.test(password),
            lower.test(password),
            number.test(password),
            special.test(password),
        ];

        const score = passed.filter(Boolean).length;

        let level = "Weak";
        if (score >= 4) level = "Strong";
        else if (score === 3) level = "Medium";

        return { score, level, passed };
    };


    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "password" | "confirmPassword") => {
        const encodedPassword = new TextEncoder().encode(e.target.value);
        const hashBuffer = await window.crypto.subtle.digest("SHA-512", encodedPassword);
        const hashedPassword = bufferToHex(hashBuffer);

        setCredentials(prev => ({ ...prev, [field]: e.target.value }));
        if (field === "password") {
            const strength = checkPasswordStrength(e.target.value);
            setPasswordStrength({ score: strength.score, level: strength.level });
        }
    };

    const validateUserInfo = () => {
        if (!userInfo.name.trim()) {
            alert.warn("Please enter your name");
            return false;
        }
        if (!userInfo.username.trim()) {
            alert.warn("Please enter a username");
            return false;
        }
        if (!userInfo.dateOfBirth) {
            alert.warn("Please select your date of birth");
            return false;
        }

        // Check if user is at least 13 years old
        const today = new Date();
        const birthDate = new Date(userInfo.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 13) {
            alert.warn("You must be at least 13 years old to create an account");
            return false;
        }

        return true;
    };

    const validateCredentials = () => {
        if (!credentials.email || !credentials.password) {
            alert.warn("Please fill all the fields");
            return false;
        }
        console.log(credentials)
        if (credentials.password !== credentials.confirmPassword) {
            alert.warn("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleStepOneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateUserInfo()) {
            setCurrentStep(2);
        }
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateCredentials()) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const formData: SignUpForm = {
            ...userInfo,
            ...credentials
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.message === "success") {
                setLoading(false);
                router.push("/login");
            } else {
                alert.warn("User already exists or signup failed");
                setLoading(false);
            }
        } catch (error) {
            alert.warn("An error occurred during signup");
            setLoading(false);
        }
    };

    const { user, status, isAuthLoading } = useAuth();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/login");
        }
    }, [status]);

    const goToPreviousStep = () => {
        setCurrentStep(1);
    };

    return (
        <>
            {isAuthLoading ? (
                <div className="collab-sbody">
                    <Oval
                        visible={true}
                        height="50"
                        width="50"
                        color="gray"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        secondaryColor="gray"
                    />
                    <p>Loading...</p>
                </div>
            ) : status === "authenticated" ? (
                <div className="collab-sbody">
                    <h1>✅</h1>
                    <h1>Authenticated</h1>
                    <p>Redirecting to dashboard...</p>
                </div>
            ) : (
                <div className="collab-sbody">
                    <button
                        className="collab-sbutton"
                        onClick={() => { router.push('/login') }}
                        style={{ width: "auto" }}
                    >
                        Login
                    </button>

                    <div className="cs-heading">
                        <Image src={'/sitraone.png'} height={50} width={50} alt="sitraone" />
                        <br />
                        <h1>Create an account</h1>
                        <p>Step {currentStep} of 2</p>
                    </div>

                    {/* Step 1: User Information */}
                    {currentStep === 1 && (
                        <div className="cs-signup-cont">
                            <div className="cs-signup-box">
                                <label>Full Name</label>
                                <input
                                    placeholder="Enter your full name"
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                                    type="text"
                                />
                            </div>
                            <div className="cs-signup-box">
                                <label>Username</label>
                                <input
                                    placeholder="Choose a username"
                                    value={userInfo.username}
                                    onChange={(e) => setUserInfo(prev => ({
                                        ...prev,
                                        username: e.target.value.trim().toLowerCase()
                                    }))}
                                    type="text"
                                />
                            </div>
                            <div className="cs-signup-box">
                                <label>Date of Birth</label>
                                <input
                                    value={userInfo.dateOfBirth}
                                    onChange={(e) => setUserInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                    type="date"
                                />
                            </div>
                            <button
                                className="collab-button"
                                onClick={handleStepOneSubmit}
                                type="button"
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Step 2: Credentials */}
                    {currentStep === 2 && (
                        <div className="cs-signup-cont">
                            <button
                                className="collab-button"
                                onClick={goToPreviousStep}
                                type="button"
                                style={{ width: "100%" }}
                            >
                                Back to User Info
                            </button>
                            <div className="cs-signup-box">
                                <label>Email Address</label>
                                <input
                                    placeholder="name@example.com"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials(prev => ({
                                        ...prev,
                                        email: e.target.value.trim().toLowerCase()
                                    }))}
                                    type="email"
                                />
                            </div>
                            <div className="cs-signup-box">
                                <label>Password</label>
                                <input
                                    placeholder="Enter a strong password"
                                    onChange={(e) => handlePasswordChange(e, "password")}
                                    type="password"
                                />
                                {credentials.password && (
                                    <p style={{ fontSize: "0.9em", color: passwordStrength.level === "Strong" ? "green" : passwordStrength.level === "Medium" ? "orange" : "red" }}>
                                        Strength: {passwordStrength.level}
                                    </p>
                                )}
                            </div>
                            <div className="cs-signup-box">
                                <label>Confirm Password</label>
                                <input
                                    placeholder="Re-enter your password"
                                    onChange={(e) => handlePasswordChange(e, "confirmPassword")}
                                    type="password"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>


                                {loading ? (
                                    <>
                                        <Oval
                                            visible={true}
                                            height="20"
                                            width="20"
                                            color="gray"
                                            ariaLabel="oval-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            secondaryColor="gray"
                                        />
                                        <p>Creating Account...</p>
                                    </>
                                ) : (
                                    <button
                                        className="collab-button"
                                        onClick={handleFinalSubmit}
                                        type="submit"
                                    >
                                        Create Account
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}