"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChat, useWorkspace } from "@/context/ChatContext";
import { Trash2, UserPlus, Users, Calendar, Crown, Layers } from "lucide-react";
import "./style.css";
import axios from "axios";
import { useAlert } from "@/context/alertContext";
import { useRouter } from "next/navigation";

interface Workspace {
    wid: string;
    name: string;
    members?: Array<any>;
    owner_uid?: string;
    created_on?: { $date: string };
    updated_on?: { $date: string };
}

export default function WorkspacePage() {
    const { status, isAuthLoading, user } = useAuth();
    const router = useRouter();
    const [inviteEmail, setInviteEmail] = useState<string>("");
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const alert = useAlert();
    const { setMessages, setChatId, Model, chatMode } = useChat();
    const { workspaces, setCurrentWorkspace } = useWorkspace();
    const [loading, setLoading] = useState(false)

    const inviteUser = async (workspaceId: string, email: string) => {
        setLoading(true)
        try {
            console.log(`Inviting ${email} to workspace ${workspaceId}`);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/user/workspace/invite`,
                {
                    data: { wid: workspaceId, uid: user?.uid, email },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                alert.success(`Invitation sent to ${email}`);
                setInviteEmail("");
                setShowInviteModal(false);
                setLoading(false)
                router.push('/workspace')
            } else {
                alert.error("Failed to send invitation");
            }
        } catch (error) {
            console.error("Error inviting user:", error);
            alert.error("Error sending invitation");
            setLoading(false)
        }
    };

    const deleteWorkspace = async (workspaceId: string) => {
        setLoading(true)
        try {
            console.log(`Deleting workspace ${workspaceId}`);

            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/user/workspace/delete`,
                {
                    data: { wid: workspaceId, uid: user?.uid },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                alert.success("Workspace deleted successfully");
                setShowDeleteModal(false);
                setLoading(false)
                router.push('/workspace')
            } else {
                alert.error("Failed to delete workspace");
                setLoading(false)
            }
        } catch (error) {
            console.error("Error deleting workspace:", error);
            alert.error("Error deleting workspace");
            setLoading(false)
        }
    };

    const formatDate = (input?: any): string => {
        if (!input) return "N/A";

        let date: Date;

        if (typeof input === "number") {
            // Unix timestamp in ms
            date = new Date(input);
        } else {
            // ISO string
            date = new Date(input);
        }

        if (isNaN(date.getTime())) return "Invalid date";

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };



    const handleInvite = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        setShowInviteModal(true);
    };

    const handleDelete = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        setShowDeleteModal(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            action();
        }
    };

    if (isAuthLoading) {
        return (
            <div className="workspace-home">
                <div className="loading">Loading workspaces...</div>
            </div>
        );
    }
    if (!user?.uid) {
        return <div className="mcpserver-body">
            <p>You must be logged in to create a Workspace.</p>
        </div>
    }
    if (user?.plan === 'free') {
        return (
            <div className="workspace-home">
                <div className="loading">Workspace access not allowed on free plan </div>
            </div>
        )
    }

    return (
        <div className="workspace-home">
            <div className="workspace-home-header">
                <h1>My Workspaces</h1>
                <p>Manage your workspaces and collaborate with team members</p>
            </div>

            <div className="workspace-home-table-container">
                <table className="workspace-home-table" role="table">
                    <thead>
                        <tr>
                            <th scope="col">Workspace Name</th>
                            <th scope="col">Members</th>
                            <th scope="col">Created</th>
                            <th scope="col">Updated</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workspaces && workspaces.length > 0 ? (
                            workspaces.map((workspace: Workspace) => (
                                <tr key={workspace.wid} onClick={() => { router.push(`/workspace/${workspace.wid}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId(''); setCurrentWorkspace(workspace.wid) }}>
                                    <td data-label="Workspace Name">
                                        <div className="workspace-home-name">
                                            <Layers size={16} aria-hidden="true" />
                                            <span>{workspace.name}</span>
                                        </div>
                                    </td>
                                    <td data-label="Members">
                                        <div className="members-count">
                                            <Users size={14} aria-hidden="true" />
                                            <span>{workspace.members?.length || 0}</span>
                                        </div>
                                    </td>
                                    <td data-label="Created">
                                        <div className="date-cell">
                                            <Calendar size={14} aria-hidden="true" />
                                            <span>
                                                {workspace.created_on
                                                    ? formatDate(workspace.created_on)
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    <td data-label="Updated">
                                        <div className="date-cell">
                                            <Calendar size={14} aria-hidden="true" />
                                            <span>
                                                {workspace.updated_on
                                                    ? formatDate(workspace.updated_on)
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    {workspace.owner_uid && user?.uid === workspace.owner_uid && <td data-label="Actions">
                                        <div className="action-buttons">
                                            <button
                                                className="invite-btn"
                                                onClick={(e) => { handleInvite(workspace); e.stopPropagation() }}
                                                onKeyDown={(e) => handleKeyDown(e, () => { handleInvite(workspace) })}
                                                title="Invite User"
                                                aria-label={`Invite user to ${workspace.name}`}
                                            >
                                                <UserPlus size={16} aria-hidden="true" />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => { handleDelete(workspace); e.stopPropagation() }}
                                                onKeyDown={(e) => handleKeyDown(e, () => handleDelete(workspace))}
                                                title="Delete Workspace"
                                                aria-label={`Delete ${workspace.name} workspace`}
                                            >
                                                <Trash2 size={16} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="no-workspace-homes">
                                    No workspaces found. Create your first workspace to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invite User Modal */}
            {showInviteModal && (
                <div
                    className="modal-overlay"
                    onClick={(e) => e.target === e.currentTarget && setShowInviteModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="invite-modal-title"
                >
                    {loading ? <div className="modal-w">
                        Inviting...
                    </div> : <div className="modal-w">
                        <div className="modal-header">
                            <h3 id="invite-modal-title">
                                Invite User to {selectedWorkspace?.name}
                            </h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowInviteModal(false)}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <label htmlFor="invite-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="invite-email"
                                type="email"
                                placeholder="Enter email address"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="invite-input"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && inviteEmail && selectedWorkspace) {
                                        inviteUser(selectedWorkspace.wid, inviteEmail);
                                    }
                                }}
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowInviteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={() =>
                                    selectedWorkspace &&
                                    inviteUser(selectedWorkspace.wid, inviteEmail)
                                }
                                disabled={!inviteEmail}
                            >
                                Send Invitation
                            </button>
                        </div>
                    </div>}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal-overlay"
                    onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-modal-title"
                >
                    {loading ? <div className="modal-w">
                        Deleting...
                    </div> : <div className="modal-w">
                        <div className="modal-header">
                            <h3 id="delete-modal-title">Delete Workspace</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowDeleteModal(false)}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <p>
                                Are you sure you want to delete "{selectedWorkspace?.name}"?
                            </p>
                            <p className="warning-text">
                                This will permanently delete the workspace and all related data including chats,
                                messages, images, and videos created in this workspace.
                            </p>

                        </div>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-confirm-btn"
                                onClick={() =>
                                    selectedWorkspace && deleteWorkspace(selectedWorkspace.wid)
                                }
                            >
                                Delete Workspace
                            </button>
                        </div>
                    </div>}
                </div>
            )}
        </div>
    );
}