'use client'
import React, { useState } from 'react';
import { X, Camera, Upload, MapPin, Globe, Calendar, Github, Twitter, Linkedin, Save, ArrowLeft } from 'lucide-react';
import './style.css'

const EditProfile = () => {
    const [formData, setFormData] = useState({
        display_name: "QubicSquare",
        username: "qubicsquare",
        bio: "We build AI agents and MCP tools that revolutionize how businesses interact with artificial intelligence. Passionate about creating innovative solutions.",
        website: "https://qubicsquare.com",
        location: "San Francisco, CA",
        github: "qubicsquare",
        twitter: "qubicsquare",
        linkedin: "qubicsquare"
    });

    const [avatarPreview, setAvatarPreview] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face");
    const [bannerPreview, setBannerPreview] = useState("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=300&fit=crop");
    const [isUploading, setIsUploading] = useState({ avatar: false, banner: false });

    const handleInputChange = (field: any, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (type: any, event: any) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(prev => ({ ...prev, [type]: true }));

            // Simulate file upload
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setTimeout(() => {
                    if (type === 'avatar') {
                        setAvatarPreview(e.target.result);
                    } else {
                        setBannerPreview(e.target.result);
                    }
                    setIsUploading(prev => ({ ...prev, [type]: false }));
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Simulate save action
        console.log('Saving profile:', formData);
        alert('Profile updated successfully!');
    };

    return (
        <>
            <style jsx>{`
        
      `}</style>

            <div className="edit-container">

                <div className="banner-section">
                    <img src={bannerPreview} alt="Profile" className="banner" />
                    <div className="banner-overlay">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('banner', e)}
                            className="hidden-input"
                            id="banner-upload"
                        />
                        <label htmlFor="banner-upload" className="upload-btn">
                            {isUploading.banner ? (
                                <div className="upload-loading">⟳</div>
                            ) : (
                                <Camera size={20} />
                            )}
                        </label>
                    </div>
                </div>

                <div className="avatar-section">
                    <div className="avatar-container">
                        <img src={avatarPreview} alt="Profile" className="avatar" />
                        <div className="avatar-overlay">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload('avatar', e)}
                                className="hidden-input"
                                id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload" className="upload-btn">
                                {isUploading.avatar ? (
                                    <div className="upload-loading">⟳</div>
                                ) : (
                                    <Camera size={20} />
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.display_name}
                            onChange={(e) => handleInputChange('display_name', e.target.value)}
                            maxLength={50}
                        />
                        <div className={`char-count ${formData.display_name.length > 45 ? 'over-limit' : ''}`}>
                            {formData.display_name.length} / 50
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                            maxLength={15}
                        />
                        <div className="help-text">Only letters, numbers, and underscores. 15 characters max.</div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                            className="form-textarea"
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            maxLength={160}
                            placeholder="Tell people about yourself..."
                        />
                        <div className={`char-count ${formData.bio.length > 140 ? 'over-limit' : ''}`}>
                            {formData.bio.length} / 160
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <div className="input-group">
                            <MapPin className="input-icon" size={18} />
                            <input
                                type="text"
                                className="form-input input-with-icon"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                placeholder="Where are you based?"
                                maxLength={30}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Website</label>
                        <div className="input-group">
                            <Globe className="input-icon" size={18} />
                            <input
                                type="url"
                                className="form-input input-with-icon"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                        <div className="help-text">Your website or portfolio URL</div>
                    </div>

                    <div className="social-section">
                        <h3 className="section-title">Social Links</h3>
                        <div className="social-grid">
                            <div className="form-group">
                                <label className="form-label">GitHub Username</label>
                                <div className="input-group">
                                    <Github className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        className="form-input input-with-icon"
                                        value={formData.github}
                                        onChange={(e) => handleInputChange('github', e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                                        placeholder="github-username"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Twitter Username</label>
                                <div className="input-group">
                                    <Twitter className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        className="form-input input-with-icon"
                                        value={formData.twitter}
                                        onChange={(e) => handleInputChange('twitter', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                        placeholder="twitter_username"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">LinkedIn Username</label>
                                <div className="input-group">
                                    <Linkedin className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        className="form-input input-with-icon"
                                        value={formData.linkedin}
                                        onChange={(e) => handleInputChange('linkedin', e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                                        placeholder="linkedin-username"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="save-btn" onClick={handleSave}>
                        <Save size={16} />
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditProfile;