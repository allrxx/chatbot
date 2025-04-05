export interface FileData {
  id: string;
  name: string;
  progress: number;
  size?: number; // Optional size property
  type: 'file' | 'url';
}