import { useEffect, useState } from "react";
import './style.css';
import { X, PlusCircle, Trash2, SquarePlus, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Composio } from "composio-core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";
import { fetchApps } from "./utils";


const ToolsModal = () => {

    const { theme } = useTheme()

    const [apps, setApps] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            const apps = await fetchApps()
            setApps(apps);
            console.log('APPS:', apps);
        }
        fetchData();
    }, []);

    return (
        <div className="tools-body" style={{ backgroundColor: theme === "dark" ? "#0E1111" : "whitesmoke" }}>
            <button className="tools-close-btn" onClick={() => { window.location.hash = '' }}>
                <X size={20} /> Close
            </button>
            <ToastContainer theme="dark" />
        </div>
    );
};

export default ToolsModal;
