"use client"
import { use, useEffect, useRef, useState } from "react";
import axios from 'axios';
import '@/app/style.css';
import '@/app/globals.css'
import Image from 'next/image';
import { SyncLoader } from 'react-spinners';
import { notFound, useRouter, useSearchParams } from "next/navigation";

import AdComponent from "@/app/components/ads";
import AdComponent2 from "@/app/components/ads2";
import { signIn, signOut, useSession } from "next-auth/react";
import McpServerModalSetting from "@/app/components/mcpComp/mcpSetting";
import McpServerModal from "@/app/components/mcpComp/serverModal";
import ProfileCont from "@/app/components/header/profile";
import { Archive, CircleFadingPlus, EllipsisVertical, PanelRightClose, PanelRightOpen, ScrollText, Trash2, User2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Circles } from "react-loader-spinner";
import Header from "@/app/components/header/header";

import Modal from "@/app/components/modal";
import Sidebar from "@/app/components/sidebar/sidebar";
import PageStruct1 from "@/app/components/pagestruct/struct1";
import TextAssistantMessage from "@/app/components/chat/message-prop/assistant/text-assistant";
import TextUserMessage from "@/app/components/chat/message-prop/user/text-user";
import { llmModels } from "@/app/utils/models-list";
import ToolResultRender from "@/app/components/chat/message-prop/assistant/toolsResult";
import { useAuth } from "@/hooks/useAuth";
import { useChat, useWorkspace } from "@/context/ChatContext";
import ChatMessage from "@/app/components/chatMessage";
import ChatInput from "@/app/components/chatInput";



export default function Chat({ params }: { params: Promise<{ chatId: string, aid: string }> }) {
    const { user, status } = useAuth();
    const { messages, aiTyping, setMessages, setIsChatRoom, setChatId, memoizedHistory, setChatPage, chatMode, setChatMode, Model, selectModel, setAgentId } = useChat();
    const router = useRouter();
    const { setCurrentWorkspace, currentWorkspace } = useWorkspace()

    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [openDisconnecModel, setOpenDisconnectModel] = useState<boolean>(false)
    const [chatTitle, setChatTitle] = useState<string | null>(null);
    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    const { theme } = useTheme();
    const p = useSearchParams();
    const mcpserversetting = p.get("serversettings")
    const mcpserver = p.get("server")

    const modalRef = useRef<HTMLDivElement | null>(null);
    const modelValues = llmModels.map(model => model.value);

    useEffect(() => {
        // Step 1: Ensure chatMode is 'image'
        if (chatMode !== 'text') {
            setChatMode('text');
            router.push(`/c/${chatId}?model=${Model}&mode=text`)
        }

        // Step 2: Ensure selectedModel is valid
        if (!modelValues.includes(Model)) {
            selectModel('gpt-4o-mini');
            router.push(`/c/${chatId}?model=gpt-4o-mini&mode=text`)
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

    const { chatId, aid } = use(params);
    useEffect(() => {
        setAgentId(aid)
        setChatPage(true)
        setCurrentWorkspace('')
        setIsChatRoom(true)
        setChatId(chatId)
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [chatId, status])

    useEffect(() => {
        async function getData() {
            setLoadingChat(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/chat/getChat/${chatId}`, {
                    method: 'GET',
                    credentials: 'include', // 👈 This is required to send cookies
                });
                console.log(response)

                if (!response.ok) {
                    throw new Error('Failed to fetch chat');
                }

                const data = await response.json();
                console.log('Chat data:', data);

                const chat: Message[] = data.chats.map((msg: MessageInterface) => ({
                    content: msg.content,
                    msg_id: msg.msg_id,
                    type: msg.type,
                    role: msg.role,
                    createdOn: msg.created_on,
                    model: msg.model,
                    tool_call_id: msg.tool_call_id,
                    tool_calls: msg.tool_calls
                }));

                console.log(chat);

                //            setChatTitle(data.chat.title)
                setMessages(chat)
                // console.log(chat, data.chats)
                setLoadingChat(false)

            } catch (e) { console.log(e) }
        }
        if (user) getData()
    }, [user])

    useEffect(() => {
        if (messages.length > 0) {
            setLoadingChat(false)
        }
    }, [messages]);

    async function deleteChat() {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/chat/deleteChat`,
                {
                    data: { chat_id: selectedChat, uid: user?.uid },
                    withCredentials: true,
                }
            );
            if (response.data.status === 'success') {
                if (selectedChat === chatId) { router.push('/'); setMessages([]) };
                setSelectedChat('')
            };
        } catch {

        }
    }
    const beautifyJSON = (input: string | object): string => {
        try {
            let obj = typeof input === 'string' ? input : JSON.stringify(input);

            // Try first parse
            obj = JSON.parse(obj);

            // If the result is still a string, try parsing again
            if (typeof obj === 'string') {
                obj = JSON.parse(obj);
            }

            return JSON.stringify(obj, null, 2);
        } catch (error) {
            console.error("Beautify error:", error);
            return typeof input === 'string' ? input : JSON.stringify(input);
        }
    };

    return (
        <>
            {selectedChat && <div className="alert-cont">
                <div className="delete-alert">
                    <h1>Delete Chat</h1>
                    <hr />
                    <p>This will Delete your chat.<br />Are You sure? You want to continue.</p>
                    <div className="delete-btn" style={{ background: 'transparent' }} onClick={() => { setSelectedChat('') }}>Cancel</div>
                    <div className="delete-btn" onClick={deleteChat}>Delete</div>
                </div>
            </div>}

            <Modal />

            <
                >
                <div
                    className="chat-cont"
                >
                    {(messages.length == 0) && <div className="quote" >
                        {user && <p>How can I assist, {user.name}</p>}
                        {!user && <p>Get Started With AUM AI</p>}
                    </div>}
                    {messages.map((msg, index) => {
                        // Group consecutive image_url items together
                        const groupedContent: any[] = [];
                        let currentImageGroup: any[] = [];

                        if (Array.isArray(msg.content)) {
                            msg.content.forEach((item, idx) => {
                                if (item.type === "image_url") {
                                    currentImageGroup.push({ item, idx });
                                } else {
                                    // If we have accumulated images, add them as a group
                                    if (currentImageGroup.length > 0) {
                                        groupedContent.push({ type: 'image_group', items: currentImageGroup });
                                        currentImageGroup = [];
                                    }
                                    // Add the non-image item
                                    groupedContent.push({ type: 'single', item, idx });
                                }
                            });

                            // Don't forget any remaining images
                            if (currentImageGroup.length > 0) {
                                groupedContent.push({ type: 'image_group', items: currentImageGroup });
                            }
                        }

                        return (
                            <div className="chat-cont-message" key={msg.msg_id}>
                                {Array.isArray(msg.content) ? (
                                    groupedContent.map((group, groupIdx) => {
                                        if (group.type === 'image_group') {
                                            // Render multiple images in a row
                                            return (
                                                <div key={`${msg.msg_id}-image-group-${groupIdx}`} className="chat-image-container">
                                                    {group.items.map(({ item, idx }) => {
                                                        const contentKey = `${msg.msg_id}-${item.type}-${idx}`;

                                                        if (msg.role === 'assistant') {
                                                            return (
                                                                <TextAssistantMessage
                                                                    key={contentKey}
                                                                    content={item.image_url}
                                                                    type={item.type}
                                                                    role={msg.role}
                                                                    model={msg.model ?? { name: '', provider: '' }}
                                                                />
                                                            );
                                                        } else {
                                                            return (
                                                                <TextUserMessage
                                                                    key={contentKey}
                                                                    content={item.image_url}
                                                                    type={item.type}
                                                                    role={msg.role ?? ''}
                                                                    filename=""
                                                                />
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            );
                                        } else {
                                            // Render single non-image item
                                            const { item, idx } = group;
                                            let messageContent = '';
                                            let filename = '';

                                            switch (item.type) {
                                                case "text":
                                                    messageContent = item.text;
                                                    break;
                                                case "file":
                                                    messageContent = `${item.file.file_url}`;
                                                    filename = `${item.file.filename}`;
                                                    break;
                                                default:
                                                    messageContent = "Unsupported message type";
                                            }

                                            const contentKey = `${msg.msg_id}-${item.type}-${idx}`;

                                            if (msg.role === 'assistant') {
                                                return (
                                                    <TextAssistantMessage
                                                        key={contentKey}
                                                        content={messageContent}
                                                        type={item.type}
                                                        role={msg.role}
                                                        model={msg.model ?? { name: '', provider: '' }}
                                                    />
                                                );
                                            } else if (msg.role === 'tool') {
                                                return (
                                                    <ToolResultRender
                                                        key={contentKey}
                                                        content={messageContent}
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <TextUserMessage
                                                        key={contentKey}
                                                        content={messageContent}
                                                        type={item.type}
                                                        role={msg.role ?? ''}
                                                        filename={filename}
                                                    />
                                                );
                                            }
                                        }
                                    })
                                ) : (
                                    <>
                                        {msg.role === 'assistant' ? (
                                            <TextAssistantMessage
                                                key={msg.msg_id}
                                                content={msg.content}
                                                role={msg.role ?? ''}
                                                type={msg.type}
                                                model={msg.model ?? { name: '', provider: '' }}
                                            />
                                        ) : msg.role === 'tool' ? (
                                            <ToolResultRender
                                                key={msg.msg_id}
                                                content={msg.content}
                                            />
                                        ) : (
                                            <TextUserMessage
                                                key={msg.msg_id}
                                                content={msg.content}
                                                role={msg.role ?? ''}
                                                type={msg.type}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}


                    {(aiTyping) && (
                        <ChatMessage message={''} isUser={false} type={'loading'} />


                    )}
                </div>
                <ChatInput />
            </>

        </>
    );
};
