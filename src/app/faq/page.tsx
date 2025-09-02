'use client'
import { useState, useEffect } from 'react';
import './style.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const faqData = [
        {
            "question": "What is Aum AI?",
            "answer": "Aum AI is a next-generation AI platform to build, deploy, and use intelligent agents across language, image, and video. It supports MCP integrations, an AI Store, and both personalized and common memory."
        },
        {
            "question": "How is Aum AI different from ChatGPT?",
            "answer": "Aum AI lets you switch models, build custom agents, list them in an AI Store, use tools via MCP, and run with persistent memory across sessions."
        },
        {
            question: "How are Aum AI Agents different from Custom GPTs?",
            answer: "Custom GPTs are locked to a single model and environment within OpenAI. Aum AI Agents are multi-model, multi-modal, and can integrate external tools via MCP. They support monetization through per-message pricing, shared or personalized memory, team workspaces, and can be published in the AI Store for discovery and revenue generation."
        },
        {
            "question": "What models does Aum AI support?",
            "answer": {
                "llmModels": ["Codestral 2501", "Cohere Command A", "Cohere Command R", "Cohere Command R+", "DeepSeek R1", "DeepSeek R1 0528", "DeepSeek V3", "DeepSeek V3 0324", "Gemini 2.0 Flash", "Gemini 2.0 Flash Lite", "Gemini 2.5 Pro", "Gemini 2.5 Flash", "GPT 4o Mini", "GPT 4o", "GPT 4.1 Mini", "GPT 4.1 Nano", "GPT 4.1", "GPT 5 Mini", "GPT 5 Nano", "GPT 5", "GPT OSS 120B", "Grok 3 Mini", "Grok 3", "Llama 3.1 405B", "Llama 4 Maverick", "Llama 4 Scout", "MAI DeepSeek R1", "Ministral 3B", "Mistral Medium 2505", "Mistral Small 2503", "Mistral Nemo", "O3 Mini", "O4 Mini", "O1", "Phi 4", "Phi 4 Mini Reasoning", "Phi 4 Reasoning"],
                "imageModels": ["Bria-2-3 Fast", "DALL-E 3", "Imagen 3 Fast", "Imagen 3", "Imagen 4", "Imagen 4 Ultra", "Stable Image Core", "Stable Image Ultra", "Stable Diffusion 3.5 Large"],
                "videoModels": ["Sora", "Veo 2", "Veo 3"]
            }
        },
        {
            "question": "What is the AI Store?",
            "answer": "A marketplace for AI agents, MCP tools, and prompts. Developers publish items with a per-use price. Users can access them directly without purchasing the agent itself."
        },
        {
            "question": "How does monetization work for developers?",
            "answer": "You set a per-message price for your agent. The platform deducts its fee from that price. The remainder is your earnings."
        },
        {
            "question": "Do users need to buy agents?",
            "answer": "No. Users pay per message in credits when they chat with an agent."
        },
        {
            "question": "How are credits deducted?",
            "answer": "Credits are deducted per message based on the price set by the agent's developer. Platform fees are applied to the agent price. Plan-specific details are at pricing section."
        },
        {
            "question": "How are credits deducted during chatting with agents?",
            "answer": "When you send a message to an agent, credits are deducted in two parts:\n\n1. Model Cost: Based on the model used inside the agent (usually 1–10 AUM per 1,000 tokens depending on the model).\n2. Agent Price: A fixed per-message price set by the developer (for example, 10 AUM).\n\nThe platform deducts both model cost and agent price. From the agent price, the platform fee is taken, and the remainder is transferred to the developer. The platform fee percentage depends on the developer’s subscription plan (Plus = 30%, Pro = 25%, Pro+ = 20%).\n\nExample: If you send a 1,000-token message using an agent priced at 10 AUM:\n- Model cost = 5 AUM (example, depends on model).\n- Agent cost = 10 AUM.\n- Total = 15 AUM deducted from the user.\n- From the 10 AUM agent price, 20–30% is kept as platform fee (depending on dev plan), rest goes to the developer."
        },
        {
            "question": "How do developer payouts work?",
            "answer": "Currently, direct payouts are not supported. Developers earn credits when users interact with their agents, and those credits can be used within the Aum AI system (for model usage, building agents, etc.). In the future, we plan to enable direct payouts so developers can withdraw their earnings after platform fee deductions. This feature is on our roadmap and will be announced once available."
        }
        ,
        {
            "question": "Does Aum AI have memory?",
            "answer": "Yes. Personalized memory (per user) and common memory (shared across agents/models) enable context-aware conversations."
        },
        {
            "question": "Is Aum AI suitable for teams?",
            "answer": "Yes. Project workspaces support collaboration, versioning, and shared assets."
        },
        {
            "question": "What protocols does Aum AI support?",
            "answer": "Full Model Context Protocol (MCP) support for tool and service integrations."
        },
        {
            "question": "How do I get started?",
            "answer": "Sign up at https://aum.sitrai.com, Select Plan, and start chatting with agents or models."
        },
        {
            "question": "Do subscription plans include daily credits?",
            "answer": "Yes. Every plan provides 200 credits per day plus extra bonus credits depending on the plan (50K, 100K, or 200K)."
        },
        {
            "question": "Can I still top up credits if I have a subscription?",
            "answer": "Yes. All subscriptions allow credit top-ups. Subscribers also receive additional discounts on top-ups based on their plan."
        },
        {
            "question": "What happens if I don’t subscribe?",
            "answer": "You can continue using Aum AI on a pay-as-you-go basis by topping up credits, but you won’t get the discounts, or reduced platform fees offered in subscription plans."
        }
    ]

    const filteredFAQ = faqData.filter(item => {
        const questionMatch = item.question.toLowerCase().includes(searchTerm.toLowerCase());
        const answerMatch = typeof item.answer === 'string'
            ? item.answer.toLowerCase().includes(searchTerm.toLowerCase())
            : JSON.stringify(item.answer).toLowerCase().includes(searchTerm.toLowerCase());
        return questionMatch || answerMatch;
    });

    const toggleFAQ = (index: any) => {
        setActiveIndex(activeIndex === index ? null : index);
    };


    const renderAnswer = (answer: any) => {
        if (typeof answer === 'object' && answer.llmModels) {
            return (
                <div className="faq-answer-content">
                    <p>Aum AI supports a comprehensive range of AI models across different categories:</p>
                    <div className="model-grid">
                        <div className="model-category">
                            <h4>Language Models</h4>
                            <ul className="model-list">
                                {answer.llmModels.map((model: any, index: any) => (
                                    <li key={index}>{index + 1}) - {model}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="model-category">
                            <h4>Image Models</h4>
                            <ul className="model-list">
                                {answer.imageModels.map((model: any, index: any) => (
                                    <li key={index}>{model}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="model-category">
                            <h4>Video Models</h4>
                            <ul className="model-list">
                                {answer.videoModels.map((model: any, index: any) => (
                                    <li key={index}>{model}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }

        // handle string with newlines
        if (typeof answer === 'string') {
            return (
                <div className="faq-answer-content">
                    {answer.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            );
        }

        return <div className="faq-answer-content">{answer}</div>;

    };

    return (
        <div className="faq-wrapper" id='faq'>

            <div className="faq-container">
                <div className="faq-header">
                    <h1 className="faq-title">Aum AI FAQ</h1>
                    <p className="faq-subtitle">Everything you need to know about our next-generation AI platform</p>
                </div>

                <div className="faq-list">
                    <input
                        type="text"
                        className="search-box"
                        placeholder="Search FAQ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="faq-items">
                        {filteredFAQ.map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    {item.question}
                                </div>
                                <div className="faq-answer">
                                    {renderAnswer(item.answer)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;