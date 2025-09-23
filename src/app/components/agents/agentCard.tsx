// AgentCard.tsx
import React from 'react';
import './AgentCard.css';
import { llmModels } from '@/app/utils/models-list';
import { Bolt, MessageCircle, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/context/ChatContext';

interface Demo {
    id: number;
    input: string;
    output: string;
}

interface McpServerTool {
    sid: string;
    allowedTools: string[];
}

interface ModelConfig {
    modelId: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    instructions: string;
}

interface AgentCardProps {
    agent: {
        _id: { $oid: string };
        name: string;
        description: string;
        handle: string;
        image: string;
        configs: [{
            models: {
                primary: ModelConfig,
                secondary: ModelConfig
            }
            allowedTools?: string[];
            mcp?: McpServerTool[]
            demos: Demo[];
        }]
        createdAt: { $date: string };
        updatedAt: { $date: string };
        aid: string;
        status: string;
        current_version: number;
    };
    onClick?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
    const { setMessages } = useChat();
    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const router = useRouter()
    console.log(agent)
    const getModelDisplayName = (modelId: string) => {
        const matched = llmModels.find(model => model.value === modelId);
        if (matched) return matched.label; // or matched.name
    };

    return (
        <div className="agent-card" onClick={onClick}>
            {/* Floating accent elements */}
            <div className="card-accent-1"></div>
            <div className="card-accent-2"></div>

            <div className="agent-card-header">
                <div className="agent-avatar">
                    {agent.image ? (
                        <img src={agent.image} alt={agent.name} />
                    ) : (
                        <div className="avatar-placeholder">
                            {agent.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="avatar-glow"></div>
                </div>
                <div className="agent-info">
                    <h3 className="agent-name">{agent.name}</h3>
                    <p className="agent-handle">@{agent.handle}</p>
                </div>
                <div className="agent-status">
                    <div className={`status-dot ${agent.status}`}></div>
                    <span className={`status-text ${agent.status}`}>{agent.status}</span>
                </div>


            </div>

            <div className="agent-description">
                <p>{agent.description}</p>
            </div>
            <div className="agent-version">
                <span className="version-label">versions: {agent.configs.length}</span>
            </div>
            <br />

            <div className="agent-footer">
                <div className="footer-info">
                </div>
                <div className="card-actions">
                    <button className="action-btn chat-btn" onClick={() => { setMessages([]); router.push(`/agent/${agent.aid}?mode=text`) }}>
                        <MessageCircle size={20} />
                        chat
                    </button>
                    <button className="action-btn configure-btn" onClick={() => router.push(`/agent/${agent.aid}/edits`)}>
                        <Bolt size={20} />
                        config
                    </button>
                    <button className="action-btn configure-btn" onClick={() => router.push('/store/publish/agent')}>
                        <Rocket size={20} />
                        {agent.status === 'published' ? 'republish' : 'publish'}
                    </button>
                </div>
                {<span className="created-date">
                    Created {formatDate(agent.createdAt)}
                </span>}
            </div>
        </div>
    );
};

export default AgentCard;