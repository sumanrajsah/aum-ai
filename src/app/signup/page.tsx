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

type SignUpForm = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function CollabSignUp() {
    const [passwordStrength, setPasswordStrength] = useState<{ score: number, level: string }>({ score: 0, level: "Weak" });
    const [formData, setFormData] = useState<SignUpForm>({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
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

    // Email validation
    useEffect(() => {
        if (formData.email) {
            setEmailValid(validateEmail(formData.email));
        } else {
            setEmailValid(null);
        }
    }, [formData.email]);

    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "password" | "confirmPassword") => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        if (field === "password") {
            const strength = checkPasswordStrength(value);
            setPasswordStrength({ score: strength.score, level: strength.level });
        }

        // Clear password mismatch error when user starts typing
        if (field === "confirmPassword" || field === "password") {
            setFieldErrors(prev => ({ ...prev, passwordMismatch: "" }));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = "Please enter your name";
        }

        if (!formData.email) {
            errors.email = "Please enter your email address";
        } else if (!validateEmail(formData.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            errors.password = "Please enter a password";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        setLoading(true);

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
                    </div>

                    <form className="cs-signup-cont" onSubmit={handleSubmit}>
                        <div className="cs-signup-box">
                            <label>Full Name *</label>
                            <input
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, name: e.target.value }));
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
                            <label>Email Address *</label>
                            <input
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData(prev => ({
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
                            {formData.password && (
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
                                            <li style={{ color: formData.password.length >= 8 ? 'green' : '#666' }}>
                                                At least 8 characters
                                            </li>
                                            <li style={{ color: /[A-Z]/.test(formData.password) ? 'green' : '#666' }}>
                                                Uppercase letter
                                            </li>
                                            <li style={{ color: /[a-z]/.test(formData.password) ? 'green' : '#666' }}>
                                                Lowercase letter
                                            </li>
                                            <li style={{ color: /[0-9]/.test(formData.password) ? 'green' : '#666' }}>
                                                Number
                                            </li>
                                            <li style={{ color: /[^A-Za-z0-9]/.test(formData.password) ? 'green' : '#666' }}>
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
                                            formData.confirmPassword && formData.password === formData.confirmPassword ? '#44ff44' : '',
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
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
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
                                        !formData.email ||
                                        !formData.password ||
                                        !formData.confirmPassword ||
                                        formData.password !== formData.confirmPassword ||
                                        emailValid === false ||
                                        passwordStrength.level === "Weak"
                                    }
                                >
                                    Create Account
                                </button>
                            )}
                            {/* Google Sign In option */}
                            {!loading && (
                                <>
                                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                                            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                                            <span style={{ margin: '0 15px', color: '#666', fontSize: '0.9em' }}>or</span>
                                            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                                        </div>
                                    </div>
                                    <GoogleSignInButton islogin={false} />
                                </>
                            )}

                            <div style={{ textAlign: 'center', fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
                                <p>By creating an account, you agree to our <Link href="/term-and-condition" style={{ textDecoration: 'underline', color: 'blue' }}>Terms of Service</Link> and <Link href="/term-and-condition" style={{ textDecoration: 'underline', color: 'blue' }}>Privacy Policy</Link></p>
                            </div>
                        </div>
                    </form>

                </div>
            )}
        </>
    );
}