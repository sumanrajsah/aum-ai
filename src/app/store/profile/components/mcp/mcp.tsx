"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import McpPopupModal from "@/app/store/components/mcpModal";
import McpCard from "@/app/store/components/mcpStoreCard";


interface Agent {
    publish_id: string;
    category?: string;
    price?: number;
    // Add other agent properties as needed
    [key: string]: any;
}
export default function ProfileMCPPage() {
    const { status, isAuthLoading } = useAuth()
    const [mcpId, setMcpId] = useState(null)
    const [mcp, setMcp] = useState<Agent[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');
    const limit: number = 10;
    const observer = useRef<IntersectionObserver | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getMcp = useCallback(async (pageNum: number = 1, reset: boolean = false): Promise<void> => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {

            const params: any = {
                page: pageNum,
                limit,
            };



            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/store/mcps`,
                {
                    params,
                    withCredentials: true,
                }
            );

            const newMcp: any[] = response.data.mcps || [];

            if (reset) {
                setMcp(newMcp);
            } else {
                setMcp(prev => [...prev, ...newMcp]);
            }

            // Check if we have more data
            setHasMore(newMcp.length === limit);

        } catch (e) {
            console.log(e);
            setError('Failed to load agents');
        } finally {
            setLoading(false);
        }
    }, [loading, limit]);


    // Load initial data
    useEffect(() => {
        getMcp(1, true);
    }, []);
    // Intersection Observer callback
    const lastAgentElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    getMcp(nextPage);
                    return nextPage;
                });
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, getMcp]);
    console.log(mcpId)

    return (
        <>
            {mcpId && <McpPopupModal sid={mcpId} onClose={() => setMcpId(null)} />}
            <div className="agent-profile-store">

                {/* Results Count */}
                {mcp.length > 0 && (
                    <div className="results-count">
                        Showing {mcp.length} mcp{mcp.length !== 1 ? 's' : ''}
                    </div>
                )}

                {/* mcp List */}
                {loading && <p>Loading...</p>}
                {mcp.length > 0 && <div className="mcp-store-grid">
                    {mcp.map((mcp: any, index: number) => {
                        // Attach ref to the last element
                        if (mcp.length === index + 1) {
                            return (

                                <McpCard key={mcp.publish_id + index} mcpData={mcp} ref={lastAgentElementRef} onClick={() => setMcpId(mcp.mcp.sid)} />

                            );
                        } else {
                            return <McpCard mcpData={mcp} key={mcp.publish_id + index} onClick={() => setMcpId(mcp.mcp.sid)} />;
                        }
                    })}
                </div>}


                {/* Error State */}
                {error && (
                    <div className="error-message">
                        {error}
                        <button
                            onClick={() => getMcp(page, false)}
                            className="retry-btn"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && mcp.length === 0 && !error && (
                    <div className="empty-state">

                        <p>No mcp found matching your criteria.</p>

                    </div>
                )}

                {/* End of Results */}
                {!hasMore && mcp.length > 0 && (
                    <div className="end-message">
                        You've reached the end!
                    </div>
                )}
            </div>
        </>
    );
}