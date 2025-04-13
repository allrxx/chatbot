// MainScreen.tsx
import React, { useState, useEffect } from 'react';
// Import Lucide icons
import {
  ArrowLeft,
  Settings,
  PlusSquare,
  Search,
  X,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon
} from 'lucide-react';

// --- Placeholder Components ---
import ChatInterface from './components/chatbot';
import MedicalUploader from './components/settings';
import NewWorkspaceDialog from './components/NewWorkspaceDialog';

// --- Types ---
// Import FileData and ChatMessage from a shared types file
import { FileData, ChatMessage } from './components/types';

interface ChatSession {
  id: string;
  title: string;
  patientFiles: FileData[];
}

interface IconButtonProps {
  icon: React.ReactNode;
  buttonName: string;
  onClick?: () => void;
  disabled?: boolean;
  isExpanded?: boolean;
  className?: string;
}

interface ChatHeaderProps {
  title: string;
  className?: string;
}

interface MainContentProps {
  activeChatId: string | null;
  chatTitle: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  className?: string;
}

interface SidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onChatSelect: (id: string) => void;
  onSettingsClick: () => void;
  onBackClick: () => void;
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setWorkspaceDetails: React.Dispatch<React.SetStateAction<{ [key: string]: WorkspaceDetails }>>;
  isExpanded: boolean;
  toggleSidebar: () => void;
  showSettings: boolean;
  className?: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface WorkspaceDetails {
  llmPreference: 'offline' | 'online';
  medicalFiles: FileData[];
  patientFiles: FileData[];
}

// Type for the setter function passed to UploadSection
type FileDataSetter = React.Dispatch<React.SetStateAction<FileData[]>>;

// Default empty state for workspace details
const defaultWorkspaceDetails: WorkspaceDetails = {
  llmPreference: 'offline',
  medicalFiles: [],
  patientFiles: [],
};

// --- Components ---

const IconButton: React.FC<IconButtonProps> = ({ icon, buttonName, onClick, disabled, isExpanded = true }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={buttonName}
    style={{
      width: '100%',
      padding: isExpanded ? '10px 12px' : '10px 0',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isExpanded ? 'flex-start' : 'center',
      gap: isExpanded ? '12px' : '0',
      marginTop: '12px',
      background: 'transparent',
      border: '1px solid transparent',
      color: `var(--text-color, #000000)`,
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    }}
    onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = `var(--button-hover-bg, #e0e0e0)`; }}
    onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    <div style={{
      width: '1.5rem',
      height: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    {isExpanded && (
      <div style={{
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: "'Noto Sans', sans-serif",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {buttonName}
      </div>
    )}
  </button>
);

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, className }) => (
  <div
    className={className}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '12px 24px',
      backgroundColor: `var(--secondary-bg, #f9f9f9)`,
      borderRadius: '10px',
      flexShrink: 0,
      height: '48px',
    }}
  >
    <div style={{ width: '36px', flexShrink: 0 }}></div>
    <div style={{
      flex: 1,
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 500,
      color: `var(--text-color, black)`,
      fontFamily: "'Noto Sans', sans-serif",
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0 10px',
    }}>
      {title}
    </div>
    <button
      title="Search Chat"
      style={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `transparent`,
        color: `var(--text-color-secondary, #666)`,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
        flexShrink: 0,
        border: `none`,
        padding: '6px',
      }}
      onClick={() => console.log("Search clicked")}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `var(--button-hover-bg, #e0e0e0)`;
        e.currentTarget.style.color = `var(--text-color, #000)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `transparent`;
        e.currentTarget.style.color = `var(--text-color-secondary, #666)`;
      }}
    >
      <Search size={18} />
    </button>
  </div>
);

const MainContent: React.FC<MainContentProps> = ({ activeChatId, chatTitle, messages, onSendMessage, className }) => (
  <div
    className={className}
    style={{
      flex: '1 1 0%',
      border: `1px solid var(--border-color, #ddd)`,
      borderRadius: '16px',
      backgroundColor: `var(--background-color, #FFFFFF)`,
      color: `var(--text-color, black)`,
      height: '100%', // Changed from calc(100% - 16px)
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '20px', // Already 0, kept as is
    }}
  >
    <ChatHeader title={chatTitle} className={className} />
    <div style={{ flexGrow: 1,padding: '0' }}>
      {activeChatId ? (
        <ChatInterface
          messages={messages}
          onSendMessage={onSendMessage}
        />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', color: `var(--text-color-secondary, #777)` }}>
          Select a patient chat or create a new one.
        </div>
      )}
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  activeChatId,
  onChatSelect,
  onSettingsClick,
  onBackClick,
  setChatSessions,
  setActiveChatId,
  setWorkspaceDetails,
  isExpanded,
  toggleSidebar,
  showSettings,
  className,
  theme,
  toggleTheme,
}) => {
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);

  const handleCreateWorkspace = (workspaceData: { name: string; files: { medical: FileData[]; patient: FileData[] } }) => {
    const newId = Date.now().toString();
    const newTitle = workspaceData.name || `Patient ${newId.slice(-4)}`;
    const newWorkspace: WorkspaceDetails = {
      llmPreference: 'offline',
      medicalFiles: workspaceData.files.medical,
      patientFiles: workspaceData.files.patient,
    };
    setChatSessions((prev) => [...prev, { id: newId, title: newTitle, patientFiles: workspaceData.files.patient }]);
    setWorkspaceDetails((prev) => ({ ...prev, [newId]: newWorkspace }));
    setActiveChatId(newId);
    setShowNewWorkspaceDialog(false);
  };

  const handleDeleteChat = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    setWorkspaceDetails(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    if (activeChatId === id) {
      const remainingSessions = chatSessions.filter(s => s.id !== id);
      setActiveChatId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  return (
    <div
      className={className}
      style={{
        flexShrink: 0,
        width: isExpanded ? '270px' : '80px',
        backgroundColor: `var(--secondary-bg, #FFFFFF)`,
        border: `1px solid var(--border-color, #ddd)`,
        color: `var(--text-color, black)`,
        borderRadius: '16px',
        height: '100%', // Changed from calc(100% - 16px)
        overflow: 'hidden',
        padding: '20px', // Changed from conditional padding to 0
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.3s ease',
        position: 'relative',
      }}
    >
      <div style={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Container: Logo + Custom Collapse Button (Expanded Only) */}
        {isExpanded && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Pushes logo left, button right
            height: '64px', // Match original logo area height
            marginBottom: '20px', // Space below header
            flexShrink: 0,
          }}>
            {/* Logo */} 
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              color: `var(--text-color, #1a1a1a)`,
              // No specific opacity/transition needed here now
            }}>
              <div style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'MuseoModerno, sans-serif', letterSpacing: '0.2rem' }}>
                CAZE LABS
              </div>
              <div style={{ color: `var(--text-color-secondary, #555)`, fontSize: '14px', fontFamily: 'Noto Sans, sans-serif', letterSpacing: '4px', marginTop: '4px' }}>
                MediBot
              </div>
            </div>

            {/* Custom Collapse Button (Expanded State) */}
            <button
              onClick={toggleSidebar}
              title="Collapse Sidebar"
              style={{
                // REMOVED position: 'absolute', top, right, zIndex
                background: `var(--input-bg, #eee)`,
                border: `1px solid var(--border-color, #ccc)`,
                color: `var(--text-color-secondary, #555)`,
                borderRadius: '6px', // Make it rectangular like IconButton padding
                width: '34px', // Adjust size as needed
                height: '34px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s, color 0.2s',
                flexShrink: 0, // Prevent shrinking
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `var(--button-hover-bg, #e0e0e0)`;
                e.currentTarget.style.color = `var(--text-color, #000)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `var(--input-bg, #eee)`;
                e.currentTarget.style.color = `var(--text-color-secondary, #555)`;
              }}
            >
              <ChevronsLeft size={18} />
            </button>
          </div>
        )}

        {showSettings && (
          <IconButton
            icon={<ArrowLeft size={20} />}
            buttonName="Back to Chat"
            onClick={onBackClick}
            isExpanded={isExpanded}
          />
        )}

        <IconButton
          icon={<PlusSquare size={20} />}
          buttonName="New Patient"
          onClick={() => setShowNewWorkspaceDialog(true)}
          isExpanded={isExpanded}
        />

        {/* Toggle IconButton for COLLAPSED state */}
        {!isExpanded && (
            <IconButton
                icon={<ChevronsRight size={20} />} 
                buttonName={"Expand Sidebar"}
                onClick={toggleSidebar}
                isExpanded={isExpanded}
            />
        )}

        {isExpanded && (
          <div style={{ marginTop: '30px' }}>
            <strong style={{ fontSize: '14px', color: `var(--text-color-secondary, #555)`, paddingLeft: '10px' }}>Recent Patients</strong>
            <div style={{
              maxHeight: 'calc(100vh - 450px)',
              overflowY: 'auto',
              marginTop: '10px',
              paddingRight: '5px',
            }}>
              {chatSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onChatSelect(s.id)}
                  title={s.title}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: activeChatId === s.id ? `var(--accent-color, #1890ff)` : 'transparent',
                    border: `1px solid ${activeChatId === s.id ? 'var(--accent-color, #1890ff)' : 'transparent'}`,
                    color: activeChatId === s.id ? `var(--button-text, #fff)` : `var(--text-color, #333)`,
                    cursor: 'pointer',
                    marginBottom: '6px',
                    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (activeChatId !== s.id) e.currentTarget.style.backgroundColor = `var(--chat-hover-bg,rgb(186, 202, 234))`; }}
                  onMouseLeave={(e) => { if (activeChatId !== s.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexGrow: 1, marginRight: '10px' }}>
                    {s.title}
                  </span>
                  <button
                    onClick={(e) => handleDeleteChat(s.id, e)}
                    title="Delete Patient Chat"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: `var(--error-color, #e74c3c)`,
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      opacity: 0.7,
                      transition: 'opacity 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.backgroundColor = `var(--button-hover-bg, rgba(220, 53, 69, 0.1))`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.7';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {chatSessions.length === 0 && (
                <div style={{ padding: '10px', color: `var(--text-color-secondary, #888)`, fontSize: '13px', textAlign: 'center' }}>
                  No recent patients.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, borderTop: isExpanded ? `1px solid var(--border-color, #ccc)` : 'none', paddingTop: isExpanded ? '10px' : '0' }}>
        <IconButton
          icon={<Settings size={20} />}
          buttonName="Settings"
          onClick={onSettingsClick}
          disabled={!activeChatId}
          isExpanded={isExpanded}
        />
        <IconButton
          icon={theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          buttonName={theme === 'light' ? "Dark Mode" : "Light Mode"}
          onClick={toggleTheme}
          isExpanded={isExpanded}
        />
      </div>

      {showNewWorkspaceDialog && (
        <NewWorkspaceDialog
          onClose={() => setShowNewWorkspaceDialog(false)}
          onCreate={handleCreateWorkspace}
          className={className}
        />
      )}
    </div>
  );
};

export const MainScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  // Initialize with an empty object, details will be added per chat ID
  const [workspaceDetails, setWorkspaceDetails] = useState<{ [key: string]: WorkspaceDetails }>({});
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Default to expanded
  // State to hold message history for all chats
  const [chatHistories, setChatHistories] = useState<{ [key: string]: ChatMessage[] }>({});

  // Find the active chat session details
  const activeChatSession = chatSessions.find(s => s.id === activeChatId);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLLMPreferenceChange = (preference: 'offline' | 'online') => {
    if (activeChatId && workspaceDetails[activeChatId]) {
      setWorkspaceDetails(prev => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId], // Keep existing files/other details
          llmPreference: preference,
        }
      }));
      console.log(`LLM preference for ${activeChatId} updated to: ${preference}`);
    } else {
      console.warn("Cannot change LLM preference: No active chat selected or workspace details missing.");
    }
  };

  const handleChatSelect = (id: string) => {
    setActiveChatId(id);
    setShowSettings(false);
  };

  const handleSettingsClick = () => {
    if (activeChatId) setShowSettings(true);
  };

  const handleBackClick = () => {
    setShowSettings(false);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Define handlers to update files for the active chat
  const handleMedicalFilesChange: FileDataSetter = (updater) => {
    if (activeChatId) { // Only proceed if a chat is active
      setWorkspaceDetails(prev => {
        // Get the previous details for the active chat, or default if missing
        const prevDetails = prev[activeChatId] || defaultWorkspaceDetails;
        // Calculate new medical files based on the updater function or value
        const newMedicalFiles = typeof updater === 'function' ? updater(prevDetails.medicalFiles) : updater;

        return {
          ...prev,
          [activeChatId]: {
            ...prevDetails, // Spread previous details
            medicalFiles: newMedicalFiles, // Update medical files
          }
        };
      });
    } else {
      console.warn("Cannot change medical files: No active chat selected.");
    }
  };

  const handlePatientFilesChange: FileDataSetter = (updater) => {
    if (activeChatId) { // Only proceed if a chat is active
      setWorkspaceDetails(prev => {
         // Get the previous details for the active chat, or default if missing
        const prevDetails = prev[activeChatId] || defaultWorkspaceDetails;
         // Calculate new patient files based on the updater function or value
        const newPatientFiles = typeof updater === 'function' ? updater(prevDetails.patientFiles) : updater;

        return {
          ...prev,
          [activeChatId]: {
            ...prevDetails, // Spread previous details
            patientFiles: newPatientFiles, // Update patient files
          }
        };
      });
    } else {
      console.warn("Cannot change patient files: No active chat selected.");
    }
  };

  // Handler to add a new message to the active chat's history
  const handleSendMessage = (text: string) => {
    if (!activeChatId) return; // Do nothing if no chat is active

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user', // Assuming user sends the message for now
      timestamp: Date.now(),
    };

    setChatHistories(prev => {
      const currentHistory = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: [...currentHistory, newMessage],
      };
    });

    // TODO: Add bot response logic here later
    console.log(`Message sent in ${activeChatId}: ${text}`);
  };

  return (
    <div
      className={theme}
      style={{
        width: '100vw',
        height: '100vh',
        fontFamily: "'Noto Sans', Arial, sans-serif",
        display: 'flex',
        backgroundColor: `var(--background-color, #F5F5F5)`,
        color: `var(--text-color, #333)`,
        overflow: 'hidden',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', width: '100%', height: '100%' }}>
        <Sidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onSettingsClick={handleSettingsClick}
          onBackClick={handleBackClick}
          setChatSessions={setChatSessions}
          setActiveChatId={setActiveChatId}
          setWorkspaceDetails={setWorkspaceDetails}
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          showSettings={showSettings}
          className={theme}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        {showSettings ? (
          <div
            className={theme}
            style={{
              flex: '1 1 0%',
              border: `1px solid var(--border-color, #ddd)`,
              borderRadius: '16px',
              backgroundColor: `var(--background-color, #FFFFFF)`,
              color: `var(--text-color, black)`,
              height: '100%', // Changed from calc(100% - 16px)
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              padding: '0', // Explicitly set to 0
            }}
          >
            <MedicalUploader
              onLLMPreferenceChange={handleLLMPreferenceChange}
              className={theme}
              // Pass the details for the active chat, or default if none/missing
              workspaceDetails={activeChatId ? workspaceDetails[activeChatId] || defaultWorkspaceDetails : defaultWorkspaceDetails}
              // Pass file update handlers
              onMedicalFilesChange={handleMedicalFilesChange}
              onPatientFilesChange={handlePatientFilesChange}
            />
          </div>
        ) : (
          <MainContent
            activeChatId={activeChatId}
            // Pass the specific chat title or a default
            chatTitle={activeChatSession?.title || "Chat"}
            // Pass the history for the active chat, or empty array if none
            messages={activeChatId ? chatHistories[activeChatId] || [] : []}
            onSendMessage={handleSendMessage} // Pass the send message handler
            className={theme}
          />
        )}
      </div>
    </div>
  );
};

export default MainScreen;