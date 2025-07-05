"use client"
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from 'next/image'
import './style.css'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Oval } from 'react-loader-spinner'
import { toast, ToastContainer } from "react-toastify";
import { ChevronDown, ChevronRight, UploadCloud, User2 } from "lucide-react";
import ProfileCont from "@/app/components/header/profile";
import Modal from "@/app/components/modal";

import axios from "axios";
import Header from "@/app/components/header/header";
import Sidebar from "@/app/components/sidebar/sidebar";
import PageStruct1 from "@/app/components/pagestruct/struct1";
import { useMcpServer } from "@/context/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/context/alertContext";
import { llmModels } from "@/app/utils/models-list";
import ToggleSwitch from "@/app/components/toggleSwitch";



interface Demo {
    id: number;
    input: string;
    output: string;
}

interface McpServer {
    name: string;
    uri: string,
    authKey: string;
    sid: string;
}
interface Tools {
    prebuilt: string[];
    user: string[];
}
interface CreateAgent {
    name: string;
    description: string;
    instructions: string;
    image: string | null;
    isPublic: boolean;
    config?: {
        temperature?: number; // creativity level (0–1)
        top_p?: number; // nucleus sampling
        max_tokens?: number; // max response length
        primaryModel: string;
        secondaryModel: string;
        mcp: [{
            sid: string;
            allowedTools: string[]
        }];
        demos: Demo[];
        allowedTools: Tools;
    }
}
interface McpServerTool {
    sid: string;
    allowedTools: string[];
}
export default function CreateAgents() {
    const { mcpServers, setMcpServers, setSelectedServers, selectedServers } = useMcpServer();
    const [demos, setDemos] = useState<Demo[]>([]); // start empty
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [openDisconnecModel, setOpenDisconnectModel] = useState<boolean>(false)
    const { user, status } = useAuth();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const [agentName, setAgentName] = useState("");
    const [description, setDescription] = useState("");
    const [instructions, setInstructions] = useState("");
    const [selectedPrebuiltTools, setSelectedPrebuiltTools] = useState<string[]>([]);
    const [selectedMcp, setSelectedMcp] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const alertMessage = useAlert()
    // Add this state to your component
    const [selectedMcpTools, setSelectedMcpTools] = useState<McpServerTool[]>([]);
    const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());

    console.log(selectedMcpTools)

    // Helper functions
    const toggleServerExpansion = (sid: string) => {
        setExpandedServers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sid)) {
                newSet.delete(sid);
            } else {
                newSet.add(sid);
            }
            return newSet;
        });
    };
    const isToolSelected = (sid: string, toolName: string) => {
        const server = selectedMcpTools.find(mcp => mcp.sid === sid);
        return server ? server.allowedTools.includes(toolName) : false;
    };

    // ✅ Toggle a single tool for a given server
    const toggleToolSelection = (sid: string, toolName: string) => {
        setSelectedMcpTools(prev => {
            const existing = prev.find(mcp => mcp.sid === sid);

            if (existing) {
                const isAlreadySelected = existing.allowedTools.includes(toolName);
                const updatedTools = isAlreadySelected
                    ? existing.allowedTools.filter(t => t !== toolName)
                    : [...existing.allowedTools, toolName];

                if (updatedTools.length === 0) {
                    return prev.filter(mcp => mcp.sid !== sid); // remove server if no tools
                }

                return prev.map(mcp =>
                    mcp.sid === sid ? { ...mcp, allowedTools: updatedTools } : mcp
                );
            } else {
                return [...prev, { sid, allowedTools: [toolName] }];
            }
        });
    };

    // ✅ Toggle all tools for a server
    const toggleAllServerTools = (sid: string, tools: string[]) => {
        setSelectedMcpTools(prev => {
            const existing = prev.find(mcp => mcp.sid === sid);
            const allSelected = existing && tools.every(tool => existing.allowedTools.includes(tool));

            if (allSelected) {
                return prev.filter(mcp => mcp.sid !== sid); // deselect all
            } else {
                const filtered = prev.filter(mcp => mcp.sid !== sid);
                return [...filtered, { sid: sid, allowedTools: tools }]; // select all
            }
        });
    };

    // ✅ Get selected tools for a server
    const getSelectedToolsForServer = (sid: string): string[] => {
        const server = selectedMcpTools.find(mcp => mcp.sid === sid);
        return server ? server.allowedTools : [];
    };

    async function createAgent() {
        if (!agentName.trim() || !instructions.trim()) {
            toast.warn("Fill the fields")
            return;
        }
        const agentData: CreateAgent = {
            name: agentName,
            description: description,
            instructions: instructions,
            config: {

                demos: demos,
            },
            image: selectedImage,
            isPublic: isPublic,
        };
        console.log(agentData, selectedMcp)

        // try {
        //     const response = await axios.post(
        //         `${process.env.NEXT_PUBLIC_API_URI}/v1/agents/create`,
        //         {
        //             agentData,
        //             uid: user?.uid,
        //         },
        //         {
        //             withCredentials: true, // 👈 this sends cookies
        //         }
        //     );

        //     const data = await response.data;
        //     console.log(data)
        //     if (response.status === 201) {
        //         alertMessage.success("Agent Created Successfully")
        //         // router.push('/agents')
        //     }
        //     else {
        //         alertMessage.warn(data.message)
        //     }
        // } catch (e) {
        //     console.log(e)
        // }
    }



    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (id: number, field: "input" | "output", value: string) => {
        setDemos((prev) =>
            prev.map((demo) =>
                demo.id === id ? { ...demo, [field]: value } : demo
            )
        );
    };

    const addDemo = () => {
        const newId = Date.now(); // unique timestamp ID
        setDemos([...demos, { id: newId, input: "", output: "" }]);
    };

    const removeDemo = (id: number) => {
        setDemos(demos.filter((demo) => demo.id !== id));
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpenDisconnectModel(false);
            }
        }

        if (openDisconnecModel) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDisconnecModel]);

    return (
        <div className="cagent-body">



            <div className="cagent-container">
                <h1>Create AUM Agent</h1>
                <div className="agent-image-container">
                    <label className="image-preview-label">
                        <div className="image-preview">
                            <Image
                                src={selectedImage || "/sitraone.png"}
                                alt="AI Agent"
                                width={100}
                                height={100}
                                className="image-circle"
                            />
                            <div className="upload-overlay">
                                <UploadCloud />
                            </div>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                </div>
                <div className="cagent-box">
                    <label>Agent Name:</label>
                    <input type="text" placeholder="Enter Agent Name" className="cagent-input" value={agentName}
                        onChange={(e) => setAgentName(e.target.value)} />
                </div>
                <div className="cagent-box">
                    <label>Description:</label>
                    <textarea placeholder="Description" value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="cagent-box">
                    <label>Instructions:</label>
                    <textarea placeholder="Intructions" value={instructions}
                        onChange={(e) => setInstructions(e.target.value)} />
                </div>
                <div className="cagent-box">
                    <label>Select Primary Model</label>
                    <select className="select-agent-model">
                        {llmModels
                            .filter((llmModel) => llmModel.tools) // ✅ Only those with tools: true
                            .map((llmModel: { value: string; label: string }) => (
                                <option key={llmModel.value} value={llmModel.value}>
                                    {llmModel.label}
                                </option>
                            ))}

                    </select>
                </div>
                <div className="cagent-box">
                    <label>Select Secondary Model</label>
                    <select className="select-agent-model">
                        <option>same as primary</option>
                        {llmModels.map((llmModel: { value: string; label: string }) => (
                            <option key={llmModel.value} value={llmModel.value}>
                                {llmModel.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="cagent-box">
                    <label>Select Prebuilt Tools: {selectedPrebuiltTools.length}</label>
                    <div className="tool-checkbox-group">
                        <div className="tool-checkbox" onClick={(e) => {
                            const value = "search";
                            setSelectedPrebuiltTools((prev) =>
                                prev.includes(value)
                                    ? prev.filter((v) => v !== value)
                                    : [...prev, value]
                            );
                        }}>
                            <div className="tool-name">🔍 Search</div>
                            <div className="tool-des">Allows the AI to search the web and retrieve real-time information.</div>
                            <label className="tool-check">
                                <ToggleSwitch
                                    checked={selectedPrebuiltTools.includes("search")}
                                    onChange={(e) => {
                                        const value = "search";
                                        setSelectedPrebuiltTools((prev) =>
                                            prev.includes(value)
                                                ? prev.filter((v) => v !== value)
                                                : [...prev, value]
                                        );
                                    }}
                                    id="prebuilt-search-toggle"
                                />
                            </label>


                        </div>
                        <div className="tool-checkbox" onClick={(e) => {
                            const value = "image";
                            setSelectedPrebuiltTools((prev) =>
                                prev.includes(value)
                                    ? prev.filter((v) => v !== value)
                                    : [...prev, value]
                            );
                        }}>
                            <div className="tool-name">🌄 Image</div>
                            <div className="tool-des">Allows the AI to search the web and retrieve real-time information.</div>
                            <label className="tool-check">
                                <ToggleSwitch
                                    checked={selectedPrebuiltTools.includes("image")}
                                    onChange={(e) => {
                                        const value = "image";
                                        setSelectedPrebuiltTools((prev) =>
                                            prev.includes(value)
                                                ? prev.filter((v) => v !== value)
                                                : [...prev, value]
                                        );
                                    }}
                                    id="prebuilt-image-toggle"
                                />
                            </label>

                        </div>

                    </div>
                </div>
                {mcpServers.length >= 1 && (
                    <div className="cagent-box">
                        <label>Select Your MCP Tools: {selectedMcpTools.length}</label>
                        <div className="tool-checkbox-group">
                            {mcpServers.map((server, index) => {
                                const serverTools = Array.isArray(server.tools) ? server.tools : [];
                                const isExpanded = expandedServers.has(server.sid.toString());


                                return (
                                    <div key={index} className="mcp-server-container">
                                        {/* Server Header */}
                                        <div className="tool-checkbox mcp-server-header" onClick={() => {
                                            selectedMcp.includes(server.sid.toString()) ? (toggleServerExpansion(server.sid.toString()), getSelectedToolsForServer(server.sid.toString())) : (setSelectedMcp((prev) =>
                                                prev.includes(server.sid.toString())
                                                    ? prev.filter((v) => v !== server.sid.toString())
                                                    : [...prev, server.sid.toString()]
                                            ), toggleAllServerTools(server.sid.toString(), server.tools))
                                        }}>
                                            <div className="server-info">
                                                <div className="tool-name">
                                                    {server.label}
                                                    <span className="tool-count">({getSelectedToolsForServer(server.sid.toString()).length}/{serverTools.length})</span>
                                                    <span className="expand-icon">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                                                </div>
                                                <div className="tool-des">{server.description}</div>
                                            </div>
                                            <label className="tool-check" onClick={(e) => e.stopPropagation()}>
                                                <ToggleSwitch
                                                    checked={selectedMcp.includes(server.sid.toString())}
                                                    onChange={(e) => {
                                                        const value = server.sid.toString();
                                                        setSelectedMcp((prev) =>
                                                            prev.includes(value)
                                                                ? prev.filter((v) => v !== value)
                                                                : [...prev, value]
                                                        );
                                                        toggleAllServerTools(server.sid.toString(), server.tools)
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        {/* Server Tools (shown when expanded) */}
                                        {isExpanded && (
                                            <div className="mcp-tools-container">
                                                {serverTools.map((toolName, toolIndex) => (
                                                    <div
                                                        key={toolIndex}
                                                        className="tool-checkbox mcp-tool-item"
                                                        onClick={() => toggleToolSelection(server.sid.toString(), toolName)}
                                                    >
                                                        <div className="tool-name">🔧 {toolName}</div>
                                                        <label className="tool-check" onClick={(e) => e.stopPropagation()}>
                                                            <ToggleSwitch
                                                                checked={isToolSelected(server.sid.toString(), toolName) && selectedMcp.includes(server.sid.toString())}
                                                                onChange={() => toggleToolSelection(server.sid.toString(), toolName)}
                                                                id={`tool-${server.sid}-${toolIndex}`}
                                                            />
                                                        </label>
                                                    </div>
                                                ))}
                                                {serverTools.length === 0 && (
                                                    <div className="no-tools-message">No tools available for this server</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}



                <div className="demo-container">
                    <h3>Demonstrations</h3>
                    {demos.map((demo, index) => (
                        <div key={demo.id} className="demo-block">
                            <div className="demo-header">
                                <strong>Demonstration {index + 1}</strong>
                                {demos.length > 0 && (
                                    <button onClick={() => removeDemo(demo.id)} className="remove-btn">
                                        remove
                                    </button>
                                )}
                            </div>

                            <div className="demo-field">
                                <label>User input</label>
                                <textarea
                                    value={demo.input}
                                    onChange={(e) =>
                                        handleChange(demo.id, "input", e.target.value)
                                    }
                                    placeholder="User input"
                                />
                            </div>

                            <div className="demo-field">
                                <label>Model output</label>
                                <textarea
                                    value={demo.output}
                                    onChange={(e) =>
                                        handleChange(demo.id, "output", e.target.value)
                                    }
                                    placeholder="Model output"
                                />
                            </div>
                        </div>
                    ))}

                    <button onClick={addDemo} className="add-demo-btn">
                        Add Demonstration
                    </button>
                </div>

                <div className="visibility-toggle">
                    <span className="toggle-label">Publish on:</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => setIsPublic(!isPublic)}
                        />
                        <span className="slider" />
                    </label>
                    <span className="toggle-status">{isPublic ? "Public 🔓" : "Private 🔒"}</span>
                </div>

            </div>
            <div className="create-agent-btn-cont">
                <button className="create-agent-btn" onClick={createAgent}>
                    Preview
                </button>
                <button className="create-agent-btn" onClick={createAgent}>
                    Save Draft
                </button>
                <button className="create-agent-btn" onClick={createAgent}>
                    {isPublic ? 'Publish' : 'Create'}
                </button>
            </div>
        </div>

    )
}