'use client'
import React, { useEffect, useState } from 'react';
import { Star, Globe, Users, Download, Calendar, MapPin, Github, Twitter, Linkedin, Bot, Code, FileText, BrainCircuit } from 'lucide-react';
import './style.css'
import ProfileAgentsPage from './components/agent/agent';
import ProfileMCPPage from './components/mcp/mcp';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Oval } from 'react-loader-spinner';
interface DevProfile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    banner_image: string;
    bio: string;
    website: string;
    followers: number;
    following: number;
    joined_date: string; // ISO date string, can change to Date if you parse
    location: string;
    social_links: {
        github: string;
        twitter: string;
        linkedin: string;
    },
    uid: string;
    verified: boolean;
    badge: string;
}
const DevProfile = () => {
    const [activeTab, setActiveTab] = useState('agents');
    const { status, isAuthLoading, user } = useAuth()
    const [profile, setProfile] = useState<DevProfile>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/store/dev`,
                {
                    params: { uid: user?.uid },
                    withCredentials: true,
                }
            );

            setProfile(response.data.profile);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // backend responded with error code
                    console.error("Server error:", err.response.data);
                    alert(
                        `Error ${err.response.status}: ${(err.response.data as any)?.error || "Request failed"
                        }`
                    );
                } else if (err.request) {
                    // request made but no response
                    console.error("No response from server:", err.request);
                    alert("No response from server. Please try again later.");
                } else {
                    // something went wrong setting up request
                    console.error("Axios error:", err.message);
                    alert("Unexpected error: " + err.message);
                }
            } else {
                console.error("Unexpected error:", err);
                alert("Unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user?.uid) {
            fetchProfile();
        }
    }, [user])



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
                {/* {activeTab === 'mcp' && <ProfileMCPPage />} */}
            </div>
        );
    };
    const getUserInitials = (name: string | undefined) => {
        if (!name) return 'U';

        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }

        const firstInitial = nameParts[0].charAt(0).toUpperCase();
        const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

        return firstInitial + lastInitial;
    };


    if (loading) {
        return <div className="profile-container"><Oval
            visible={true}
            height="50"
            width="50"
            color="gray"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
            secondaryColor="gray"
        /></div>
    }
    if (!profile) {
        return <NotFoundRedirect />;
    }

    function NotFoundRedirect() {
        const router = useRouter();

        useEffect(() => {
            const t = setTimeout(() => {
                router.push('/profile'); // redirect to homepage or any path
            }, 3000);
            return () => clearTimeout(t);
        }, [router]);

        return <div>Not Found. Redirecting in 3 seconds...</div>;
    }

    return (
        <>

            <div className="profile-container">

                <div className="banner"> {profile.banner_image && <img src={profile.banner_image} alt="Profile" className="banner" />}</div>
                <div className="profile-section">
                    <div className="profile-header">
                        {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.display_name} className="avatar" /> : <div
                            className="avatar"
                        >
                            {getUserInitials(profile.display_name)}
                        </div>}
                        {user?.uid == profile.uid && <button onClick={() => { router.push('/store/profile/edit') }} className="follow-btn">Edit</button>}
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
                                {formatNumber(profile.following)}
                                <span className="stat-label">Following</span>
                            </a>
                            <a href="#" className="stat-link">
                                {formatNumber(profile.followers)}
                                <span className="stat-label">Followers</span>
                            </a>
                        </div>

                        <div className="social-links">
                            {profile.social_links.github && (
                                <a href={`${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="social-link">
                                    <Github size={18} />
                                </a>
                            )}
                            {profile.social_links.twitter && (
                                <a href={`${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {profile.social_links.linkedin && (
                                <a href={`${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-link">
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
                        {/* <button
                            className={`tab ${activeTab === 'mcp' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mcp')}
                        >
                            <svg fill="currentColor" height="20px" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z"></path><path d="M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z"></path></svg>
                            MCP
                        </button> */}
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