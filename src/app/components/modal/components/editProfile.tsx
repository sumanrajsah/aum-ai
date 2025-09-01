import React, { useState, useEffect } from 'react';
import './editProfile.css';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentUsername: string;
    onProfileUpdate?: (name: string, username: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    currentName,
    currentUsername,
    onProfileUpdate
}) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Initialize form with current values when modal opens
    useEffect(() => {
        if (isOpen) {
            setName(currentName);
            setUsername(currentUsername);
            setError('');
            setSuccess('');
        }
    }, [isOpen, currentName, currentUsername]);

    const resetModal = () => {
        setName(currentName);
        setUsername(currentUsername);
        setError('');
        setSuccess('');
        setLoading(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError('Name is required');
            return false;
        }

        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters long');
            return false;
        }

        if (!username.trim()) {
            setError('Username is required');
            return false;
        }

        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters long');
            return false;
        }

        // Username validation - only alphanumeric and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username.trim())) {
            setError('Username can only contain letters, numbers, and underscores');
            return false;
        }

        return true;
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        // Check if anything actually changed
        if (name.trim() === currentName && username.trim() === currentUsername) {
            setError('No changes detected');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: name.trim(),
                    username: username.trim()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Profile updated successfully!');

                // Call the callback if provided
                if (onProfileUpdate) {
                    onProfileUpdate(name.trim(), username.trim());
                }

                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setError(data.message || 'Failed to update profile');
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
                    <h2>Edit Profile</h2>
                    <button className="close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleUpdateProfile} className="form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                disabled={loading}
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                disabled={loading}
                                maxLength={30}
                            />
                            <small>Only letters, numbers, and underscores allowed</small>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="back-button"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;