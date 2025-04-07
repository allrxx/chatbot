import React, { useRef, useState } from 'react';
// Assuming lucide-react is installed and icons are available
import { Upload, X, CheckCircle } from 'lucide-react';
import { FileData } from '../components/types'; // Assuming this type exists

// Define the props interface for UploadSection
interface UploadSectionProps {
  title: string;
  files: FileData[];
  setFiles?: React.Dispatch<React.SetStateAction<FileData[]>>;
  inputMethod?: 'upload' | 'url';
  setInputMethod?: React.Dispatch<React.SetStateAction<'upload' | 'url'>>;
  url?: string;
  setUrl?: React.Dispatch<React.SetStateAction<string>>;
  readOnly?: boolean;
  // Add className prop to allow passing theme ('light' or 'dark')
  className?: string;
}

// Define the UploadSection functional component
const UploadSection: React.FC<UploadSectionProps> = ({
  title,
  files,
  setFiles,
  inputMethod = 'upload',
  setInputMethod,
  url = '',
  setUrl,
  readOnly = false,
  className = 'light', // Default to light theme
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Event Handlers (Keep existing logic) ---

  const handleFileUpload = (filesList: FileList | null) => {
    if (readOnly || !setFiles) return; // Prevent action if readOnly or setFiles not provided
    if (filesList) {
      const newFiles: FileData[] = Array.from(filesList).map((file) => ({
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        progress: 0,
        type: 'file',
        status: 'uploading',
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      simulateUploadProgress(newFiles);
    }
  };

  const simulateUploadProgress = (filesArr: FileData[]) => {
     if (readOnly || !setFiles) return;
    // Use requestAnimationFrame for smoother updates potentially
    filesArr.forEach((file) => {
        let currentProgress = 0;
        const step = () => {
            currentProgress = Math.min(currentProgress + 5 + Math.random() * 10, 100); // Simulate variable speed
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === file.id
                        ? {
                            ...f,
                            progress: Math.round(currentProgress), // Round progress
                            status: currentProgress >= 100 ? 'completed' : 'uploading',
                          }
                        : f
                )
            );
            if (currentProgress < 100) {
                setTimeout(step, 50 + Math.random() * 100); // Simulate variable network speed
            }
        };
        setTimeout(step, 50); // Initial delay
    });
  };


  const handleAddUrl = () => {
    if (readOnly || !setFiles || !setUrl) return;
    if (url) {
      // Basic URL validation (optional)
      try {
        new URL(url); // Check if it's a valid URL structure
        setFiles((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            name: url,
            size: 0,
            progress: 100,
            type: 'url',
            status: 'completed',
          },
        ]);
        setUrl(''); // Clear input after adding
      } catch (_) {
        alert("Please enter a valid URL (e.g., https://example.com)");
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files);
  };

  const handleRemoveFile = (fileId: string) => {
    if (readOnly || !setFiles) return;
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  // --- Styles using CSS Variables ---

  // Style for toggle buttons (Upload/URL)
  const toggleButtonBaseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: `1px solid var(--border-color, #e5e7eb)`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    fontSize: '14px',
    fontWeight: 500,
  };

  const toggleButtonSelectedStyle: React.CSSProperties = {
    ...toggleButtonBaseStyle,
    backgroundColor: `var(--secondary-bg, #f5f5f5)`,
    color: `var(--text-color, #000000)`,
    borderColor: `var(--accent-color, #007bff)`,
    fontWeight: 600,
  };

  const toggleButtonNormalStyle: React.CSSProperties = {
    ...toggleButtonBaseStyle,
    backgroundColor: 'transparent',
    color: `var(--text-color-secondary, #6c757d)`,
  };

  // Style for the main "Add URL" button
   const primaryButtonStyle: React.CSSProperties = {
    padding: '10px 18px', // Slightly larger padding
    borderRadius: '4px',
    backgroundColor: `var(--button-bg, #007bff)`,
    color: `var(--button-text, #ffffff)`,
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background-color 0.2s ease',
  };

  const primaryButtonHoverStyle: React.CSSProperties = {
      backgroundColor: `var(--hover-bg, #0057a3)`,
  };


  return (
    // Apply theme class to the root element
    <div
      className={className}
      style={{
        // Use secondary background for the card itself
        backgroundColor: `var(--secondary-bg, #ffffff)`,
        border: `1px solid var(--border-color, #e5e7eb)`,
        color: `var(--text-color, #000000)`, // Default text color
        padding: '24px',
        marginBottom: '32px',
        borderRadius: '8px',
        // Removed boxShadow for flatter design, use borders instead
      }}
    >
      {/* Section Title */}
      <h2 style={{
          fontSize: '1.25rem', // Adjusted size
          fontWeight: 600, // Adjusted weight
          marginBottom: '16px',
          color: `var(--text-color, #000000)`, // Use text color variable
          borderBottom: `1px solid var(--border-color, #e5e7eb)`, // Separator
          paddingBottom: '8px',
       }}>
        {title}
      </h2>

      {/* Conditional rendering for editable controls */}
      {!readOnly && setFiles && setInputMethod && setUrl && (
        <>
          {/* Input Method Toggle Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              style={inputMethod === 'upload' ? toggleButtonSelectedStyle : toggleButtonNormalStyle}
              onClick={() => setInputMethod('upload')}
              onMouseEnter={(e) => { if (inputMethod !== 'upload') e.currentTarget.style.backgroundColor = `var(--secondary-bg, #f5f5f5)`; }}
              onMouseLeave={(e) => { if (inputMethod !== 'upload') e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Upload Files
            </button>
            <button
              style={inputMethod === 'url' ? toggleButtonSelectedStyle : toggleButtonNormalStyle}
              onClick={() => setInputMethod('url')}
              onMouseEnter={(e) => { if (inputMethod !== 'url') e.currentTarget.style.backgroundColor = `var(--secondary-bg, #f5f5f5)`; }}
              onMouseLeave={(e) => { if (inputMethod !== 'url') e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Enter URL
            </button>
          </div>

          {/* Upload Area or URL Input */}
          {inputMethod === 'upload' ? (
            // Drag and Drop Area
            <div
              style={{
                border: `2px dashed var(--accent-color, #007bff)`, // Use accent color for border
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                // Use background color, change on drag active
                backgroundColor: dragActive ? `var(--secondary-bg, #f5f5f5)` : `var(--background-color, #ffffff)`,
                marginBottom: '16px',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()} // Trigger hidden file input
            >
              <Upload style={{ height: '48px', width: '48px', color: `var(--accent-color, #007bff)` }} />
              <p style={{
                  marginTop: '12px',
                  fontSize: '0.9rem',
                  color: `var(--text-color-secondary, #6c757d)` // Use secondary text color
               }}>
                Drag and drop files here, or click to browse.
              </p>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx" // Specify acceptable file types
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            // URL Input Area
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
              <input
                type="url" // Use type="url" for better semantics/validation
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                style={{
                  flex: 1, // Take available space
                  padding: '10px 12px',
                  border: `1px solid var(--border-color, #cccccc)`,
                  borderRadius: '4px',
                  backgroundColor: `var(--input-bg, #f8f8f8)`, // Use input background
                  color: `var(--input-text, #49454f)`, // Use input text color
                  fontSize: '14px',
                  outline: 'none', // Remove default outline
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                 // Add focus style using pseudo-class if using CSS modules/styled-components
                 // Or inline using focus/blur handlers (less ideal)
                 onFocus={(e) => e.target.style.borderColor = `var(--focus-ring-color, #007bff)`}
                 onBlur={(e) => e.target.style.borderColor = `var(--border-color, #cccccc)`}
              />
              <button
                onClick={handleAddUrl}
                style={primaryButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `var(--hover-bg, #0057a3)`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `var(--button-bg, #007bff)`}
              >
                Add URL
              </button>
            </div>
          )}
        </>
      )}

      {/* File List */}
      <div style={{ marginTop: '24px' }}>
        {files.length === 0 && (
             <p style={{ textAlign: 'center', color: `var(--text-color-secondary, #6c757d)`, fontSize: '14px' }}>
                {readOnly ? "No documents uploaded." : "Upload documents or add URLs using the controls above."}
            </p>
        )}
        {files.map((file) => (
          <div
            key={file.id}
            style={{
              position: 'relative', // For absolute positioning of delete button
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px', // Adjusted padding
              border: `1px solid var(--border-color, #e5e7eb)`,
              borderRadius: '8px',
              // Use input background for file items for slight contrast
              backgroundColor: `var(--input-bg, #f9f9f9)`,
              marginBottom: '12px',
              gap: '16px', // Add gap between elements
            }}
          >
            {/* File Info and Progress */}
            <div style={{ flex: 1, overflow: 'hidden' }}> {/* Allow shrinking and hide overflow */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                {/* File Name (truncated) */}
                <span title={file.name} style={{
                    color: `var(--text-color, #000000)`,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginRight: '10px', // Space before status icon/text
                 }}>
                  {file.name}
                </span>
                {/* Status Icon/Text */}
                {file.status === 'completed' ? (
                  <CheckCircle style={{ color: `var(--success-color, green)`, height: '20px', width: '20px', flexShrink: 0 }} />
                ) : (
                  <span style={{ color: `var(--text-color-secondary, #666666)`, fontSize: '13px', flexShrink: 0 }}>{file.progress}%</span>
                )}
              </div>
              {/* Progress Bar */}
              {file.status !== 'completed' && ( // Only show progress bar if not completed
                  <div style={{
                      height: '6px', // Thinner progress bar
                      backgroundColor: `var(--border-color, #eeeeee)`, // Use border color for track
                      borderRadius: '3px',
                      overflow: 'hidden',
                   }}>
                    <div style={{
                        height: '100%',
                        width: `${file.progress}%`,
                        // Use accent color for progress, success color when complete (handled by hiding bar)
                        backgroundColor: `var(--accent-color, #007bff)`,
                        borderRadius: '3px',
                        transition: 'width 0.1s linear', // Smoother transition
                     }} />
                  </div>
              )}
               {/* File Size */}
               {file.size > 0 && ( // Only show size if available (not for URLs)
                    <div style={{
                        marginTop: '8px',
                        fontSize: '0.8rem', // Smaller size text
                        color: `var(--text-color-secondary, #555555)`,
                    }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                )}
            </div>

            {/* Remove Button (only if not readOnly) */}
            {!readOnly && setFiles && (
              <button
                onClick={() => handleRemoveFile(file.id)}
                title="Remove File"
                style={{
                  background: 'none',
                  border: 'none',
                  color: `var(--error-color, #e74c3c)`, // Use error color
                  cursor: 'pointer',
                  padding: '4px', // Smaller padding
                  borderRadius: '50%',
                  display: 'flex', // Ensure icon is centered
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0, // Prevent button from shrinking
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `var(--error-color, #e74c3c)1A`; }} // Use error color with low alpha for hover
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X style={{ height: '18px', width: '18px' }} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadSection;
