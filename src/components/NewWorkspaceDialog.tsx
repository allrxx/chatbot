import React, { useState } from 'react';
import UploadSection from './UploadSection';
import { FileData } from '../components/types'; // Import centralized FileData type

interface NewWorkspaceDialogProps {
  onClose: () => void;
  onCreate: (workspaceData: { name: string; files: { medical: FileData[]; patient: FileData[] } }) => void;
}

const NewWorkspaceDialog: React.FC<NewWorkspaceDialogProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [medicalFiles, setMedicalFiles] = useState<FileData[]>([]);
  const [patientFiles, setPatientFiles] = useState<FileData[]>([]);
  const [medicalInputMethod, setMedicalInputMethod] = useState<'upload' | 'url'>('upload');
  const [patientInputMethod, setPatientInputMethod] = useState<'upload' | 'url'>('upload');
  const [medicalUrl, setMedicalUrl] = useState('');
  const [patientUrl, setPatientUrl] = useState('');

  const handleCreate = () => {
    if (!name) {
      alert('Please enter a name for the workspace.');
      return;
    }
    onCreate({ name, files: { medical: medicalFiles, patient: patientFiles } });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
        backdropFilter: 'blur(8px)', // Blur effect for the background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '18px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)', // Floating shadow effect
          width: '70%',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'floatIn 0.3s ease-out', // Add a float-in animation
        }}
      >
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>New Patient Workspace</h2>

        {/* Name Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Patient Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        {/* Side-by-side Upload Sections */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <UploadSection
              title="Upload Medical Documents"
              files={medicalFiles}
              setFiles={setMedicalFiles}
              inputMethod={medicalInputMethod}
              setInputMethod={setMedicalInputMethod}
              url={medicalUrl}
              setUrl={setMedicalUrl}
            />
          </div>
          <div style={{ flex: 1 }}>
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

        {/* Actions */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewWorkspaceDialog;
