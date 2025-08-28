'use client'
import React, { useCallback, useEffect, useRef, useState } from "react"
import '../../style.css'
import './style.css'
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/useAuth"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Archive, BrainCircuit, ChevronDown, ChevronRight, ImagePlay, Images, Layers, MessagesSquare, Moon, PanelLeft, Play, Plus, PlusCircle, ScrollText, Search, Image as Limage, EllipsisVertical, MessageSquare, PenLine, Rocket, SquarePen, User, UserPlus } from "lucide-react"
import { useChat, useWorkspace } from "../../../context/ChatContext"
import axios from "axios"
import SidebarButton from "./sidebarbutton"
import { useAlert } from "../../../context/alertContext"
import { useSidebarStore } from "@/store/useSidebarStore"
import { useHistoryBarStore } from "@/store/useHistorybarStore"
import ProfileCont from "./profile"



const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarStore();
    const { isHistoryBarOpen, toggleHistoryBar, closeHistoryBar } = useHistoryBarStore()
    const router = useRouter();
    const { messages, aiTyping, setIsChatRoom, memoizedHistory, setMessages, selectModel, Model, setChatId, chatId, setHistory, chatMode } = useChat();
    const { currentWorkspace, setCurrentWorkspace, workspaces } = useWorkspace();
    // console.log(memoizedHistory)
    const [activeMenuChatId, setActiveMenuChatId] = useState<string | null>(null);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const { user, status } = useAuth()
    const { theme, setTheme, systemTheme } = useTheme();
    const alertMessage = useAlert()
    const SidebarRef = useRef<HTMLDivElement | null>(null);
    const [isWorkspaceExpannd, setWorkspaceExpand] = useState(false)
    const [isAgentExpannd, setAgentExpand] = useState(false)
    const [isStudioExpannd, setStudioExpand] = useState(true)
    const [openProfileModal, setProfileModal] = useState(false)
    const modalRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (SidebarRef.current && !SidebarRef.current.contains(event.target as Node)) {

                if (innerWidth <= 1000) {
                    closeSidebar();
                }
            }
        }

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setProfileModal(false)
            }
        }

        if (openProfileModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openProfileModal]);


    function toggleDropdown(type: string) {
        if (type === 'agent') {
            setAgentExpand(!isAgentExpannd)
            setWorkspaceExpand(false)
        }
        if (type === 'workspace') {
            setAgentExpand(false)
            setWorkspaceExpand(!isWorkspaceExpannd)
        }
    }
    const getUserInitials = (name: string | undefined) => {
        if (!name) return 'U';

        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }

        const firstInitial = nameParts[0].charAt(0).toUpperCase();
        const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

        return firstInitial + lastInitial;
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <>
            {isSidebarOpen && <div className="sidebar" onClick={() => { setActiveMenuChatId('') }} ref={SidebarRef}>
                <div className="slogo-cont" >
                    <Image src="/sitraone.png" onClick={() => { router.push('/'); setMessages([]); }} alt="0xXplorer" width={30} height={30} priority />
                    <h3 className="slogo-text">AUM AI</h3>
                    <SidebarButton className="sidebar-button-2 close-sidebar" style={{ cursor: 'w-resize' }} data-tooltip="Close Sidebar" onClick={() => { toggleSidebar() }}>
                        <PanelLeft size={20} />
                    </SidebarButton >
                </div>
                <div className="sidebar-2-top-cont" onClick={(e) => { e.stopPropagation() }}>


                    <SidebarButton className="sidebar-button" onClick={() => { router.push(currentWorkspace === '' ? `/?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                        <SquarePen size={20} />New Chat
                    </SidebarButton >
                    <SidebarButton className="sidebar-button" onClick={() => { router.push('/create') }}>
                        <PlusCircle size={20} />Create
                    </SidebarButton >
                    <SidebarButton className="sidebar-button" data-tooltip={'chats'} onClick={() => { toggleHistoryBar() }}>
                        <MessagesSquare size={20} /> Chats
                    </SidebarButton>
                    <SidebarButton className="sidebar-button" onClick={() => { router.push('/store') }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        </svg>

                        AUM Store</SidebarButton>
                    <div className="sidebar-dropdown-cont">
                        <button className="dropdown-list" onClick={() => { router.push('/store/publish') }}> <Rocket size={16} /> Publish</button>
                        <button className="dropdown-list" onClick={() => { router.push('/store/profile') }}> <User size={16} /> Profile</button>
                        <button className="dropdown-list" onClick={() => { router.push('/store/agents') }}> <BrainCircuit size={16} /> AI Agents</button>
                        <button className="dropdown-list" onClick={() => { router.push('/store/mcp') }}>    <svg fill="currentColor" height="20px" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z"></path><path d="M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z"></path></svg> MCPs</button>
                        <button className="dropdown-list" onClick={() => { router.push('/store/prompts') }} >  <MessageSquare size={16} /> Prompts</button>
                    </div>
                    <SidebarButton className="sidebar-button" onClick={() => { window.location.href = (currentWorkspace === '' ? `/?model=dalle-3&mode=image` : `/workspace/${currentWorkspace}?model=dalle-3&mode=image`); setMessages([]); setChatId("") }}>
                        <ImagePlay size={16} />AI Media Studio
                    </SidebarButton >
                    <div className="sidebar-dropdown-cont">
                        <button className="dropdown-list" onClick={() => { router.push(currentWorkspace === '' ? `/image-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/image-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}> <Limage size={16} /> Image</button>
                        <button className="dropdown-list" onClick={() => { router.push(currentWorkspace === '' ? `/video-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/video-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>  <Play size={16} /> Video</button>
                    </div>
                    {user?.plan !== 'free' && <SidebarButton className="sidebar-button" data-tooltip={'history'} onClick={() => toggleDropdown('workspace')}>
                        <Layers size={20} /> Workspaces <span className="expand-sidebar-icon">{isWorkspaceExpannd ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                    </SidebarButton>}
                    {isWorkspaceExpannd && <div className="sidebar-dropdown-cont">
                        <button className="dropdown-list" onClick={() => { location.href = '#workspace/create' }}><Plus size={14} />Create</button>
                        <button className="dropdown-list" onClick={() => { router.push(`/workspace/invite`) }}>
                            <UserPlus size={14} />Invites
                        </button>
                        <button className="dropdown-list" onClick={() => { router.push(`/workspace`); setCurrentWorkspace(''); setMessages([]); setChatId('') }}>
                            <Layers size={14} />Workspace Home
                        </button>
                        <hr />
                        {workspaces.map((workspace: Workspace) => (
                            <button className="dropdown-list" key={workspace.wid} onClick={() => { router.push(`/workspace/${workspace.wid}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId(''); setCurrentWorkspace(workspace.wid) }}>
                                <Layers size={14} />{workspace.name}
                            </button>
                        ))}
                    </div>}
                </div>
                <div className="sidebar-2-bottom-cont" onClick={(e) => { e.stopPropagation() }}>

                    {user && <SidebarButton className="sidebar-button account-btn" onClick={() => { setProfileModal(!openProfileModal) }}>
                        <div className="user-avatar">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt="Profile"
                                    className="avatar-image"
                                    onError={(e) => {
                                        // Hide the image and show initials if image fails to load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        if ((e.target as HTMLImageElement).nextSibling && (e.target as HTMLImageElement).nextSibling instanceof HTMLElement) {
                                            ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div
                                className="avatar-initials"
                                style={{
                                    display: user?.image ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(94, 129, 173, 0.2)',
                                    color: 'rgba(94, 129, 173, 1)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    borderRadius: '50%'
                                }}
                            >
                                {getUserInitials(user?.name)}
                            </div>
                        </div><span>{user?.name}<br /><span className="plan" style={{ textTransform: 'uppercase', fontWeight: '600' }}>{user?.plan === 'pro-plus' ? 'pro+' : `${user?.plan}`}</span></span>
                    </SidebarButton>}
                    {openProfileModal && <div className="profile-sidebar-cont" ref={modalRef} >
                        <ProfileCont />
                    </div>}
                </div>

            </div>}
            {!isSidebarOpen && <div className="sidebar-2" style={{ cursor: 'w-resize' }} onClick={() => { toggleSidebar() }}>
                <div className="slogo-cont" onClick={() => { router.push('/') }} style={{ justifyContent: 'center' }}>
                    <Image src="/sitraone.png" alt="0xXplorer" width={30} height={30} priority />
                </div>
                <div className="sidebar-2-top-cont" onClick={(e) => { e.stopPropagation() }}>
                    <SidebarButton className="sidebar-button-2 toggle-sidebar" data-tooltip="open sidebar" style={{ cursor: 'w-resize' }} title={isSidebarOpen ? "close" : "open"} onClick={() => { toggleSidebar() }}>
                        <PanelLeft size={20} />
                    </SidebarButton>

                    <SidebarButton className="sidebar-button-2" data-tooltip="New Chat" onClick={() => { router.push(currentWorkspace === '' ? `/?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}> <SquarePen size={20} /></SidebarButton>
                    <SidebarButton className="sidebar-button-2" data-tooltip="Create" onClick={() => { router.push('/create') }}>
                        <PlusCircle size={20} />
                    </SidebarButton >
                    <SidebarButton className="sidebar-button-2" data-tooltip={'chats'} onClick={() => { toggleHistoryBar() }}>
                        <MessagesSquare size={20} />
                    </SidebarButton>
                    <SidebarButton
                        className="sidebar-button-2"
                        data-tooltip="search chat"
                        onClick={() => {
                            location.href = '#searchchat';
                        }}
                    >
                        <Search size={20} />
                    </SidebarButton>
                    <SidebarButton className="sidebar-button-2" data-tooltip={'AUM Store'} onClick={() => { router.push('/store') }}>      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                    </SidebarButton>
                    <SidebarButton className="sidebar-button-2" data-tooltip="Image studio" onClick={() => { router.push(currentWorkspace === '' ? `/image-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/image-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                        <Limage size={20} />
                    </SidebarButton >
                    <SidebarButton className="sidebar-button-2" data-tooltip="Video studio" onClick={() => { router.push(currentWorkspace === '' ? `/video-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/video-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                        <Play size={20} />
                    </SidebarButton >

                </div>
                <div className="sidebar-2-bottom-cont" onClick={(e) => { e.stopPropagation() }}>
                    {user && <SidebarButton className="sidebar-button-2" data-tooltip={'profile'} onClick={() => { setProfileModal(!openProfileModal) }}>
                        <div className="user-avatar">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt="Profile"
                                    className="avatar-image"
                                    onError={(e) => {
                                        // Hide the image and show initials if image fails to load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        if ((e.target as HTMLImageElement).nextSibling && (e.target as HTMLImageElement).nextSibling instanceof HTMLElement) {
                                            ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div
                                className="avatar-initials"
                                style={{
                                    display: user?.image ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(94, 129, 173, 0.2)',
                                    color: 'rgba(94, 129, 173, 1)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    borderRadius: '50%'
                                }}
                            >
                                {getUserInitials(user?.name)}
                            </div>
                        </div>
                    </SidebarButton>}
                    {openProfileModal && <div className="profile-sidebar-cont" ref={modalRef} >
                        <ProfileCont />
                    </div>}

                </div>
            </div>}
        </>
    )
}

export default Sidebar;