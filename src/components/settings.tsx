import React from 'react'; // Import React (useState might not be needed here anymore)
import UploadSection from './UploadSection'; // Assuming this component exists
import { FileData } from '../components/types'; // Assuming this type exists

// Define the props interface for MedicalUploader
interface MedicalUploaderProps {
  workspaceDetails: {
    llmPreference: 'offline' | 'online';
    medicalFiles: FileData[];
    patientFiles: FileData[];
  };
  onLLMPreferenceChange: (preference: 'offline' | 'online') => void;
  // Add className prop to allow passing theme ('light' or 'dark')
  className?: string;
}

// Define the MedicalUploader functional component
const MedicalUploader: React.FC<MedicalUploaderProps> = ({
  workspaceDetails,
  onLLMPreferenceChange,
  className = 'light', // Default to light theme if no class is provided
}) => {
  // Destructure workspaceDetails for easier access
  const { llmPreference, medicalFiles, patientFiles } = workspaceDetails;

  // Basic button styles using CSS variables - can be moved to a CSS file/module
  const buttonBaseStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '0 5px',
    border: `1px solid var(--border-color, #e5e7eb)`, // Use var() with fallback
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    fontSize: '14px',
    fontWeight: 500,
  };

  // Style for the selected button
  const selectedButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: `var(--secondary-bg, #f5f5f5)`, // Use secondary background for selected
    color: `var(--text-color, #000000)`, // Use primary text color for selected
    borderColor: `var(--accent-color, #007bff)`, // Use accent color for border
    fontWeight: 600,
  };

  // Style for the non-selected button
  const normalButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'transparent', // Make non-selected transparent
    color: `var(--text-color-secondary, #6c757d)`, // Use secondary text color
  };


  return (
    // Add the theme class ('light' or 'dark') to the root element
    // This allows the CSS variables defined in your .css file to apply
    <div className={className} style={{
        // Use padding for inner spacing instead of relying on parent
        padding: '20px',
        // Allow vertical scrolling if content overflows
        overflowY: 'auto',
        // Set height to fill container (adjust as needed)
        height: '100%',
        // Use background variable (optional, if this component needs its own background)
        // backgroundColor: 'var(--background-color)'
        color: `var(--text-color, #000000)`, // Set default text color for the component
     }}>

      {/* Main Title */}
      <h1 style={{
          color: `var(--text-color, #000000)`, // Use text color variable
          borderBottom: `1px solid var(--border-color, #e5e7eb)`, // Add a separator line
          paddingBottom: '10px',
          marginBottom: '20px',
          fontSize: '24px', // Adjust font size as needed
       }}>
        Settings
      </h1>

      {/* LLM Preference Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
            color: `var(--text-color, #000000)`, // Use text color variable
            marginBottom: '10px',
            fontSize: '18px', // Adjust font size
         }}>
          LLM Preference
        </h2>
        <div>
          {/* Offline Button */}
          <button
            style={llmPreference === 'offline' ? selectedButtonStyle : normalButtonStyle}
            onClick={() => onLLMPreferenceChange('offline')}
            // Add hover effect inline (alternatively use CSS classes)
            onMouseEnter={(e) => { if (llmPreference !== 'offline') e.currentTarget.style.backgroundColor = `var(--secondary-bg, #f5f5f5)`; }}
            onMouseLeave={(e) => { if (llmPreference !== 'offline') e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Offline
          </button>
          {/* Online Button */}
          <button
            style={llmPreference === 'online' ? selectedButtonStyle : normalButtonStyle}
            onClick={() => onLLMPreferenceChange('online')}
            onMouseEnter={(e) => { if (llmPreference !== 'online') e.currentTarget.style.backgroundColor = `var(--secondary-bg, #f5f5f5)`; }}
            onMouseLeave={(e) => { if (llmPreference !== 'online') e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Online
          </button>
        </div>
      </div>

      {/* Upload Sections Wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/*
          NOTE: The UploadSection component itself needs to be modified
          internally to use the CSS variables for its own elements
          (like titles, file lists, buttons, inputs etc.).
          The styles applied here are only for the wrapper.
        */}
        <UploadSection
          title="Uploaded Medical Documents"
          files={medicalFiles}
          // These functions are disabled in settings view as per original code
          setFiles={() => { console.log("File changes disabled in settings view."); }}
          inputMethod="upload" // Assuming 'upload' is the default or only relevant method here
          setInputMethod={() => {}}
          url=""
          setUrl={() => {}}
          // Pass the theme class down if UploadSection supports it
          // className={className}
        />
        <UploadSection
          title="Uploaded Patient Documents"
          files={patientFiles}
          setFiles={() => { console.log("File changes disabled in settings view."); }}
          inputMethod="upload"
          setInputMethod={() => {}}
          url=""
          setUrl={() => {}}
          // Pass the theme class down if UploadSection supports it
          // className={className}
        />
      </div>
    </div>
  );
};

export default MedicalUploader;
