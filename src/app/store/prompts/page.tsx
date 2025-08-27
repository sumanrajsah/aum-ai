"use client"
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Oval } from 'react-loader-spinner'
import { useAuth } from "@/hooks/useAuth";
import { useMcpServer } from "@/context/ChatContext";
import MCPServerCard from "@/app/components/mcpComp/mcpcard";

export default function PromptsPage() {

    const router = useRouter();

    const [isFetching, setFetching] = useState(false)
    const { mcpServers, setMcpServers, setSelectedServers, selectedServers, setMcpResources, selectMcpResource, mcpResource, mcpResources } = useMcpServer();
    console.log(mcpServers)
    const { status, isAuthLoading } = useAuth()



    return (
        <div className="mcp-page-body">
            <div className="mcp-header">
                <h1>Comming Soon</h1>
            </div>
        </div>

    );
}