'use client'
import React, { useState } from 'react';
import { Star, Globe, Users, Download, Calendar, MapPin, Github, Twitter, Linkedin, Bot, Code, FileText, BrainCircuit } from 'lucide-react';
import './style.css'
import ProfileAgentsPage from './components/agent/agent';
import ProfileMCPPage from './components/mcp/mcp';
import { useAuth } from '@/hooks/useAuth';

const DevProfile = () => {
    const [activeTab, setActiveTab] = useState('agents');
    const { status, isAuthLoading, user } = useAuth()
    // Enhanced developer profile data
    const profile = {
        "id": "dev_001",
        "username": "qubicsquare",
        "display_name": "QubicSquare",
        "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        "banner_image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=300&fit=crop",
        "bio": "We build AI agents and MCP tools that revolutionize how businesses interact with artificial intelligence. Passionate about creating innovative solutions.",
        "website": "https://qubicsquare.com",
        "followers": 1240,
        "following": 89,
        "joined_date": "2022-03-15",
        "location": "San Francisco, CA",
        "github": "qubicsquare",
        "twitter": "qubicsquare",
        "linkedin": "qubicsquare",
        "verified": true,
        "badge": "Pro Developer"
    };



    const formatNumber = (num: any) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    const renderTabContent = () => {

        return (
            <div className="tab-content">
                {activeTab === 'agents' && <ProfileAgentsPage uid={user?.uid} />}
                {activeTab === 'mcp' && <ProfileMCPPage />}
            </div>
        );
    };

    return (
        <>

            <div className="profile-container">

                <div className="banner"></div>
                <div className="profile-section">
                    <div className="profile-header">
                        <img src={profile.avatar_url} alt={profile.display_name} className="avatar" />
                        <button className="follow-btn">Follow</button>
                    </div>

                    <div className="profile-info">
                        <h1 className="display-name">
                            {profile.display_name}
                            {profile.verified && <span className="verified-badge">✓</span>}
                        </h1>
                        <p className="username">@{profile.username}</p>
                        <p className="bio">{profile.bio}</p>

                        <div className="profile-details">
                            {profile.location && (
                                <div className="detail-item">
                                    <MapPin size={16} />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.website && (
                                <div className="detail-item">
                                    <Globe size={16} />
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                        {profile.website.replace('https://', '')}
                                    </a>
                                </div>
                            )}
                            <div className="detail-item">
                                <Calendar size={16} />
                                <span>Joined {formatDate(profile.joined_date)}</span>
                            </div>
                        </div>

                        <div className="follow-stats">
                            <a href="#" className="stat-link">
                                <span className="stat-number">{formatNumber(profile.following)}</span>
                                <span className="stat-label">Following</span>
                            </a>
                            <a href="#" className="stat-link">
                                <span className="stat-number">{formatNumber(profile.followers)}</span>
                                <span className="stat-label">Followers</span>
                            </a>
                        </div>

                        <div className="social-links">
                            {profile.github && (
                                <a href={`${profile.github}`} target="_blank" rel="noopener noreferrer" className="social-link">
                                    <Github size={18} />
                                </a>
                            )}
                            {profile.twitter && (
                                <a href={`${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={`${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-link">
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="tabs-container">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('agents')}
                        >
                            <BrainCircuit size={18} />
                            Agents
                        </button>
                        <button
                            className={`tab ${activeTab === 'mcp' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mcp')}
                        >
                            <svg fill="currentColor" height="20px" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z"></path><path d="M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z"></path></svg>
                            MCP
                        </button>
                        {/* <button
                            className={`tab ${activeTab === 'prompts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('prompts')}
                        >
                            <FileText size={18} />
                            Prompts
                        </button> */}
                    </div>
                </div>

                {renderTabContent()}
            </div>
        </>
    );
};

export default DevProfile;