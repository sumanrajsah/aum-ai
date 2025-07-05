// components/FilePreview.tsx
import React from 'react';

type FilePreviewProps = {
    fileUrl: string;
    fileName: string;
};

const FilePreview: React.FC<FilePreviewProps> = ({ fileUrl, fileName }) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension) return (
        <div className='file-view-user'>
            {fileUrl}
        </div>
    );

    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
        return <img src={fileUrl} alt={fileName} style={{ maxWidth: '100%', maxHeight: '400px' }} />;
    }

    // PDF files
    if (extension === 'pdf') {
        const encodedUrl = encodeURIComponent(fileUrl);

        return (
            <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                width="250px"
                height="250px"
                style={{
                    width: '1000px',
                    height: '1000px',
                    border: 'none',
                    zoom: '0.25', // Chrome-only
                }}
                title={fileName}
            />
        );
    }

    // Video files
    if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return (
            <video controls width="100%">
                <source src={fileUrl} type={`video/${extension}`} />
                Your browser does not support the video tag.
            </video>
        );
    }

    // Audio files
    if (['mp3', 'wav', 'ogg'].includes(extension)) {
        return (
            <audio controls>
                <source src={fileUrl} type={`audio/${extension}`} />
                Your browser does not support the audio tag.
            </audio>
        );
    }

    // Text files
    if (['txt', 'csv', 'json'].includes(extension)) {
        return (
            <iframe
                src={fileUrl}
                width="100%"
                height="400px"
                style={{ border: '1px solid #ccc' }}
                title={fileName}
            />
        );
    }

    // Office files (doc, docx, xls, pptx) – fallback to Google Docs Viewer or Microsoft Office Viewer
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
        const encodedUrl = encodeURIComponent(fileUrl);
        return (
            <iframe
                src={`https://view.officeapps.live.com/op/view.aspx?src=${encodedUrl}`}
                width="250px"
                height="250px"
                title={fileName}
                style={{
                    width: '1000px',
                    height: '1000px',
                    border: 'none',
                    zoom: '0.25', // Chrome-only
                }}
            />
        );
    }

    // Fallback
    return (
        <div>
            <p>File preview not supported.</p>
        </div>
    );
};

export default FilePreview;
