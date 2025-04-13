export interface FileData {
  id: string;
  name: string;
  size: number;
  progress: number;
  type: string;
  status: 'uploading' | 'completed'; // Added status property
}

// Interface for a single chat message
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}