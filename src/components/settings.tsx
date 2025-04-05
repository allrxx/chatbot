import { useState } from 'react';
import UploadSection from './UploadSection'; // Import the standalone UploadSection component
import { FileData } from '../components/types'; // Import centralized FileData type

interface MedicalUploaderProps {
  workspaceDetails: {
    llmPreference: 'offline' | 'online';
    medicalFiles: FileData[];
    patientFiles: FileData[];
  };
  onLLMPreferenceChange: (preference: 'offline' | 'online') => void;
}

const MedicalUploader: React.FC<MedicalUploaderProps> = ({ workspaceDetails, onLLMPreferenceChange }) => {
  const { llmPreference, medicalFiles, patientFiles } = workspaceDetails;

  return (
    <div style={{ overflowY: 'auto' }}>
      <div>
        <h1>Medical Document Upload</h1>

        {/* LLM Preference Section */}
        <div>
          <h2>LLM Preference</h2>
          <div>
            <button
              style={{
                backgroundColor: llmPreference === 'offline' ? '#e5e7eb' : '#f3f4f6',
              }}
              onClick={() => onLLMPreferenceChange('offline')}
            >
              Offline
            </button>
            <button
              style={{
                backgroundColor: llmPreference === 'online' ? '#e5e7eb' : '#f3f4f6',
              }}
              onClick={() => onLLMPreferenceChange('online')}
            >
              Online
            </button>
          </div>
        </div>

        {/* Upload Sections */}
        <UploadSection
          title="Uploaded Medical Documents"
          files={medicalFiles}
          setFiles={() => {}} // Disable file uploads in settings
          inputMethod="upload"
          setInputMethod={() => {}}
          url=""
          setUrl={() => {}}
        />
        <UploadSection
          title="Uploaded Patient Documents"
          files={patientFiles}
          setFiles={() => {}} // Disable file uploads in settings
          inputMethod="upload"
          setInputMethod={() => {}}
          url=""
          setUrl={() => {}}
        />
      </div>
    </div>
  );
};

export default MedicalUploader;
