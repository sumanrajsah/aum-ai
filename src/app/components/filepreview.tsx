// components/FilePreview.tsx
import React from 'react';
import './filepreview.css'

type FilePreviewProps = {
    fileUrl: string;
    fileName: string;
};

const FilePreview: React.FC<FilePreviewProps> = ({ fileUrl, fileName }) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    // Image preview
    if (extension && ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
        return <img src={fileUrl} alt={fileName} className="image-preview" />;
    }

    // Card for non-image
    return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="file-card">
            <div className="file-icon">📄</div>
            <div className="file-info">
                <p className="file-name">{fileName}</p>
                <p className="file-subtext">Click to download</p>
            </div>
        </a>
    );
};

export default FilePreview;
