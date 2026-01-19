// import CustomButton from '@/shared/components/atoms/button/CustomButton';
import { useWorkspace } from '../features/workspace/context/WorkspaceContext';
import { useChatHistory, MessageType } from '../features/chat/context/ChatHistoryContext';
import { Message, ArrowUpward, Stop } from '@mui/icons-material';
import { ContentCopy as CopyIcon, Edit as EditIcon } from '@mui/icons-material';
import ChatImage from './ChatImage/ChatImage';
import {
    Box,
    Button,
    Card,
    IconButton,
    Paper,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { useState, useEffect, useRef, memo } from 'react';

// Define getSanitizedHTML function
const getSanitizedHTML = (content: string | object | unknown): string => {
    if (typeof content === 'string') {
        const parsedHtml = marked.parse(content) as string;
        return DOMPurify.sanitize(parsedHtml);
    } else if (typeof content === 'object') {
        const jsonString = JSON.stringify(content, null, 2);
        const pre = document.createElement('pre');
        pre.textContent = jsonString;
        return DOMPurify.sanitize(pre.outerHTML);
    } else {
        const pre = document.createElement('pre');
        pre.textContent = String(content);
        return DOMPurify.sanitize(pre.outerHTML);
    }
};

// Define getMessageContentForCopy function
const getMessageContentForCopy = (chatResponse: any): string => {
    if (typeof chatResponse === 'object' && chatResponse !== null && 'response' in chatResponse) {
        return chatResponse.response;
    }
    return String(chatResponse || '');
};

interface MessageListProps {
    messages: MessageType[];
    loading: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    handleEditMessage: (messageContent: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading, messagesEndRef, handleEditMessage }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: 'auto',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                // background: theme.palette.background.default,
                gap: 0.5,
            }}
        >
            {messages.map((message) => (
                <Box
                    key={message.id}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.isUser ? 'flex-end' : 'flex-start',
                    }}
                >
                    <Paper
                        elevation={message.isUser ? 0 : 0}
                        sx={{
                            p: 1.7,
                            maxWidth: '80%',
                            borderRadius: message.isUser
                                ? '16px 4px 16px 16px'
                                : '4px 16px 16px 16px',
                            backgroundColor: message.isUser
                                ? theme.palette.background.paper
                                : theme.palette.background.default,
                            color: message.isUser
                                ? theme.palette.text.primary
                                : theme.palette.text.primary,
                        }}
                    >
                        <Typography
                            component="div"
                            variant="body1"
                            sx={{
                                '& ol': { listStyle: 'decimal', marginLeft: 2, pl: 2 },
                                '& ul': { listStyle: 'disc', marginLeft: 2, pl: 2 },
                                '& li': { marginBottom: '0.25em' },
                                '& h1, & h2, & h3, & h4, & h5, & h6': { marginTop: '0.5em', marginBottom: '0.25em', fontWeight: 'bold' },
                                '& p': { marginBottom: '0.25em', mt: 0.3 },
                                '& pre': { backgroundColor: theme.palette.action.hover, padding: '0.5em', overflowX: 'auto', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
                            }}
                            dangerouslySetInnerHTML={{
                                __html: getSanitizedHTML(
                                    typeof message.ChatResponse === 'object' && message.ChatResponse !== null && 'response' in message.ChatResponse
                                        ? message.ChatResponse.response
                                        : message.ChatResponse || ''
                                )
                            }}
                        />
                        {typeof message.ChatResponse === 'object' && message.ChatResponse !== null && 'image_base64' in message.ChatResponse && (message.ChatResponse as { image_base64?: string }).image_base64 && (
                            <ChatImage
                                src={(message.ChatResponse as { image_base64?: string }).image_base64 as string}
                                alt="AI Response Image"
                            />
                        )}
                        {message.imageBase64 && (
                            <ChatImage
                                src={message.imageBase64}
                                alt="AI Response Image"
                            />
                        )}
                    </Paper>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 1,
                            mt: 0.65,
                            opacity: 0.7,
                            gap: 0.3
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <IconButton
                                size="small"
                                onClick={() => navigator.clipboard.writeText(getMessageContentForCopy(message.ChatResponse))}
                                sx={{ p: 0.3, fontSize: '0.75rem', borderRadius: '4px', '&:hover': { backgroundColor: theme.palette.action.hover } }}
                            >
                                <CopyIcon fontSize="inherit" />
                            </IconButton>
                            {message.isUser && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleEditMessage(getMessageContentForCopy(message.ChatResponse))}
                                    sx={{ p: 0.3, fontSize: '0.75rem', borderRadius: '4px', '&:hover': { backgroundColor: theme.palette.action.hover } }}
                                >
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            )}
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Box>
                </Box>
            ))}
            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        '@keyframes bounce': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-3px)' },
                        },
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Searching Documents
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Box component="span" sx={{ marginTop: '10px', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'text.secondary', animation: 'bounce 1.2s infinite ease-in-out' }} />
                        <Box component="span" sx={{ marginTop: '10px', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'text.secondary', animation: 'bounce 1.2s infinite ease-in-out', animationDelay: '0.2s' }} />
                        <Box component="span" sx={{ marginTop: '10px', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'text.secondary', animation: 'bounce 1.2s infinite ease-in-out', animationDelay: '0.4s' }} />
                    </Box>
                </Box>
            )}
            <div ref={messagesEndRef} />
        </Box>
    );
};

const MemoizedMessageList = memo(MessageList);

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    handleSendMessage: (event: React.FormEvent) => void;
    loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSendMessage, loading }) => {
    const theme = useTheme();
    return (
        <Paper
            component="form"
            onSubmit={handleSendMessage}
            elevation={3}
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: '24px', // Explicit pill shape
                mb: 1,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                '&:hover': {
                    boxShadow: theme.shadows[4],
                },
                transition: 'box-shadow 0.3s ease-in-out',
            }}
        >
            <TextField
                fullWidth
                variant="standard"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                multiline
                maxRows={4}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                    }
                }}
                InputProps={{
                    disableUnderline: true,
                    sx: {
                        px: 2,
                        py: 1.5,
                        fontSize: '0.95rem'
                    }
                }}
            />
            <IconButton
                type="submit"
                disabled={loading || !input.trim()}
                color="primary"
                sx={{
                    p: '10px',
                    mr: 0.5,
                    alignSelf: 'flex-end',
                    mb: 0.5
                }}
            >
                {loading ? <Stop /> : <ArrowUpward />}
            </IconButton>
        </Paper>
    );
};

interface ChatProps {
    aiResponse?: string;
}

const Chat: React.FC<ChatProps> = () => {
    const theme = useTheme();
    const { activeWorkspace } = useWorkspace();
    const { getChatHistory, sendMessage, isLoading, clearChatHistory } = useChatHistory();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentWorkspaceId = activeWorkspace?.id || 'default';
    const messages = getChatHistory(currentWorkspaceId);
    const loading = isLoading(currentWorkspaceId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!input.trim()) return;

        const messageToSend = input.trim();
        setInput('');

        try {
            await sendMessage(currentWorkspaceId, messageToSend);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const clearAllChats = () => {
        clearChatHistory(currentWorkspaceId);
    };

    const handleEditMessage = (messageContent: string) => {
        setInput(messageContent);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    height: '100%',
                    borderRadius: 2,
                    borderColor: 'divider',
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        backgroundColor: theme.palette.background.default,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.5,
                            borderBottom: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Message sx={{ color: 'text.primary' }} />
                            <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                                Chat
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                variant="text"
                                size="small"
                                onClick={clearAllChats}
                                sx={{ color: 'text.primary', fontSize: '0.75rem' }}
                            >
                                Clear Chat
                            </Button>
                        </Box>
                    </Box>

                    <MemoizedMessageList
                        messages={messages}
                        loading={loading}
                        messagesEndRef={messagesEndRef}
                        handleEditMessage={handleEditMessage}
                    />
                    <Box
                        sx={{ px: 2 }}
                    >
                        <ChatInput
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            loading={loading}
                        />
                    </Box>

                </Card>
            </Box>
        </>
    );
};

export default Chat;