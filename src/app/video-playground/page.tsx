"use client"
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import './style.css'

import { useAlert } from "@/context/alertContext";
import { useAuth } from "@/hooks/useAuth";
import { useChat, useVideoPlayground } from "@/context/ChatContext";
import ChatInput from "../components/chatInput";
import { vidoeModels } from "../utils/models-list";
import VideoAssistantCard from "../components/chat/message-prop/assistant/video-assistant-card";



export default function VideoPlayground() {
    const { setChatPage, setIsChatRoom, setAlertModel, setChatMode, selectModel, chatMode, Model } = useChat();
    const router = useRouter();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const { allVideos, creatingVideo, setExpandVideo, expandVideo } = useVideoPlayground();

    const { user } = useAuth();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const alertMessage = useAlert();
    const [columns, setColumns] = useState<any[][]>([]);

    const videoModelValues = vidoeModels.map(model => model.value);

    // Fix initialization and redirect logic
    useEffect(() => {
        let needsRedirect = false;
        let newUrl = '';

        // Step 1: Ensure chatMode is 'video'
        if (chatMode !== 'video') {
            setChatMode('video');
            needsRedirect = true;
            newUrl = `/video-playground?model=${Model}&mode=video`;
        }

        // Step 2: Ensure selectedModel is valid
        if (!videoModelValues.includes(Model)) {
            selectModel('sora');
            needsRedirect = true;
            newUrl = `/video-playground?model=sora&mode=video`;
        }

        // Only redirect after all state updates are done
        if (needsRedirect) {
            // Use setTimeout to ensure redirect happens after current render cycle
            setTimeout(() => {
                router.push(newUrl);
            }, 0);
        } else {
            setIsInitialized(true);
        }
    }, [chatMode, Model, videoModelValues, setChatMode, selectModel, router]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                // Handle modal close logic here if needed
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setChatPage(true);
        setIsChatRoom(false);
        if (!user?.uid) {
            setAlertModel(false);
        }
    }, [user, setChatPage, setIsChatRoom, setAlertModel]);

    async function deleteChat() {
        if (!selectedChat || !user?.uid) return;

        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/chat/deleteChat`,
                {
                    data: { chat_id: selectedChat, uid: user.uid },
                    withCredentials: true,
                }
            );

            if (response.data.status === 'success') {
                setSelectedChat(null);
                alertMessage.success('Deleted');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            alertMessage.error('Failed to delete chat');
        }
    }

    function splitIntoColumns(items: any[], columnCount: number): any[][] {
        const columns: any[][] = Array.from({ length: columnCount }, () => []);
        items.forEach((item: any, i: number) => {
            columns[i % columnCount].push(item);
        });
        return columns;
    }

    const getColumnCount = (): number => {
        if (typeof window === 'undefined') return 3;

        const width = window.innerWidth;
        if (width < 600) return 1;
        if (width < 900) return 2;
        if (width < 1200) return 3;
        return 3;
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

        const handleResize = () => {
            updateColumns();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [allVideos, creatingVideo]);

    // Don't render until properly initialized
    if (!isInitialized) {
        return (
            <div className="video-playground-body">
                <div className="loading-container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {selectedChat && (
                <div className="alert-cont">
                    <div className="delete-alert" ref={modalRef}>
                        <h2>Delete Chat</h2>
                        <hr />
                        <p>This will delete your chat.<br />Are you sure you want to continue?</p>
                        <div className="alert-buttons">
                            <button
                                className="delete-btn cancel-btn"
                                onClick={() => setSelectedChat(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-btn confirm-btn"
                                onClick={deleteChat}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="video-playground-body">
                <div className="video-playground-gallery">
                    {columns.map((col, colIndex) => (
                        <div className="masonry-column" key={colIndex}>
                            {col.map((video, i) => (
                                <VideoAssistantCard
                                    key={video.video_id || video.image_id || `loading-${i}`}
                                    data={video.loading ? undefined : video}
                                    loading={video.loading || false}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {allVideos.length === 0 && !creatingVideo && (
                    <div className="empty-state">
                        <p>No videos yet. Create your first video!</p>
                    </div>
                )}
            </div>

            <ChatInput />
        </>
    );
}