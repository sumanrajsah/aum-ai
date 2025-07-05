"use client";
import React from "react";// adjust if needed
import "./mcp-table.css";
import { Edit, Trash, Trash2 } from "lucide-react";
import axios from "axios";
import { useAlert } from "@/context/alertContext";
import { useMcpServer } from "@/context/ChatContext";

export default function MCPServerTable({ mcp }: { mcp: MCPServerInfo }) {
    const { mcpServers, setMcpServers } = useMcpServer()
    const alert = useAlert();
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
            //console.log('Server deleted:', response.data);
            alert.success('server deleted successfully')
            if (response.status === 200) {
                setMcpServers((prevServers) => prevServers.filter(server => server.sid !== sid));
            }
        } catch (error: any) {
            alert.warn('something went wrong')
            console.error('Delete error:', error.response?.data || error.message);
        }
    };
    return (
        <div className="mcp-server-table-container">
            <div className="mcp-server-table-row">
                <div className="column name" data-label="Name">
                    <span className="column-title">{mcp.label}</span>
                    <span className="column-subtitle">{mcp.description}</span>
                </div>

                <div className="column type" data-label="Connection Type">
                    <span className="type-badge">{mcp.config.type}</span>
                </div>

                <div className="column endpoint" data-label="Endpoint">
                    <span className="endpoint-url">{mcp.config.url}</span>
                </div>

                <div className="column auth" data-label="Auth">
                    {mcp.auth ? (
                        <span className="auth-yes">✓ Yes</span>
                    ) : (
                        <span className="auth-no">✗ No</span>
                    )}
                </div>

                <div className="column tools" data-label="Tools">
                    <span className="tools-count">{mcp.tools.length} tools</span>
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

                <div className="column created" data-label="Created">
                    <span className="date-text">{formatDate(mcp.created_on)}</span>
                </div>
                <div className="column tools" data-label="Actions">
                    <div className="mcp-action-btn-cont">
                        <button className="mcp-action-btn"><Edit size={16} /></button>
                        <button className="mcp-action-btn" onClick={() => { deleteServer(mcp.sid) }}><Trash2 size={16} /></button>
                    </div>

                </div>
            </div>
        </div>
    );
}
