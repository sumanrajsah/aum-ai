'use client'
import React, { useEffect, useRef, useState } from "react"
import { Image, Layers, MonitorSmartphone, PanelRightClose, Sparkles, Timer, TvMinimal, User2, ChevronDown, ChevronRight } from "lucide-react"
import './selectmcp.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useMcpServer } from "@/context/ChatContext"
import { MCP } from "./function"
import ToggleSwitch from "../toggleSwitch"

interface SelectMcpButtonProps {
    openModal: boolean
    onClose: () => void
    [key: string]: any // for {...props}
}

interface McpServerWithTools {
    server: any;
    tools: string[];
    expanded: boolean;
}

const SelectMcpButton = ({ openModal, onClose, ...props }: SelectMcpButtonProps) => {
    const searchParams = useSearchParams();
    const router = useRouter()
    const modalRef = useRef<HTMLDivElement>(null);
    const [serversWithTools, setServersWithTools] = useState<McpServerWithTools[]>([]);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [loadingServers, setLoadingServers] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const { mcpServers, setMcpServers, setSelectedServers, selectedServers, setMcpResources, selectMcpResource, mcpResource, mcpResources, setMcpTools } = useMcpServer();
    const { theme } = useTheme()

    const toggleServerSelection = (server: any) => {
        const isCurrentlySelected = selectedServers.some((s) => s.sid === server.sid);

        if (!isCurrentlySelected) {
            // Add server to loading state
            setLoadingServers(prev => new Set([...prev, server.sid]));
        }

        setSelectedServers((prevSelected) =>
            prevSelected.some((s) => s.sid === server.sid)
                ? prevSelected.filter((s) => s.sid !== server.sid) // Remove if exists
                : [...prevSelected, server] // Add if not exists
        );
    };

    const toggleToolSelection = (toolName: string) => {
        setSelectedTools((prevSelected) =>
            prevSelected.includes(toolName)
                ? prevSelected.filter((t) => t !== toolName) // Remove if exists
                : [...prevSelected, toolName] // Add if not exists
        );
    };

    const toggleServerExpansion = (serverSid: String) => {
        setServersWithTools(prev =>
            prev.map(swt =>
                swt.server.sid === serverSid
                    ? { ...swt, expanded: !swt.expanded }
                    : { ...swt, expanded: false } // Close all other servers
            )
        );
    };

    useEffect(() => {
        const fetchToolsForServers = async () => {
            if (!selectedServers || selectedServers.length === 0) {
                setServersWithTools([]);
                setLoadingServers(new Set());
                return;
            }

            try {
                const serverToolsData = await Promise.all(
                    selectedServers.map(async (server: any) => {
                        try {
                            const endpoint = {
                                auth: server.auth,
                                uri: server.config.url,
                                header: {
                                    key: server.config.header.key,
                                    value: server.config.header.value
                                }
                            };

                            const result = await MCP(endpoint);
                            const tools = result.tools || [];
                            const resources = result.resources || [];

                            // Update global resources
                            const mappedResources = resources.map((r: any) => ({
                                uri: r.uri,
                                name: r.name,
                                ...r
                            }));
                            setMcpResources(prev => [...prev, ...mappedResources]);

                            // Remove server from loading state
                            setLoadingServers(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(server.sid);
                                return newSet;
                            });

                            return {
                                server,
                                tools: tools.map(tool => tool.function.name),
                                expanded: false
                            };
                        } catch (error) {
                            console.error(`Error fetching tools for server ${server.label}:`, error);

                            // Remove server from loading state even on error
                            setLoadingServers(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(server.sid);
                                return newSet;
                            });

                            return {
                                server,
                                tools: [],
                                expanded: false
                            };
                        }
                    })
                );

                setServersWithTools(serverToolsData);

                // Update global tools list
                const allTools = serverToolsData.flatMap(swt => swt.tools);
                setMcpTools(allTools);

            } catch (error) {
                console.error('Error in fetchToolsForServers:', error);
                // Clear loading state on general error
                setLoadingServers(new Set());
            }
        };

        fetchToolsForServers();
    }, [selectedServers]);

    if (!openModal) return null;

    return (
        <div className="selectmcp-btn-modal" ref={modalRef}>
            <label>Select MCP Servers & Tools</label>
            <div className="selectmcp-btn-cont">
                {mcpServers.map((server, index) => {
                    const isSelected = selectedServers.some((s) => s.sid === server.sid);
                    const serverWithTools = serversWithTools.find(swt => swt.server.sid === server.sid);

                    return (
                        <div key={index + server.created_on} className="mcp-server-group">
                            {/* Server Selection */}
                            <div className="mcp-checkbox server-checkbox">
                                <div className="mcp-content">
                                    <div className="mcp-name">{server.label}</div>
                                    {serverWithTools && serverWithTools.tools.length > 0 && (
                                        <div className="mcp-tools-count">
                                            {serverWithTools.tools.length} tools
                                        </div>
                                    )}
                                </div>
                                <div className="mcp-controls">
                                    {loadingServers.has(server.sid.toString()) ? (
                                        <div className="mcp-loader">
                                            <div className="spinner" />
                                        </div>
                                    ) : (
                                        <div className="mcp-check">
                                            <ToggleSwitch
                                                checked={isSelected}
                                                onChange={() => toggleServerSelection(server)}
                                                id={`toggle-${server.sid}`}
                                            />
                                        </div>
                                    )}
                                    {isSelected && serverWithTools && serverWithTools.tools.length > 0 && (
                                        <button
                                            className="expand-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleServerExpansion(server.sid);
                                            }}
                                        >
                                            {serverWithTools.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Tools Dropdown */}
                            {isSelected && serverWithTools && serverWithTools.expanded && (
                                <div className="tools-dropdown">
                                    {serverWithTools.tools.map((toolName, toolIndex) => (
                                        <div
                                            key={toolIndex + toolName}
                                            className="mcp-checkbox mcptool-checkbox"
                                            onClick={() => toggleToolSelection(toolName)}
                                        >
                                            <div className="mcptool-name">{toolName}</div>
                                            <div className="mcp-check">
                                                <ToggleSwitch
                                                    checked={selectedTools.includes(toolName)}
                                                    onChange={() => toggleToolSelection(toolName)}
                                                    id={`toggle-tool-${toolName}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selected Tools Summary */}
            {selectedTools.length > 0 && (
                <div className="selected-tools-summary">
                    <div className="summary-label">Selected Tools ({selectedTools.length})</div>
                    <div className="selected-tools-list">
                        {selectedTools.map((toolName, index) => (
                            <div key={index} className="tool-tag">
                                <span> {toolName}</span>
                                <button
                                    className="remove-tool-btn"
                                    onClick={() => toggleToolSelection(toolName)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectMcpButton;