import React, { useState } from 'react';
import './changePassword.css';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, userEmail }) => {
    const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const resetModal = () => {
        setStep('email');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setLoading(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep('otp');
                setSuccess('OTP sent to your email successfully!');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep('password');
                setSuccess('OTP verified successfully!');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password changed successfully!');
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setError(data.message || 'Failed to change password');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Change Password</h2>
                    <button className="close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    {step === 'email' && (
                        <form onSubmit={handleSendOTP} className="form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={userEmail}
                                    readOnly
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="submit-button" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="form">
                            <div className="form-group">
                                <label htmlFor="otp">Enter OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    required
                                    disabled={loading}
                                />
                                <small>Check your email for the OTP code</small>
                            </div>
                            <div className="button-group">
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={() => setStep('email')}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button type="submit" className="submit-button" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'password' && (
                        <form onSubmit={handleChangePassword} className="form">
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    minLength={8}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    minLength={8}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="button-group">
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={() => setStep('otp')}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button type="submit" className="submit-button" disabled={loading}>
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;