'use client'
import React, { useEffect, useRef, useState } from "react"
import { Image, Layers, MonitorSmartphone, PanelRightClose, Sparkles, Timer, TvMinimal, User2 } from "lucide-react"
import './settings-btn.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useChat, useImagePlaygound, useVideoPlayground } from "../../context/ChatContext"
import { getAllLLMStyles, getLLMParamsByStyle, imageModels, llmModels, vidoeModels } from "../utils/models-list"
import { useLLMStyleStore } from "@/store/useLLMStyleStore"

interface SettingsButtonProps {
    openModal: boolean
    onClose: () => void
    [key: string]: any // for {...props}
}
const SettingsButton = ({ openModal, onClose, ...props }: SettingsButtonProps) => {
    const { imageSettings, setImageSettings } = useImagePlaygound();
    const { videoSettings, setVideoSettings } = useVideoPlayground();
    const { selectModel, Model, chatMode } = useChat();
    const searchParams = useSearchParams();
    const router = useRouter()
    const modalRef = useRef<HTMLDivElement>(null);
    const styles = getAllLLMStyles();
    const { selectedStyle, setStyle } = useLLMStyleStore();

    const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const style = event.target.value;
        setStyle(style);
    };
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

    if (!openModal) return null;

    return (
        <>
            <div className="settings-btn-modal" ref={modalRef} >
                <label>Settings</label>
                {chatMode === 'image' &&
                    <>
                        {Model === 'dalle-3' && <div className="settings-btn-cont">
                            <label><TvMinimal size={16} />Size</label>
                            <select className="model-selector-trigger" onChange={(e) => { setImageSettings(prev => ({ ...prev, size: e.target.value })) }} defaultValue={imageSettings.size}>
                                <option value='1024x1024'>1024x1024</option>
                                <option value='1024x1792'>1024x1792</option>
                                <option value='1792x1024'>1792x1024</option>
                            </select>
                            <hr />
                            <label><Sparkles size={16} />Style</label>
                            <select className="model-selector-trigger" onChange={(e) => { setImageSettings(prev => ({ ...prev, style: e.target.value })) }} defaultValue={imageSettings.style}>
                                <option value='vivid'>Vivid</option>
                                <option value='natural'>Natural</option>
                            </select>
                            <hr />
                            <label><Image size={16} />Quality</label>
                            <select className="model-selector-trigger" onChange={(e) => { setImageSettings(prev => ({ ...prev, quality: e.target.value })) }} defaultValue={imageSettings.quality}>
                                <option value='standard'>Standard</option>
                                <option value='hd'>High</option>
                            </select>
                        </div>}
                        {Model.includes('stable') && <div className="settings-btn-cont" >
                            <label><TvMinimal size={16} />Size</label>
                            <select className="model-selector-trigger" onChange={(e) => { setImageSettings(prev => ({ ...prev, size: e.target.value })) }} defaultValue={imageSettings.size}>
                                <option value='672x1566'>672x1566</option>
                                <option value='768x1366'>768x1366</option>
                                <option value='836x1254'>836x1254</option>
                                <option value='916x1145'>916x1145</option>
                                <option value='1024x1024'>1024x1024</option>
                                <option value='1145x916'>1145x916</option>
                                <option value='1254x836'>1254x836</option>
                                <option value='1366x768'>1366x768</option>
                                <option value='1566x672'>1566x672</option>
                            </select>
                        </div>}
                        {Model.includes('bria') && <div className="settings-btn-cont" >
                            <label><TvMinimal size={16} />Size</label>
                            <select className="model-selector-trigger" onChange={(e) => { setImageSettings(prev => ({ ...prev, size: e.target.value })) }} defaultValue={imageSettings.size}>

                                <option value='768x1344'>768x1344</option>
                                <option value='832x1216'>832x1216</option>
                                <option value='896x1152'>896x1152</option>
                                <option value='896x1088'>896x1088</option>
                                <option value='1024x1024'>1024x1024</option>
                                <option value='1088x896'>1088x896</option>
                                <option value='1152x896'>1152x896</option>
                                <option value='1216x832'>1216x832</option>
                                <option value='1344x768'>1344x768</option>

                            </select>
                        </div>}
                        {Model.includes('imagen') && <div className="settings-btn-cont">
                            <label><MonitorSmartphone size={16} />Ratio</label>
                            <select className="model-selector-trigger" onChange={(e) => { setImageSettings(prev => ({ ...prev, ratio: e.target.value })) }} defaultValue={imageSettings.ratio}>
                                <option value='1:1'>1:1</option>
                                <option value='3:4'>3:4</option>
                                <option value='4:3'>4:3</option>
                                <option value='9:16'>9:16</option>
                                <option value='16:9'>16:9</option>
                            </select>
                        </div>}
                    </>

                }
                {chatMode === 'video' &&
                    <>{Model.includes('sora') && <div className="settings-btn-cont">
                        <label><TvMinimal size={16} />Resolution</label>
                        <select className="model-selector-trigger" onChange={(e) => { setVideoSettings(prev => ({ ...prev, resolution: e.target.value })) }} defaultValue={videoSettings.resolution}>
                            <option value='480p'>480p</option>
                            <option value='720p'>720p</option>
                            <option value='1080p'>1080p</option>
                        </select>
                        <hr />
                        <label><MonitorSmartphone size={16} />Ratio</label>
                        <select className="model-selector-trigger" onChange={(e) => { setVideoSettings(prev => ({ ...prev, ratio: e.target.value })) }} defaultValue={videoSettings.ratio}>
                            <option value='1:1'>1:1</option>
                            <option value='9:16'>9:16</option>
                            <option value='16:9'>16:9</option>
                        </select>
                        <hr />
                        <label><Timer size={16} />Durations</label>
                        <select className="model-selector-trigger" onChange={(e) => { setVideoSettings(prev => ({ ...prev, duration: e.target.value })) }} defaultValue={videoSettings.duration}>
                            <option value='5'>5 seconds</option>
                            <option value='10'>10 seconds</option>
                            <option value='15'>15 seconds</option>
                            <option value='20'>20 seconds</option>
                        </select>

                    </div>}
                        {Model.includes('veo') && <div className="settings-btn-cont">
                            <label><TvMinimal size={16} />Resolution</label>
                            <select className="model-selector-trigger" onChange={(e) => { setVideoSettings(prev => ({ ...prev, resolution: e.target.value })) }} defaultValue={videoSettings.resolution}>
                                <option value='720p'>720p</option>
                                {!Model.includes('veo-2') && <option value='1080p'>1080p</option>}
                            </select>
                            <hr />
                            <label><Timer size={16} />Durations</label>
                            <select className="model-selector-trigger" onChange={(e) => { setVideoSettings(prev => ({ ...prev, duration: e.target.value })) }} defaultValue={videoSettings.duration}>
                                {Model.includes('veo-2') && <option value='5'>5 seconds</option>}
                                {Model.includes('veo-2') && <option value='10'>6 seconds</option>}
                                {Model.includes('veo-2') && <option value='15'>7 seconds</option>}
                                <option value='20'>8 seconds</option>
                            </select>

                        </div>}
                    </>}
                {chatMode === 'text' && <>
                    <div className="settings-btn-cont">
                        <label>style</label>
                        <select className="model-selector-trigger" value={selectedStyle} onChange={handleStyleChange}>
                            {styles.map(style => (
                                <option key={style} value={style}>
                                    {style}
                                </option>
                            ))}
                        </select>
                    </div>
                </>}

            </div >
        </>
    )
}

export default SettingsButton;