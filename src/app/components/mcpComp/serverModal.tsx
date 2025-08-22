import { use, useEffect, useState } from "react";
import { useMcpServer } from "../../../context/ChatContext";
import { X, PlusCircle, Trash2, SquarePlus, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { MCP } from "./function";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";
import { set } from "zod";
import { useSidebarStore } from "@/store/useSidebarStore";

const McpServerModal = () => {
    const router = useRouter();
    const { mcpServers, setMcpServers, setSelectedServers, selectedServers, setMcpResources, selectMcpResource, mcpResource, mcpResources } = useMcpServer();
    const { theme } = useTheme()
    const { isSidebarOpen, toggleSidebar } = useSidebarStore();

    const toggleSelection = (server: any) => {
        setSelectedServers((prevSelected) =>
            prevSelected.some((s) => s.sid === server.sid)
                ? prevSelected.filter((s) => s.sid !== server.sid) // Remove if exists
                : [...prevSelected, server] // Add if not exists
        );
    };
    //  console.log(selectedServers)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoints = selectedServers.map((server: any) => ({
                    uri: server.uri,
                    authKey: server.authKey
                }));

                const connectionResults = await Promise.all(
                    endpoints.map(endpoint => MCP(endpoint))
                );

                const tools = connectionResults.flatMap(result => result.tools);
                const resources = connectionResults.flatMap(result => result.resources);

                // Early return if no tools found
                if (!tools || tools.length === 0) return;

                // Map resources to ensure they match McpResource type
                const mappedResources = resources.map((r: any) => ({
                    uri: r.uri,
                    name: r.name,
                    ...r // spread other properties
                }));
                setMcpResources(mappedResources);


            } catch (error) {
                console.error('Error in fetchData:', error);
            }
        };

        if (selectedServers && selectedServers.length > 0) {
            fetchData();
        }
    }, [selectedServers, mcpResource]); // Added mcpResource to dependencies since it's used inside


    return (
        <div className={`mcpserver-body`} style={{ background: theme === 'dark' ? 'var(--prop-dark-bg)' : 'var(--prop-white-bg)' }}>
            <button className="mcp-close-btn" onClick={() => { window.location.hash = '' }}>
                <X size={20} /> Close
            </button>
            <div className="mcp-header">
                <h2>Servers</h2>

            </div>

            <div className="mcpserver-cont">
                {mcpServers.length > 0 && <button className="mcp-edit-btn" onClick={() => window.location.hash = '#server/settings'} >
                    <SquarePen size={20} /> Edit
                </button>}
                {mcpServers.map((server, index) => (
                    <div key={index} className={`mcpserver-box ${selectedServers.some((s) => s.sid === server.sid) ? "selected" : ""}`}
                        onClick={() => toggleSelection(server)}>
                        <h3>{server.label}</h3>
                        <p>{server.config.url}</p>
                    </div>
                ))}
                {mcpServers.length === 0 && <p>No servers</p>}
                {mcpServers.length === 0 && <button className="mcp-add-btn" onClick={() => window.location.hash = '#server/settings'} >
                    <SquarePlus size={20} /> Add
                </button>}
            </div>


            <ToastContainer theme="dark" />
        </div>
    );
};

export default McpServerModal;
