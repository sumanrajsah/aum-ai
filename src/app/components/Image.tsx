"use client";
import React, { useRef } from "react";

interface RenderImageProps {
  src: string;
  alt: string;
}

const RenderImage: React.FC<RenderImageProps> = ({ src, alt }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous"; // Allow cross-origin images

    return new Promise<string>((resolve) => {
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Add watermark text
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Semi-transparent white
        ctx.textAlign = "center";
        ctx.fillText("AI Generated", canvas.width / 2, canvas.height / 2);

        // Convert canvas to a downloadable image
        const watermarkedImage = canvas.toDataURL("image/png");
        resolve(watermarkedImage);
      };
    });
  };

  const handleDownload = async () => {
    const watermarkedImage = await addWatermark();
    if (!watermarkedImage) return;

    const link = document.createElement("a");
    link.href = watermarkedImage;
    link.download = "ai-generated-image.png";
    link.click();
  };

  const handleShare = async () => {
    const watermarkedImage = await addWatermark();
    if (!watermarkedImage) return;

    // Convert data URL to a Blob
    const blob = await fetch(watermarkedImage).then((res) => res.blob());

    // Share the image using the Web Share API
    if (navigator.share) {
      const file = new File([blob], "ai-generated-image.png", {
        type: "image/png",
      });
      const filesArray = [file];

      navigator.share({
        files: filesArray,
        title: "AI Generated Image",
        text: "Check out this AI-generated image!",
      });
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Display the original image */}
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: "100%",
          borderRadius: "8px",
          margin: "10px 0",
          height: "250px",
          width: "250px",
        }}
      />

      {/* Hidden canvas for watermarking */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Download and Share Buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={handleDownload}
          style={{
            padding: "5px",
            background: "rgba(0, 0, 0, 0.7)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span role="img" aria-label="Download">
            ⬇️
          </span>
        </button>
        <button
          onClick={handleShare}
          style={{
            padding: "5px",
            background: "rgba(0, 0, 0, 0.7)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span role="img" aria-label="Share">
            🔗
          </span>
        </button>
      </div>
    </div>
  );
};

export default RenderImage;