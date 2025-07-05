'use client'
import React, { useEffect, useRef, useState } from "react"
import { Globe, Image, Images, Layers, MonitorSmartphone, PanelRightClose, Sparkles, Timer, TvMinimal, User2 } from "lucide-react"
import './tool.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useMcpServer } from "@/context/ChatContext"
import ToggleSwitch from "../toggleSwitch"

interface SelectToolButtonProps {
    openModal: boolean
    onClose: () => void
    [key: string]: any // for {...props}
}
const SelectToolButton = ({ openModal, onClose, ...props }: SelectToolButtonProps) => {

    const searchParams = useSearchParams();
    const router = useRouter()
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedTools, setSelectedTools] = useState<string[]>([])
    // console.log(imageSettings)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose(); // close modal if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { mcpServers, setMcpServers, setSelectedServers, selectedServers, setMcpResources, selectMcpResource, mcpResource, mcpResources, mcpTools } = useMcpServer();
    const { theme } = useTheme()

    const toggleToolSelection = (toolName: string) => {
        setSelectedTools(prev =>
            prev.includes(toolName)
                ? prev.filter(t => t !== toolName)
                : [...prev, toolName]
        );
    };


    if (!openModal) return null;

    return (
        <>
            <div className="selecttool-btn-modal" ref={modalRef} >
                <label>Select Tools</label>
                <div className="selecttool-btn-cont">
                    <div className="tool-checkbox" onClick={() => { toggleToolSelection('image') }}>
                        <div className="tool-name"><Images size={14} />create an image</div>
                        <div className="tool-check">
                            <ToggleSwitch
                                checked={selectedTools.some((s) => s === 'image')}
                                onChange={() => toggleToolSelection('image')}
                                id={`toggle-${'image'}`}
                            />
                        </div>
                    </div>
                    <div className="tool-checkbox" onClick={() => { toggleToolSelection('search') }}>
                        <div className="tool-name"><Globe size={14} />search on web</div>
                        <div className="tool-check">
                            <ToggleSwitch
                                checked={selectedTools.some((s) => s === 'search')}
                                onChange={() => toggleToolSelection('search')}
                                id={`toggle-${'search'}`}
                            />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default SelectToolButton;