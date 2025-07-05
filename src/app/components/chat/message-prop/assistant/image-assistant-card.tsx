'use client'
import React, { useState, useEffect, useRef } from 'react';
import './image.css';
import { useChat, useImagePlaygound } from '@/context/ChatContext';
import { Download, Expand, Images, SquarePen } from 'lucide-react';

interface ChatMessageProps {
    data?: ImageMetadata;
    loading?: boolean;
}

const ImageAssistantCard: React.FC<ChatMessageProps> = ({ data, loading }) => {
    const { setExpandImage } = useImagePlaygound(); // Fixed typo
    const [imageLoaded, setImageLoaded] = useState(false);
    const [shouldLoadImage, setShouldLoadImage] = useState(false);
    const { setEditInput } = useChat();
    const imageCardRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!data || !imageCardRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoadImage(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the image is visible
                rootMargin: '50px' // Start loading 50px before the image enters viewport
            }
        );

        observer.observe(imageCardRef.current);

        return () => {
            if (imageCardRef.current) {
                observer.unobserve(imageCardRef.current);
            }
        };
    }, [data]);

    // Load image when shouldLoadImage becomes true
    useEffect(() => {
        if (!data || !shouldLoadImage) return;

        const img = new Image(); // Simplified image creation
        img.src = data.image_url;

        img.onload = () => {
            setImageLoaded(true);
        };

        img.onerror = (error: any) => {
            console.log("Image failed to load:", data.image_url, error.type || "Unknown error");
            setImageLoaded(false); // Still set to true to hide loading state
        };
    }, [data?.image_url, shouldLoadImage]);

    const handleDownload = async (imageUrl: string) => {
        try {
            // Try direct download first
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Image download failed:', err);
            // Fallback: open image in new tab
            window.open(imageUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="image-card">
                <div className="loading-img-container">
                    <div className="loading-img" >
                        <Images size={40} />
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="image-card" ref={imageCardRef}>
            <div className="image-card-img-cont">
                {/* Show loading state until image is loaded */}
                {(!imageLoaded || !shouldLoadImage) && (
                    <div className="loading-img-container">
                        <div className="loading-img" >
                            <Images size={40} />
                        </div>
                    </div>
                )}

                {imageLoaded && shouldLoadImage && (
                    <img
                        src={data.image_url}
                        alt={data.revised_prompt}
                        className="img"
                        loading="lazy" // Native lazy loading as fallback
                    />
                )}

                <div className="image-card-footer">
                    <button
                        className="img-card-footer-btn"
                        onClick={() => {
                            setEditInput(data.prompt);
                        }}
                        aria-label="Edit prompt"
                    >
                        <SquarePen size={18} />
                    </button>
                    <button
                        className="img-card-footer-btn"
                        onClick={() => {
                            setExpandImage(data);
                            window.location.hash = 'image'; // More explicit window reference
                        }}
                        aria-label="Expand image"
                    >
                        <Expand size={18} />
                    </button>
                    <button
                        className="img-card-footer-btn"
                        onClick={() => handleDownload(data.image_url)}
                        aria-label="Download image"
                    >
                        <Download size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageAssistantCard;