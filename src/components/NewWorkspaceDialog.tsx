import React, { useState } from 'react';
import UploadSection from './UploadSection'; // Assuming this component exists and accepts className
import { FileData } from '../components/types'; // Assuming this type exists

// Define the props interface for NewWorkspaceDialog
interface NewWorkspaceDialogProps {
  onClose: () => void;
  onCreate: (workspaceData: { name: string; files: { medical: FileData[]; patient: FileData[] } }) => void;
  // Add className prop to allow passing theme ('light' or 'dark')
  className?: string;
}

// Define the NewWorkspaceDialog functional component
const NewWorkspaceDialog: React.FC<NewWorkspaceDialogProps> = ({
  onClose,
  onCreate,
  className = 'light', // Default to light theme
}) => {
  // State for the dialog inputs
  const [name, setName] = useState('');
  const [medicalFiles, setMedicalFiles] = useState<FileData[]>([]);
  const [patientFiles, setPatientFiles] = useState<FileData[]>([]);
  const [medicalInputMethod, setMedicalInputMethod] = useState<'upload' | 'url'>('upload');
  const [patientInputMethod, setPatientInputMethod] = useState<'upload' | 'url'>('upload');
  const [medicalUrl, setMedicalUrl] = useState('');
  const [patientUrl, setPatientUrl] = useState('');

  // Handler for creating the workspace
  const handleCreate = () => {
    if (!name.trim()) {
      // Consider replacing alert with a styled message component later
      alert('Please enter a name for the patient workspace.');
      return;
    }
    onCreate({ name, files: { medical: medicalFiles, patient: patientFiles } });
    onClose(); // Close the dialog after creation
  };

  // --- Button Styles using CSS Variables ---

  // Primary Button (Create)
  const primaryButtonStyle: React.CSSProperties = {
    padding: '10px 20px', // Adjusted padding
    backgroundColor: `var(--button-bg, #007bff)`,
    color: `var(--button-text, #ffffff)`,
    border: 'none',
    borderRadius: '6px', // Slightly more rounded
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600, // Bolder
    transition: 'background-color 0.2s ease',
  };

  // Secondary Button (Cancel)
  const secondaryButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: 'transparent', // Transparent background
    color: `var(--text-color-secondary, #6c757d)`, // Use secondary text color
    border: `1px solid var(--border-color, #cccccc)`, // Use border color
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  };

  const secondaryButtonHoverStyle: React.CSSProperties = {
      backgroundColor: `var(--secondary-bg, #f5f5f5)`, // Use secondary bg on hover
      borderColor: `var(--text-color-secondary, #6c757d)`, // Darken border slightly on hover
      color: `var(--text-color, #000000)`, // Use primary text color on hover
  };


  return (
    // Backdrop / Overlay
    <div
      // Apply theme class potentially for backdrop variable if defined,
      // but rgba(0,0,0,0.5) is often theme-independent
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        // Semi-transparent black is common, could use a variable like --overlay-bg if needed
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)', // Keep blur effect
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Ensure it's above other content
      }}
      onClick={onClose} // Close dialog when clicking the backdrop
    >
      {/* Dialog Content Box */}
      <div
        // Apply theme class here to activate variables within the dialog
        className={className}
        style={{
          backgroundColor: `var(--background-color, #ffffff)`, // Use background variable
          color: `var(--text-color, #000000)`, // Default text color for dialog
          padding: '24px 32px', // Adjusted padding
          borderRadius: '12px', // Adjusted border radius
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)', // Keep shadow or use theme variable
          width: 'clamp(500px, 70%, 900px)', // Responsive width: min 500px, 70% ideal, max 900px
          maxHeight: '90vh', // Limit height
          overflowY: 'auto', // Allow scrolling if content exceeds height
          display: 'flex',
          flexDirection: 'column',
          gap: '24px', // Add gap between sections
          // animation: 'floatIn 0.3s ease-out', // Keep animation (ensure @keyframes defined in CSS)
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside dialog from closing it
      >
        {/* Dialog Title */}
        <h2 style={{
            marginBottom: '0', // Remove default margin, use gap instead
            paddingBottom: '16px', // Space below title
            textAlign: 'center',
            fontSize: '1.5rem', // Larger title
            fontWeight: 600,
            color: `var(--text-color, #000000)`, // Use text color variable
            borderBottom: `1px solid var(--border-color, #e5e7eb)` // Separator line
         }}>
            New Patient Workspace
        </h2>

        {/* Name Input Section */}
        <div>
          <label htmlFor="workspaceName" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: `var(--text-color, #000000)` // Use text color
           }}>
            Patient Name
          </label>
          <input
            id="workspaceName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter patient's full name"
            style={{
              width: '100%', // Full width
              padding: '10px 12px',
              border: `1px solid var(--border-color, #cccccc)`,
              borderRadius: '6px',
              backgroundColor: `var(--input-bg, #f8f8f8)`,
              color: `var(--input-text, #49454f)`,
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxSizing: 'border-box', // Include padding/border in width
            }}
            onFocus={(e) => e.target.style.borderColor = `var(--focus-ring-color, #007bff)`}
            onBlur={(e) => e.target.style.borderColor = `var(--border-color, #cccccc)`}
          />
        </div>

        {/* Side-by-side Upload Sections */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
          {/* Medical Documents Upload */}
          <div style={{ flex: 1 }}>
            <UploadSection
              title="Medical Documents" // Shortened title
              files={medicalFiles}
              setFiles={setMedicalFiles}
              inputMethod={medicalInputMethod}
              setInputMethod={setMedicalInputMethod}
              url={medicalUrl}
              setUrl={setMedicalUrl}
              className={className} // Pass theme class down
            />
          </div>
          {/* Patient Documents Upload */}
          <div style={{ flex: 1 }}>
            <UploadSection
              title="Patient Documents" // Shortened title
              files={patientFiles}
              setFiles={setPatientFiles}
              inputMethod={patientInputMethod}
              setInputMethod={setPatientInputMethod}
              url={patientUrl}
              setUrl={setPatientUrl}
              className={className} // Pass theme class down
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
            marginTop: '8px', // Reduced top margin
            paddingTop: '16px', // Add padding above buttons
            display: 'flex',
            justifyContent: 'flex-end', // Align buttons to the right
            gap: '12px', // Space between buttons
            borderTop: `1px solid var(--border-color, #e5e7eb)` // Separator line above actions
         }}>
          {/* Cancel Button */}
          <button
            onClick={onClose}
            style={secondaryButtonStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `var(--secondary-bg, #f5f5f5)`;
                e.currentTarget.style.borderColor = `var(--text-color-secondary, #6c757d)`;
                e.currentTarget.style.color = `var(--text-color, #000000)`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = `var(--border-color, #cccccc)`;
                e.currentTarget.style.color = `var(--text-color-secondary, #6c757d)`;
            }}
          >
            Cancel
          </button>
          {/* Create Button */}
          <button
            onClick={handleCreate}
            style={primaryButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `var(--hover-bg, #0057a3)`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `var(--button-bg, #007bff)`}
          >
            Create Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewWorkspaceDialog;
