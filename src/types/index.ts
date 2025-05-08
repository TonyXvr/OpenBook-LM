export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  sourceDocumentId?: string; // Reference to source document if created from a document
}

export interface Notebook {
  id: string;
  title: string;
  notes: string[]; // Note IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export type DocumentType = 'pdf' | 'ppt' | 'pptx';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  content: string; // Extracted text content
  createdAt: Date;
  file: File;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface AiResponse {
  text: string;
  sourceDocuments?: string[];
}
