import arrowBackIcon from './assets/arrow_back.svg'; // Import the arrow_back.svg
import newChatIcon from './assets/new_chat.svg';
import documentUploadIcon from './assets/document_upload.svg';
import settingIcon from './assets/setting.svg';
import React from 'react';
import ChatInterface from './components/chatbot';

interface MainContentProps {
    title: string;
    content: string;
}

interface SidebarProps {
    title: string;
    items: string[];
}

interface IconButtonProps {
    iconSrc: string;
    buttonName: string;
}

const IconButton: React.FC<IconButtonProps> = ({ iconSrc, buttonName }) => {
    return (
        <div
            style={{
                width: '100%', // Full width
                paddingLeft: '14px', // Equivalent to pl-5
                borderRadius: '0.5rem', // Equivalent to rounded-lg
                outline: '1px solid black', // Equivalent to outline
                display: 'flex', // Use flexbox for row alignment
                alignItems: 'center', // Center items vertically
                gap: '8px', // Add 8px gap between icon and text
                marginTop: '12px',
            }}
        >
            {/* Icon Container */}
            <div
                style={{
                    width: '2rem', // Equivalent to w-8
                    height: '2rem', // Equivalent to h-8
                    display: 'flex', // Use flexbox for centering the icon
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center', // Center vertically
                    opacity: 0.6, // Equivalent to opacity-60
                }}
            >
                <img
                    src={iconSrc}
                    alt={buttonName}
                    style={{
                        width: '42px', // Equivalent to w-5
                        height: '42px', // Adjust size as needed
                        cursor: 'pointer',
                    }}
                />
            </div>

            {/* Text */}
            <div
                style={{
                    color: 'black',
                    fontSize: '14px', // Equivalent to text-xl
                    fontWeight: 500, // Equivalent to font-medium
                    fontFamily: 'Montserrat, sans-serif',
                }}
            >
                {buttonName}
            </div>
        </div>
    );
};

const MainContent: React.FC<MainContentProps> = () => {
    return (
        <div
            style={{
                flex: '5 2 0%',
                padding: '30px 100px',
                border: '1px solid #ddd',
                borderRadius: '16px',
                background: '#FFFFFF',
                color: 'black',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <ChatInterface />
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ title, items }) => {
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
                    marginBottom: '20px',
                    padding:'2px'
                }}
            >
                {/* CAZE LABS Logo */}
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
                    />
                    CAZE LABS
                </div>

                {/* MediBot Subtitle */}
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

                {/* Document Upload Component */}
                <div className='MenuBar' style={{
                    width: '100%', padding: '0px'
                }}>
                    <IconButton
                        iconSrc={newChatIcon}
                        buttonName="New Chat"
                    />
                    <IconButton
                        iconSrc={documentUploadIcon}
                        buttonName="Document Upload" />
                    <IconButton iconSrc={settingIcon} buttonName="Setting" />
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
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
                padding: '8px 8px 0px 0px'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    margin: '0px',
                    gap: '10px',
                    minHeight: 0,
                    padding: '8px 8px 0px 0px'
                }}
            >
                <Sidebar
                    title="Sidebar"
                    items={['Item 1', 'Item 2', 'Item 3', 'Item 4']}
                />
                <MainContent
                    title="Main Content Area"
                    content="This is the main content area of the webpage. You can replace this with your actual content."
                />
            </div>
        </div>
    );
};

export default App;
export { App as MainScreen };
