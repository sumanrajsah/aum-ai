"use client"
import { use, useEffect, useRef, useState } from "react";
import axios from 'axios';
import Image from 'next/image';
import { SyncLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import './style.css'

import { Archive, CircleFadingPlus, EllipsisVertical, PanelRightClose, PanelRightOpen, ScrollText, Sun, Trash2, User, User2 } from "lucide-react";
;
import { useTheme } from "next-themes";
import Modal from "../components/modal";
import TextAssistantMessage from "../components/chat/message-prop/assistant/text-assistant";
import TextUserMessage from "../components/chat/message-prop/user/text-user";
import { useAlert } from "@/context/alertContext";
import { useAuth } from "@/hooks/useAuth";
import { useChat, useImagePlaygound } from "@/context/ChatContext";
import ChatMessage from "../components/chatMessage";
import ChatInput from "../components/chatInput";
import { imageModels } from "../utils/models-list";
import ImageAssistantCard from "../components/chat/message-prop/assistant/image-assistant-card";



export default function ImagePlayground() {
    const { messages, aiTyping, setIsChatRoom, memoizedHistory, setMessages, selectLanguage, language, setChatPage, alertModel, setAlertModel, setChatMode, selectModel, chatMode, Model } = useChat();
    const { allImages, creatingImage } = useImagePlaygound();
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [openDisconnecModel, setOpenDisconnectModel] = useState<boolean>(false)

    const { user, status } = useAuth()
    const modalRef = useRef<HTMLDivElement | null>(null);
    const { theme } = useTheme();
    const alertMessage = useAlert()

    const imageModelValues = imageModels.map(model => model.value);

    useEffect(() => {
        // Step 1: Ensure chatMode is 'image'
        if (chatMode !== 'image') {
            setChatMode('image');
            router.push(`/image-playground?model=dalle-3&mode=image`)
        } else {

            // Step 2: Ensure selectedModel is valid
            //console.log(imageModelValues, Model)
            if (!imageModelValues.includes(Model)) {
                selectModel('dalle-3');
                router.push(`/image-playground?model=dalle-3&mode=image`)
            } else {

                router.push(`/image-playground?model=${Model}&mode=image`)
            }
        }
    }, [chatMode, Model]);

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

    //console.log(session)

    useEffect(() => {


        setChatPage(true)
        setIsChatRoom(false)
        if (!user?.uid) {
            setAlertModel(false)
        }
    }, [user])

    async function deleteChat() {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/chat/deleteChat`,
                {
                    data: { chat_id: selectedChat, uid: user?.uid },
                    withCredentials: true,
                }
            );
            console.log(response)

            if (response.data.status === 'success') { setSelectedChat(''); alertMessage.success('Deleted'); };
        } catch {

        }
    }
    const [columns, setColumns] = useState<any[][]>([]);
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
        return 3;
    };
    const updateColumns = () => {
        const count = getColumnCount();
        const images = creatingImage
            ? [{ loading: true }, ...allImages]
            : [...allImages];

        const columnized = splitIntoColumns(images, count);
        setColumns(columnized);
    };

    useEffect(() => {
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, [allImages, creatingImage]); // Added creatingImage to dependencies


    return (
        <>
            {selectedChat && <div className="alert-cont">
                <div className="delete-alert">
                    <h2>Delete Chat</h2>
                    <hr />
                    <p>This will Delete your chat.<br />Are You sure? You want to continue.</p>
                    <div className="delete-btn" style={{ background: 'transparent' }} onClick={() => { setSelectedChat('') }}>Cancel</div>
                    <div className="delete-btn" onClick={deleteChat}>Delete</div>
                </div>
            </div>}



            <
                >
                <div
                    className="image-playground-body"
                >
                    <div className="image-playground-gallery">
                        {columns.map((col, colIndex) => (
                            <div className="masonry-column" key={colIndex}>
                                {col.map((image, i) => (
                                    <ImageAssistantCard
                                        key={(image.image_id ?? 'loading') + (image.created ?? i)}
                                        data={image}
                                        loading={false}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <ChatInput />
            </>


        </>
    );
};
