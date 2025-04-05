// MainScreen.tsx
import React, { useState } from 'react';
import arrowBackIcon from './assets/arrow_back.svg';
import newChatIcon from './assets/new_chat.svg';
import settingIcon from './assets/setting.svg';
import searchIcon from './assets/searchIcon.svg';
import ChatInterface from './components/chatbot';
import MedicalUploader from './components/settings';
import NewWorkspaceDialog from './components/NewWorkspaceDialog';
import { FileData } from '../src/components/types'; // centralized FileData

// --- Types ---
interface ChatSession {
  id: string;
  title: string;
}

interface IconButtonProps {
  iconSrc: string;
  buttonName: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface ChatHeaderProps {
  title: string;
}

interface MainContentProps {
  activeChatId: string | null;
}

interface SidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onChatSelect: (id: string) => void;
  onSettingsClick: () => void;
  onBackClick: () => void;
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setWorkspaceDetails: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        llmPreference: 'offline' | 'online';
        medicalFiles: FileData[];
        patientFiles: FileData[];
      };
    }>
  >;
}

// --- Components ---
const IconButton: React.FC<IconButtonProps> = ({ iconSrc, buttonName, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '100%',
      paddingLeft: '10px 12px',
      borderRadius: '0.5rem',
      outline: '1px solid black',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
      background: 'none',
      border: 'none',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
  >
    <div
      style={{
        width: '2rem',
        height: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.6,
      }}
    >
      <img src={iconSrc} alt={buttonName} style={{ width: '42px', height: '42px' }} />
    </div>
    <div style={{ color: 'black', fontSize: '14px', fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
      {buttonName}
    </div>
  </button>
);

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '4px 28px',
      backgroundColor: 'transparent',
    }}
  >
    <div
      style={{
        fontSize: '20px',
        fontWeight: 500,
        color: 'black',
        letterSpacing: '6px',
        fontFamily: "'Montserrat', sans-serif",
        flex: 1,
        textAlign: 'center',
      }}
    >
      {title}
    </div>
    <div
      style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        flexShrink: 0,
        marginLeft: '16px',
      }}
    >
      <img src={searchIcon} alt="Search" width="100%" height="100%" style={{ padding: '4px' }} />
    </div>
  </div>
);

const MainContent: React.FC<MainContentProps> = ({ activeChatId }) => (
  <div
    style={{
      flex: '5 2 0%',
      padding: '28px',
      border: '1px solid #ddd',
      borderRadius: '16px',
      background: '#FFFFFF',
      color: 'black',
      height: '100%',
      gap: '10px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <ChatHeader title="Chat" />
    {activeChatId ? <ChatInterface key={activeChatId} /> : <div>Select a chat session or create a new one.</div>}
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
}) => {
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);

  const handleCreateWorkspace = (workspaceData: {
    name: string;
    files: { medical: FileData[]; patient: FileData[] };
  }) => {
    const newId = Date.now().toString();
    setChatSessions((prev) => [...prev, { id: newId, title: workspaceData.name }]);
    setWorkspaceDetails((prev) => ({
      ...prev,
      [newId]: {
        llmPreference: 'offline',
        medicalFiles: workspaceData.files.medical,
        patientFiles: workspaceData.files.patient,
      },
    }));
    setActiveChatId(newId);
    setShowNewWorkspaceDialog(false);
  };

  const handleDeleteChat = (id: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  return (
    <div
      style={{
        flex: 1,
        border: '1px solid #ddd',
        borderRadius: '16px',
        background: '#FFFFFF',
        color: 'black',
        height: '100%',
        overflow: 'auto',
        alignSelf: 'flex-start',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          style={{
            position: 'relative',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1a1a1a',
            fontSize: '32px',
            fontWeight: 600,
            fontFamily: 'MuseoModerno, sans-serif',
            letterSpacing: '0.3rem',
            padding: '4px',
          }}
        >
          CAZE LABS
          <img
            src={arrowBackIcon}
            alt="Back"
            onClick={onBackClick}
            style={{
              position: 'absolute',
              right: '8px',
              width: '38px',
              height: '38px',
              cursor: 'pointer',
            }}
          />
        </div>
        <div
          style={{
            color: '#1a1a1a',
            fontSize: '16px',
            fontWeight: 'lighter',
            fontFamily: 'Noto Sans, sans-serif',
            letterSpacing: '6px',
          }}
        >
          MediBot
        </div>
        <div style={{ margin: '60px 0 0' }}>
          <IconButton iconSrc={newChatIcon} buttonName="New Patient Workspace" onClick={() => setShowNewWorkspaceDialog(true)} />
        </div>
        <div style={{ marginTop: '20px' }}>
          <strong style={{ fontSize: '16px', color: '#333' }}>Recent</strong>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginTop: '8px',
            }}
          >
            {chatSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => onChatSelect(s.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: activeChatId === s.id ? '#1890ff' : 'transparent',
                  color: activeChatId === s.id ? '#fff' : '#333',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                <span>{s.title}</span>
                <button onClick={() => handleDeleteChat(s.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <IconButton iconSrc={settingIcon} buttonName="Setting" onClick={onSettingsClick} disabled={!activeChatId} />

      {showNewWorkspaceDialog && (
        <NewWorkspaceDialog onClose={() => setShowNewWorkspaceDialog(false)} onCreate={handleCreateWorkspace} />
      )}
    </div>
  );
};

export const MainScreen: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([{ id: 'default', title: 'Default Chat' }]);
  const [activeChatId, setActiveChatId] = useState<string | null>('default');
  const [showSettings, setShowSettings] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<{
    [key: string]: { llmPreference: 'offline' | 'online'; medicalFiles: FileData[]; patientFiles: FileData[] };
  }>({
    default: { llmPreference: 'offline', medicalFiles: [], patientFiles: [] },
  });

  const handleLLMPreferenceChange = (preference: 'offline' | 'online') => {
    if (!activeChatId) return;
    setWorkspaceDetails((prev) => ({
      ...prev,
      [activeChatId]: { ...prev[activeChatId], llmPreference: preference },
    }));
  };

  const handleChatSelect = (id: string) => {
    setActiveChatId(id);
    setShowSettings(false);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        backgroundColor: '#F5F5F5',
        color: '#fff',
        overflow: 'hidden',
        padding: '8px 8px 0px 0px',
      }}
    >
      <div
        style={{
          display: 'flex',
          margin: '0px',
          gap: '10px',
          minHeight: 0,
          padding: '8px 8px 0px 0px',
          width: '100%',
        }}
      >
        <Sidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onSettingsClick={() => setShowSettings(true)}
          onBackClick={() => setShowSettings(false)}
          setChatSessions={setChatSessions}
          setActiveChatId={setActiveChatId}
          setWorkspaceDetails={setWorkspaceDetails}
        />

        {showSettings ? (
          <div
            style={{
              flex: '5 2 0%',
              padding: '28px',
              border: '1px solid #ddd',
              borderRadius: '16px',
              background: '#FFFFFF',
              color: 'black',
              height: '100%',
              gap: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MedicalUploader
              workspaceDetails={workspaceDetails[activeChatId!]}
              onLLMPreferenceChange={handleLLMPreferenceChange}
            />
          </div>
        ) : (
          <MainContent activeChatId={activeChatId} />
        )}
      </div>
    </div>
  );
};
