// import CustomButton from '@/shared/components/atoms/button/CustomButton';
import { useWorkspace } from '../features/workspace/context/WorkspaceContext';
import { useChatHistory, MessageType } from '../features/chat/context/ChatHistoryContext';
import { Message } from '@mui/icons-material';
import { ContentCopy as CopyIcon, Edit as EditIcon } from '@mui/icons-material';
import ChatImage from './ChatImage/ChatImage';
import {
    Box,
    Button,
    Card,
    IconButton,
    Paper,
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
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustHeight = React.useCallback((reset?: boolean) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        if (reset) {
            textarea.style.height = '56px';
            return;
        }
        textarea.style.height = '56px';
        const newHeight = Math.max(56, Math.min(textarea.scrollHeight, 160));
        textarea.style.height = `${newHeight}px`;
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                handleSendMessage(e);
                adjustHeight(true);
            }
        }
    };

    return (
        <Box sx={{ width: '100%', mb: 2, px: 2 }}>
            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
                    '&:focus-within': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                    },
                }}
            >
                <Box
                    component="textarea"
                    ref={textareaRef}
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setInput(e.target.value);
                        adjustHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about the patient..."
                    sx={{
                        width: '100%',
                        minHeight: '56px',
                        maxHeight: '160px',
                        px: 2,
                        py: 1.5,
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        bgcolor: 'transparent',
                        color: theme.palette.text.primary,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        '&::placeholder': {
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                        },
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 1.5,
                        py: 1,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                        </IconButton>
                    </Box>
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            if (input.trim() && !loading) {
                                handleSendMessage(e);
                                adjustHeight(true);
                            }
                        }}
                        disabled={loading || !input.trim()}
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: input.trim() ? theme.palette.primary.main : theme.palette.action.disabledBackground,
                            color: input.trim() ? theme.palette.primary.contrastText : theme.palette.text.disabled,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: input.trim() ? theme.palette.primary.dark : theme.palette.action.disabledBackground,
                            },
                            '&.Mui-disabled': {
                                bgcolor: theme.palette.action.disabledBackground,
                                color: theme.palette.text.disabled,
                            },
                        }}
                    >
                        {loading ? (
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    border: '2px solid currentColor',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                    },
                                }}
                            />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="19" x2="12" y2="5" />
                                <polyline points="5 12 12 5 19 12" />
                            </svg>
                        )}
                    </IconButton>
                </Box>
            </Paper>
        </Box>
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