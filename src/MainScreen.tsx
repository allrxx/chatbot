import arrowBackIcon from './assets/arrow_back.svg'; // Import the arrow_back.svg
import newChatICon from './assets/new_chat.svg';
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
                <div
                    style={{
                        width: '100%', // Full width
                        paddingLeft: '14px', // Equivalent to pl-5
                        borderRadius: '0.5rem', // Equivalent to rounded-lg
                        outline: '1px solid black', // Equivalent to outline
                        display: 'flex', // Use flexbox for row alignment
                        alignItems: 'center', // Center items vertically
                        gap: '8px', // Add 8px gap between icon and text
                        marginTop: '28px',
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
                            src={newChatICon}
                            alt="New Chat"
                            style={{
                                width: '1.25rem', // Equivalent to w-5
                                height: '1.25rem', // Adjust size as needed
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
                        Document Upload
                    </div>
                </div>
            </div>

            {/* Sidebar Items */}
            <h3>{title}</h3>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
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
