"use client";
import React from "react";
import "./mcp-card.css";
import { Bolt, Edit, MessageCircle, Rocket, Trash2 } from "lucide-react";
import axios from "axios";
import { useAlert } from "@/context/alertContext";
import { useMcpServer } from "@/context/ChatContext";
import { useRouter } from "next/navigation";

export default function MCPServerCard({ mcp }: { mcp: MCPServerInfo }) {
    const { mcpServers, setMcpServers } = useMcpServer();
    const alert = useAlert();
    const router = useRouter();

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const deleteServer = async (sid: String) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URI}/v1/servers/delete/${sid}`);
            alert.success('server deleted successfully');
            if (response.status === 200) {
                setMcpServers((prevServers) => prevServers.filter(server => server.sid !== sid));
            }
        } catch (error: any) {
            alert.warn('something went wrong');
            console.error('Delete error:', error.response?.data || error.message);
        }
    };

    return (
        <div className="mcp-server-card">
            <div className="mcp-card-header">
                <div className="mcp-card-title-section">
                    <h3 className="mcp-card-title">{mcp.label}</h3>
                    <p className="mcp-card-description">{mcp.description}</p>
                </div>
                <div className="mcp-status">
                    <div className={`status-dot ${mcp.status}`}></div>
                    <span className={`status-text ${mcp.status}`}>{mcp.status}</span>
                </div>
            </div>

            <div className="mcp-card-content">
                {/* <div className="mcp-card-row">
                    <div className="mcp-card-field">
                        <span className="mcp-field-label">Connection Type</span>
                        <span className="type-badge">{mcp.config.type}</span>
                    </div>
                    <div className="mcp-card-field">
                        <span className="mcp-field-label">Auth</span>
                        {mcp.auth ? (
                            <span className="auth-yes"> Yes</span>
                        ) : (
                            <span className="auth-no"> No</span>
                        )}
                    </div>
                </div>

                <div className="mcp-card-field">
                    <span className="mcp-field-label">Endpoint</span>
                    <span className="endpoint-url">{mcp.config.url}</span>
                </div> */}

                <div className="mcp-card-field">
                    <span className="mcp-field-label">Tools:{mcp.tools.length}</span>
                    <div className="tools-section">
                        {mcp.tools.length > 0 && (
                            <div className="tools-list">
                                {mcp.tools.slice(0, 3).map((tool, index) => (
                                    <span key={index} className="tool-item">{tool}</span>
                                ))}
                                {mcp.tools.length > 3 && (
                                    <span className="tool-item more">+{mcp.tools.length - 3} more</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mcp-card-footer">
                <div className="card-actions">
                    <button className="action-btn configure-btn" onClick={() => router.push(`/mcps/${mcp.sid}/edits`)}>
                        <Edit size={20} />
                        Edit
                    </button>
                    {/* <button className="action-btn configure-btn" onClick={() => router.push('/store/publish/mcp')}>
                        <Rocket size={20} />
                        {mcp.status === 'published' ? 'republish' : 'publish'}
                    </button> */}
                    <button className="action-btn configure-btn" onClick={() => deleteServer(mcp.sid)}>
                        <Trash2 size={16} />
                        Remove
                    </button>
                </div>
                <br />
                <span className="mcp-field-label">Created  {formatDate(mcp.created_on)}</span>

            </div>
        </div>
    );
}