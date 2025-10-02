'use client'
import React, { useEffect, useRef, useState } from "react"
import { BookOpen, ClipboardCheck, Globe, Image, Images, Layers, MonitorSmartphone, PanelRightClose, Sparkles, Timer, TvMinimal, User2 } from "lucide-react"
import './tool.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useChat, useMcpServer } from "@/context/ChatContext"
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
    const { tools: prevTools, setTools } = useChat();
    const { theme } = useTheme()

    const toggleToolSelection = (toolName: string) => {
        setTools(prev =>
            prev.includes(toolName) ? [] : [toolName]  // only keep one tool
        );
    };


    const tools = [
        {
            id: 'web_search',
            label: 'Search',
            name: 'Search on Web',
            description: 'Browse and search the internet for information',
            icon: Globe
        },
        {
            id: 'study_mode',
            label: 'Study',
            name: 'Study',
            description: 'Help you learn, summarize, create flashcards, and generate quizzes from study material',
            icon: BookOpen // or any study-related icon
        },
        {
            id: 'exam_mode',
            label: 'Exam',
            name: 'Exam',
            description: 'Conduct timed exams with MCQs, short answers, problem-solving, and provide scoring and reports',
            icon: ClipboardCheck // or any exam-related icon
        }
    ];


    return (
        <div className="selecttool-btn-modal">
            <div className="tool-modal-header">
                <h3 className="tool-modal-title">
                    <Sparkles size={18} />
                    Select Tools
                </h3>
                <p className="modal-subtitle">Choose the tools you want to enable for this session</p>
            </div>

            <div className="selecttool-btn-cont">
                {tools.map((tool) => {
                    const IconComponent = tool.icon;
                    const isSelected = prevTools.includes(tool.id);

                    return (
                        <div
                            key={tool.id}
                            className={`tool-modal-checkbox ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleToolSelection(tool.id)}
                        >
                            <div className="tool-content">
                                <div className="tool-header">
                                    <div className="tool-icon">
                                        <IconComponent size={16} />
                                    </div>
                                    <div className="tool-name">{tool.name}</div>
                                </div>
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

            <div className="tool-modal-footer">
                <div className="selected-count">
                    {prevTools.length} tool{prevTools.length !== 1 ? 's' : ''} selected
                </div>
            </div>
        </div>
    )
}

export default SelectToolButton;