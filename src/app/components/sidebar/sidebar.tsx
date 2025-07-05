'use client'
import React, { useCallback, useEffect, useRef, useState } from "react"
import '../../style.css'
import './style.css'
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/useAuth"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Archive, CircleFadingPlus, Ellipsis, EllipsisVertical, History, Images, Layers, Moon, PanelLeft, PanelRightClose, PanelRightOpen, ScrollText, Search, Settings, SquarePen, Sun, Trash2, Video } from "lucide-react"
import { useChat, useWorkspace } from "../../../context/ChatContext"
import axios from "axios"
import SidebarButton from "./sidebarbutton"
import { useAlert } from "../../../context/alertContext"
import { useSidebarStore } from "@/store/useSidebarStore"



const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarStore();
    const router = useRouter();
    const { messages, aiTyping, setIsChatRoom, memoizedHistory, setMessages, selectModel, Model, setChatId, chatId, setHistory, chatMode } = useChat();
    const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
    // console.log(memoizedHistory)
    const [activeMenuChatId, setActiveMenuChatId] = useState<string | null>(null);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const { user, status } = useAuth()
    const { theme, setTheme, systemTheme } = useTheme();
    const alertMessage = useAlert()
    const SidebarRef = useRef<HTMLDivElement | null>(null);
    const scrollToItem = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            node.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, []);
    async function deleteChat(id: string) {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/chat/deleteChat`,
                {
                    data: { chat_id: id, uid: user?.uid, wid: currentWorkspace },
                    withCredentials: true,
                }
            );

            if (response.data.status === 'success') {
                if (id === chatId) { setMessages([]); router.push(currentWorkspace === '' ? `/?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}?model=${Model}&mode=${chatMode}`); }; setSelectedChat(''); setChatId(''); alertMessage.warn('Deleted');
                const updatedHistory = Object.entries(memoizedHistory).reduce((acc, [date, items]) => {
                    const filteredItems = items.filter(item => item.chat_id !== id);
                    if (filteredItems.length > 0) {
                        acc[date] = filteredItems;
                    }
                    return acc;
                }, {} as GroupedHistoryByDate);

                setHistory(updatedHistory);
            };
        } catch (e) {
            console.log(e)
        }
    }
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
                    <SidebarButton className="sidebar-button-2 close-sidebar" style={{ cursor: 'w-resize' }} title="Close" onClick={() => { toggleSidebar() }}>
                        <PanelLeft size={20} />
                    </SidebarButton >
                </div>


                <SidebarButton className="sidebar-button" onClick={() => { router.push(currentWorkspace === '' ? `/?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                    <CircleFadingPlus size={16} /> New Chat
                </SidebarButton >
                <SidebarButton className="sidebar-button" onClick={() => { router.push(currentWorkspace === '' ? `/image-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/image-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                    <Images size={16} /> Image Playground
                </SidebarButton >
                <SidebarButton className="sidebar-button" onClick={() => { router.push(currentWorkspace === '' ? `/video-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/video-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                    <Video size={16} /> Video Playground
                </SidebarButton >
                <SidebarButton
                    className="sidebar-button"
                    title="Close"
                    onClick={() => {
                        location.href = '#searchchat';
                    }}
                >
                    <Search size={16} /> Search Chats
                </SidebarButton>

                {memoizedHistory && Object.keys(memoizedHistory).length > 0 && (
                    <div className="history-panel">

                        <label>
                            <History size={16} />
                            chat history
                        </label>
                        <div className="history-panel-cont">
                            {Object.entries(memoizedHistory).map(([date, items]) => (
                                <div key={date} className="history-date-group">
                                    <label className="date-label">{date}</label> {/* Display group date */}
                                    {items.map((item: ChatHistory, index) => {
                                        const isSelected = chatId === item.chat_id;

                                        return (

                                            <div
                                                ref={isSelected ? scrollToItem : null}
                                                key={item.chat_id} // better unique key than index
                                                className="history-box"
                                                title={item.title}
                                                onClick={() => {
                                                    router.push(
                                                        !(item.wid)
                                                            ? `/c/${item.chat_id}?model=${Model}&mode=${chatMode}`
                                                            : `/workspace/${item.wid}/c/${item.chat_id}?model=${Model}&mode=${chatMode}`
                                                    );
                                                    setSelectedChat(item.chat_id);
                                                }}
                                                style={{
                                                    background:
                                                        chatId === item.chat_id ? 'rgba(94, 129, 173, 0.3)' : '',
                                                }}
                                            >
                                                <p>{item.title.replace(/^"(.*)"$/, '$1')}</p>

                                                <div
                                                    className="chath-menu-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuChatId(
                                                            activeMenuChatId === item.chat_id ? null : item.chat_id
                                                        );
                                                    }}

                                                >
                                                    <Ellipsis size={20} />
                                                </div>
                                                {activeMenuChatId === item.chat_id && (
                                                    <div
                                                        className="chath-menu"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedChat(item.chat_id);
                                                        }}
                                                        style={{ background: theme === 'dark' ? 'var(--prop-dark-bg)' : 'var(--prop-white-bg)' }}
                                                    >
                                                        <div
                                                            className="chath-menu-list"
                                                            onClick={() =>
                                                                (location.href = `#movechat`)
                                                            }
                                                        >
                                                            <Layers size={16} />
                                                            Move
                                                        </div>
                                                        <div
                                                            className="chath-menu-list"
                                                            onClick={() =>
                                                                (location.href = `#renamechat?name=${item.title}&id=${item.chat_id}`)
                                                            }
                                                        >
                                                            <SquarePen size={16} />
                                                            Rename
                                                        </div>
                                                        <hr />
                                                        <div className="chath-menu-list">
                                                            <Archive size={16} />
                                                            Archive
                                                        </div>
                                                        <div
                                                            className="chath-menu-list delete"
                                                            onClick={() => {
                                                                deleteChat(item.chat_id);
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>}
            {!isSidebarOpen && <div className="sidebar-2" style={{ cursor: 'w-resize' }} onClick={() => { toggleSidebar() }}>
                <div className="sidebar-2-top-cont" onClick={(e) => { e.stopPropagation() }}>
                    <div className="slogo-cont" onClick={() => { router.push('/') }} >
                        <Image src="/sitraone.png" alt="0xXplorer" width={30} height={30} priority />
                    </div>
                    <SidebarButton className="sidebar-button-2 toggle-sidebar" style={{ cursor: 'w-resize' }} title={isSidebarOpen ? "close" : "open"} onClick={() => { toggleSidebar() }}>
                        <PanelLeft size={20} />
                    </SidebarButton>

                    <SidebarButton className="sidebar-button-2" title="New Chat" onClick={() => { router.push(currentWorkspace === '' ? `/?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}> <CircleFadingPlus size={20} /></SidebarButton>
                    <SidebarButton className="sidebar-button-2" onClick={() => { router.push(currentWorkspace === '' ? `/image-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/image-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                        <Images size={20} />
                    </SidebarButton >
                    <SidebarButton className="sidebar-button-2" onClick={() => { router.push(currentWorkspace === '' ? `/video-playground?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/video-playground?model=${Model}&mode=${chatMode}`); setMessages([]); setChatId("") }}>
                        <Video size={20} />
                    </SidebarButton >
                    <SidebarButton
                        className="sidebar-button-2"
                        title="Close"
                        onClick={() => {
                            location.href = '#searchchat';
                        }}
                    >
                        <Search size={20} />
                    </SidebarButton>
                    <SidebarButton className="sidebar-button-2" title={'history'} onClick={() => { toggleSidebar() }}>
                        <History size={20} />
                    </SidebarButton>
                </div>
                <div className="sidebar-2-bottom-cont" onClick={(e) => { e.stopPropagation() }}>
                    <SidebarButton
                        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                        className="sidebar-button-2"
                        title={currentTheme === 'dark' ? "Light Mode" : "Dark Mode"}
                    >
                        {currentTheme === 'dark' ? <><Sun size={20} /></> : <><Moon size={20} /></>}
                    </SidebarButton>
                    <SidebarButton className="sidebar-button-2" title="setting" onClick={() => { router.push('/docs') }}><Settings size={20} /></SidebarButton>

                </div>
            </div>}
        </>
    )
}

export default Sidebar;