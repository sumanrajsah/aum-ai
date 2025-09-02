"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Oval } from 'react-loader-spinner'
import './style.css'

import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/context/ChatContext";
import { BrainCircuit, MessageSquare } from "lucide-react";

export default function Publish() {
    const { status, isAuthLoading } = useAuth();
    const router = useRouter();

    const publishOptions = [
        {
            id: 'agent',
            title: 'AI Agents',
            description: 'Create and deploy intelligent AI agents for automated tasks',
            icon: <BrainCircuit />,
            route: '/store/publish/agent',
            gradient: 'from-blue-500 to-purple-600'
        },
        {
            id: 'prompt',
            title: 'Prompts',
            description: 'Share your best prompts and templates with the community',
            icon: <MessageSquare />,
            route: '/store/publish/prompt',
            gradient: 'from-green-500 to-teal-600'
        },
        {
            id: 'mcp',
            title: 'MCP Tools',
            description: 'Publish Model Context Protocol tools and integrations',
            icon: <svg fill="currentColor" height="20px" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z"></path><path d="M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z"></path></svg>,
            route: '/store/publish/mcp',
            gradient: 'from-orange-500 to-red-600'
        }
    ];

    return (
        <div className="publish">
            <div className="publish-container">
                <div className="publish-header">
                    <h1 className="publish-title">What would you like to publish?</h1>
                    <p className="publish-subtitle">Share your creations with the community and help others build amazing things</p>
                </div>

                <div className="publish-grid">
                    {publishOptions.map((option) => (
                        <div
                            key={option.id}
                            className="publish-card"
                            onClick={() => router.push(option.route)}
                        >
                            <div className={`publish-card-gradient ${option.gradient}`}></div>
                            <div className="publish-card-content">
                                <div className="publish-card-icon">
                                    {option.icon}
                                </div>
                                <br />
                                <h3 className="publish-card-title">{option.title}</h3>
                                <p className="publish-card-description">{option.description}</p>
                                <div className="publish-card-arrow">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}