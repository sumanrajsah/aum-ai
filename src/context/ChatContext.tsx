// context/ChatContext.tsx
'use client'
import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../hooks/useAuth";
import { v7 as uuidv7 } from 'uuid'
import { useAlert } from "./alertContext";
import VideoPlayground from "@/app/video-playground/page";
import { useLLMStyleStore } from "@/store/useLLMStyleStore";
import { getMediaSupportByModelName } from "@/app/utils/models-list";


interface ChatContextType {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setChatId: React.Dispatch<React.SetStateAction<String>>;
    selectLanguage: React.Dispatch<React.SetStateAction<string>>;
    selectModel: React.Dispatch<React.SetStateAction<string>>;
    setEditInput: React.Dispatch<React.SetStateAction<string>>;
    setHistory: React.Dispatch<React.SetStateAction<GroupedHistoryByDate>>;
    editInput: string;
    Model: string;
    language: string;
    chatId: String;
    aiTyping: boolean;
    aiWriting: boolean;
    setAiTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setIsChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
    setChatPage: React.Dispatch<React.SetStateAction<boolean>>;
    setAlertModel: React.Dispatch<React.SetStateAction<boolean>>;
    alertModel: boolean;
    abortControllerRef: React.MutableRefObject<AbortController | null>;
    handleSendMessage: (message: MessageContentItem[], mcpServers: any[], bot?: boolean, lang?: string) => Promise<void>;
    memoizedHistory: GroupedHistoryByDate;
    setChatMode: React.Dispatch<React.SetStateAction<ChatMode>>;
    chatMode: ChatMode;

    agentId: string;
    setAgentId: React.Dispatch<React.SetStateAction<string>>;
    setUserAgents: React.Dispatch<React.SetStateAction<any[]>>;
    userAgents: any[];
}
interface MCPServerContextType {
    setMcpServers: React.Dispatch<React.SetStateAction<MCPServerInfo[]>>;
    mcpServers: MCPServerInfo[];
    setSelectedServers: React.Dispatch<React.SetStateAction<McpServer[]>>;
    selectedServers: McpServer[];
    setMcpResources: React.Dispatch<React.SetStateAction<McpResource[]>>;
    mcpResources: McpResource[];
    selectMcpResource: React.Dispatch<React.SetStateAction<McpResource | undefined>>;
    mcpResource: McpResource | undefined;
    mcpTools: string[];
    setMcpTools: React.Dispatch<React.SetStateAction<string[]>>;
}
interface WorkspaceContextType {
    workspaces: Workspace[];
    setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
    currentWorkspace: string; // Optional, if you want to track the current workspace
    setCurrentWorkspace: React.Dispatch<React.SetStateAction<string>>;
    workspaceData: any; // Optional, if you want to store workspace data
    setWorkspaceData: React.Dispatch<React.SetStateAction<any>>;
}
interface ImagePlayGroundContextType {
    setImageSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
    imageSettings: ImageSettings;
    allImages: ImageMetadata[];
    setAllImages: React.Dispatch<React.SetStateAction<ImageMetadata[]>>;
    creatingImage: boolean;
    createImage: (prompt: string) => Promise<void>;
    generatedImage: ImageMetadata | {};
    expandImage: ImageMetadata | {};
    setExpandImage: React.Dispatch<React.SetStateAction<ImageMetadata>>;
}
interface VideoPlayGroundContextType {
    setVideoSettings: React.Dispatch<React.SetStateAction<VideoSettings>>;
    videoSettings: VideoSettings;
    allVideos: VideoMetadata[];
    setAllVideos: React.Dispatch<React.SetStateAction<VideoMetadata[]>>;
    creatingVideo: boolean;
    createVideo: (prompt: string) => Promise<void>;
    generatedVideo: VideoMetadata | {};
    expandVideo: VideoMetadata | {};
    setExpandVideo: React.Dispatch<React.SetStateAction<VideoMetadata>>;
}
interface AgentContextType {
    agentLoading: boolean;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);
const McpServerContext = createContext<MCPServerContextType | undefined>(undefined);
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);
const ImagePlaygroundContext = createContext<ImagePlayGroundContextType | undefined>(undefined);
const VideoPlaygroundContext = createContext<VideoPlayGroundContextType | undefined>(undefined);
const AgentContext = createContext<AgentContextType | undefined>(undefined);


const AgentProvider = ({ children }: { children: React.ReactNode }) => {
    const { setUserAgents } = useChat();
    const { user } = useAuth();
    const alert = useAlert();
    const [agentLoading, setAgentLoading] = useState(false)

    const fetchAgentsByUID = async (uid: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/agents/uid/${uid}`, {
                method: 'GET',
                credentials: 'include', // include cookies if using auth
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch agents');
            }

            return {
                success: true,
                agents: data.agents,
            };
        } catch (error: any) {
            // console.error('Error fetching agents:', error.message);
            return {
                success: false,
                error: error.message,
                agents: [],
            };
        }
    };
    useEffect(() => {
        if (!user?.uid) {
            setAgentLoading(false)
            return;
        }

        const loadAgents = async () => {
            setAgentLoading(true)
            try {

                const result = await fetchAgentsByUID(user.uid);

                if (result.success) {
                    setUserAgents(result.agents);

                } else {
                    alert.warn('Something went wrong')
                    setUserAgents([]);
                }
            } catch (err) {
                alert.warn('Something went wrong')
                setUserAgents([]);
            } finally {
                setAgentLoading(false)
            }
        };

        loadAgents();
    }, [user?.uid]);
    return (
        <AgentContext.Provider value={{ agentLoading }}>
            {children}
        </AgentContext.Provider>
    )
}
const ImagePlaygroundProvider = ({ children }: { children: React.ReactNode }) => {
    const { Model, chatMode } = useChat();
    const { currentWorkspace } = useWorkspace()
    const [imageSettings, setImageSettings] = useState<ImageSettings>({ size: '1024x1024', quality: 'standard', ratio: '1:1', style: 'natural' });
    const [allImages, setAllImages] = useState<ImageMetadata[] | []>([]);
    const [generatedImage, setGeneratedImage] = useState<ImageMetadata | {}>({});
    const [creatingImage, setCreatingImage] = useState<boolean>(false);
    const { user, status } = useAuth();
    const [expandImage, setExpandImage] = useState<ImageMetadata | {}>({})
    const alert = useAlert();
    const router = useRouter();
    useEffect(() => {
        async function getImages() {
            if (status === 'unauthenticated') {
                console.error("User unauthenticated");
                return;
            }
            if (!user?.uid) {
                console.error("User UID is missing");
                return;
            }
            try {
                const url = currentWorkspace
                    ? `${process.env.NEXT_PUBLIC_API_URI}/v1/image/${user.uid}/${currentWorkspace}`
                    : `${process.env.NEXT_PUBLIC_API_URI}/v1/image/${user.uid}`;


                const response = await axios.get(url, { withCredentials: true });
                //console.log("Fetching images from:", url);

                if (response.status === 201 && response.data?.success) {
                    setAllImages(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch images:", error);
            }

        }
        if (status === 'authenticated' && user?.uid) {
            getImages();
        }
    }, [user?.uid, status, currentWorkspace])
    useEffect(() => {
        const stored = localStorage.getItem('image-settings')
        if (stored) {
            setImageSettings(JSON.parse(stored))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('image-settings', JSON.stringify(imageSettings))
    }, [imageSettings])


    //console.log(currentWorkspace)
    async function createImage(prompt: string) {
        if (currentWorkspace) {
            router.push(`/workspace/${currentWorkspace}/image-playground?model=${Model}&mode=${chatMode}`)
        } else {
            router.push(`/image-playground?model=${Model}&mode=${chatMode}`)
        }
        setCreatingImage(true);
        const data = {
            prompt: prompt,
            model: Model,
            uid: user?.uid,
            wid: currentWorkspace,
            settings: imageSettings
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/image/generation`,
                { data },
                { withCredentials: true }
            );

            const { status, data: resData } = response;

            if (status === 201 && resData.success) {
                setGeneratedImage(resData.data);
                setAllImages(prev => [resData.data, ...prev]);
            } else {
                alert.warn('Image generation failed');
            }
        } catch (error) {
            console.error('Image generation error:', error);
            alert.warn('Something went wrong.');
        } finally {
            setCreatingImage(false);
        }


    }
    return (
        <ImagePlaygroundContext.Provider value={{ imageSettings, setImageSettings, allImages, setAllImages, creatingImage, createImage, generatedImage, setExpandImage, expandImage }}>
            {children}
        </ImagePlaygroundContext.Provider>
    )
}
const VideoPlaygroundProvider = ({ children }: { children: React.ReactNode }) => {
    const { Model, chatMode } = useChat();
    const { currentWorkspace } = useWorkspace()
    const [videoSettings, setVideoSettings] = useState<VideoSettings>({ resolution: '480p', ratio: '1:1', duration: '5' });
    const [allVideos, setAllVideos] = useState<VideoMetadata[] | []>([]);
    const [generatedVideo, setGeneratedVideo] = useState<VideoMetadata | {}>({});
    const [creatingVideo, setCreatingVideo] = useState<boolean>(false);
    const { user, status } = useAuth();
    const [expandVideo, setExpandVideo] = useState<VideoMetadata | {}>({})
    const alert = useAlert();
    const router = useRouter();
    useEffect(() => {
        async function getVideos() {
            if (status === 'unauthenticated') {
                console.error("User unauthenticated");
                return;
            }
            if (!user?.uid) {
                console.error("User UID is missing");
                return;
            }
            try {
                const url = currentWorkspace
                    ? `${process.env.NEXT_PUBLIC_API_URI}/v1/video/${user.uid}/${currentWorkspace}`
                    : `${process.env.NEXT_PUBLIC_API_URI}/v1/video/${user.uid}`;


                const response = await axios.get(url, { withCredentials: true });
                //console.log("Fetching images from:", url);

                if (response.status === 201 && response.data?.success) {
                    setAllVideos(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            }

        }
        if (status === 'authenticated' && user?.uid) {
            getVideos();
        }
    }, [user?.uid, status, currentWorkspace])
    useEffect(() => {
        const stored = localStorage.getItem('video-settings')
        if (stored) {
            setVideoSettings(JSON.parse(stored))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('video-settings', JSON.stringify(videoSettings))
    }, [videoSettings])


    //console.log(currentWorkspace)
    async function createVideo(prompt: string) {
        if (currentWorkspace) {
            router.push(`/workspace/${currentWorkspace}/video-playground?model=${Model}&mode=${chatMode}`)
        } else {
            router.push(`/video-playground?model=${Model}&mode=${chatMode}`)
        }
        setCreatingVideo(true);
        const data = {
            prompt: prompt,
            model: Model,
            uid: user?.uid,
            wid: currentWorkspace,
            settings: videoSettings
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/video/generation`,
                { data },
                { withCredentials: true }
            );

            const { status, data: resData } = response;

            if (status === 201 && resData.success) {
                setGeneratedVideo(resData.data);
                setAllVideos(prev => [resData.data, ...prev]);
            } else {
                alert.warn('Video generation failed');
            }
        } catch (error) {
            console.error('Video generation error:', error);
            alert.warn('Something went wrong.');
        } finally {
            setCreatingVideo(false);
        }


    }
    return (
        <VideoPlaygroundContext.Provider value={{ videoSettings, setVideoSettings, allVideos, setAllVideos, creatingVideo, createVideo, generatedVideo, setExpandVideo, expandVideo }}>
            {children}
        </VideoPlaygroundContext.Provider>
    )
}
const McpServerProvider = ({ children }: { children: React.ReactNode }) => {

    const [mcpServers, setMcpServers] = useState<MCPServerInfo[]>([]);
    const [mcpResources, setMcpResources] = useState<McpResource[]>([]);
    const [mcpResource, selectMcpResource] = useState<McpResource>();
    const [selectedServers, setSelectedServers] = useState<McpServer[]>([]);
    const [mcpTools, setMcpTools] = useState<string[]>([])
    const { user, status } = useAuth();
    useEffect(() => {
        async function getData() {
            if (status === 'unauthenticated') {
                console.error("User unauthenticated");
                return;
            }
            if (!user?.uid) {
                console.error("User UID is missing");
                return;
            }

            try {
                const serverResult = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/servers?uid=${user.uid}`, { withCredentials: true })

                    ;
                // console.log(userResult, serverResult)
                // Handle workspace result

                // Handle server result independently

                const serverResponse = serverResult;
                if (serverResponse.status === 200) {
                    if (mcpServers.length !== serverResponse.data.data)
                        setMcpServers(serverResponse.data.data);
                } else {
                    // console.warn("Server data invalid or not found:", serverResponse);
                    setMcpServers([]);
                }
            } catch (err) {
                // console.error("Unexpected error occurred:", err);
            }

        }

        if (user) getData();
    }, [user, status])

    return (
        <McpServerContext.Provider
            value={{
                mcpServers,
                setMcpServers,
                selectedServers,
                setSelectedServers,
                mcpResources,
                setMcpResources,
                selectMcpResource,
                mcpResource,
                setMcpTools,
                mcpTools
            }
            }
        >
            {children}
        </McpServerContext.Provider>
    )
}

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const searchparams = useSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [aiTyping, setAiTyping] = useState(false);
    const [aiWriting, setAiWriting] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();
    const [chatId, setChatId] = useState<String>("")
    const [isChatRoom, setIsChatRoom] = useState<boolean>(false);
    const [historyItems, setHistory] = useState<GroupedHistoryByDate>({});
    const [language, selectLanguage] = useState<string>('English');
    const [isChatPage, setChatPage] = useState<boolean>(false);
    const [alertModel, setAlertModel] = useState<boolean>(true);

    const [Model, selectModel] = useState<string>('gpt-5-nano');
    const [editInput, setEditInput] = useState<string>('');
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspace] = useState<string>('');
    const [workspaceData, setWorkspaceData] = useState<any>(null);
    const [chatMode, setChatMode] = useState<ChatMode>('text'); // Replace 'default' with an actual ChatMode value
    const { temperature, top_p, frequency_penalty, presence_penalty } = useLLMStyleStore();

    //agents 
    const [agentId, setAgentId] = useState('')
    const [userAgents, setUserAgents] = useState<any[]>([])

    //console.log(editInput)
    const { user, status } = useAuth();
    const pathname = usePathname();
    //  console.log(user)
    const alertMessage = useAlert()

    const chat = messages.map((msg) => ({
        role: msg.role, // "user" or "assistant"
        content: msg.content, // The message content
        tool_call_id: msg.tool_call_id,
        tool_calls: msg.tool_calls
    }));
    let memoizedHistory;
    //console.log(messages, chat)
    useEffect(() => {
        const mode = searchparams.get('mode');
        if (mode) {
            setChatMode(mode as ChatMode);
        } else {
            setChatMode('text'); // or your default ChatMode value
        }
        const model = searchparams.get('model');
        if (model) {
            selectModel(model)
        } else {
            if (mode === 'text') {
                selectModel('gpt-5-nano')
            }
        }
    }, [])

    useEffect(() => {
        async function getData() {
            if (status === 'unauthenticated') {
                console.error("User unauthenticated");
                return;
            }
            if (!user?.uid) {
                console.error("User UID is missing");
                return;
            }

            try {
                const [userResult, workspaceResult, workspaceDetails] = await Promise.allSettled([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/chathistory/${user.uid}`, { withCredentials: true }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/workspaces/${user?.uid}`, { withCredentials: true }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/chathistory/${user.uid}?wid=${currentWorkspace}`, { withCredentials: true })
                ]);
                // console.log(userResult, serverResult)
                // Handle workspace result
                if (workspaceResult.status === 'fulfilled') {
                    const workspaceResponse = workspaceResult.value;
                    if (workspaceResponse.status === 200) {
                        const workspaceData = workspaceResponse.data.workspaces;
                        if (workspaceData) {
                            setWorkspaces(workspaceData);

                        } else {
                            setWorkspaces([]);
                        }
                    } else {
                        // console.warn("Workspace data invalid or not found:", workspaceResponse);
                        setWorkspaces([]);
                    }
                }


                if (workspaceDetails.status === 'fulfilled') {
                    const workspaceDetailsResponse = workspaceDetails.value;
                    if (workspaceDetailsResponse.status === 200) {
                        const workspaceData = workspaceDetailsResponse.data.userData;
                        if (workspaceData) {
                            setWorkspaceData(workspaceData);
                            setHistory(workspaceData);
                        } else {
                            setWorkspaceData(null);
                        }
                    } else {
                        // console.warn("Workspace details invalid or not found:", workspaceDetailsResponse);
                        setWorkspaceData(null);
                    }
                }

                // Handle user result
                if (userResult.status === 'fulfilled') {
                    const userResponse = userResult.value;
                    if (userResponse.status === 200) {
                        const userData = userResponse.data.userData;
                        if (currentWorkspace === '') {
                            if (!userData) {
                                setHistory({});
                            } else {
                                setHistory(userData);
                            }
                        }
                    } else {
                        // console.warn("User data response invalid:", userResponse);
                        setHistory({});
                    }
                } else {
                    //console.error("Failed to fetch user data:", userResult.reason);
                    setHistory({});
                }

                // Handle server result independently

            } catch (err) {
                console.error("Unexpected error occurred:", err);
            }

        }

        if (user) getData();
    }, [user, memoizedHistory, currentWorkspace, aiTyping, status])
    memoizedHistory = useMemo(() => historyItems, [historyItems]);
    // console.log(memoizedHistory)
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);


    const handleSendMessage = useCallback(async (message: MessageContentItem[], mcpServers: any[], bot?: boolean, lang?: string) => {
        abortControllerRef.current = new AbortController();
        let chat_id;

        if (user && !(pathname.startsWith('/c/') || (pathname.includes('/workspace/') && pathname.includes('/c/')) || (pathname.includes('/agents/') && pathname.includes('/c/')))) {
            try {

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/chat/newChat`, { withCredentials: true });
                if (response.data.status === 'success') {
                    chat_id = response.data.chat_id;
                    console.log(response.data.chat_id)
                    setChatId(response.data.chat_id)
                    // setHistory([{ title: chat_id, chat_id: chat_id }])
                    if (agentId !== '') {
                        router.push(`/agent/${agentId}/c/${response.data.chat_id}`)
                    } else {
                        router.push(currentWorkspace === '' ? `/c/${response.data.chat_id}?model=${Model}&mode=${chatMode}` : `/workspace/${currentWorkspace}/c/${response.data.chat_id}?model=${Model}&mode=${chatMode}`);
                    }
                };
                // await updateChat(messageData, response.data.chat_id);
                // return;
            } catch (error: any) {
                console.log(error.message);
            }
        }

        setAiTyping(true);

        const userMessage = { content: message, msg_id: `msg_${uuidv7()}`, type: 'text', created_on: Date.now(), role: 'user' };
        setMessages((prev) => [...prev, userMessage]);


        try {

            const messageData: MessageInterface = {
                content: message,
                role: 'user',
                msg_id: `msg_${uuidv7()}`
                , type: 'text',
                created_on: 0
            }
            const config = {
                model: Model,
                mcp_server: mcpServers,
                temperature: temperature,
                top_p: top_p,
                frequency_penalty: frequency_penalty,
                presence_penalty: presence_penalty,
                supportsMedia: getMediaSupportByModelName(Model)
            }
            let response;
            //console.log(chatId, chat_id)
            if (agentId !== '') {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/agents/chat/completion`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    },
                    body: JSON.stringify({ messageData, history: chat, uid: `${user ? user?.uid : null}`, chat_id: chatId ? `${chatId}` : `${chat_id}`, workspace: currentWorkspace, config: config, aid: agentId }),
                    signal: abortControllerRef.current.signal,
                    credentials: 'include',
                });
            } else {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/chat/completion`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    },
                    body: JSON.stringify({ messageData, history: chat, uid: `${user ? user?.uid : null}`, chat_id: chatId ? `${chatId}` : `${chat_id}`, workspace: currentWorkspace, config: config }),
                    signal: abortControllerRef.current.signal,
                    credentials: 'include',
                });
            }
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (!response.body) {
                alertMessage.error("No response body received.");
                throw new Error("No response body received.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = "";


            while (true) {

                const { done, value } = await reader.read();
                if (done) {
                    return;
                }


                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n').filter(Boolean);

                for (const line of lines) {
                    try {
                        const jsonStr = line.replace(/^data:\s*/, ''); // Fix: Safe regex replace
                        const parsed = JSON.parse(jsonStr);
                        console.log(parsed, parsed.tool_calls)

                        const msg_id = parsed.msg_id;
                        aiResponse += parsed.response;
                        //if (parsed.type === 'text') setAiTyping(false);
                        setAiWriting(true)
                        if (parsed.type === 'error') {
                            alertMessage.error(parsed.response);
                            return;
                        }
                        if (parsed.type === 'event') {
                            // alertMessage.error(parsed.response);

                        }

                        setMessages((prev) => {
                            return prev.some((msg) => msg.msg_id === msg_id)
                                ? prev.map((msg) =>
                                    msg.msg_id === msg_id
                                        ? { ...msg, content: msg.content + parsed.response, type: parsed.type, created_on: parsed.created, model: parsed.model, role: parsed.role, tool_calls: parsed.tool_calls, tool_call_id: parsed.tool_call_id } // Append new response
                                        : msg
                                )
                                : [...prev, { msg_id, content: parsed.response, type: parsed.type, created_on: parsed.created, role: parsed.role, model: parsed.model, tool_calls: parsed.tool_calls, tool_call_id: parsed.tool_call_id }];
                        });


                    } catch (error) {
                        alertMessage.error("Error parsing stream chunk.");
                        console.error("Error parsing stream chunk:", error, line);
                        continue;
                    }
                }
            }



        } catch (error: any) {
            console.error('Error fetching AI response:', error.message);
            if (error.name === 'AbortError') {
                alertMessage.error("Request aborted.");
                setMessages((prev) => [
                    ...prev,
                    { content: "It seems you Stop me😭😭.", isUser: false, msg_id: `msg_${Date.now()}`, type: 'error', created_on: Date.now() },
                ]);
            } else {
                alertMessage.error("Server is busy right now. Try after sometime.");
                setMessages((prev) => [
                    ...prev,
                    { content: "Server is busy right now. Try after sometime.", isUser: false, msg_id: `msg_${Date.now()}`, type: 'error', created_on: Date.now() },
                ]);
            }
        } finally {
            setAiTyping(false);
            setMessages(prevMessages => prevMessages.filter(message => message.type !== 'event'));
            setAiWriting(false)

        }
    }, [user, router, chat, chatId]);
    return (
        <ChatContext.Provider
            value={{
                messages,
                setMessages,
                setHistory,
                aiTyping,
                setAiTyping,
                abortControllerRef,
                handleSendMessage,
                setIsChatRoom,
                setChatId,
                memoizedHistory,
                selectLanguage, language,
                setChatPage,
                alertModel,
                setAlertModel, selectModel,
                Model,
                chatId,
                setEditInput, editInput,
                chatMode,
                setChatMode,
                aiWriting,
                setAgentId,
                agentId, userAgents, setUserAgents

            }}
        >
            <McpServerProvider>
                <WorkspaceContext.Provider value={{ workspaces, setWorkspaces, currentWorkspace, setCurrentWorkspace, workspaceData, setWorkspaceData }}>
                    <ImagePlaygroundProvider>
                        <VideoPlaygroundProvider>
                            <AgentProvider>
                                {children}
                            </AgentProvider>
                        </VideoPlaygroundProvider>
                    </ImagePlaygroundProvider>
                </WorkspaceContext.Provider>
            </McpServerProvider>
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
export const useMcpServer = () => {
    const context = useContext(McpServerContext);
    if (context === undefined) {
        throw new Error("useMcpServer");
    }
    return context;
};
export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
};
export const useImagePlaygound = () => {
    const context = useContext(ImagePlaygroundContext);
    if (context === undefined) {
        throw new Error("error in ImagePlaygroundContextProvider");
    }
    return context;
};
export const useVideoPlayground = () => {
    const context = useContext(VideoPlaygroundContext);
    if (context === undefined) {
        throw new Error("error in VideoPlaygroundContextProvider");
    }
    return context;
};
export const useAgent = () => {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error("error in Agent Provider");
    }
    return context;
};