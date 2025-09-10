export interface FileData {
  id: string;
  name: string;
  size: number;
  progress: number;
  type: string;
  status: 'uploading' | 'completed'; // Added status property
}

// Interface for a single chat message
export interface MessageType {
  id: string;
  ChatResponse: object | string;
  isUser: boolean;
  timestamp: Date;
  imageBase64?: string;
}