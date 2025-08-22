"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Oval } from 'react-loader-spinner'
import './style.css'
import { toast, ToastContainer } from "react-toastify";
import GoogleSignInButton from "@/app/components/GSB";
import Header from "@/app/components/header/header";
import Modal from "@/app/components/modal";
import Sidebar from "@/app/components/sidebar/sidebar";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useMcpServer } from "@/context/ChatContext";
import MCPServerCard from "@/app/components/mcpComp/mcpcard";

export default function MCPPage() {

    const router = useRouter();

    const [isFetching, setFetching] = useState(false)
    const { mcpServers, setMcpServers, setSelectedServers, selectedServers, setMcpResources, selectMcpResource, mcpResource, mcpResources } = useMcpServer();
    console.log(mcpServers)
    const { status, isAuthLoading } = useAuth()



    return (
        <div className="mcp-page-body">
            <div className="mcp-header">
                <h1>Your MCP Servers</h1>
            </div>

            {isFetching ? (
                <div className="loading-container">
                    <Oval height={40} width={40} color="#4fa94d" />
                </div>
            ) : mcpServers.length === 0 ? (
                <p>No MCP Server Found</p>
            ) : (
                <div className="mcp-card-list">
                    {mcpServers.map((server, index) => (
                        <MCPServerCard key={index} mcp={server} />
                    ))}
                </div>
            )}
        </div>

    );
}