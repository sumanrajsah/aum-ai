import React, { useState, useEffect } from 'react';
import './deleteMemoryModal.css';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/alertContext';

interface DeleteMemoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    memoryTitle?: string;
    memory_id?: string;
    onMemoryDelete?: (memory_id: string) => void;
}

const DeleteMemoryModal: React.FC<DeleteMemoryModalProps> = ({
    isOpen,
    onClose,
    memoryTitle = "this memory",
    memory_id = "",
    onMemoryDelete
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const router = useRouter();
    const alert = useAlert();

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setError('');
            setConfirmText('');
            setLoading(false);
        }
    }, [isOpen]);

    const resetModal = () => {
        setError('');
        setConfirmText('');
        setLoading(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleDeleteMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate confirmation text
        if (confirmText.toLowerCase() !== 'forget') {
            setError('Please type "forget" to confirm');
            return;
        }

        if (!memory_id) {
            setError('Memory ID is missing');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/memory/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ memory_id }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                // Call the callback if provided
                if (onMemoryDelete) {
                    onMemoryDelete(memory_id);
                    alert.success('Memory Deleted')
                }

                handleClose();
            } else {
                setError(data.message || 'Failed to delete memory');
                alert.warn('Failed to delete memory')
            }
        } catch (error) {
            setError('Network error. Please try again.');
            alert.warn('Network error. Please try again.')
        } finally {
            router.refresh();
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay" onClick={handleClose}>
            <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="delete-modal-header">
                    <h2>Delete Memory</h2>
                    <button className="delete-close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>

                <div className="delete-modal-content">
                    {error && <div className="delete-error-message">{error}</div>}

                    <div className="delete-warning-section">
                        <div className="delete-warning-icon">⚠️</div>
                        <div className="delete-warning-content">
                            <h3>Are you sure you want to delete this memory?</h3>
                            <p>
                                You are about to permanently delete "<strong>{memoryTitle}</strong>".
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleDeleteMemory} className="delete-form">
                        <div className="delete-form-group">
                            <label htmlFor="confirmText">
                                Type <strong>"forget"</strong> to confirm:
                            </label>
                            <input
                                type="text"
                                id="confirmText"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Type 'forget' here"
                                required
                                disabled={loading}
                                autoComplete="off"
                            />
                        </div>

                        <div className="delete-button-group">
                            <button
                                type="button"
                                className="delete-cancel-button"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="delete-confirm-button"
                                disabled={loading || confirmText.toLowerCase() !== 'forget'}
                            >
                                {loading ? 'Deleting...' : 'forget Memory'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteMemoryModal;