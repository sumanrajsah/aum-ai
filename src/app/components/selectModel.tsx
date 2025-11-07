'use client'
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Layers, PanelRightClose, User2, DollarSign, ArrowUpDown, Cpu } from "lucide-react"
import './selectModel.css' // Add the sort-button styles to this CSS file
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useChat } from "../../context/ChatContext"
import { imageModels, llmModels, vidoeModels } from "../utils/models-list"
import { useAuth } from "@/hooks/useAuth"

export const llmModelsFree = ['gpt-5-nano', 'gpt-4.1-nano', 'mistral-small-2503', 'ministral-3b', 'grok-3-mini', 'mistral-nemo', 'phi-4-mini-reasoning', 'gpt-4o-mini', 'grok-4-fast-non-reasoning', 'grok-4-fast-reasoning'];

export function isModelAvailable(modelValue: string): boolean {
    return llmModelsFree.includes(modelValue);
}

type SortOption = 'default' | 'cheap' | 'expensive' | 'free';

const SelectModelButton = () => {
    const { user } = useAuth();
    const { selectModel, Model, chatMode } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(Model);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const selectedModelRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        if (isOpen && selectedModelRef.current) {
            selectedModelRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [isOpen, selectedModel]);

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

    // add near top of file
    type IOCredit = { inputCredits: number; outputCredits: number };
    const hasIOCredits = (m: any): m is IOCredit =>
        typeof m?.inputCredits === "number" && typeof m?.outputCredits === "number";

    // Calculate total cost for a model
    const getModelCost = (model: any): number => {
        if (isModelAvailable(model.value)) return 0; // Free models
        if (hasIOCredits(model)) {
            return model.inputCredits + model.outputCredits;
        }
        if (model.credits) {
            return model.credits;
        }
        return 0;
    };

    // Sort models based on selected option
    const getSortedModels = () => {
        const modelsList = user?.uid ? models : models.filter(m => isModelAvailable(m.value));

        switch (sortBy) {
            case 'free':
                return modelsList.filter(m => isModelAvailable(m.value));
            case 'cheap':
                return [...modelsList].sort((a, b) => getModelCost(a) - getModelCost(b));
            case 'expensive':
                return [...modelsList].sort((a, b) => getModelCost(b) - getModelCost(a));
            default:
                return modelsList;
        }
    };

    const sortedModels = getSortedModels();

    // Handle model selection
    const handleModelSelect = (modelValue: any) => {
        setSelectedModel(modelValue);
        selectModel(modelValue);
        router.push(`?model=${modelValue}&mode=${chatMode}`);
        setIsOpen(false);
    };

    // Handle pricing button click
    const handlePricingClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push('/pricing')
    };

    // Handle sort change
    const handleSortChange = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sortOptions: SortOption[] = ['default', 'cheap', 'expensive', 'free'];
        const currentIndex = sortOptions.indexOf(sortBy);
        const nextIndex = (currentIndex + 1) % sortOptions.length;
        setSortBy(sortOptions[nextIndex]);
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

    return (
        <div className="custom-model-selector" ref={dropdownRef}>
            <button
                className="model-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <Cpu size={16} />
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
                            {/* <span className="mode-badge">{chatMode}</span> */}
                            <button
                                className="sort-button"
                                onClick={handleSortChange}
                                title={`Sort by: ${sortBy}`}
                            >
                                <ArrowUpDown size={10} />
                                {sortBy === 'default' ? 'Sort' : sortBy}
                            </button>
                            <button
                                className="pricing-button"
                                onClick={handlePricingClick}
                                title="View Pricing"
                            >
                                <DollarSign size={10} />Pricing
                            </button>
                        </div>
                    </div>
                    {!user?.uid && (
                        <p className="dropdown-title" style={{ display: 'flex', justifyContent: 'center', fontSize: '12px' }}>Login to unlock more models.</p>
                    )}
                    <ul className="model-list" role="listbox">
                        {sortedModels.map((model) => (
                            <li
                                key={model.value}
                                ref={selectedModel === model.value ? selectedModelRef : null}
                                className={`model-option ${selectedModel === model.value ? 'selected' : ''}`}
                                onClick={() => handleModelSelect(model.value)}
                                role="option"
                                aria-selected={selectedModel === model.value}
                            >
                                <div className="model-info">
                                    <span className="s-model-name">{model.label}</span>
                                    {hasIOCredits(model) ? (
                                        <div className="model-credits">
                                            {!isModelAvailable(model.value) && <span className="credit-item">Input: {model.inputCredits} | </span>}
                                            {!isModelAvailable(model.value) && <span className="credit-item">Output: {model.outputCredits}</span>}
                                            {isModelAvailable(model.value) && <span className="credit-item">Free</span>}
                                        </div>
                                    ) : model.credits ? (
                                        <div className="model-credits">
                                            <span className="credit-item">
                                                Credits: {model.credits} {chatMode === 'video' && '/s'}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                                {selectedModel === model.value && <Check className="check-icon" size={16} />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectModelButton;