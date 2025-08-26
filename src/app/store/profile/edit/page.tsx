'use client'
import React, { useEffect, useState } from 'react';
import { X, Camera, Upload, MapPin, Globe, Calendar, Github, Twitter, Linkedin, Save, ArrowLeft } from 'lucide-react';
import './style.css'
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useAlert } from '@/context/alertContext';

const EditProfile = () => {
    const { user } = useAuth();
    const alert = useAlert();
    const [formData, setFormData] = useState({
        _id: '',
        display_name: "QubicSquare",
        username: "qubicsquare",
        bio: "We build AI agents and MCP tools that revolutionize how businesses interact with artificial intelligence. Passionate about creating innovative solutions.",
        website: "https://qubicsquare.com",
        location: "San Francisco, CA",
        social_links: {
            "github": "https://github.com/qubicsquare",
            "twitter": "https://twitter.com/qubicsquare",
            "linkedin": "https://linkedin.com/in/qubicsquare",
        },
        banner_image: '',
        avatar_url: ''
    });

    const [avatarPreview, setAvatarPreview] = useState("");
    const [bannerPreview, setBannerPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);;
    const [bannerFile, setBannerFile] = useState<File | null>(null);;
    const [isUploading, setIsUploading] = useState({ avatar: false, banner: false });

    const handleInputChange = (field: any, value: any) => {
        if (field === 'github' || field === 'twitter' || field === 'linkedin') {
            setFormData(prev => ({
                ...prev,
                social_links: {
                    ...prev.social_links,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/store/dev`,
                {
                    params: { uid: user?.uid },
                    withCredentials: true,
                }
            );
            console.log(response.data)
            setFormData(response.data.profile)
        } catch (e) { console.log(e) }
    }

    useEffect(() => {
        if (user?.uid) {
            fetchProfile();
        }
    }, [user])

    const handleFileUpload = (type: any, event: any) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(prev => ({ ...prev, [type]: true }));

            // Simulate file upload
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setTimeout(() => {
                    if (type === 'avatar') {
                        setAvatarFile(file)
                        setAvatarPreview(e.target.result);
                    } else {
                        setBannerFile(file)
                        setBannerPreview(e.target.result);
                    }
                    setIsUploading(prev => ({ ...prev, [type]: false }));
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
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
    const handleSave = async () => {
        try {
            const { _id, ...rest } = formData; // remove _id

            const fd = new FormData();
            fd.append('uid', String(user?.uid));                 // simple fields as strings
            fd.append('profileData', JSON.stringify(rest));     // all profile fields
            if (avatarFile) fd.append('avatar', avatarFile);    // <input type="file" name="avatar" />
            if (bannerFile) fd.append('banner', bannerFile);    // <input type="file" name="banner" />

            const resp = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/store/dev`,
                fd,
                { withCredentials: true } // axios sets Content-Type boundary automatically for FormData
            );

            alert.success('Profile updated successfully');
        } catch (err) {
            console.error(err);
            alert.warn('Error updating profile');
        }
    };

    return (
        <>
            <style jsx>{`
        
      `}</style>

            <div className="edit-container">

                <div className="banner-section">
                    {(bannerPreview || formData.banner_image) && <img src={bannerPreview ? bannerPreview : formData.banner_image} alt="Profile" className="banner" />}
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
                        {(avatarPreview || formData.avatar_url) && <img src={avatarPreview ? avatarPreview : formData.avatar_url} alt="Profile" className="avatar" />}
                        {!(avatarPreview || formData.avatar_url) && <div
                            className="avatar"
                        >
                            {getUserInitials(formData.display_name)}
                        </div>}
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
                                <label className="form-label">GitHub Link</label>
                                <div className="input-group">
                                    <Github className="input-icon" size={18} />
                                    <input
                                        type="url"
                                        className="form-input input-with-icon"
                                        value={formData.social_links.github}
                                        onChange={(e) => handleInputChange('github', e.target.value)}
                                        placeholder="https://github.com/username"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Twitter Link</label>
                                <div className="input-group">
                                    <Twitter className="input-icon" size={18} />
                                    <input
                                        type="url"
                                        className="form-input input-with-icon"
                                        value={formData.social_links.twitter}
                                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                                        placeholder="https://twitter.com/username"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">LinkedIn Link</label>
                                <div className="input-group">
                                    <Linkedin className="input-icon" size={18} />
                                    <input
                                        type="url"
                                        className="form-input input-with-icon"
                                        value={formData.social_links.linkedin}
                                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
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