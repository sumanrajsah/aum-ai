"use client"
import { use, useEffect, useRef, useState } from "react";
import axios from 'axios';
import Image from 'next/image';
import { SyncLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import './style.css'

import { Archive, CircleFadingPlus, EllipsisVertical, PanelRightClose, PanelRightOpen, ScrollText, Sun, Trash2, User, User2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useAlert } from "@/context/alertContext";
import { useAuth } from "@/hooks/useAuth";
import { useChat, useVideoPlayground, useWorkspace } from "@/context/ChatContext";
import { vidoeModels } from "@/app/utils/models-list";
import VideoAssistantCard from "@/app/components/chat/message-prop/assistant/video-assistant-card";
import ChatInput from "@/app/components/chatInput";


export default function VideoPlayground({ params }: { params: Promise<{ wid: string }> }) {
    const { messages, aiTyping, setIsChatRoom, memoizedHistory, setMessages, selectLanguage, language, setChatPage, alertModel, setAlertModel, setChatMode, selectModel, chatMode, Model } = useChat();
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [openDisconnecModel, setOpenDisconnectModel] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const { allVideos, creatingVideo, setAllVideos, setExpandVideo, expandVideo } = useVideoPlayground();
    const { setCurrentWorkspace, currentWorkspace } = useWorkspace()
    const { user, status } = useAuth();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const { theme } = useTheme();
    const alertMessage = useAlert();
    const [columns, setColumns] = useState<any[][]>([]);
    const { wid } = use(params);
    const videoModelValues = vidoeModels.map(model => model.value);

    useEffect(() => {
        // Step 1: Ensure chatMode is 'video'
        if (chatMode !== 'video') {
            setChatMode('video');
            router.push(`/workspace/${wid}/video-playground?model=${Model}&mode=video`)
        }

        // Step 2: Ensure selectedModel is valid
        if (!videoModelValues.includes(Model)) {
            selectModel('sora');
            router.push(`/workspace/${wid}/video-playground?model=sora&mode=video`)
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpenDisconnectModel(false);
            }
        }

        if (openDisconnecModel) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDisconnecModel]);

    useEffect(() => {
        setCurrentWorkspace(wid);

        setChatPage(true);
        setIsChatRoom(false);
        if (!user?.uid) {
            setAlertModel(false);
        }
    }, [user, currentWorkspace, wid]);

    async function deleteChat() {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/chat/deleteChat`,
                {
                    data: { chat_id: selectedChat, uid: user?.uid },
                    withCredentials: true,
                }
            );
            console.log(response);

            if (response.data.status === 'success') {
                setSelectedChat('');
                alertMessage.success('Deleted');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    }

    function splitIntoColumns(items: any[], columnCount: number) {
        const columns: any[][] = Array.from({ length: columnCount }, () => []);
        items.forEach((item: any, i: number) => {
            columns[i % columnCount].push(item);
        });
        return columns;
    }


    const getColumnCount = () => {
        const width = window.innerWidth;
        if (width < 600) return 1;
        if (width < 900) return 2;
        if (width < 1200) return 3;
        return 4;
    };

    const updateColumns = () => {
        const count = getColumnCount();
        const videos = creatingVideo
            ? [{ loading: true }, ...allVideos]
            : [...allVideos];

        const columnized = splitIntoColumns(videos, count);
        setColumns(columnized);
    };

    useEffect(() => {
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, [allVideos, creatingVideo]);


    return (
        <>
            {selectedChat && (
                <div className="alert-cont">
                    <div className="delete-alert">
                        <h2>Delete Chat</h2>
                        <hr />
                        <p>This will Delete your chat.<br />Are You sure? You want to continue.</p>
                        <div className="delete-btn" style={{ background: 'transparent' }} onClick={() => { setSelectedChat('') }}>Cancel</div>
                        <div className="delete-btn" onClick={deleteChat}>Delete</div>
                    </div>
                </div>
            )}

            <div className="video-playground-body">
                <div className="video-playground-gallery">
                    {columns.map((col, colIndex) => (
                        <div className="masonryv-column" key={colIndex}>
                            {col.map((video, i) => (
                                <VideoAssistantCard
                                    key={(video.image_id ?? 'loading') + (video.created ?? i)}
                                    data={video}
                                    loading={false}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <ChatInput />
        </>
    );
}