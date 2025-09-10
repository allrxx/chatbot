"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface Folder {
  id: string;
  name: string;
  type: 'patient_documents' | 'medical_documents';
  children: (Folder | File)[];
  files?: string[];
  urls?: string[];
}

export interface File {
  id: string;
  name: string;
  type: 'file';
  fileType: string;
  url: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
  folders: Folder[];
  createdAt?: Date;
  updatedAt?: Date;
  collaborators?: Collaborator[];
  type?: 'medical_documents' | 'patient_documents';
  filePath?: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspace: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const createDefaultWorkspace = (): Workspace => ({
    id: `ws-default-${Date.now()}`,
    name: 'Default chat',
    folders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    collaborators: []
  });

  const loadWorkspaces = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage
      const storedWorkspaces = localStorage.getItem('workspaces');
      const storedActiveWorkspace = localStorage.getItem('activeWorkspace');

      if (storedWorkspaces) {
        const parsedWorkspaces = JSON.parse(storedWorkspaces);
        setWorkspaces(parsedWorkspaces);
        
        if (storedActiveWorkspace) {
          setActiveWorkspace(JSON.parse(storedActiveWorkspace));
        } else if (parsedWorkspaces.length > 0) {
          setActiveWorkspace(parsedWorkspaces[0]);
        }
      } else {
        // If no workspaces in storage, create default
        const defaultWorkspace = createDefaultWorkspace();
        setWorkspaces([defaultWorkspace]);
        setActiveWorkspace(defaultWorkspace);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
      // Fallback to creating default workspace
      const defaultWorkspace = createDefaultWorkspace();
      setWorkspaces([defaultWorkspace]);
      setActiveWorkspace(defaultWorkspace);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('workspaces', JSON.stringify(workspaces));
      if (activeWorkspace) {
        localStorage.setItem('activeWorkspace', JSON.stringify(activeWorkspace));
      }
    }
  }, [workspaces, activeWorkspace, isInitialized]);

  const refreshWorkspaces = async () => {
    await loadWorkspaces();
  };

  const addWorkspace = (workspace: Workspace) => {
    setWorkspaces(prev => [...prev, workspace]);
    setActiveWorkspace(workspace);
    localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
  };

  const deleteWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));

    if (activeWorkspace?.id === workspaceId) {
      const remaining = workspaces.filter(w => w.id !== workspaceId);
      const newActive = remaining.length > 0 ? remaining[0] : createDefaultWorkspace();
      setActiveWorkspace(newActive);
      localStorage.setItem('activeWorkspace', JSON.stringify(newActive));

      if (remaining.length === 0) {
        const newDefaultWorkspace = createDefaultWorkspace();
        setWorkspaces([newDefaultWorkspace]);
      }
    }
  };

  const updateWorkspace = (updatedWorkspace: Workspace) => {
    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace
      )
    );

    if (activeWorkspace?.id === updatedWorkspace.id) {
      setActiveWorkspace(updatedWorkspace);
      localStorage.setItem('activeWorkspace', JSON.stringify(updatedWorkspace));
    }
  };

  const contextValue = {
    workspaces,
    activeWorkspace,
    setActiveWorkspace: (workspace: Workspace | null) => {
      if (workspace) {
        setActiveWorkspace(workspace);
        localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
      }
    },
    addWorkspace,
    deleteWorkspace,
    updateWorkspace,
    refreshWorkspaces,
    isLoading,
    isInitialized,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};