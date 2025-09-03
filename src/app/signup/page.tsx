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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [usernameChecking, setUsernameChecking] = useState(false);
    const [emailChecking, setEmailChecking] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [emailValid, setEmailValid] = useState<boolean | null>(null);

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

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateUsername = (username: string) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

    // Debounced username availability check
    useEffect(() => {
        const checkUsernameAvailability = async () => {
            if (userInfo.username.length >= 3 && validateUsername(userInfo.username)) {
                setUsernameChecking(true);
                try {
                    // Simulate API call - replace with actual endpoint
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/check-username`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: userInfo.username })
                    });
                    const data = await response.json();
                    console.log(data)
                    setUsernameAvailable(data.available);
                } catch (error) {
                    setUsernameAvailable(null);
                } finally {
                    setUsernameChecking(false);
                }
            } else {
                setUsernameAvailable(null);
            }
        };

        const timeoutId = setTimeout(checkUsernameAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [userInfo.username]);

    // Email validation
    useEffect(() => {
        if (credentials.email) {
            setEmailValid(validateEmail(credentials.email));
        } else {
            setEmailValid(null);
        }
    }, [credentials.email]);

    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "password" | "confirmPassword") => {
        const value = e.target.value;
        setCredentials(prev => ({ ...prev, [field]: value }));

        if (field === "password") {
            const strength = checkPasswordStrength(value);
            setPasswordStrength({ score: strength.score, level: strength.level });
        }

        // Clear password mismatch error when user starts typing
        if (field === "confirmPassword" || field === "password") {
            setFieldErrors(prev => ({ ...prev, passwordMismatch: "" }));
        }
    };

    const validateUserInfo = () => {
        const errors: { [key: string]: string } = {};

        if (!userInfo.name.trim()) {
            errors.name = "Please enter your name";
        }

        if (!userInfo.username.trim()) {
            errors.username = "Please enter a username";
        } else if (!validateUsername(userInfo.username)) {
            errors.username = "Username must be 3-20 characters and contain only letters, numbers, and underscores";
        } else if (usernameAvailable === false) {
            errors.username = "This username is already taken";
        }

        if (!userInfo.dateOfBirth) {
            errors.dateOfBirth = "Please select your date of birth";
        } else {
            // Check if user is at least 13 years old
            const today = new Date();
            const birthDate = new Date(userInfo.dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 13) {
                errors.dateOfBirth = "You must be at least 13 years old to create an account";
            }
        }

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            alert.warn(firstError);
            return false;
        }

        return true;
    };

    const validateCredentials = () => {
        const errors: { [key: string]: string } = {};

        if (!credentials.email) {
            errors.email = "Please enter your email address";
        } else if (!validateEmail(credentials.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!credentials.password) {
            errors.password = "Please enter a password";
        } else if (credentials.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        }

        if (!credentials.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (credentials.password !== credentials.confirmPassword) {
            errors.passwordMismatch = "Passwords do not match";
        }

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            alert.warn(firstError);
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
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.message === "success") {
                alert.success("Account created successfully! Please check your email to verify your account.");
                location.href = "/login";
            } else {
                alert.warn(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            alert.warn("An error occurred during signup. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const { user, status, isAuthLoading } = useAuth();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const goToPreviousStep = () => {
        setCurrentStep(1);
        setFieldErrors({});
    };

    // Get current year for date input max
    const currentYear = new Date().getFullYear();
    const minDate = `${currentYear - 100}-01-01`;
    const maxDate = `${currentYear - 13}-12-31`;

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
                        Already have an account? Login
                    </button>

                    <div className="cs-heading">
                        <Image src={'/sitraone.png'} height={50} width={50} alt="sitraone" />
                        <br />
                        <h1>Create an account</h1>
                        <p>Step {currentStep} of 2</p>
                        <div style={{ width: '100%', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', marginTop: '10px' }}>
                            <div
                                style={{
                                    width: `${(currentStep / 2) * 100}%`,
                                    height: '100%',
                                    backgroundColor: '#007bff',
                                    borderRadius: '2px',
                                    transition: 'width 0.3s ease'
                                }}
                            />
                        </div>
                    </div>

                    {/* Step 1: User Information */}
                    {currentStep === 1 && (
                        <form className="cs-signup-cont" onSubmit={handleStepOneSubmit}>
                            <div className="cs-signup-box">
                                <label>Full Name *</label>
                                <input
                                    placeholder="Enter your full name"
                                    value={userInfo.name}
                                    onChange={(e) => {
                                        setUserInfo(prev => ({ ...prev, name: e.target.value }));
                                        setFieldErrors(prev => ({ ...prev, name: "" }));
                                    }}
                                    type="text"
                                    style={{ borderColor: fieldErrors.name ? '#ff4444' : '' }}
                                />
                                {fieldErrors.name && (
                                    <p style={{ color: '#ff4444', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>

                            <div className="cs-signup-box">
                                <label>Username *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        placeholder="Choose a username (3-20 characters)"
                                        value={userInfo.username}
                                        onChange={(e) => {
                                            setUserInfo(prev => ({
                                                ...prev,
                                                username: e.target.value.trim().toLowerCase()
                                            }));
                                            setFieldErrors(prev => ({ ...prev, username: "" }));
                                        }}
                                        type="text"
                                        style={{
                                            borderColor: fieldErrors.username ? '#ff4444' :
                                                usernameAvailable === false ? '#ff4444' :
                                                    usernameAvailable === true ? '#44ff44' : '',
                                            paddingRight: '35px'
                                        }}
                                    />
                                    {usernameChecking && (
                                        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                                            <Oval height="16" width="16" color="gray" />
                                        </div>
                                    )}
                                    {!usernameChecking && usernameAvailable === true && (
                                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#44ff44' }}>
                                            ✓
                                        </span>
                                    )}
                                    {!usernameChecking && usernameAvailable === false && (
                                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ff4444' }}>
                                            ✗
                                        </span>
                                    )}
                                </div>
                                {fieldErrors.username && (
                                    <p style={{ color: '#ff4444', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        {fieldErrors.username}
                                    </p>
                                )}
                                {!fieldErrors.username && usernameAvailable === false && (
                                    <p style={{ color: '#ff4444', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        Username is already taken
                                    </p>
                                )}
                            </div>

                            <div className="cs-signup-box">
                                <label>Date of Birth *</label>
                                <input
                                    value={userInfo.dateOfBirth}
                                    onChange={(e) => {
                                        setUserInfo(prev => ({ ...prev, dateOfBirth: e.target.value }));
                                        setFieldErrors(prev => ({ ...prev, dateOfBirth: "" }));
                                    }}
                                    type="date"
                                    min={minDate}
                                    max={maxDate}
                                    style={{ borderColor: fieldErrors.dateOfBirth ? '#ff4444' : '' }}
                                />
                                {fieldErrors.dateOfBirth && (
                                    <p style={{ color: '#ff4444', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        {fieldErrors.dateOfBirth}
                                    </p>
                                )}
                                <p style={{ fontSize: '0.8em', color: '#666', margin: '5px 0 0 0' }}>
                                    You must be at least 13 years old
                                </p>
                            </div>

                            <button
                                className="collab-button"
                                type="submit"
                                disabled={!!usernameChecking || (!!userInfo.username && usernameAvailable === false)}
                            >
                                {usernameChecking ? "Checking..." : "Next"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Credentials */}
                    {currentStep === 2 && (
                        <form className="cs-signup-cont" onSubmit={handleFinalSubmit}>
                            <button
                                className="collab-button"
                                onClick={goToPreviousStep}
                                type="button"
                                style={{ width: "100%", marginBottom: "15px" }}
                            >
                                ← Back to User Info
                            </button>

                            <div className="cs-signup-box">
                                <label>Email Address *</label>
                                <input
                                    placeholder="name@example.com"
                                    value={credentials.email}
                                    onChange={(e) => {
                                        setCredentials(prev => ({
                                            ...prev,
                                            email: e.target.value.trim().toLowerCase()
                                        }));
                                        setFieldErrors(prev => ({ ...prev, email: "" }));
                                    }}
                                    type="email"
                                    style={{
                                        borderColor: fieldErrors.email ? '#ff4444' :
                                            emailValid === false ? '#ff4444' :
                                                emailValid === true ? '#44ff44' : ''
                                    }}
                                />
                                {fieldErrors.email && (
                                    <p style={{ color: '#ff4444', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            <div className="cs-signup-box">
                                <label>Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        placeholder="Enter a strong password"
                                        onChange={(e) => handlePasswordChange(e, "password")}
                                        type={showPassword ? "text" : "password"}
                                        style={{
                                            borderColor: fieldErrors.password ? '#ff4444' : '',
                                            paddingRight: '40px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#666'
                                        }}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <p style={{ color: '#ff4444', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        {fieldErrors.password}
                                    </p>
                                )}
                                {credentials.password && (
                                    <div style={{ marginTop: '8px' }}>
                                        <p style={{
                                            fontSize: "0.9em",
                                            color: passwordStrength.level === "Strong" ? "green" :
                                                passwordStrength.level === "Medium" ? "orange" : "red",
                                            margin: '0 0 5px 0'
                                        }}>
                                            Strength: {passwordStrength.level}
                                        </p>
                                        <div style={{ fontSize: '0.8em', color: '#666' }}>
                                            <p style={{ margin: 0 }}>Password should contain:</p>
                                            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                                <li style={{ color: credentials.password.length >= 8 ? 'green' : '#666' }}>
                                                    At least 8 characters
                                                </li>
                                                <li style={{ color: /[A-Z]/.test(credentials.password) ? 'green' : '#666' }}>
                                                    Uppercase letter
                                                </li>
                                                <li style={{ color: /[a-z]/.test(credentials.password) ? 'green' : '#666' }}>
                                                    Lowercase letter
                                                </li>
                                                <li style={{ color: /[0-9]/.test(credentials.password) ? 'green' : '#666' }}>
                                                    Number
                                                </li>
                                                <li style={{ color: /[^A-Za-z0-9]/.test(credentials.password) ? 'green' : '#666' }}>
                                                    Special character
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="cs-signup-box">
                                <label>Confirm Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        placeholder="Re-enter your password"
                                        onChange={(e) => handlePasswordChange(e, "confirmPassword")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        style={{
                                            borderColor: fieldErrors.confirmPassword || fieldErrors.passwordMismatch ? '#ff4444' :
                                                credentials.confirmPassword && credentials.password === credentials.confirmPassword ? '#44ff44' : '',
                                            paddingRight: '40px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#666'
                                        }}
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {(fieldErrors.confirmPassword || fieldErrors.passwordMismatch) && (
                                    <p style={{ color: '#ff4444', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        {fieldErrors.confirmPassword || fieldErrors.passwordMismatch}
                                    </p>
                                )}
                                {credentials.confirmPassword && credentials.password === credentials.confirmPassword && (
                                    <p style={{ color: 'green', fontSize: '0.8em', margin: '5px 0 0 0' }}>
                                        ✓ Passwords match
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '20px' }}>
                                {loading ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
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
                                    </div>
                                ) : (
                                    <button
                                        className="collab-button"
                                        type="submit"
                                        disabled={
                                            !credentials.email ||
                                            !credentials.password ||
                                            !credentials.confirmPassword ||
                                            credentials.password !== credentials.confirmPassword ||
                                            emailValid === false ||
                                            passwordStrength.level === "Weak"
                                        }
                                    >
                                        Create Account
                                    </button>
                                )}

                                <div style={{ textAlign: 'center', fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
                                    <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Add Google Sign In option */}
                    {currentStep === 2 && !loading && (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                                <span style={{ margin: '0 15px', color: '#666', fontSize: '0.9em' }}>or</span>
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}