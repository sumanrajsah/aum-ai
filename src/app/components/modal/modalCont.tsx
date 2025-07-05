import { Children, useEffect, useRef, useState } from "react";
import './style.css'
import { BrainCircuit, Layers, LogOut, Pickaxe, PlusCircle, Server, Settings, Telescope, User2, Wrench, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "next-themes";
import { useAuth } from "../../../hooks/useAuth";
import { useAlert } from "../../../context/alertContext";


import { ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
}

const ModalCont = ({ children }: ModalProps) => {
    const router = useRouter();
    const { theme } = useTheme();
    const { user } = useAuth()
    const alertMessage = useAlert()
    const [workspaceName, setWorkspaceName] = useState("");



    return (
        <div className="modal-body">
            <div className="modal-cont">
                <button className="modal-close-btn" onClick={() => { window.location.hash = '' }}>
                    <X size={20} />
                </button>
                {children}

            </div>

        </div>
    );
};

export default ModalCont;
