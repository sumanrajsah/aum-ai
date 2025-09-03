"use client"
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import './style.css'

import { useAlert } from "@/context/alertContext";
import { useAuth } from "@/hooks/useAuth";
import { useChat, useImagePlaygound } from "@/context/ChatContext";
import ChatInput from "../components/chatInput";
import { imageModels } from "../utils/models-list";
import ImageAssistantCard from "../components/chat/message-prop/assistant/image-assistant-card";



export default function ImagePlayground() {
    const { setChatPage, setIsChatRoom, setAlertModel, setChatMode, selectModel, chatMode, Model } = useChat();
    const { allImages, creatingImage } = useImagePlaygound();
    const router = useRouter();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const { user } = useAuth();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const alertMessage = useAlert();
    const [columns, setColumns] = useState<any[][]>([]);

    const imageModelValues = imageModels.map(model => model.value);

    // Fix initialization and redirect logic
    useEffect(() => {
        let needsRedirect = false;
        let newUrl = '';

        // Step 1: Ensure chatMode is 'image'
        if (chatMode !== 'image') {
            setChatMode('image');
            needsRedirect = true;
            newUrl = `/image-playground?model=${Model}&mode=image`;
        }

        // Step 2: Ensure selectedModel is valid
        if (!imageModelValues.includes(Model)) {
            selectModel('dalle-3');
            needsRedirect = true;
            newUrl = `/image-playground?model=dalle-3&mode=image`;
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
    }, [chatMode, Model, imageModelValues, setChatMode, selectModel, router]);

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
        return 3;
    };

    const updateColumns = () => {
        const count = getColumnCount();
        const images: any[] = creatingImage
            ? [{ loading: true }, ...allImages]
            : [...allImages];

        const columnized = splitIntoColumns(images, count);
        setColumns(columnized);
    };

    useEffect(() => {
        updateColumns();

        const handleResize = () => {
            updateColumns();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [allImages, creatingImage]);

    // Don't render until properly initialized
    if (!isInitialized) {
        return (
            <div className="image-playground-body">
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

            <div className="image-playground-body">
                <div className="image-playground-gallery">
                    {columns.map((col, colIndex) => (
                        <div className="masonry-column" key={colIndex}>
                            {col.map((image, i) => (
                                <ImageAssistantCard
                                    key={image.image_id || `loading-${i}`}
                                    data={image.loading ? undefined : image}
                                    loading={image.loading || false}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {allImages.length === 0 && !creatingImage && (
                    <div className="empty-state">
                        <p>No images yet. Create your first image!</p>
                    </div>
                )}
            </div>

            <ChatInput />
        </>
    );
}