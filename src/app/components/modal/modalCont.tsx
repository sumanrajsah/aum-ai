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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Add fade-in animation
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            window.location.hash = '';
        }, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div
            className={`modal-body ${isVisible ? 'modal-visible' : ''}`}
            onClick={handleBackdropClick}
        >
            <div className="modal-wrapper">
                <button
                    className="modal-close-btn"
                    onClick={handleClose}
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div className="modal-cont">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalCont;