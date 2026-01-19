// MainScreen.tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  PlusSquare,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import {
  Box,
  Typography,
  IconButton,

  Tooltip,
  useTheme,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';

// --- Placeholder Components ---
import Chat from './components/chatbot';
import MedicalUploader from './components/settings';
import NewWorkspaceDialog from './components/NewWorkspaceDialog';

// --- Types ---
import { FileData } from './components/types';
import { useWorkspace } from './features/workspace/context/WorkspaceContext';
import { useAppTheme } from './themeContext';

interface ChatSession {
  id: string;
  title: string;
  patientFiles: FileData[];
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
  handleDeleteChat: (id: string, event: React.MouseEvent) => void;
  onCreateNew: () => void;
}

interface WorkspaceDetails {
  llmPreference: 'offline' | 'online';
  medicalFiles: FileData[];
  patientFiles: FileData[];
}

type FileDataSetter = React.Dispatch<React.SetStateAction<FileData[]>>;

const defaultWorkspaceDetails: WorkspaceDetails = {
  llmPreference: 'offline',
  medicalFiles: [],
  patientFiles: [],
};

// --- Styled Components / Sub-components ---

const SidebarItem = ({
  icon,
  label,
  onClick,
  active = false,
  expanded = true,
  endIcon = null,
  color = 'inherit'
}: {
  icon: React.ReactNode,
  label: string,
  onClick: () => void,
  active?: boolean,
  expanded?: boolean,
  endIcon?: React.ReactNode,
  color?: string
}) => {
  const theme = useTheme();

  return (
    <Tooltip title={!expanded ? label : ''} placement="right">
      <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
        <ListItemButton
          onClick={onClick}
          selected={active}
          sx={{
            minHeight: 48,
            justifyContent: expanded ? 'initial' : 'center',
            px: 2.5,
            borderRadius: 2,
            mx: 1,
            color: active ? theme.palette.primary.main : color,
            bgcolor: active ? (theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 123, 255, 0.1)') : 'transparent',
            '&.Mui-selected': {
              bgcolor: active ? (theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 123, 255, 0.15)') : 'transparent',
              '&:hover': {
                bgcolor: active ? (theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(0, 123, 255, 0.2)') : 'transparent',
              }
            },
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: expanded ? 2 : 'auto',
              justifyContent: 'center',
              color: 'inherit',
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={label}
            sx={{
              opacity: expanded ? 1 : 0,
              display: expanded ? 'block' : 'none',
              '& .MuiTypography-root': { fontWeight: active ? 600 : 500 }
            }}
          />
          {expanded && endIcon && (
            <Box sx={{ ml: 1, display: 'flex' }} onClick={(e) => e.stopPropagation()}>
              {endIcon}
            </Box>
          )}
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  activeChatId,
  onChatSelect,
  onSettingsClick,
  onBackClick,
  isExpanded,
  toggleSidebar,
  showSettings,
  handleDeleteChat,
  onCreateNew
}) => {
  const theme = useTheme();
  const { mode, toggleTheme } = useAppTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        width: isExpanded ? 280 : 80,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        borderRight: 'none',
        borderRadius: 3,
        zIndex: 10,
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'space-between' : 'center',
        height: 64
      }}>
        {isExpanded && (
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            ChatBot
          </Typography>
        )}
        <IconButton onClick={toggleSidebar} size="small">
          {isExpanded ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Main Actions */}
      <List>
        {showSettings && (
          <SidebarItem
            icon={<ArrowLeft size={20} />}
            label="Back to Chat"
            onClick={onBackClick}
            expanded={isExpanded}
          />
        )}

        <SidebarItem
          icon={<PlusSquare size={20} />}
          label="New Session"
          onClick={onCreateNew}
          expanded={isExpanded}
          color={theme.palette.primary.main}
        />
      </List>

      {/* Chat History */}
      {isExpanded && (
        <Typography variant="caption" sx={{ px: 3, mt: 2, mb: 1, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Recent
        </Typography>
      )}

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {chatSessions.map((session) => (
            <SidebarItem
              key={session.id}
              icon={<MessageSquare size={18} />}
              label={session.title}
              active={activeChatId === session.id}
              onClick={() => onChatSelect(session.id)}
              expanded={isExpanded}
              endIcon={
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteChat(session.id, e)}
                  sx={{
                    opacity: 0.6,
                    '&:hover': { opacity: 1, color: theme.palette.error.main }
                  }}
                >
                  <Trash2 size={14} />
                </IconButton>
              }
            />
          ))}
          {chatSessions.length === 0 && isExpanded && (
            <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
              <Typography variant="caption">No active sessions</Typography>
            </Box>
          )}
        </List>
      </Box>

      {/* Footer Actions */}
      <Box sx={{ p: 1, mt: 'auto' }}>
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          onClick={onSettingsClick}
          expanded={isExpanded}
        />
        <SidebarItem
          icon={mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          label={mode === 'light' ? "Dark Mode" : "Light Mode"}
          onClick={toggleTheme}
          expanded={isExpanded}
        />
      </Box>
    </Paper>
  );
};

export const MainScreen: React.FC = () => {
  // We can use the useAppTheme hook if we needed to access mode directly, but it's handled in Sidebar
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [workspaceDetails, setWorkspaceDetails] = useState<{ [key: string]: WorkspaceDetails }>({});
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);

  const { setActiveWorkspace } = useWorkspace();

  // Handlers
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
    setActiveWorkspace({ id: newId, name: newTitle, folders: [] });
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
      setActiveWorkspace(remainingSessions.length > 0 ? { id: remainingSessions[0].id, name: remainingSessions[0].title, folders: [] } : null);
    }
  };

  const handleChatSelect = (id: string) => {
    setActiveChatId(id);
    const selectedChat = chatSessions.find(chat => chat.id === id);
    if (selectedChat) {
      setActiveWorkspace({ id: selectedChat.id, name: selectedChat.title, folders: [] });
    }
    setShowSettings(false);
  };

  const handleLLMPreferenceChange = (preference: 'offline' | 'online') => {
    if (activeChatId && workspaceDetails[activeChatId]) {
      setWorkspaceDetails(prev => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          llmPreference: preference,
        }
      }));
    }
  };

  const handleMedicalFilesChange: FileDataSetter = (updater) => {
    if (activeChatId) {
      setWorkspaceDetails(prev => {
        const prevDetails = prev[activeChatId] || defaultWorkspaceDetails;
        const newMedicalFiles = typeof updater === 'function' ? updater(prevDetails.medicalFiles) : updater;
        return {
          ...prev,
          [activeChatId]: {
            ...prevDetails,
            medicalFiles: newMedicalFiles,
          }
        };
      });
    }
  };

  const handlePatientFilesChange: FileDataSetter = (updater) => {
    if (activeChatId) {
      setWorkspaceDetails(prev => {
        const prevDetails = prev[activeChatId] || defaultWorkspaceDetails;
        const newPatientFiles = typeof updater === 'function' ? updater(prevDetails.patientFiles) : updater;
        return {
          ...prev,
          [activeChatId]: {
            ...prevDetails,
            patientFiles: newPatientFiles,
          }
        };
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary', p: 1, gap: 1 }}>
      <Sidebar
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onChatSelect={handleChatSelect}
        onSettingsClick={() => { if (activeChatId) setShowSettings(true); }}
        onBackClick={() => setShowSettings(false)}
        setChatSessions={setChatSessions}
        setActiveChatId={setActiveChatId}
        setWorkspaceDetails={setWorkspaceDetails}
        isExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        showSettings={showSettings}

        handleDeleteChat={handleDeleteChat}
        onCreateNew={() => setShowNewWorkspaceDialog(true)}
      />

      <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            overflow: 'hidden',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          {showSettings ? (
            <MedicalUploader
              onLLMPreferenceChange={handleLLMPreferenceChange}
              workspaceDetails={activeChatId ? workspaceDetails[activeChatId] || defaultWorkspaceDetails : defaultWorkspaceDetails}
              onMedicalFilesChange={handleMedicalFilesChange}
              onPatientFilesChange={handlePatientFilesChange}
            />
          ) : (
            <Chat />
          )}
        </Paper>
      </Box>

      {showNewWorkspaceDialog && (
        <NewWorkspaceDialog
          onClose={() => setShowNewWorkspaceDialog(false)}
          onCreate={handleCreateWorkspace}
        />
      )}
    </Box>
  );
};

export default MainScreen;