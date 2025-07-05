'use client'
import React, { useEffect, useRef, useState } from "react"
import { Layers, PanelRightClose, User2 } from "lucide-react"
import './selectModel.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useChat } from "../../context/ChatContext"
import { imageModels, llmModels, vidoeModels } from "../utils/models-list"


const SelectModelButton = () => {
    const { selectModel, Model, chatMode } = useChat();
    const searchParams = useSearchParams();
    const router = useRouter()
    return (
        <>
            {chatMode === 'text' && <select className="select-model-btn" onChange={(e) => { selectModel(e.target.value); router.push(`?model=${e.target.value}&mode=${chatMode}`) }} defaultValue={Model} >

                {llmModels.map((llmModel: { value: string; label: string }) => (
                    <option key={llmModel.value} value={llmModel.value}>
                        {llmModel.label}
                    </option>
                ))}
            </select>}
            {chatMode === 'image' && <select className="select-model-btn" onChange={(e) => { selectModel(e.target.value); router.push(`?model=${e.target.value}&mode=${chatMode}`) }} defaultValue={Model} >
                {imageModels.map((model: { value: string; label: string }) => (
                    <option key={model.value} value={model.value}>
                        {model.label}
                    </option>
                ))}
            </select>}
            {chatMode === 'video' && <select className="select-model-btn" onChange={(e) => { selectModel(e.target.value); router.push(`?model=${e.target.value}&mode=${chatMode}`) }} defaultValue={Model} >
                {vidoeModels.map((model: { value: string; label: string }) => (
                    <option key={model.value} value={model.value}>
                        {model.label}
                    </option>
                ))}
            </select>}
        </>
    )
}

export default SelectModelButton;