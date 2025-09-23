import { useEffect, useState } from "react";
import './login.css';
import { X, PlusCircle, Trash2, SquarePlus, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Composio } from "composio-core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";
import ModalCont from "../modal/modalCont";
import SelectMcpButton from "../mcpComp/selectmcp";
import SelectToolButton from "../toolComp/toolmodal";
import { useChat, useMcpServer } from "@/context/ChatContext";

const LoginModal = () => {
    const { theme } = useTheme()
    const { selectedServers } = useMcpServer();
    const { tools } = useChat();

    const [apps, setApps] = useState<any[]>([]);

    return (
        <ModalCont closeBtn={false}>
            <div className="login-modal">
                <h3>Login to unlock more features</h3>
                <div className="login-modal-buttons">
                    <button onClick={() => { location.href = '/login' }}>Login</button>
                    <button onClick={() => { location.href = '/signup' }}>SignUp</button>
                    <button onClick={() => { location.href = '#' }}>Stay Logout</button>
                </div>
            </div>
        </ModalCont>
    );
};

export default LoginModal;