import React, { useState } from 'react';
import arrowBackIcon from './assets/arrow_back.svg';
import newChatIcon from './assets/new_chat.svg';
import documentUploadIcon from './assets/document_upload.svg';
import settingIcon from './assets/setting.svg';
import searchIcon from './assets/searchIcon.svg';
import ChatInterface from './components/chatbot';
import MedicalUploader from './components/settings';// Adjust path as needed

interface MainContentProps {
    title: string;
    content: string;
}

interface SidebarProps {
    title: string;
    items: string[];
    onSettingsClick: () => void;
    onBackClick: () => void;
}

interface IconButtonProps {
    iconSrc: string;
    buttonName: string;
    onClick?: () => void;
}

interface ChatHeaderProps {
    title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "8px 28px",
                backgroundColor: "rgba(233, 231, 231, 0.73)",
                borderRadius: "14px",
                backdropFilter: "blur(2px)",
                position: "relative",
                zIndex: 1,
            }}
        >
            <div
                style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "black",
                    letterSpacing: "6px",
                    fontFamily: "'Montserrat', sans-serif",
                    flex: 1,
                    textAlign: "center",
                }}
            >
                {title}
            </div>
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#E0E0E0",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    flexShrink: 0,
                    marginLeft: "16px",
                }}
            >
                <img
                    src={searchIcon}
                    alt="Search"
                    width="100%"
                    height="100%"
                    style={{ display: "block", margin: "20px auto", padding: "4px" }}
                />
            </div>
        </div>
    );
};

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

const MainContent: React.FC<MainContentProps> = () => {
    return (
        <div
            style={{
                flex: '5 2 0%',
                padding: '28px',
                border: '1px solid #ddd',
                borderRadius: '16px',
                background: '#FFFFFF', // Already white
                color: 'black',
                height: '100%',
                gap: "10px",
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <ChatHeader title="Chat" />
            <ChatInterface />
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ onSettingsClick, onBackClick }) => {
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
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                }}
            >
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
                        alignSelf: 'self-start',
                    }}
                >
                    MediBot
                </div>
                <div className='MenuBar' style={{ width: '100%', padding: '0px' }}>
                    <IconButton
                        iconSrc={newChatIcon}
                        buttonName="New Workspace"
                    />
                    <IconButton
                        iconSrc={settingIcon}
                        buttonName="Setting"
                        onClick={onSettingsClick}
                    />
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [showSettings, setShowSettings] = useState(false);
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                fontFamily: 'Arial, sans-serif',
                display: 'flex',
                backgroundColor: '#F5F5F5', // Outer app background remains light gray
                color: '#fff',
                overflow: 'hidden',
                padding: '8px 8px 0px 0px'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    margin: '0px',
                    gap: '10px',
                    minHeight: 0,
                    padding: '8px 8px 0px 0px',
                    width: '100%', // Ensure it takes full width
                }}
            >
                <Sidebar
                    title="Sidebar"
                    items={['Item 1', 'Item 2', 'Item 3', 'Item 4']}
                    onSettingsClick={() => setShowSettings(true)}
                    onBackClick={() => setShowSettings(false)}
                />
                {showSettings ? (
                    <div
                        style={{
                            flex: '5 2 0%', // Match MainContent flex
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '16px',
                            background: '#FFFFFF', // White background for settings
                            color: 'black',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <MedicalUploader />
                    </div>
                ) : (
                    <MainContent
                        title="Main Content Area"
                        content="This is the main content area of the webpage. You can replace this with your actual content."
                    />
                )}
            </div>
        </div>
    );
};

export { App as MainScreen };