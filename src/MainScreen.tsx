import React, { useState } from 'react';
import arrowBackIcon from './assets/arrow_back.svg';
import newChatIcon from './assets/new_chat.svg';
import documentUploadIcon from './assets/document_upload.svg';
import settingIcon from './assets/setting.svg';
import searchIcon from './assets/searchIcon.svg';
import ChatInterface from './components/chatbot';
import MedicalUploader from './components/settings';

// Define a chat session type
interface ChatSession {
    id: string;
    title: string;
}

interface IconButtonProps {
    iconSrc: string;
    buttonName: string;
    onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ iconSrc, buttonName, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                paddingLeft: '14px',
                borderRadius: '0.5rem',
                outline: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
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
                <img
                    src={iconSrc}
                    alt={buttonName}
                    style={{
                        width: '42px',
                        height: '42px',
                    }}
                />
            </div>
            <div
                style={{
                    color: 'black',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Montserrat, sans-serif',
                }}
            >
                {buttonName}
            </div>
        </button>
    );
};

interface ChatHeaderProps {
    title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '4px 28px',
                backgroundColor: 'transparent', // Changed to transparent
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
                <img
                    src={searchIcon}
                    alt="Search"
                    width="100%"
                    height="100%"
                    style={{ display: 'block', margin: '20px auto', padding: '4px' }}
                />
            </div>
        </div>
    );
};

interface MainContentProps {
    activeChatId: string | null;
}

const MainContent: React.FC<MainContentProps> = ({ activeChatId }) => {
    return (
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
            {activeChatId ? (
                // Use the activeChatId as a key to force re-mount when a new chat is selected.
                <ChatInterface key={activeChatId} />
            ) : (
                <div>Select a chat session or create a new one.</div>
            )}
        </div>
    );
};

interface SidebarProps {
    chatSessions: ChatSession[];
    activeChatId: string | null;
    onNewChat: () => void;
    onChatSelect: (id: string) => void;
    onSettingsClick: () => void;
    onBackClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    chatSessions,
    activeChatId,
    onNewChat,
    onChatSelect,
    onSettingsClick,
    onBackClick,
}) => {
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
                justifyContent: 'space-between', // Ensures the settings button is at the bottom
            }}
        >
            <div>
                <div
                    style={{
                        position: 'relative',
                        height: '64px',
                        justifyContent: 'center',
                        color: '#1a1a1a',
                        fontSize: '32px',
                        fontWeight: 600,
                        fontFamily: 'MuseoModerno, sans-serif',
                        letterSpacing: '0.3rem',
                        padding: '4px',
                    }}
                >
                    <img
                        src={arrowBackIcon}
                        alt="Back"
                        style={{
                            position: 'absolute',
                            right: '8px',
                            width: '38px',
                            height: '38px',
                            cursor: 'pointer',
                        }}
                        onClick={onBackClick}
                    />
                    CAZE LABS
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
                <div style={{ width: '100%', padding: '0px', margin: '60px 0px 0px 0px' }}>
                    <IconButton
                        iconSrc={newChatIcon}
                        buttonName="New Workspace"
                        onClick={onNewChat}
                    />
                </div>
                {/* Recent Chats Section */}
                <div style={{ marginTop: '20px' }}>
                    <div
                        style={{
                            textAlign: 'start',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            marginBottom: '10px',
                            color: '#333',
                        }}
                    >
                        Recent
                    </div>
                    <div
                        style={{
                            width: '100%',
                            maxHeight: '300px', // Limit height to make it scrollable
                            overflowY: 'auto', // Enable scrolling
                            padding: '0px',
                            scrollbarWidth: 'thin', // For Firefox
                            scrollbarColor: '#c4c4c4 transparent', // Thumb and track colors
                        }}
                        className="chat-sessions-container" // Add a class for custom scrollbar styling
                    >
                        {chatSessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => onChatSelect(session.id)}
                                style={{
                                    width: '100%',
                                    padding: '14px 12px', // Increased padding for taller buttons
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: activeChatId === session.id ? '#e6f7ff' : 'transparent',
                                    border: activeChatId === session.id ? '1px solid #1890ff' : 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s, border 0.3s',
                                    color: '#333',
                                    fontFamily: 'Noto Sans, sans-serif',
                                    fontSize: '14px',
                                }}
                                onMouseEnter={(e) => {
                                    if (activeChatId !== session.id) {
                                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeChatId !== session.id) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {session.title}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Settings Button at the Bottom */}
            <div style={{ width: '100%', padding: '0px', marginTop: '20px' }}>
                <IconButton
                    iconSrc={settingIcon}
                    buttonName="Setting"
                    onClick={onSettingsClick}
                />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    // Initialize with a default chat session
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([
        { id: 'default', title: 'Default Chat' }
    ]);
    const [activeChatId, setActiveChatId] = useState<string>('default');
    const [showSettings, setShowSettings] = useState(false);

    // When a new chat is created, add it to the list and set it as active.
    const handleNewChat = () => {
        const newChatId = Date.now().toString();
        const newChatSession: ChatSession = {
            id: newChatId,
            title: `Chat ${chatSessions.length + 1}`,
        };
        setChatSessions((prev) => [...prev, newChatSession]);
        setActiveChatId(newChatId);
        setShowSettings(false);
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
                    onNewChat={handleNewChat}
                    onChatSelect={handleChatSelect}
                    onSettingsClick={() => setShowSettings(true)}
                    onBackClick={() => setShowSettings(false)}
                />
                {showSettings ? (
                    <div
                        style={{
                            flex: '5 2 0%',
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '16px',
                            background: '#FFFFFF',
                            color: 'black',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <MedicalUploader />
                    </div>
                ) : (
                    <MainContent activeChatId={activeChatId} />
                )}
            </div>
        </div>
    );
};

export { App as MainScreen };
