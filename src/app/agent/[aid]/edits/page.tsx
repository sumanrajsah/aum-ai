"use client"
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from 'next/image'
import './style.css'
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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

interface Starter {
    id: number;
    messages: string;
}

interface ModelConfig {
    modelId: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    instructions: string;
}

interface UpdateAgent {
    name: string;
    handle: string;
    description: string;
    config?: {
        models: {
            primary: ModelConfig,
            secondary: ModelConfig
        }
        allowedTools?: string[];
        mcp?: McpServerTool[]
        starters: Starter[];
    }
}

interface McpServerTool {
    sid: string;
    allowedTools: string[];
}


export default function EditAgent() {
    const { mcpServers } = useMcpServer();
    const { user, isAuthLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const agentId = params.aid as string;
    const alertMessage = useAlert();
    const modalRef = useRef<HTMLDivElement | null>(null);

    // Config version management
    const [availableConfigs, setAvailableConfigs] = useState<any[]>([]);
    const [selectedConfigVersion, setSelectedConfigVersion] = useState<number>(1);
    const [selectedConfigId, setSelectedConfigId] = useState<string>("");
    const [modificationMode, setModificationMode] = useState<"same" | "new">("same");
    const [showConfigSelector, setShowConfigSelector] = useState<boolean>(false);

    // Basic agent info
    const [agentName, setAgentName] = useState("");
    const [agentHandle, setAgentHandle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    // Model configuration
    const [primaryModel, setPrimaryModel] = useState<string>("gpt-4o-mini");
    const [secondaryModel, setSecondaryModel] = useState<string>("same-as-primary");
    const [primaryInstructions, setPrimaryInstructions] = useState("");
    const [secondaryInstructions, setSecondaryInstructions] = useState("");

    // Advanced config for primary model
    const [primaryTemperature, setPrimaryTemperature] = useState<number>(0.7);
    const [primaryTopP, setPrimaryTopP] = useState<number>(0.9);
    const [primaryMaxTokens, setPrimaryMaxTokens] = useState<number>(4000);

    // Advanced config for secondary model
    const [secondaryTemperature, setSecondaryTemperature] = useState<number>(0.7);
    const [secondaryTopP, setSecondaryTopP] = useState<number>(0.9);
    const [secondaryMaxTokens, setSecondaryMaxTokens] = useState<number>(4000);

    // Tools and demos
    const [selectedPrebuiltTools, setSelectedPrebuiltTools] = useState<string[]>([]);
    const [selectedMcpTools, setSelectedMcpTools] = useState<McpServerTool[]>([]);
    const [starters, setStarters] = useState<Starter[]>([]);
    const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());

    // UI states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [openDisconnectModel, setOpenDisconnectModel] = useState<boolean>(false);

    // Load existing agent data
    useEffect(() => {
        const loadAgentData = async () => {
            if (!agentId || !user?.uid) return;

            try {
                setIsDataLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URI}/v1/agents/aid/${agentId}`,
                    {
                        withCredentials: true,
                        params: { uid: user.uid }
                    }
                );

                if (response.status === 200) {
                    const agent = response.data;
                    console.log(response.data)

                    // Set basic info
                    setAgentName(agent.name);
                    setAgentHandle(agent.handle);
                    setDescription(agent.description || "");
                    setCurrentImageUrl(agent.image || null);

                    // Set available configs
                    setAvailableConfigs(agent.configs || []);

                    // Find the latest config or use the first config
                    const latestConfig = agent.configs?.reduce((latest: any, current: any) =>
                        current.version > latest.version ? current : latest
                    ) || agent.configs?.[0];

                    if (latestConfig) {
                        setSelectedConfigVersion(latestConfig.version);
                        setSelectedConfigId(latestConfig.config_id);
                        loadConfigData(latestConfig.config);
                    }
                } else {
                    alertMessage.warn('Failed to load agent data');
                    router.push('/agents');
                }
            } catch (error) {
                console.error('Error loading agent:', error);
                alertMessage.warn('Failed to load agent data');
                router.push('/agents');
            } finally {
                setIsDataLoading(false);
            }
        };

        loadAgentData();
    }, [agentId, user]);

    // New function to load config data
    const loadConfigData = (config: any) => {
        if (config?.models) {
            const { primary, secondary } = config.models;

            // Primary model
            setPrimaryModel(primary.modelId);
            setPrimaryInstructions(primary.instructions);
            setPrimaryTemperature(primary.temperature || 0.7);
            setPrimaryTopP(primary.topP || 0.9);
            setPrimaryMaxTokens(primary.maxTokens || 4000);

            // Secondary model
            if (secondary.modelId === primary.modelId &&
                secondary.instructions === primary.instructions) {
                setSecondaryModel("same-as-primary");
            } else {
                setSecondaryModel(secondary.modelId);
                setSecondaryInstructions(secondary.instructions);
                setSecondaryTemperature(secondary.temperature || 0.7);
                setSecondaryTopP(secondary.topP || 0.9);
                setSecondaryMaxTokens(secondary.maxTokens || 4000);
            }
        }

        // Set tools
        setSelectedPrebuiltTools(config?.allowedTools || []);
        setSelectedMcpTools(config?.mcp || []);

        // Set demos with unique IDs
        const demosWithIds = (config?.starters || []).map((starter: any, index: number) => ({
            ...starter,
            id: starter.id || Date.now() + index
        }));
        setStarters(demosWithIds);
    };

    // Function to switch config version
    const switchConfigVersion = (version: number) => {
        const selectedConfig = availableConfigs.find(config => config.version === version);
        if (selectedConfig) {
            setSelectedConfigVersion(version);
            setSelectedConfigId(selectedConfig.config_id);
            loadConfigData(selectedConfig.config);
            setShowConfigSelector(false);
        }
    };
    console.log(selectedPrebuiltTools)

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!agentName.trim()) {
            newErrors.agentName = "Agent name is required";
        } else if (agentName.length > 100) {
            newErrors.agentName = "Agent name must be less than 100 characters";
        }

        if (!agentHandle.trim()) {
            newErrors.agentHandle = "Agent handle is required";
        } else if (agentHandle.length > 100) {
            newErrors.agentHandle = "Agent handle must be less than 100 characters";
        }

        if (!primaryInstructions.trim()) {
            newErrors.primaryInstructions = "Primary model instructions are required";
        } else if (primaryInstructions.length > 5000) {
            newErrors.primaryInstructions = "Primary instructions must be less than 5000 characters";
        }

        if (secondaryModel !== "same-as-primary" && !secondaryInstructions.trim()) {
            newErrors.secondaryInstructions = "Secondary model instructions are required";
        } else if (secondaryInstructions.length > 5000) {
            newErrors.secondaryInstructions = "Secondary instructions must be less than 5000 characters";
        }

        if (!primaryModel) {
            newErrors.primaryModel = "Primary model selection is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // MCP Tools helper functions
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

    const toggleToolSelection = (sid: string, toolName: string) => {
        setSelectedMcpTools(prev => {
            const existing = prev.find(mcp => mcp.sid === sid);

            if (existing) {
                const isAlreadySelected = existing.allowedTools.includes(toolName);
                const updatedTools = isAlreadySelected
                    ? existing.allowedTools.filter(t => t !== toolName)
                    : [...existing.allowedTools, toolName];

                if (updatedTools.length === 0) {
                    return prev.filter(mcp => mcp.sid !== sid);
                }

                return prev.map(mcp =>
                    mcp.sid === sid ? { ...mcp, allowedTools: updatedTools } : mcp
                );
            } else {
                return [...prev, { sid, allowedTools: [toolName] }];
            }
        });
    };

    const toggleAllServerTools = (sid: string, tools: string[]) => {
        setSelectedMcpTools(prev => {
            const existing = prev.find(mcp => mcp.sid === sid);
            const allSelected = existing && tools.every(tool => existing.allowedTools.includes(tool));

            if (allSelected) {
                return prev.filter(mcp => mcp.sid !== sid);
            } else {
                const filtered = prev.filter(mcp => mcp.sid !== sid);
                return [...filtered, { sid: sid, allowedTools: tools }];
            }
        });
    };

    const getSelectedToolsForServer = (sid: any): string[] => {
        const server = selectedMcpTools.find(mcp => mcp.sid === sid);
        return server ? server.allowedTools : [];
    };

    // Demo functions
    const handleDemoChange = (id: number, value: string) => {
        setStarters((prev) =>
            prev.map((demo) =>
                demo.id === id ? { ...demo, 'messages': value } : demo
            )
        );
    };

    const addDemo = () => {
        const newId = Date.now();
        setStarters([...starters, { id: newId, messages: "" }]);
    };

    const removeDemo = (id: number) => {
        setStarters(starters.filter((starter) => starter.id !== id));
    };

    // Update agent function
    async function updateAgent() {
        if (!validateForm()) {
            alertMessage.warn('Please fill all required fields');
            return;
        }

        setIsLoading(true);

        // Prepare secondary model config
        const secondaryModelConfig = secondaryModel === "same-as-primary"
            ? {
                modelId: primaryModel,
                instructions: primaryInstructions,
                temperature: primaryTemperature,
                topP: primaryTopP,
                maxTokens: primaryMaxTokens
            }
            : {
                modelId: secondaryModel,
                instructions: secondaryInstructions,
                temperature: secondaryTemperature,
                topP: secondaryTopP,
                maxTokens: secondaryMaxTokens
            };

        const configData = {
            models: {
                primary: {
                    instructions: primaryInstructions,
                    modelId: primaryModel,
                    temperature: primaryTemperature,
                    topP: primaryTopP,
                    maxTokens: primaryMaxTokens
                },
                secondary: secondaryModelConfig
            },
            mcp: selectedMcpTools,
            starters: starters,
            allowedTools: selectedPrebuiltTools
        };

        const agentData: UpdateAgent = {
            name: agentName,
            description: description,
            handle: agentHandle,
            config: configData,
        };

        const formData = new FormData();
        formData.append('agentData', JSON.stringify(agentData));
        formData.append('uid', user?.uid || '');
        formData.append('agentId', agentId);
        formData.append('configId', selectedConfigId);
        formData.append('modificationMode', modificationMode);
        formData.append('selectedVersion', selectedConfigVersion.toString());
        formData.append('image', currentImageUrl ?? '');

        if (selectedImage && imageFile) {
            formData.append('file', imageFile);
        }

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/agents/edit/${agentId}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                alertMessage.success(
                    modificationMode === "new"
                        ? "Agent Updated with New Config Version"
                        : "Agent Configuration Updated"
                );
                // router.push('/agents');
            } else {
                alertMessage.warn(response.data.message);
            }
        } catch (error) {
            console.error('Error updating agent:', error);
            alertMessage.warn('Failed to update agent. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePrebuiltTool = (toolName: string) => {
        setSelectedPrebuiltTools((prev) =>
            prev.includes(toolName)
                ? prev.filter((v) => v !== toolName)
                : [...prev, toolName]
        );
    };

    // Effect for modal click outside handling
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpenDisconnectModel(false);
            }
        }

        if (openDisconnectModel) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDisconnectModel]);

    if (isAuthLoading || isDataLoading) {
        return (
            <div className="loading-container">
                <Oval
                    visible={true}
                    height="50"
                    width="50"
                    color="gray"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    secondaryColor="gray"
                />
            </div>
        );
    }

    const displayImage = selectedImage || currentImageUrl || "/sitraone.png";


    return (
        <div className="cagent-body">
            <h1>Edit AUM Agent</h1>

            <div className="cagent-container">
                <h2>Agent Info</h2>
                {/* Agent Image */}
                <div className="agent-image-container">
                    <label className="image-preview-label">
                        <div className="image-preview">
                            <img
                                src={displayImage}
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

                {/* Agent Name */}
                <div className="cagent-box">
                    <label>Agent Name: *</label>
                    <input
                        type="text"
                        placeholder="Aum Agent"
                        className={`cagent-input ${errors.agentName ? 'error' : ''}`}
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        maxLength={100}
                        disabled
                    />
                    {errors.agentName && <span className="error-message">{errors.agentName}</span>}
                </div>

                {/* Agent Handle */}
                <div className="cagent-box">
                    <label>Agent Handle: *</label>
                    <input
                        type="text"
                        placeholder="@aumAgent"
                        className={`cagent-input ${errors.agentHandle ? 'error' : ''}`}
                        value={agentHandle}
                        onChange={(e) => setAgentHandle(e.target.value)}
                        maxLength={100}
                        disabled
                    />
                    {errors.agentHandle && <span className="error-message">{errors.agentHandle}</span>}
                </div>

                {/* Description */}
                <div className="cagent-box">
                    <label>Description:</label>
                    <textarea
                        placeholder="Brief description of your agent"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                    />
                </div>
            </div>
            <div className="cagent-container">
                <h2>Configuration Management</h2>

                {/* Current Config Info */}
                <div className="cagent-box">
                    <label>Current Configuration:</label>
                    <div className="config-info">
                        <div className="config-details">
                            <span>Version {selectedConfigVersion}</span>
                            <span className="config-status">
                                {availableConfigs.find(c => c.version === selectedConfigVersion)?.status || 'draft'}
                            </span>
                        </div>
                        <button
                            className="config-selector-btn"
                            onClick={() => setShowConfigSelector(!showConfigSelector)}
                        >
                            {showConfigSelector ? 'Hide Versions' : 'Switch Version'}
                        </button>
                    </div>
                </div>

                {/* Config Version Selector */}
                {showConfigSelector && (
                    <div className="cagent-box">
                        <label>Available Configurations:</label>
                        <div className="config-versions-list">
                            {availableConfigs.map((config) => (
                                <div
                                    key={config.config_id}
                                    className={`config-version-item ${config.version === selectedConfigVersion ? 'active' : ''
                                        }`}
                                    onClick={() => switchConfigVersion(config.version)}
                                >
                                    <div className="version-info">
                                        <span className="version-number">Version {config.version}</span>
                                        <span className={`version-status ${config.status}`}>
                                            {config.status}
                                        </span>
                                    </div>
                                    <div className="version-date">
                                        Created: {new Date(config.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modification Mode */}
                <div className="cagent-box">
                    <label>Modification Mode:</label>
                    <div className="modification-mode">
                        <div
                            className={`mode-option ${modificationMode === 'same' ? 'active' : ''}`}
                            onClick={() => setModificationMode('same')}
                        >
                            <div className="mode-title">Update Current Config</div>
                            <div className="mode-description">
                                Modify the existing configuration version {selectedConfigVersion}
                            </div>
                        </div>
                        <div
                            className={`mode-option ${modificationMode === 'new' ? 'active' : ''}`}
                            onClick={() => setModificationMode('new')}
                        >
                            <div className="mode-title">Create New Version</div>
                            <div className="mode-description">
                                Create a new configuration version based on current settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cagent-container">
                <h2>Agent Configurations</h2>
                {/* Primary Model */}
                <div className="cagent-box">
                    <label>Select Primary Model: *</label>
                    <select
                        className={`select-agent-model ${errors.primaryModel ? 'error' : ''}`}
                        value={primaryModel}
                        onChange={(e) => setPrimaryModel(e.target.value)}
                    >
                        {llmModels
                            .filter((llmModel) => llmModel.tools)
                            .map((llmModel: { value: string; label: string }) => (
                                <option key={llmModel.value} value={llmModel.value}>
                                    {llmModel.label}
                                </option>
                            ))}
                    </select>
                    {errors.primaryModel && <span className="error-message">{errors.primaryModel}</span>}
                </div>

                {/* Primary Instructions */}
                <div className="cagent-box">
                    <label>Primary Model Instructions: *</label>
                    <textarea
                        placeholder="Detailed instructions for your primary model"
                        value={primaryInstructions}
                        onChange={(e) => setPrimaryInstructions(e.target.value)}
                        className={errors.primaryInstructions ? 'error' : ''}
                        maxLength={5000}
                    />
                    {errors.primaryInstructions && <span className="error-message">{errors.primaryInstructions}</span>}
                </div>

                {/* Primary Model Advanced Configuration */}
                <div className="cagent-box">
                    <label>Advanced Configuration - Primary Model:</label>
                    <div className="config-group">
                        <div className="config-item">
                            <label>Temperature ({primaryTemperature}):</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={primaryTemperature}
                                onChange={(e) => setPrimaryTemperature(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="config-item">
                            <label>Top P ({primaryTopP}):</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={primaryTopP}
                                onChange={(e) => setPrimaryTopP(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="config-item">
                            <label>Max Tokens:</label>
                            <input
                                type="number"
                                min="100"
                                max="8000"
                                value={primaryMaxTokens}
                                onChange={(e) => setPrimaryMaxTokens(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Prebuilt Tools */}
                <div className="cagent-box">
                    <label>Select Prebuilt Tools: {selectedPrebuiltTools.length}</label>
                    <div className="tool-checkbox-group">
                        <div className="tool-checkbox" onClick={() => togglePrebuiltTool("web_search")}>
                            <div className="tool-name">🔍 Search</div>
                            <div className="tool-des">Allows the AI to search the web and retrieve real-time information.</div>
                            <label className="tool-check" onClick={(e) => e.stopPropagation()}>
                                <ToggleSwitch
                                    checked={selectedPrebuiltTools.includes("web_search")}
                                    onChange={() => togglePrebuiltTool("web_search")}
                                    id="prebuilt-search-toggle"
                                />
                            </label>
                        </div>
                        {/* <div className="tool-checkbox" onClick={() => togglePrebuiltTool("image")}>
                            <div className="tool-name">🌄 Image</div>
                            <div className="tool-des">Allows the AI to generate and process images.</div>
                            <label className="tool-check" onClick={(e) => e.stopPropagation()}>
                                <ToggleSwitch
                                    checked={selectedPrebuiltTools.includes("image")}
                                    onChange={() => togglePrebuiltTool("image")}
                                    id="prebuilt-image-toggle"
                                />
                            </label>
                        </div> */}
                    </div>
                </div>

                {/* MCP Tools */}
                {mcpServers.length >= 1 && (
                    <div className="cagent-box">
                        <label>Select Your MCP Tools: {selectedMcpTools.length}</label>
                        <div className="tool-checkbox-group">
                            {mcpServers.map((server, index) => {
                                const serverTools = Array.isArray(server.tools) ? server.tools : [];
                                const isExpanded = expandedServers.has(`${server.sid}`);
                                const selectedToolsCount = getSelectedToolsForServer(server.sid).length;

                                return (
                                    <div key={index} className="mcp-server-container">
                                        {/* Server Header */}
                                        <div
                                            className="tool-checkbox mcp-server-header"
                                            onClick={() => toggleServerExpansion(server.sid.toString())}
                                        >
                                            <div className="server-info">
                                                <div className="tool-name">
                                                    {server.label}
                                                    <span className="tool-count">({selectedToolsCount}/{serverTools.length})</span>
                                                    <span className="expand-icon">
                                                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                    </span>
                                                </div>
                                                <div className="tool-des">{server.description}</div>
                                            </div>
                                            <label className="tool-check" onClick={(e) => e.stopPropagation()}>
                                                <ToggleSwitch
                                                    checked={selectedToolsCount === serverTools.length && serverTools.length > 0}
                                                    onChange={() => toggleAllServerTools(server.sid.toString(), server.tools)}
                                                />
                                            </label>
                                        </div>

                                        {/* Server Tools */}
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
                                                                checked={isToolSelected(server.sid.toString(), toolName)}
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

                {/* Secondary Model */}
                <div className="cagent-box">
                    <label>Select Secondary Model:</label>
                    <select
                        className="select-agent-model"
                        value={secondaryModel}
                        onChange={(e) => setSecondaryModel(e.target.value)}
                    >
                        <option value="same-as-primary">Same as primary</option>
                        {llmModels.map((llmModel: { value: string; label: string }) => (
                            <option key={llmModel.value} value={llmModel.value}>
                                {llmModel.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Secondary Instructions */}
                {secondaryModel !== 'same-as-primary' && (
                    <>
                        <div className="cagent-box">
                            <label>Secondary Model Instructions: *</label>
                            <textarea
                                placeholder="Detailed instructions for your secondary model"
                                value={secondaryInstructions}
                                onChange={(e) => setSecondaryInstructions(e.target.value)}
                                className={errors.secondaryInstructions ? 'error' : ''}
                                maxLength={5000}
                            />
                            {errors.secondaryInstructions && <span className="error-message">{errors.secondaryInstructions}</span>}
                        </div>

                        {/* Secondary Model Advanced Configuration */}
                        <div className="cagent-box">
                            <label>Advanced Configuration - Secondary Model:</label>
                            <div className="config-group">
                                <div className="config-item">
                                    <label>Temperature ({secondaryTemperature}):</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={secondaryTemperature}
                                        onChange={(e) => setSecondaryTemperature(parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="config-item">
                                    <label>Top P ({secondaryTopP}):</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={secondaryTopP}
                                        onChange={(e) => setSecondaryTopP(parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="config-item">
                                    <label>Max Tokens:</label>
                                    <input
                                        type="number"
                                        min="100"
                                        max="8000"
                                        value={secondaryMaxTokens}
                                        onChange={(e) => setSecondaryMaxTokens(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Demonstrations */}
                <div className="demo-container">
                    <h3>Conversation Starter</h3>
                    {starters.map((starter, index) => (
                        <div key={starter.id} className="demo-block">
                            <div className="demo-header">
                                <strong>Starter {index + 1}</strong>
                                <button onClick={() => removeDemo(starter.id)} className="remove-btn">
                                    Remove
                                </button>
                            </div>

                            <div className="demo-field">
                                <textarea
                                    value={starter.messages}
                                    onChange={(e) => handleDemoChange(starter.id, e.target.value)}
                                    placeholder="Add conversation starter"
                                />
                            </div>


                        </div>
                    ))}

                    <button onClick={addDemo} className="add-demo-btn">
                        Add Starter
                    </button>
                </div>
            </div>

            <div className="create-agent-btn-cont">
                <button
                    className="create-agent-btn"
                    onClick={updateAgent}
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Agent'}
                </button>
            </div>
        </div>
    );
}