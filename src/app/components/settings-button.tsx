'use client'
import React, { useEffect, useRef, useState } from "react"
import { Image, Layers, MonitorSmartphone, PanelRightClose, Sparkles, Timer, TvMinimal, User2, Check, ChevronDown } from "lucide-react"
import './settings-btn.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useChat, useImagePlaygound, useVideoPlayground } from "../../context/ChatContext"
import { getAllLLMStyles, getLLMParamsByStyle, imageModels, llmModels, vidoeModels } from "../utils/models-list"
import { useLLMStyleStore } from "@/store/useLLMStyleStore"
import { calculateImagePrice, calculateVideoPrice } from "../utils/pricing"

interface SettingsButtonProps {
    openModal: boolean
    onClose: () => void
    [key: string]: any
}

interface CustomSelectProps {
    label: string
    icon: React.ReactNode
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
}

const CustomSelect = ({ label, icon, value, options, onChange }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className="custom-setting-select" ref={dropdownRef}>
            <label className="setting-label">
                {icon}
                {label}
            </label>
            <div className="setting-dropdown-wrapper">
                <button
                    className="setting-select-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                >
                    <span className="selected-value">{selectedOption.label}</span>
                    <ChevronDown
                        className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
                        size={14}
                    />
                </button>

                {isOpen && (
                    <div className="setting-dropdown-menu">
                        <ul className="setting-option-list">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    className={`setting-option ${value === option.value ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && <Check className="check-icon" size={14} />}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsButton = ({ openModal, onClose, ...props }: SettingsButtonProps) => {
    const { imageSettings, setImageSettings } = useImagePlaygound();
    const { videoSettings, setVideoSettings } = useVideoPlayground();
    const { selectModel, Model, chatMode, setVideoCredits } = useChat();
    const searchParams = useSearchParams();
    const router = useRouter()
    const modalRef = useRef<HTMLDivElement>(null);
    const styles = getAllLLMStyles();
    const { selectedStyle, setStyle } = useLLMStyleStore();

    const handleStyleChange = (value: string) => {
        setStyle(value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (Model.includes("veo")) {
            setVideoSettings((prev) => ({
                ...prev,
                resolution: "720p",
                duration: "8",
            }));
        }
    }, [Model, setVideoSettings]);

    if (!openModal) return null;

    return (
        <div className="settings-btn-modal" ref={modalRef}>
            <label className="settings-title">Settings</label>

            {chatMode === 'image' && (
                <>
                    {(() => {
                        const price = calculateImagePrice(
                            Model,
                            imageSettings.size,
                            imageSettings.quality
                        );
                        return (
                            <span className="price-tag">
                                *Price: {price.credits} credits*
                            </span>
                        );
                    })()}

                    {Model === 'dalle-3' && (
                        <div className="settings-btn-cont">
                            <CustomSelect
                                label="Size"
                                icon={<TvMinimal size={16} />}
                                value={imageSettings.size || '1024x1024'}
                                options={[
                                    { value: '1024x1024', label: '1024x1024' },
                                    { value: '1024x1792', label: '1024x1792' },
                                    { value: '1792x1024', label: '1792x1024' }
                                ]}
                                onChange={(value) => setImageSettings(prev => ({ ...prev, size: value }))}
                            />
                            <hr />
                            <CustomSelect
                                label="Style"
                                icon={<Sparkles size={16} />}
                                value={imageSettings.style || 'vivid'}
                                options={[
                                    { value: 'vivid', label: 'Vivid' },
                                    { value: 'natural', label: 'Natural' }
                                ]}
                                onChange={(value) => setImageSettings(prev => ({ ...prev, style: value }))}
                            />
                            <hr />
                            <CustomSelect
                                label="Quality"
                                icon={<Image size={16} />}
                                value={imageSettings.quality || 'standard'}
                                options={[
                                    { value: 'standard', label: 'Standard' },
                                    { value: 'hd', label: 'High' }
                                ]}
                                onChange={(value) => setImageSettings(prev => ({ ...prev, quality: value }))}
                            />
                        </div>
                    )}

                    {Model.includes('stable') && (
                        <div className="settings-btn-cont">
                            <CustomSelect
                                label="Size"
                                icon={<TvMinimal size={16} />}
                                value={imageSettings.size || '1024x1024'}
                                options={[
                                    { value: '672x1566', label: '672x1566' },
                                    { value: '768x1366', label: '768x1366' },
                                    { value: '836x1254', label: '836x1254' },
                                    { value: '916x1145', label: '916x1145' },
                                    { value: '1024x1024', label: '1024x1024' },
                                    { value: '1145x916', label: '1145x916' },
                                    { value: '1254x836', label: '1254x836' },
                                    { value: '1366x768', label: '1366x768' },
                                    { value: '1566x672', label: '1566x672' }
                                ]}
                                onChange={(value) => setImageSettings(prev => ({ ...prev, size: value }))}
                            />
                        </div>
                    )}

                    {Model.includes('bria') && (
                        <div className="settings-btn-cont">
                            <CustomSelect
                                label="Size"
                                icon={<TvMinimal size={16} />}
                                value={imageSettings.size || '1024x1024'}
                                options={[
                                    { value: '768x1344', label: '768x1344' },
                                    { value: '832x1216', label: '832x1216' },
                                    { value: '896x1152', label: '896x1152' },
                                    { value: '896x1088', label: '896x1088' },
                                    { value: '1024x1024', label: '1024x1024' },
                                    { value: '1088x896', label: '1088x896' },
                                    { value: '1152x896', label: '1152x896' },
                                    { value: '1216x832', label: '1216x832' },
                                    { value: '1344x768', label: '1344x768' }
                                ]}
                                onChange={(value) => setImageSettings(prev => ({ ...prev, size: value }))}
                            />
                        </div>
                    )}

                    {Model.includes('imagen') && (
                        <div className="settings-btn-cont">
                            <CustomSelect
                                label="Ratio"
                                icon={<MonitorSmartphone size={16} />}
                                value={imageSettings.ratio || '1:1'}
                                options={[
                                    { value: '1:1', label: '1:1' },
                                    { value: '3:4', label: '3:4' },
                                    { value: '4:3', label: '4:3' },
                                    { value: '9:16', label: '9:16' },
                                    { value: '16:9', label: '16:9' }
                                ]}
                                onChange={(value) => setImageSettings(prev => ({ ...prev, ratio: value }))}
                            />
                        </div>
                    )}
                </>
            )}

            {chatMode === 'video' && (
                <>
                    {(() => {
                        let duration = Number(videoSettings.duration) || 5;

                        if (Model?.toLowerCase().includes("veo")) {
                            duration = 8;
                        }

                        const price = calculateVideoPrice(
                            Model,
                            videoSettings.resolution || "720p",
                            videoSettings.ratio || "16:9",
                            duration
                        );
                        setVideoCredits(price.credits + 100);
                        return (
                            <span className="price-tag">
                                *Price: {price.credits + 100} credits*
                            </span>
                        );
                    })()}

                    {Model.includes('sora') && (
                        <div className="settings-btn-cont">
                            <CustomSelect
                                label="Resolution"
                                icon={<TvMinimal size={16} />}
                                value={videoSettings.resolution || '720p'}
                                options={[
                                    { value: '480p', label: '480p' },
                                    { value: '720p', label: '720p' },
                                    { value: '1080p', label: '1080p' }
                                ]}
                                onChange={(value) => setVideoSettings(prev => ({ ...prev, resolution: value }))}
                            />
                            <hr />
                            <CustomSelect
                                label="Ratio"
                                icon={<MonitorSmartphone size={16} />}
                                value={videoSettings.ratio || '16:9'}
                                options={[
                                    { value: '1:1', label: '1:1' },
                                    { value: '9:16', label: '9:16' },
                                    { value: '16:9', label: '16:9' }
                                ]}
                                onChange={(value) => setVideoSettings(prev => ({ ...prev, ratio: value }))}
                            />
                            <hr />
                            <CustomSelect
                                label="Duration"
                                icon={<Timer size={16} />}
                                value={videoSettings.duration || '5'}
                                options={[
                                    { value: '5', label: '5 seconds' },
                                    { value: '10', label: '10 seconds' },
                                    { value: '15', label: '15 seconds' },
                                    { value: '20', label: '20 seconds' }
                                ]}
                                onChange={(value) => setVideoSettings(prev => ({ ...prev, duration: value }))}
                            />
                        </div>
                    )}

                    {Model.includes('veo') && (
                        <div className="settings-btn-cont">
                            <CustomSelect
                                label="Resolution"
                                icon={<TvMinimal size={16} />}
                                value={videoSettings.resolution || '720p'}
                                options={[
                                    { value: '720p', label: '720p' },
                                    ...(!Model.includes('veo-2') ? [{ value: '1080p', label: '1080p' }] : [])
                                ]}
                                onChange={(value) => setVideoSettings(prev => ({ ...prev, resolution: value }))}
                            />
                            <hr />
                            <CustomSelect
                                label="Duration"
                                icon={<Timer size={16} />}
                                value={videoSettings.duration || '20'}
                                options={[
                                    ...(Model.includes('veo-2') ? [
                                        { value: '5', label: '5 seconds' },
                                        { value: '10', label: '6 seconds' },
                                        { value: '15', label: '7 seconds' }
                                    ] : []),
                                    { value: '20', label: '8 seconds' }
                                ]}
                                onChange={(value) => setVideoSettings(prev => ({ ...prev, duration: value }))}
                            />
                        </div>
                    )}
                </>
            )}

            {chatMode === 'text' && (
                <div className="settings-btn-cont">
                    <CustomSelect
                        label="Style"
                        icon={<Sparkles size={16} />}
                        value={selectedStyle}
                        options={styles.map(style => ({ value: style, label: style }))}
                        onChange={handleStyleChange}
                    />
                </div>
            )}
        </div>
    );
};

export default SettingsButton;