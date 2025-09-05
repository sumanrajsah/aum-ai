'use client'
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Layers, PanelRightClose, User2, DollarSign } from "lucide-react"
import './selectModel.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useChat } from "../../context/ChatContext"
import { imageModels, llmModels, vidoeModels } from "../utils/models-list"

export const llmModelsFree = ['gpt-5-nano', 'gpt-4.1-nano', 'mistral-small-2503', 'ministral-3b', 'grok-3-mini', 'mistral-nemo', 'phi-4-mini-reasoning', 'gpt-4o-mini'];

export function isModelAvailable(modelValue: string): boolean {
    return llmModelsFree.includes(modelValue);
}

const SelectModelButton = () => {
    const { selectModel, Model, chatMode } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(Model);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const scrollToItem = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            node.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, []);

    // Get the appropriate models based on chat mode
    const getModels = () => {
        switch (chatMode) {
            case 'text': return llmModels;
            case 'image': return imageModels;
            case 'video': return vidoeModels;
            default: return llmModels;
        }
    };

    const models = getModels();
    const currentModel = models.find(model => model.value === selectedModel) || models[0];

    // Handle model selection
    const handleModelSelect = (modelValue: any) => {
        setSelectedModel(modelValue);
        selectModel(modelValue);
        router.push(`?model=${modelValue}&mode=${chatMode}`);
        setIsOpen(false);
    };

    // Handle pricing button click
    const handlePricingClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent dropdown from closing
        router.push('/pricing')
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update selected model when Model prop changes
    useEffect(() => {
        setSelectedModel(Model);
    }, [Model]);

    // add near top of file
    type IOCredit = { inputCredits: number; outputCredits: number };
    const hasIOCredits = (m: any): m is IOCredit =>
        typeof m?.inputCredits === "number" && typeof m?.outputCredits === "number";

    return (
        <div className="custom-model-selector" ref={dropdownRef}>
            <button
                className="model-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className="selected-model-label">{currentModel.label}</span>
                <ChevronDown
                    className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
                    size={16}
                />
            </button>

            {isOpen && (
                <div className="model-dropdown">
                    <div className="dropdown-header">
                        <span className="dropdown-title">Select Model</span>
                        <div className="header-actions">
                            <span className="mode-badge">{chatMode}</span>
                            <button
                                className="pricing-button"
                                onClick={handlePricingClick}
                                title="View Pricing"
                            >
                                <DollarSign size={10} />Pricing
                            </button>
                        </div>
                    </div>
                    <ul className="model-list" role="listbox">
                        {models.map((model) => (
                            <li
                                key={model.value}
                                className={`model-option ${selectedModel === model.value ? 'selected' : ''}`}
                                onClick={() => handleModelSelect(model.value)}
                                role="option"
                                aria-selected={selectedModel === model.value}
                            >
                                <div className="model-info">
                                    <span className="s-model-name">{model.label}</span>
                                    {hasIOCredits(model) ? (
                                        <div className="model-credits">
                                            {!isModelAvailable(model.value) && <span className="credit-item">Input: {model.inputCredits} </span>}
                                            {!isModelAvailable(model.value) && <span className="credit-item">Output: {model.outputCredits} </span>}
                                            {isModelAvailable(model.value) && <span className="credit-item">Free</span>}
                                        </div>
                                    ) : model.credits ? (
                                        <div className="model-credits">
                                            <span className="credit-item">Credits: {model.credits} {chatMode === 'video' && '/s'} </span>
                                        </div>
                                    ) : null}
                                </div>
                                {selectedModel === model.value && (
                                    <Check className="check-icon" size={16} />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectModelButton;