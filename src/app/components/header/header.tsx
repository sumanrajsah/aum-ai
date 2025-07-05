'use client'
import React, { use, useEffect, useRef, useState } from "react"
import './header.css'
import { AlignLeft, CircleFadingPlus, Layers, PanelRightClose, User2 } from "lucide-react"
import ProfileCont from "./profile"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/useAuth"
import { useTheme } from "next-themes"
import Image from "next/image"
import Sidebar from "../sidebar/sidebar"
import WorkspaceCont from "./workspaceModal"
import { useChat, useWorkspace } from "../../../context/ChatContext"
import { useSidebarStore } from "@/store/useSidebarStore"



const Header = () => {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarStore();
    const router = useRouter()
    const { messages, aiTyping, setIsChatRoom, memoizedHistory, setMessages, selectModel, Model, setChatId, chatId, setHistory, chatMode } = useChat();
    const [openDisconnecModel, setOpenDisconnectModel] = useState<boolean>(false)
    const [openWorkspaceModel, setOpenWorkspaceModel] = useState<boolean>(false)
    const [workspaceName, setWorkspaceName] = useState<string>('');
    const pathname = usePathname()
    const { user, status } = useAuth()
    const modalRef = useRef<HTMLDivElement | null>(null);
    const { theme } = useTheme();
    const { workspaces, currentWorkspace } = useWorkspace();

    useEffect(() => {
        workspaces.find((workspace) => workspace.wid === currentWorkspace)?.name && setWorkspaceName(workspaces.find((workspace) => workspace.wid === currentWorkspace)?.name || '');
    }, [workspaces]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpenDisconnectModel(false);
                setOpenWorkspaceModel(false);
            }
        }

        if (openDisconnecModel || openWorkspaceModel) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDisconnecModel, openWorkspaceModel]);

    return (
        <>
            <div className={`header ${isSidebarOpen ? 'collapsed' : 'expanded'}`} onClick={async () => { setOpenDisconnectModel(false) }} >
                <div className="header-left-btn-cont">
                    {!isSidebarOpen && user && <button className="ham-btn" title="open" onClick={(e) => {
                        // e.stopPropagation()
                        toggleSidebar()
                    }}>
                        <AlignLeft size={20} />
                    </button>}
                    {user && <button className="select-workspace-btn" onClick={() => { setOpenWorkspaceModel(!openWorkspaceModel); setOpenDisconnectModel(false) }}>
                        <Layers size={20} /> {currentWorkspace === '' ? 'Aum Ai' : `${workspaceName}`}
                    </button>}
                    {user && <button className="ham-btn" onClick={() => { router.push(currentWorkspace === '' ? `/?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                        <CircleFadingPlus size={20} />
                    </button>}
                </div>
                {openWorkspaceModel && user && <div className="workspace-cont" ref={modalRef}>
                    <WorkspaceCont />
                </div>}
                {/* {pathname !== '/' && !pathname.startsWith('/c/') && <button onClick={() => router.push('/')} className="connect-button">Home</button>} */}
                <div className="btn-cont">
                    {pathname === '/agents/explorer' && user && <button onClick={() => router.push('/agents/create')} className="connect-button">Create</button>}
                    {pathname.startsWith('/agents/create') && <button onClick={() => router.push('/agents/explorer')} className="connect-button">Explore Agents</button>}

                    {!(user) ? <button className="connect-button"
                        onClick={() => {
                            router.push('/login')
                        }}
                    >Sign In</button> : <button className="account-button" onClick={async (e) => { e.stopPropagation(); setOpenDisconnectModel(true) }}>{user.image ? <Image className="avatar" src={user?.image as string} alt="t" height={50} width={50} /> : <User2 size={20} />}</button>}
                    {!(user) ? <button className="connect-button"
                        onClick={() => {
                            router.push('/signup')
                        }}
                    >Sign Up</button> : ""}
                </div>
                {openDisconnecModel && <div className="profile-cont" ref={modalRef} >
                    <ProfileCont />
                </div>}

            </div>
        </>
    )
}

export default Header;