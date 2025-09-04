'use client'
import React, { useCallback, useEffect, useRef, useState } from "react"
import '../../style.css'
import './style.css'
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/useAuth"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Archive, CircleFadingPlus, Ellipsis, EllipsisVertical, History, Images, Layers, Moon, PanelLeft, PanelRightClose, PanelRightOpen, PenLine, ScrollText, Search, Settings, SquarePen, Sun, Trash2, Video, X } from "lucide-react"
import { useChat, useWorkspace } from "../../../context/ChatContext"
import axios from "axios"
import SidebarButton from "./sidebarbutton"
import { useAlert } from "../../../context/alertContext"
import { useQuickAccessBarStore } from "@/store/useQuickAccessStore"



const QuickAccessBar = () => {
    const { isQuickAccessBarOpen, toggleQuickAccessBar, closeQuickAccessBar } = useQuickAccessBarStore()
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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (SidebarRef.current && !SidebarRef.current.contains(event.target as Node)) {

                if (innerWidth <= 1000) {
                    closeQuickAccessBar();
                }
            }
        }

        if (isQuickAccessBarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isQuickAccessBarOpen]);


    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <>
            {isQuickAccessBarOpen && <div className="sidebar" onClick={() => { setActiveMenuChatId('') }} ref={SidebarRef} style={{ paddingTop: '10px' }}>
                <SidebarButton
                    className="sidebar-button"
                    data-tooltip="Close"
                    onClick={() => {
                        closeQuickAccessBar()
                    }}
                >
                    <X size={16} /> Close
                </SidebarButton>

            </div>}
        </>
    )
}

export default QuickAccessBar;