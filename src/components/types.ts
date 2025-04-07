export interface FileData {
  id: string;
  name: string;
  size: number;
  progress: number;
  type: string;
  status: 'uploading' | 'completed'; // Added status property
}