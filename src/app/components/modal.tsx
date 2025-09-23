import { useEffect, useRef, useState } from "react";
import { BrainCircuit, LogOut, Pickaxe, Server, Settings, Telescope, User2, Wrench } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";
import McpServerModalSetting from "./mcpComp/mcpSetting";
import McpServerModal from "./mcpComp/serverModal";
import { useAuth } from "../../hooks/useAuth";
import ToolsModal from "./tools/toolModal";
import WorkspaceCreateModal from "./workspace/create";
import RenameChatModal from "./chat/modals/rename";
import ImageModal from "./chat/modals/image-modal";
import { useImagePlaygound, useVideoPlayground } from "@/context/ChatContext";
import VideoModal from "./chat/modals/video-modal";
import ModalSetting from "./modal/settingModal";
import LoginModal from "./modal/login";

const Modal = () => {
    const router = useRouter();
    const { expandImage } = useImagePlaygound()
    const { expandVideo } = useVideoPlayground();
    const [openDisconnecModel, setOpenDisconnectModel] = useState<boolean>(false)
    const { user, status } = useAuth()
    const modalRef = useRef<HTMLDivElement | null>(null);
    const { theme } = useTheme();
    const pathname = usePathname();
    const [openToolsModal, setOpenToolsModal] = useState<boolean>(false);
    const [openWorkspaceCreateModal, setOpenWorkspaceCreateModal] = useState<boolean>(false);
    const [openChatReanmeModal, setOpenChatRenameModal] = useState<boolean>(false);
    const [openImageModal, setImageModal] = useState<boolean>(false)
    const [openVideoModal, setOpenVideoModal] = useState<boolean>(false);
    const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false);
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleHash = () => {
            const hash = window.location.hash;
            //console.log('HASH:', hash);
            setOpenToolsModal(hash === '#tools');
            setOpenWorkspaceCreateModal(hash === '#workspace/create');
            setOpenChatRenameModal(hash.includes('#renamechat'))
            setImageModal(hash.includes('#image'))
            setOpenVideoModal(hash === '#video');
            setOpenSettingsModal(hash === '#settings');
            setOpenLoginModal(hash === '#login');
        };

        // Run on mount
        handleHash();

        // Listen for hash changes (without reload)
        window.addEventListener('hashchange', handleHash);

        return () => {
            window.removeEventListener('hashchange', handleHash);
        };
    }, [pathname]);

    return (
        <>
            {openToolsModal && <ToolsModal />}
            {openWorkspaceCreateModal && user?.uid && <WorkspaceCreateModal />}
            {openChatReanmeModal && user?.uid && <RenameChatModal />}
            {openImageModal && expandImage && user?.uid && <ImageModal />}
            {openVideoModal && expandVideo && user?.uid && <VideoModal />}
            {openSettingsModal && user?.uid && <ModalSetting />}
            {openLoginModal && status !== "authenticated" && <LoginModal />}

        </>
    );
};

export default Modal;
