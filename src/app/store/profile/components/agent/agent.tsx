'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import './style.css'
import { useRouter } from 'next/navigation';
import { useAgent, useChat } from '@/context/ChatContext';
import AgentCard from '@/app/components/agents/agentCard';
import axios from 'axios';
import AgentPopupModal from '@/app/store/components/agentModal';
import { Search } from 'lucide-react';
import AgentStoreCard from '@/app/store/components/agentStoreCard';


// Type definitions
interface Agent {
    publish_id: string;
    category?: string;
    price?: number;
    // Add other agent properties as needed
    [key: string]: any;
}

const ProfileAgentsPage = ({ uid }: { uid: any }) => {
    const { status, isAuthLoading } = useAuth()
    const [agentId, setAgentId] = useState(null)
    const [agents, setAgents] = useState<Agent[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const limit: number = 10;
    const observer = useRef<IntersectionObserver | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getAgents = useCallback(async (pageNum: number = 1, reset: boolean = false): Promise<void> => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {

            const params: any = {
                page: pageNum,
                limit,
                uid
            };


            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/store/agents`,
                {
                    params,
                    withCredentials: true,
                }
            );

            const newAgents: Agent[] = response.data.agents || [];

            if (reset) {
                setAgents(newAgents);
            } else {
                setAgents(prev => [...prev, ...newAgents]);
            }

            // Check if we have more data
            setHasMore(newAgents.length === limit);

        } catch (e) {
            console.log(e);
            setError('Failed to load agents');
        } finally {
            setLoading(false);
        }
    }, [loading, limit]);



    // Clear search

    // Load initial data
    useEffect(() => {
        getAgents(1, true);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);


    // Intersection Observer callback
    const lastAgentElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    getAgents(nextPage);
                    return nextPage;
                });
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, getAgents]);

    return (
        <>
            {agentId && <AgentPopupModal agent_id={agentId} onClose={() => setAgentId(null)} />}
            <div className="agent-profile-store">
                {/* Search Bar */}

                {/* Results Count */}
                {agents.length > 0 && (
                    <div className="results-count">
                        Showing {agents.length} agent{agents.length !== 1 ? 's' : ''}
                    </div>
                )}

                {/* Agents List */}
                {loading && <p>Loading...</p>}
                {agents.length > 0 && <div className="agents-store-grid">
                    {agents.map((agent: Agent, index: number) => {
                        // Attach ref to the last element
                        if (agents.length === index + 1) {
                            return (

                                <AgentStoreCard key={agent.publish_id + index} agentData={agent} ref={lastAgentElementRef} onClick={() => setAgentId(agent.agent.aid)} />

                            );
                        } else {
                            return <AgentStoreCard agentData={agent} key={agent.publish_id + index} onClick={() => setAgentId(agent.agent.aid)} />;
                        }
                    })}
                </div>}


                {/* Error State */}
                {error && (
                    <div className="error-message">
                        {error}
                        <button
                            onClick={() => getAgents(page, false)}
                            className="retry-btn"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && agents.length === 0 && !error && (
                    <div className="empty-state">

                        <p>No agents found matching your criteria.</p>

                    </div>
                )}

                {/* End of Results */}
                {!hasMore && agents.length > 0 && (
                    <div className="end-message">
                        You've reached the end!
                    </div>
                )}
            </div>
        </>
    );
}
export default ProfileAgentsPage;