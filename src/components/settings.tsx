import React, { useState } from 'react';
import UploadSection from './UploadSection'; // Assuming this component exists
import { FileData } from '../components/types'; // Assuming this type exists

// Type for the file setter function expected by UploadSection
type FileDataSetter = React.Dispatch<React.SetStateAction<FileData[]>>;

// Define the props interface for MedicalUploader
interface MedicalUploaderProps {
  workspaceDetails: {
    llmPreference: 'offline' | 'online';
    medicalFiles: FileData[];
    patientFiles: FileData[];
  };
  onLLMPreferenceChange: (preference: 'offline' | 'online') => void;
  // Add handlers for updating file lists
  onMedicalFilesChange: FileDataSetter;
  onPatientFilesChange: FileDataSetter;
  className?: string; // For theme class ('light' or 'dark')
}

// Define the MedicalUploader functional component
const MedicalUploader: React.FC<MedicalUploaderProps> = ({
  workspaceDetails,
  onLLMPreferenceChange,
  onMedicalFilesChange,
  onPatientFilesChange,
  className = 'light',
}) => {
  // Destructure workspaceDetails for easier access
  const { llmPreference, medicalFiles, patientFiles } = workspaceDetails;

  // Local state for UI controls within this component (Settings page)
  const [medicalInputMethod, setMedicalInputMethod] = useState<'upload' | 'url'>('upload');
  const [patientInputMethod, setPatientInputMethod] = useState<'upload' | 'url'>('upload');
  const [medicalUrl, setMedicalUrl] = useState('');
  const [patientUrl, setPatientUrl] = useState('');

  // Basic button styles using CSS variables
  const buttonBaseStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '0 5px',
    border: `1px solid var(--border-color, #e5e7eb)`, // Theme border color with fallback
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: 'transparent', // Default to transparent
    color: `var(--text-color-secondary, #6c757d)`, // Secondary text color with fallback
  };

  // Style for the selected button
  const selectedButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: `var(--secondary-bg, #f5f5f5)`, // Secondary background for selected
    color: `var(--text-color, #000000)`, // Primary text color for selected
    borderColor: `var(--accent-color, #007bff)`, // Accent color for border
    fontWeight: 600,
  };

  // Style for the non-selected button (same as base style but explicit for clarity)
  const normalButtonStyle: React.CSSProperties = buttonBaseStyle;

  return (
    <div
      className={className} // Apply theme class ('light' or 'dark')
      style={{
        padding: '20px',
        overflowY: 'auto',
        height: '100%',
        color: `var(--text-color, #000000)`, // Primary text color with fallback
      }}
    >
      {/* Main Title */}
      <h1
        style={{
          color: `var(--text-color, #000000)`, // Theme text color
          borderBottom: `1px solid var(--border-color, #e5e7eb)`, // Theme border color
          paddingBottom: '10px',
          marginBottom: '20px',
          fontSize: '24px',
        }}
      >
        Settings
      </h1>

      {/* LLM Preference Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            color: `var(--text-color, #000000)`, // Theme text color
            marginBottom: '10px',
            fontSize: '18px',
          }}
        >
          LLM Preference
        </h2>
        <div>
          {/* Offline Button */}
          <button
            style={llmPreference === 'offline' ? selectedButtonStyle : normalButtonStyle}
            onClick={() => onLLMPreferenceChange('offline')}
            onMouseEnter={(e) => {
              if (llmPreference !== 'offline') {
                e.currentTarget.style.backgroundColor = `var(--secondary-bg, #f5f5f5)`;
                e.currentTarget.style.color = `var(--text-color, #000000)`;
              }
            }}
            onMouseLeave={(e) => {
              if (llmPreference !== 'offline') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = `var(--text-color-secondary, #6c757d)`;
              }
            }}
          >
            Offline
          </button>
          {/* Online Button */}
          <button
            style={llmPreference === 'online' ? selectedButtonStyle : normalButtonStyle}
            onClick={() => onLLMPreferenceChange('online')}
            onMouseEnter={(e) => {
              if (llmPreference !== 'online') {
                e.currentTarget.style.backgroundColor = `var(--secondary-bg, #f5f5f5)`;
                e.currentTarget.style.color = `var(--text-color, #000000)`;
              }
            }}
            onMouseLeave={(e) => {
              if (llmPreference !== 'online') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = `var(--text-color-secondary, #6c757d)`;
              }
            }}
          >
            Online
          </button>
        </div>
      </div>

      {/* Upload Sections Wrapper */}
      <div className="settings-upload-sections" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <UploadSection
          title="Uploaded Medical Documents"
          files={medicalFiles}
          setFiles={onMedicalFilesChange}
          inputMethod={medicalInputMethod}
          setInputMethod={setMedicalInputMethod}
          url={medicalUrl}
          setUrl={setMedicalUrl}
          className={className}
        />
        <UploadSection
          title="Uploaded Patient Documents"
          files={patientFiles}
          setFiles={onPatientFilesChange}
          inputMethod={patientInputMethod}
          setInputMethod={setPatientInputMethod}
          url={patientUrl}
          setUrl={setPatientUrl}
          className={className}
        />
      </div>
    </div>
  );
};

export default MedicalUploader;