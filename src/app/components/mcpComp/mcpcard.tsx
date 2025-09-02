"use client";
import React from "react";
import "./mcp-card.css";
import { Bolt, Calendar, Edit, MessageCircle, Rocket, Trash2 } from "lucide-react";
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
            {/* Header with status indicator */}
            <div className="mcp-server-header">
                <div className="mcp-server-content">
                    <h3 className="mcp-server-title">{mcp.label}</h3>
                    <p className="mcp-server-description">{mcp.description}</p>
                </div>
                <div className={`status-indicator ${mcp.status}`}>
                    <div className="status-dot"></div>
                </div>
            </div>

            {/* Tools section */}
            <div className="tools-section">
                <div className="tools-header">
                    <span className="tools-count">{mcp.tools.length} tools</span>
                </div>
                <div className="tools-preview">
                    {mcp.tools.slice(0, 2).map((tool, index) => (
                        <span key={index} className="tool-tag">{tool}</span>
                    ))}
                    {mcp.tools.length > 2 && (
                        <span className="tool-tag more">+{mcp.tools.length - 2}</span>
                    )}
                </div>
            </div>

            {/* Footer with date and actions */}
            <div className="mcp-server-footer">
                <div className="date-info">
                    <Calendar size={12} className="date-icon" />
                    <span className="date-text">{formatDate(mcp.created_on)}</span>
                </div>
                <div className="action-buttons">
                    <button className="action-btn edit-btn" title="Edit">
                        <Edit size={14} />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => deleteServer(mcp.sid)} title="Delete">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}