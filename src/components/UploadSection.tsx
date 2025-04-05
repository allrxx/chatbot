import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { FileData } from '../components/types'; // Import centralized FileData type

interface UploadSectionProps {
  title: string;
  files: FileData[];
  setFiles?: React.Dispatch<React.SetStateAction<FileData[]>>; // Optional for read-only mode
  inputMethod: 'upload' | 'url';
  setInputMethod?: React.Dispatch<React.SetStateAction<'upload' | 'url'>>; // Optional for read-only mode
  url: string;
  setUrl?: React.Dispatch<React.SetStateAction<string>>; // Optional for read-only mode
}

const UploadSection: React.FC<UploadSectionProps> = ({
  title,
  files,
  setFiles,
  inputMethod,
  setInputMethod,
  url,
  setUrl,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (files && setFiles) {
      const newFiles: FileData[] = Array.from(files).map((file) => ({
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        progress: 100,
        type: 'file',
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const simulateUploadProgress = (files: FileData[]) => {
    files.forEach((file) => {
      const interval = setInterval(() => {
        setFiles?.((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: Math.min(f.progress + 10, 100) } : f
          )
        );
        if (file.progress >= 100) clearInterval(interval);
      }, 100);
    });
  };

  const handleAddUrl = () => {
    if (url && setFiles) {
      setFiles((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          name: url,
          progress: 100,
          type: 'url',
        },
      ]);
      setUrl?.('');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div
      style={{
        padding: '24px',
        marginBottom: '32px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
        {title}
      </h2>
      {setFiles && setInputMethod ? (
        <>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: inputMethod === 'upload' ? '#e5e7eb' : '#f3f4f6',
                color: inputMethod === 'upload' ? '#000' : '#666',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setInputMethod('upload')}
            >
              Upload PDF
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: inputMethod === 'url' ? '#e5e7eb' : '#f3f4f6',
                color: inputMethod === 'url' ? '#000' : '#666',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setInputMethod('url')}
            >
              Enter URL
            </button>
          </div>

          {inputMethod === 'upload' ? (
            <div
              style={{
                border: '2px dashed #3498db',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: dragActive ? '#ecf0f1' : '#fff',
                marginBottom: '16px',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload style={{ height: '48px', width: '48px', color: '#3498db' }} />
              <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
                Drag and drop your PDF files here, or click to browse.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl && setUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '8px',
                }}
              />
              <button
                onClick={handleAddUrl}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#e5e7eb',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Add URL
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          {files.map((file) => (
            <div key={file.id}>{file.name}</div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        {files.map((file) => (
          <div
            key={file.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              marginBottom: '12px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: '#000' }}>{file.name}</span>
                <span style={{ color: '#666' }}>{file.progress}%</span>
              </div>
              <div
                style={{
                  height: '8px',
                  backgroundColor: '#eee',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${file.progress}%`,
                    backgroundColor: '#3498db',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              {file.size && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    color: '#555',
                  }}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
            {setFiles && (
              <button
                onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
                style={{
                  marginLeft: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#e74c3c',
                  cursor: 'pointer',
                }}
              >
                <X style={{ height: '20px', width: '20px' }} />
              </button>
            )}
          </div>
        ))}
      </div>

      {setFiles && setInputMethod && setUrl && (
        <button
          onClick={() => {
            setFiles([]);
            setInputMethod('upload');
            setUrl('');
          }}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f3f4f6',
            color: '#000',
            cursor: 'pointer',
          }}
        >
          Reset Section
        </button>
      )}
    </div>
  );
};

export default UploadSection;