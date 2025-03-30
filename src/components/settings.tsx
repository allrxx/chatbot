import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileData {
  id: string;
  name: string;
  progress: number;
  size?: number;
  type: 'file' | 'url';
}

const MedicalUploader = () => {
  const [llmPreference, setLlmPreference] = useState<'offline' | 'online'>('offline');
  const [medicalFiles, setMedicalFiles] = useState<FileData[]>([]);
  const [patientFiles, setPatientFiles] = useState<FileData[]>([]);
  const [medicalInputMethod, setMedicalInputMethod] = useState<'upload' | 'url'>('upload');
  const [patientInputMethod, setPatientInputMethod] = useState<'upload' | 'url'>('upload');
  const [medicalUrl, setMedicalUrl] = useState('');
  const [patientUrl, setPatientUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null, setFiles: React.Dispatch<React.SetStateAction<FileData[]>>) => {
    if (files) {
      const newFiles: FileData[] = Array.from(files).map(file => ({
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        progress: 0,
        type: 'file'
      }));
      setFiles(prev => [...prev, ...newFiles]);
      simulateUploadProgress(newFiles, setFiles);
    }
  };

  const simulateUploadProgress = (files: FileData[], setFiles: React.Dispatch<React.SetStateAction<FileData[]>>) => {
    files.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, progress: Math.min(f.progress + 10, 100) } : f
        ));
        // Stop the interval when progress reaches 100
        if (file.progress >= 100) clearInterval(interval);
      }, 100);
    });
  };

  const handleAddUrl = (
    url: string,
    setFiles: React.Dispatch<React.SetStateAction<FileData[]>>,
    setUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (url) {
      setFiles(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          name: url,
          progress: 100,
          type: 'url'
        }
      ]);
      setUrl('');
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

  const handleDrop = (e: React.DragEvent, setFiles: React.Dispatch<React.SetStateAction<FileData[]>>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, setFiles);
    }
  };

  const UploadSection = ({
    title,
    files,
    setFiles,
    inputMethod,
    setInputMethod,
    url,
    setUrl
  }: {
    title: string;
    files: FileData[];
    setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
    inputMethod: 'upload' | 'url';
    setInputMethod: React.Dispatch<React.SetStateAction<'upload' | 'url'>>;
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    // Button styles
    const activeButton = {
      padding: '8px 16px',
      borderRadius: '4px',
      backgroundColor: '#e5e7eb',
      color: '#000',
      border: 'none',
      cursor: 'pointer',
      marginRight: '8px'
    };

    const inactiveButton = {
      padding: '8px 16px',
      borderRadius: '4px',
      backgroundColor: '#f3f4f6',
      color: '#666',
      border: 'none',
      cursor: 'pointer',
      marginRight: '8px'
    };

    // Styles for the section container
    const sectionContainer = {
      padding: '24px',
      marginBottom: '32px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
    };

    // Styles for the upload area (distinct and big)
    const uploadArea = {
      border: '2px dashed #3498db',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center' as const,
      backgroundColor: dragActive ? '#ecf0f1' : '#fff',
      marginBottom: '16px',
      minHeight: '150px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    };

    // Input field style
    const inputStyle = {
      flex: 1,
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginRight: '8px'
    };

    // Reset button style
    const resetButton = {
      marginTop: '16px',
      padding: '8px 16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f3f4f6',
      color: '#000',
      cursor: 'pointer'
    };

    // File item style
    const fileItem = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginBottom: '12px'
    };

    const progressContainer = {
      height: '8px',
      backgroundColor: '#eee',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '8px'
    };

    const progressBar = (width: number) => ({
      height: '100%',
      width: `${width}%`,
      backgroundColor: '#3498db',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    });

    return (
      <div style={sectionContainer}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
          {title}
        </h2>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <button
            style={inputMethod === 'upload' ? activeButton : inactiveButton}
            onClick={() => setInputMethod('upload')}
          >
            Upload PDF
          </button>
          <button
            style={inputMethod === 'url' ? activeButton : inactiveButton}
            onClick={() => setInputMethod('url')}
          >
            Enter URL
          </button>
        </div>

        {inputMethod === 'upload' ? (
          <div
            style={uploadArea}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, setFiles)}
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
              onChange={(e) => handleFileUpload(e.target.files, setFiles)}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={() => handleAddUrl(url, setFiles, setUrl)}
              style={activeButton}
            >
              Add URL
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          {files.map(file => (
            <div key={file.id} style={fileItem}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#000' }}>{file.name}</span>
                  <span style={{ color: '#666' }}>{file.progress}%</span>
                </div>
                <div style={progressContainer}>
                  <div style={progressBar(file.progress)} />
                </div>
                {file.size && (
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#555' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
              <button
                onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}
                style={{ marginLeft: '16px', background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
              >
                <X style={{ height: '20px', width: '20px' }} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setFiles([]);
            setInputMethod('upload');
            setUrl('');
          }}
          style={resetButton}
        >
          Reset Section
        </button>
      </div>
    );
  };

  // Styles for main container
  const containerStyle = {
    padding: '32px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)'
  };

  // LLM Preference Section styles
  const llmSection = {
    padding: '24px',
    marginBottom: '32px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f9fafb'
  };

  const llmTitle = { fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#000' };

  return (
    // Make the entire component scrollable
    <div style={{ overflowY: 'auto'}}>
      <div style={containerStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#000' }}>
          Medical Document Upload
        </h1>

        <div style={llmSection}>
          <h2 style={llmTitle}>LLM Preference</h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              style={llmPreference === 'offline'
                ? { padding: '8px 16px', borderRadius: '4px', backgroundColor: '#e5e7eb', color: '#000', border: 'none', cursor: 'pointer' }
                : { padding: '8px 16px', borderRadius: '4px', backgroundColor: '#f3f4f6', color: '#666', border: 'none', cursor: 'pointer' }
              }
              onClick={() => setLlmPreference('offline')}
            >
              Offline
            </button>
            <button
              style={llmPreference === 'online'
                ? { padding: '8px 16px', borderRadius: '4px', backgroundColor: '#e5e7eb', color: '#000', border: 'none', cursor: 'pointer' }
                : { padding: '8px 16px', borderRadius: '4px', backgroundColor: '#f3f4f6', color: '#666', border: 'none', cursor: 'pointer' }
              }
              onClick={() => setLlmPreference('online')}
            >
              Online
            </button>
          </div>
        </div>

        <UploadSection
          title="Upload Medical Documents"
          files={medicalFiles}
          setFiles={setMedicalFiles}
          inputMethod={medicalInputMethod}
          setInputMethod={setMedicalInputMethod}
          url={medicalUrl}
          setUrl={setMedicalUrl}
        />

        <UploadSection
          title="Upload Patient Documents"
          files={patientFiles}
          setFiles={setPatientFiles}
          inputMethod={patientInputMethod}
          setInputMethod={setPatientInputMethod}
          url={patientUrl}
          setUrl={setPatientUrl}
        />
      </div>
    </div>
  );
};

export default MedicalUploader;
