'use client'
import React, { useState, useEffect, useRef } from 'react';
import './image.css';
import { useChat, useImagePlaygound } from '@/context/ChatContext';
import { Download, Expand, Images, SquarePen, Trash2 } from 'lucide-react';
import { useAlert } from '@/context/alertContext';


interface ChatMessageProps {
    data?: ImageMetadata;
    loading?: boolean;
}

const ImageAssistantCard: React.FC<ChatMessageProps> = ({ data, loading }) => {
    const { setExpandImage } = useImagePlaygound();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [shouldLoadImage, setShouldLoadImage] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { setEditInput } = useChat();
    const imageCardRef = useRef<HTMLDivElement>(null);
    const alert = useAlert();

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

    // Image loading effect - only runs when shouldLoadImage is true
    useEffect(() => {
        if (!data?.image_url || !shouldLoadImage) {
            setImageLoaded(false);
            setImageError(false);
            return;
        }

        // Reset states when URL changes
        setImageLoaded(false);
        setImageError(false);

        const img = new Image();
        img.src = data.image_url;

        const handleLoad = () => {
            setImageLoaded(true);
            setImageError(false);
        };

        const handleError = (error: Event | string) => {
            console.error("Image failed to load:", data.image_url, error);
            setImageError(true);
            setImageLoaded(false);
        };

        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);

        // Cleanup function
        return () => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
            img.src = '';
        };
    }, [data?.image_url, shouldLoadImage]);

    const handleDownload = async (imageUrl: string) => {
        try {
            // Notify user
            alert.success("Downloading...");

            // Create and click hidden link
            const link = document.createElement("a");
            link.href = imageUrl + "?download=1";
            //link.target = "_blank"; // optional
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert.success("Download completed!");
        } catch (err) {
            console.error("Image download failed:", err);
            alert.error("Download failed. Opening in new tab...");
            window.open(imageUrl, "_blank");
        }
    };

    async function deleteImage(imageId: string) {
        alert.success('Deleting...');
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/v1/image/delete`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image_id: imageId }),
                }
            );

            let data: any;
            try {
                data = await res.json();
            } catch {
                throw new Error("Invalid server response");
            }

            if (!res.ok) {
                throw new Error(data?.error || "Failed to delete image");
            }
            alert.success('Deleted');
            location.href = '/image-playground'
            return data;
        } catch (err: any) {
            // Differentiate between network error and API error
            if (err.name === "TypeError") {
                // e.g. fetch failed due to CORS, network down, etc.
                throw new Error("Network error: Unable to reach server");
            }
            throw err;
        }
    }

    if (loading) {
        return (
            <div className="image-card">
                <div className="loading-img-container">
                    <div className="loading-img">
                        <Images size={40} color='grey' />
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="image-card" ref={imageCardRef}>
            <div className="image-card-img-cont">
                {/* Show loading state until image should load and is loaded */}
                {(!shouldLoadImage || (!imageLoaded && !imageError)) && (
                    <div className="loading-img-container">
                        <div className="loading-img">
                            <Images size={40} color='grey' />
                        </div>
                    </div>
                )}

                {shouldLoadImage && imageError && (
                    <div className="error-img-container">
                        <div className="image-error">
                            <p>Failed to load image</p>
                        </div>
                    </div>
                )}

                {shouldLoadImage && imageLoaded && !imageError && (
                    <img
                        src={data.image_url}
                        alt={data.revised_prompt || data.prompt || 'Generated image'}
                        className="img"
                        onError={() => setImageError(true)}
                    />
                )}

                {shouldLoadImage && imageLoaded && (
                    <div className="image-card-footer">
                        <button
                            className="img-card-footer-btn"
                            onClick={() => setEditInput(data.prompt)}
                            title="Edit prompt"
                        >
                            <SquarePen size={18} />
                        </button>
                        <button
                            className="img-card-footer-btn"
                            onClick={() => {
                                setExpandImage(data);
                                window.location.hash = 'image';
                            }}
                            title="Expand image"
                        >
                            <Expand size={18} />
                        </button>
                        <button
                            className="img-card-footer-btn"
                            onClick={() => handleDownload(data.image_url)}
                            title="Download image"
                            disabled={!imageLoaded || imageError}
                        >
                            <Download size={18} />
                        </button>
                        <button
                            className="img-card-footer-btn"
                            onClick={() => deleteImage(data.image_id)}
                            title="Delete"
                            disabled={!imageLoaded || imageError}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageAssistantCard;