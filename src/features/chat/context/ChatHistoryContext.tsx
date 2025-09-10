"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MetProAiAPI } from '../../../lib/api/flask-api';

function genId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof (crypto as any).getRandomValues === "function") {
      const buf = new Uint8Array(16);
      (crypto as any).getRandomValues(buf);
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;
      const toHex = (n: number) => n.toString(16).padStart(2, "0");
      const b = Array.from(buf, toHex).join("");
      return `${b.substring(0, 8)}-${b.substring(8, 12)}-${b.substring(12, 16)}-${b.substring(16, 20)}-${b.substring(20)}`;
    }
  } catch {}
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface MessageType {
  id: string;
  ChatResponse: object | string;
  isUser: boolean;
  timestamp: Date;
  imageBase64?: string;
}

interface ChatHistoryContextType {
  getChatHistory: (workspaceId: string) => MessageType[];
  sendMessage: (workspaceId: string, userMessage: string) => Promise<void>;
  clearChatHistory: (workspaceId: string) => void;
  clearAllChatHistory: () => void;
  isLoading: (workspaceId: string) => boolean;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatHistories, setChatHistories] = useState<Record<string, MessageType[]>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem("chatHistories");
      if (!saved) return {};
      const parsed: Record<string, MessageType[]> = JSON.parse(saved);
      Object.keys(parsed).forEach((wk) => {
        parsed[wk] = parsed[wk].map((m: MessageType) => ({ ...m, timestamp: new Date(m.timestamp) }));
      });
      return parsed;
    } catch (e) {
      console.error("Failed to parse chat histories from localStorage", e);
      return {};
    }
  });

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
    } catch (e) {
      console.warn("Could not write chatHistories to localStorage", e);
    }
  }, [chatHistories]);

  const getChatHistory = useCallback((workspaceId: string): MessageType[] => {
    return chatHistories[workspaceId] || [];
  }, [chatHistories]);

  const sendMessage = useCallback(async (workspaceId: string, userMessage: string) => {
    const userMessageObj: MessageType = {
      id: genId(),
      ChatResponse: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setChatHistories((prev) => ({ ...prev, [workspaceId]: [...(prev[workspaceId] || []), userMessageObj] }));
    setLoadingStates((prev) => ({ ...prev, [workspaceId]: true }));

    try {
      const aiReply = await MetProAiAPI.sendChatMessage(userMessage);
      let chatPayload: any = 'No response from AI.';
      if (aiReply) {
        if (typeof aiReply === 'string') {
            chatPayload = aiReply;
        } else if (typeof aiReply === 'object') {
          chatPayload = {
            response: aiReply.response || 'No response from AI.',
            image_base64: aiReply.image_base64 || '',
            image_path: aiReply.image_path || '',
            agent_used: aiReply.agent_used || '',
            status: aiReply.status || '',
            timestamp: aiReply.timestamp || '',
          };
        }
      }
      const aiMessage: MessageType = { id: genId(), ChatResponse: chatPayload, isUser: false, timestamp: new Date() };
      setChatHistories(prev => ({ ...prev, [workspaceId]: [...(prev[workspaceId] || []), aiMessage] }));
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: MessageType = { id: genId(), ChatResponse: "Error processing your request. Please try again.", isUser: false, timestamp: new Date() };
      setChatHistories((prev) => ({ ...prev, [workspaceId]: [...(prev[workspaceId] || []), errorMessage] }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [workspaceId]: false }));
    }
  }, []);

  const clearChatHistory = useCallback((workspaceId: string) => {
    setChatHistories((prev) => {
      const copy = { ...prev };
      delete copy[workspaceId];
      return copy;
    });
  }, []);

  const clearAllChatHistory = useCallback(() => {
    setChatHistories({});
  }, []);

  const isLoading = useCallback(
    (workspaceId: string): boolean => {
      return !!loadingStates[workspaceId];
    },
    [loadingStates]
  );

  return (
    <ChatHistoryContext.Provider value={{ getChatHistory, sendMessage, clearChatHistory, clearAllChatHistory, isLoading }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = (): ChatHistoryContextType => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  return context;
};