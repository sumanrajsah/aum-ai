import { use, useEffect, useRef, useState } from "react";
import './style.css'
import { BrainCircuit, Layers, LogOut, Pickaxe, PlusCircle, Server, Settings, Telescope, User2, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "next-themes";
import { useAuth } from "../../../hooks/useAuth";
import { useAlert } from "../../../context/alertContext";
import { set } from "lodash";
import { useChat, useWorkspace } from "../../../context/ChatContext";

type Workspace = {
    name: string;
    wid: string;
}


const WorkspaceCont = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const { user } = useAuth()
    const alertMessage = useAlert()
    const { setMessages, setChatId, Model, chatMode } = useChat();
    const { workspaces, setCurrentWorkspace } = useWorkspace();



    return (
        <div className="workspace-body">
            <button className="workspace-btn" onClick={() => { router.push(`/?model=${Model}&mode=${chatMode}`); setCurrentWorkspace(''); setMessages([]); setChatId('') }}>
                <User2 size={14} />AUM AI
            </button>
            {workspaces.map((workspace: Workspace) => (
                <button className="workspace-btn" key={workspace.wid} onClick={() => { router.push(`/workspace/${workspace.wid}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId(''); setCurrentWorkspace(workspace.wid) }}>
                    <Layers size={14} />{workspace.name}
                </button>
            ))}

            <hr />
            <button className="workspace-btn" onClick={() => { location.href = '#workspace/create' }}><Settings size={14} />Settings</button>
            <button className="workspace-btn" onClick={() => { location.href = '#workspace/create' }}><PlusCircle size={14} />Create</button>

        </div>
    );
};

export default WorkspaceCont;
