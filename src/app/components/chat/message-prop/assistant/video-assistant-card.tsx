'use client'
import React, { useState, useEffect, useRef } from 'react';
import './video.css';
import { useChat, useVideoPlayground } from '@/context/ChatContext';
import { Download, Expand, Play, SquarePen, Trash2 } from 'lucide-react';
import { useAlert } from '@/context/alertContext';


interface VideoProps {
    data?: VideoMetadata;
    loading?: boolean;
}

const VideoAssistantCard: React.FC<VideoProps> = ({ data, loading }) => {
    const { setExpandVideo } = useVideoPlayground();
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const { setEditInput } = useChat();
    const alert = useAlert();
    const videoCardRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!data || !videoCardRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoadVideo(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the video is visible
                rootMargin: '100px' // Start loading 100px before entering viewport (videos are larger)
            }
        );

        observer.observe(videoCardRef.current);

        return () => {
            if (videoCardRef.current) {
                observer.unobserve(videoCardRef.current);
            }
        };
    }, [data]);

    // Video loading effect - only runs when shouldLoadVideo is true
    useEffect(() => {
        if (!data?.video_url || !shouldLoadVideo) {
            setVideoLoaded(false);
            setVideoError(false);
            return;
        }

        // Reset states when URL changes
        setVideoLoaded(false);
        setVideoError(false);

        const video = document.createElement('video');
        video.src = data.video_url;
        video.preload = 'metadata';

        const handleLoadedData = () => {
            setVideoLoaded(true);
            setVideoError(false);
        };

        const handleError = (error: Event) => {
            console.error("Video failed to load", error);
            setVideoError(true);
            setVideoLoaded(false);
        };

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('error', handleError);

        // Cleanup function
        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('error', handleError);
            video.src = '';
            video.load();
        };
    }, [data?.video_url, shouldLoadVideo]);

    const handleDownload = async (videoUrl: string) => {
        try {
            alert.success('Downloading...');

            // Try direct download first, fallback to proxy if needed
            let response;
            try {
                response = await fetch(videoUrl);
                if (!response.ok) throw new Error('Direct fetch failed');
            } catch {
                // Fallback to proxy (note: cors-anywhere requires approval for production)
                const proxyUrl = `https://cors-anywhere.herokuapp.com/${videoUrl}`;
                response = await fetch(proxyUrl);
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `video-${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            alert.success('Download completed!');
        } catch (err) {
            // console.error('Video download failed:', err);
            alert.error('Download failed. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="video-card">
                <div className="loading-vid-container">
                    <div className="loading-vid">
                        <Play size={40} color='grey' />
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="video-card" ref={videoCardRef}>
            <div className="video-card-img-cont">
                {/* Show loading state until video should load and is loaded */}
                {(!shouldLoadVideo || (!videoLoaded && !videoError)) && (
                    <div className="loading-vid-container">
                        <div className="loading-vid">
                            <Play size={40} color='grey' />
                        </div>
                    </div>
                )}

                {shouldLoadVideo && videoError && (
                    <div className="error-vid-container">
                        <div className="video-error">
                            <p>Failed to load video</p>
                        </div>
                    </div>
                )}

                {shouldLoadVideo && videoLoaded && !videoError && (
                    <video
                        src={data.video_url}
                        className="vid"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={() => setVideoError(true)}
                    />
                )}

                {shouldLoadVideo && videoLoaded && (
                    <div className="video-card-footer">
                        <button
                            className="vid-card-footer-btn"
                            onClick={() => setEditInput(data.prompt)}
                            title="Edit prompt"
                        >
                            <SquarePen size={18} />
                        </button>
                        <button
                            className="vid-card-footer-btn"
                            onClick={() => {
                                setExpandVideo(data);
                                window.location.hash = 'video';
                            }}
                            title="Expand video"
                        >
                            <Expand size={18} />
                        </button>
                        <button
                            className="vid-card-footer-btn"
                            onClick={() => handleDownload(data.video_url)}
                            title="Download video"
                            disabled={!videoLoaded || videoError}
                        >
                            <Download size={18} />
                        </button>
                        <button
                            className="vid-card-footer-btn"
                            onClick={() => handleDownload(data.video_url)}
                            title="Download video"
                            disabled={!videoLoaded || videoError}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoAssistantCard;