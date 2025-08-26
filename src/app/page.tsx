"use client"
import { use, useEffect, useRef, useState } from "react";
import axios from 'axios';
import ChatMessage from './components/chatMessage';
import ChatInput from './components/chatInput';
import './style.css';
import './globals.css'
import Image from 'next/image';
import { SyncLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useChat, useMcpServer, useWorkspace } from "../context/ChatContext";
import AdComponent from "./components/ads";
import AdComponent2 from "./components/ads2";
import { Archive, CircleFadingPlus, EllipsisVertical, PanelRightClose, PanelRightOpen, ScrollText, Sun, Trash2, User, User2 } from "lucide-react";
import McpServerModalSetting from "./components/mcpComp/mcpSetting";
import ProfileCont from "./components/header/profile";
import McpServerModal from "./components/mcpComp/serverModal";
import { useTheme } from "next-themes";
import Modal from "./components/modal";
import { useAuth } from "../hooks/useAuth";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";
import { useAlert } from "../context/alertContext";
import PageStruct1 from "./components/pagestruct/struct1";
import TextAssistantMessage from "./components/chat/message-prop/assistant/text-assistant";
import TextUserMessage from "./components/chat/message-prop/user/text-user";
import ToolResultRender from "./components/chat/message-prop/assistant/toolsResult";


export default function Home() {
  const { messages, aiTyping, setIsChatRoom, memoizedHistory, setMessages, selectLanguage, language, setChatPage, alertModel, setAlertModel } = useChat();
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [openDisconnecModel, setOpenDisconnectModel] = useState<boolean>(false)
  const { setCurrentWorkspace, currentWorkspace } = useWorkspace()
  const { user, status } = useAuth()
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const alertMessage = useAlert()

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

  ////console.log(session)

  useEffect(() => {

    setCurrentWorkspace('')
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
      //console.log(response)

      if (response.data.status === 'success') { setSelectedChat(''); alertMessage.success('Deleted'); };
    } catch {

    }
  }


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
          className="chat-cont"
        >
          {(messages.length == 0) && <div className="quote" >
            {/* <Image src={'/sitraone.png'} height={80} width={80} alt="sitraone" /> */}
            {user && <p>How can I assist, {user.name}</p>}
            {!user && <p>Get Started With AUM AI</p>}
          </div>}
          {messages.map((msg, index) => (
            <div className="chat-cont-message" key={msg.msg_id}>
              {Array.isArray(msg.content) ? (
                msg.content.map((item: MessageContentItem, idx) => {
                  let messageContent: string;
                  let filename: string = '';

                  switch (item.type) {
                    case "text":
                      messageContent = item.text;
                      break;
                    case "image_url":
                      messageContent = item.image_url;
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
          ))}

          {(aiTyping) && (
            <ChatMessage message={''} isUser={false} type={'loading'} />


          )}

        </div>
        <ChatInput />
      </>


    </>
  );
};
