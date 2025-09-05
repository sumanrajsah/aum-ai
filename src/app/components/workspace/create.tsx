import { useEffect, useRef, useState } from "react";
import './style.css'
import { BrainCircuit, Layers, LogOut, Pickaxe, PlusCircle, Server, Settings, Telescope, User2, Wrench, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "next-themes";
import { useAuth } from "../../../hooks/useAuth";
import { useAlert } from "../../../context/alertContext";
import Modal from "../modal/modalCont";



const WorkspaceCreateModal = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const { user } = useAuth()
    const alertMessage = useAlert()
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceDescription, setWorkspaceDescription] = useState("");


    const handleCreateWorkspace = async () => {
        try {
            if (!workspaceName) {
                alertMessage.warn("Please enter a workspace name.");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/workspace/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: workspaceName, description: workspaceDescription, uid: user?.uid }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                alertMessage.error(errorData.message || "Failed to create workspace.");
                return;
            }

            //const data = await response.json();
            alertMessage.success("Workspace created successfully!");

            location.href = '/workspace'

        } catch (error) {
            console.error("Error creating workspace:", error);
            alertMessage.warn("Please try again later.");
        }
    }
    if (user?.plan === 'free') {
        return (
            <Modal>
                <h2 className="wcreate-title">Upgrade Required</h2>
                <p className="wcreate-description">You need to upgrade your plan to create a workspace.</p>
                <button className="wcreate-btn" onClick={() => { router.push('/plan') }}>Upgrade Now</button>
            </Modal>
        );
    }

    return (
        <Modal>
            <h2 className="wcreate-title">Create Workspace</h2>
            <div className="wcreate-input-group">
                <label className="wcreate-label">Workspace Name</label>
                <input type="text" id="workspace-name" className="wcreate-input" placeholder="Name..." onChange={(e) => { setWorkspaceName(e.target.value) }} />
            </div>
            <div className="wcreate-input-group">
                <label className="wcreate-label">Description</label>
                <input type="text" id="workspace-description" className="wcreate-input" placeholder="Description..." onChange={(e) => { setWorkspaceDescription(e.target.value) }} />
            </div>
            <button className="wcreate-btn" onClick={handleCreateWorkspace}>Create</button>

        </Modal>
    );
};

export default WorkspaceCreateModal;
