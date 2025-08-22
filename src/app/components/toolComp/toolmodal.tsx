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

const SelectToolButton = () => {
    const searchParams = useSearchParams();
    const router = useRouter()
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedTools, setSelectedTools] = useState<string[]>([])
    const { theme } = useTheme()

    const toggleToolSelection = (toolName: string) => {
        setSelectedTools(prev =>
            prev.includes(toolName)
                ? prev.filter(t => t !== toolName)
                : [...prev, toolName]
        );
    };

    const tools = [
        {
            id: 'image',
            name: 'Create an Image',
            description: 'Generate AI-powered images and visual content',
            icon: Images
        },
        {
            id: 'search',
            name: 'Search on Web',
            description: 'Browse and search the internet for information',
            icon: Globe
        }
    ];

    return (
        <div className="selecttool-btn-modal">
            <div className="modal-header">
                <h3 className="modal-title">
                    <Sparkles size={18} />
                    Select Tools
                </h3>
                <p className="modal-subtitle">Choose the tools you want to enable for this session</p>
            </div>

            <div className="selecttool-btn-cont">
                {tools.map((tool) => {
                    const IconComponent = tool.icon;
                    const isSelected = selectedTools.includes(tool.id);

                    return (
                        <div
                            key={tool.id}
                            className={`tool-checkbox ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleToolSelection(tool.id)}
                        >
                            <div className="tool-content">
                                <div className="tool-header">
                                    <div className="tool-icon">
                                        <IconComponent size={16} />
                                    </div>
                                    <div className="tool-name">{tool.name}</div>
                                </div>
                                <div className="tool-description">{tool.description}</div>
                            </div>
                            <div className="tool-check">
                                <ToggleSwitch
                                    checked={isSelected}
                                    onChange={() => toggleToolSelection(tool.id)}
                                    id={`toggle-${tool.id}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="modal-footer">
                <div className="selected-count">
                    {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                </div>
            </div>
        </div>
    )
}

export default SelectToolButton;