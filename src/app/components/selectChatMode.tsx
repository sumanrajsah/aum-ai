'use client'
import React, { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Layers, MessageSquare } from "lucide-react"
import "./selectModel.css"
import { useRouter } from "next/navigation"
import { useChat } from "../../context/ChatContext"

type ChatMode = "text" | "image" | "video"

const SelectChatModeButton = () => {
    const { chatMode, setChatMode, selectModel } = useChat()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedMode, setSelectedMode] = useState<ChatMode>(chatMode)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const chatModes: { value: ChatMode; label: string; model: string }[] = [
        { value: "text", label: "Text", model: "gpt-5-nano" },
        { value: "image", label: "Image", model: "dalle-3" },
        { value: "video", label: "Video", model: "sora" },
    ]

    const currentMode = chatModes.find((m) => m.value === selectedMode) || chatModes[0]

    const handleSelect = (mode: ChatMode) => {
        const selected = chatModes.find((m) => m.value === mode)
        if (!selected) return
        setSelectedMode(mode)
        setChatMode(mode)
        selectModel(selected.model)
        router.push(`/?model=${selected.model}&mode=${mode}`)
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="custom-model-selector" ref={dropdownRef}>
            <button
                className="model-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                style={{ maxWidth: '100px' }}
            >
                <MessageSquare size={16} />

                <span className="selected-model-label">{currentMode.label}</span>
                <ChevronDown className={`chevron-icon ${isOpen ? "rotated" : ""}`} size={16} />
            </button>

            {isOpen && (
                <div className="model-dropdown">
                    <div className="dropdown-header">
                        <span className="dropdown-title">Select Mode</span>
                    </div>

                    <ul className="model-list" role="listbox">
                        {chatModes.map((mode) => (
                            <li
                                key={mode.value}
                                className={`model-option ${selectedMode === mode.value ? "selected" : ""}`}
                                onClick={() => handleSelect(mode.value)}
                                role="option"
                                aria-selected={selectedMode === mode.value}
                            >
                                <div className="model-info">
                                    <span className="s-model-name">{mode.label}</span>
                                </div>
                                {selectedMode === mode.value && <Check className="check-icon" size={16} />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SelectChatModeButton
