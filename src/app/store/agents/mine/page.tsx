'use client'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import './style.css'
import { useRouter } from 'next/navigation';
import { useAgent, useChat } from '@/context/ChatContext';
import AgentCard from '@/app/components/agents/agentCard';

const AgentsPage = () => {
    const { user } = useAuth()
    const { userAgents, setUserAgents } = useChat();
    const [error, setError] = useState<string | null>(null);
    const { agentLoading } = useAgent()
    const router = useRouter();

    if (agentLoading) {
        return (
            <div className="agents-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading agents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="agents-container">


            {userAgents.length === 0 ? (
                <div className="empty-state">
                    <p>No agents found. Create your first agent!</p>
                    <button
                        className="create-btn"
                        onClick={() => router.push('/create/agent')}
                    >
                        + Create Agent
                    </button>
                </div>
            ) : (
                <> <div className="agents-header">
                    <h1>Your Agents</h1>
                </div>
                    <div className="agents-grid">
                        {userAgents.map((agent, index) => (
                            <div
                                key={agent.id || index}
                                className="agent-card-wrapper"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <AgentCard agent={agent} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AgentsPage;