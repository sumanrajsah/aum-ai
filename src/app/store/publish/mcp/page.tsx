"use client"
import React, { useEffect, useState } from "react";
import { Oval } from 'react-loader-spinner';
import './style.css';

import { useAuth } from "@/hooks/useAuth";
import { useChat, useMcpServer } from "@/context/ChatContext";
import axios from "axios";
import { useAlert } from "@/context/alertContext";
import ToggleSwitch from "@/app/components/toggleSwitch";
const CATEGORIES = [
    'search',
    'web scraping',
    'communication',
    'productivity',
    'development',
    'database',
    'cloud service',
    'file system',
    'cloud storage',
    'version control',
    'other'
];
export default function PublishAgent() {
    const { status, isAuthLoading, user } = useAuth();
    const { mcpServers } = useMcpServer()
    const alert = useAlert();

    const [selectedMcpIndex, setSelectedMcpIndex] = useState(0);
    const [price, setPrice] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagsInput, setTagsInput] = useState<string>(''); // for display

    const handleMcpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = parseInt(e.target.value, 10);
        setSelectedMcpIndex(index);
        // reset config when agent changes
    };


    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setTagsInput(input); // keep showing what user types

        const tagArray = input
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');

        setTags(tagArray); // store clean array
    };

    const handlePublish = async () => {
        const selectedMcp = mcpServers[selectedMcpIndex];


        setIsPublishing(true);
        console.log("Publishing Mcp:", selectedMcp.label);
        console.log("Price:", price);

        const data = {
            type: 'mcp',
            sid: selectedMcp.sid,
            price: price,
            uid: user?.uid,
            categories: selectedCategories,
            tags: tags
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/store/publish`,
                data,
                { withCredentials: true }
            );

            const { status, data: resData } = response;
            // console.log(response)

            if (status === 200) {
                alert.success(resData.message);
            } else {
                alert.warn('publishing failed');
            }
        } catch (error) {
            console.error('publishing error:', error);
            alert.warn('Something went wrong.');
        } finally {
            setIsPublishing(false);
        }

        setTimeout(() => {
            setIsPublishing(false);
        }, 2000);
    };
    const toggleCategory = (category: string) => {
        if (!selectedCategories.includes(category) && selectedCategories.length >= 3) {
            alert.warn("You can select up to 3 categories only.");
            return;
        }

        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(cat => cat !== category);
            } else {
                return [...prev, category];
            }
        });
    };
    const getPublishedData = async () => {
        try {
            const params = { type: 'mcp' }
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/store/getpublishedData/${mcpServers[selectedMcpIndex].sid}`,
                {
                    params,
                    withCredentials: true,
                }
            );
            // when setting state after API call
            setSelectedCategories(response.data.data.info.categories ?? []);
            setTagsInput(response.data.data.info.tags ?? "");   // always string
            setTags(response.data.data.info.tags ?? "");   // always string
            setPrice(response.data.data.pricing_info.amount?.toString() ?? "");


        } catch (e) { console.log(e) }
    }
    useEffect(() => {
        if (
            mcpServers &&
            mcpServers.length > 0 &&
            selectedMcpIndex >= 0 &&
            selectedMcpIndex < mcpServers.length &&
            mcpServers[selectedMcpIndex]?.status === "published"
        ) {
            getPublishedData();
        } else {
            setSelectedCategories([])
            setTagsInput('')
            setPrice('')
        }
    }, [mcpServers, selectedMcpIndex]);

    // Don't render if userAgents is empty or still loading
    if (!mcpServers || mcpServers.length === 0) {
        return (
            <div className="list">
                <h1 className="publish-title">Publish MCP</h1>
                <div className="list-agent-cont">
                    <p>No agents available to publish.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="list">
            <h1 className="publish-title">Publish MCP</h1>
            <div className="list-agent-cont">
                {/* Agent Dropdown */}
                <label>Select Your Mcp</label>
                <select
                    className="agent-list-wrapper"
                    onChange={handleMcpChange}
                    value={selectedMcpIndex}
                >
                    {mcpServers.map((agent, index) => (
                        <option key={index} value={index}>
                            {agent.label}
                        </option>
                    ))}
                </select>
                {mcpServers[selectedMcpIndex].status === "published" && (
                    <p style={{ width: '100%', textAlign: 'center', color: 'yellow' }}>This Mcp is already published. Continue to republish it.</p>
                )}
                <br />
                <div className="form-grid">
                    <label>Category: ({selectedCategories.length} selected)</label>
                    <div className="mcp-category-checkbox-group">
                        {CATEGORIES.map((category) => (
                            <div
                                key={category}
                                className="mcp-category-checkbox"
                                onClick={() => toggleCategory(category)}
                            >
                                <div className="mcp-category-name">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </div>
                                <div className="mcp-category-p-check" onClick={(e) => e.stopPropagation()}>
                                    <ToggleSwitch
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                        id={`mcp-category-${category}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedCategories.length > 0 && (
                        <div className="mcp-selected-categories">
                            Selected: {selectedCategories.join(', ')}
                        </div>
                    )}
                </div>
                <div className="form-grid">
                    <label>Tags:</label>
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={handleTagsChange}
                        placeholder="ai, productivity, automation..."
                        className="mcp-p-input"
                    />
                </div>


                {/* Price Input */}
                <div className="form-grid">
                    <div className="agent-price form-group">
                        <label>💰 Price</label>
                        <div className="price-container">
                            <input
                                type="number"
                                value={price}
                                onChange={handlePriceChange}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="modern-input"
                            />
                            <div className="price-display">
                                {price || '0'} AUM Credits
                            </div>
                        </div>
                    </div>
                </div>

                {/* Publish Button */}
                <button
                    className="publish-btn"
                    onClick={handlePublish}
                    disabled={isPublishing}
                >
                    {isPublishing ? (
                        <>
                            <Oval height={20} width={20} color="white" ariaLabel="publishing" secondaryColor="rgba(255,255,255,0.5)" />
                            Publishing...
                        </>
                    ) : (
                        mcpServers[selectedMcpIndex].status === 'published' ? 'Republish' : '🚀 Publish MCP'
                    )}
                </button>
            </div>
        </div>
    );
}