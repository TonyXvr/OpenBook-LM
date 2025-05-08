import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Note, Notebook, Document, DocumentType } from '../types';
import { extractTextFromDocument } from '../services/geminiService';

interface NotesContextType {
  notes: Note[];
  notebooks: Notebook[];
  documents: Document[];
  activeNote: Note | null;
  activeNotebook: Notebook | null;
  setActiveNote: (note: Note | null) => void;
  setActiveNotebook: (notebook: Notebook | null) => void;
  createNote: (notebookId: string, title?: string, content?: string) => Note;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  createNotebook: (title: string) => void;
  updateNotebook: (notebook: Notebook) => void;
  deleteNotebook: (notebookId: string) => void;
  uploadDocument: (file: File) => Promise<Document>;
  getDocumentById: (id: string) => Document | undefined;
  createNoteFromDocument: (document: Document, notebookId: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Load data from localStorage or use empty arrays if not found
const loadFromStorage = <T extends unknown>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      // Parse dates properly
      const parsed = JSON.parse(storedData, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(loadFromStorage('notes', []));
  const [notebooks, setNotebooks] = useState<Notebook[]>(loadFromStorage('notebooks', []));
  const [documents, setDocuments] = useState<Document[]>(loadFromStorage('documents', []));
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [activeNotebook, setActiveNotebook] = useState<Notebook | null>(null);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  // Create a default notebook if none exists
  useEffect(() => {
    if (notebooks.length === 0) {
      createNotebook('My First Notebook');
    }
  }, []);

  const createNote = (notebookId: string, title = 'Untitled Note', content = ''): Note => {
    const newNote: Note = {
      id: `n${Date.now()}`,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };

    setNotes(prevNotes => [...prevNotes, newNote]);

    // Update the notebook to include this note
    const updatedNotebooks = notebooks.map(nb => {
      if (nb.id === notebookId) {
        return {
          ...nb,
          notes: [...nb.notes, newNote.id],
          updatedAt: new Date(),
        };
      }
      return nb;
    });

    setNotebooks(updatedNotebooks);
    setActiveNote(newNote);
    return newNote;
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date() } 
        : note
    );
    setNotes(updatedNotes);
    
    if (activeNote?.id === updatedNote.id) {
      setActiveNote({ ...updatedNote, updatedAt: new Date() });
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    
    // Remove the note from any notebooks
    const updatedNotebooks = notebooks.map(notebook => ({
      ...notebook,
      notes: notebook.notes.filter(id => id !== noteId),
      updatedAt: new Date(),
    }));
    
    setNotebooks(updatedNotebooks);
    
    if (activeNote?.id === noteId) {
      setActiveNote(null);
    }
  };

  const createNotebook = (title: string) => {
    const newNotebook: Notebook = {
      id: `nb${Date.now()}`,
      title,
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setNotebooks([...notebooks, newNotebook]);
    setActiveNotebook(newNotebook);
  };

  const updateNotebook = (updatedNotebook: Notebook) => {
    const updatedNotebooks = notebooks.map(notebook => 
      notebook.id === updatedNotebook.id 
        ? { ...updatedNotebook, updatedAt: new Date() } 
        : notebook
    );
    
    setNotebooks(updatedNotebooks);
    
    if (activeNotebook?.id === updatedNotebook.id) {
      setActiveNotebook({ ...updatedNotebook, updatedAt: new Date() });
    }
  };

  const deleteNotebook = (notebookId: string) => {
    // Get all note IDs in this notebook
    const notebookToDelete = notebooks.find(nb => nb.id === notebookId);
    if (!notebookToDelete) return;
    
    // Delete all notes in this notebook
    setNotes(notes.filter(note => !notebookToDelete.notes.includes(note.id)));
    
    // Delete the notebook
    setNotebooks(notebooks.filter(notebook => notebook.id !== notebookId));
    
    if (activeNotebook?.id === notebookId) {
      setActiveNotebook(null);
      setActiveNote(null);
    }
  };

  const getDocumentType = (fileName: string): DocumentType => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (extension === 'ppt' || extension === 'pptx') return 'ppt';
    return 'pdf'; // Default to PDF
  };

  const uploadDocument = async (file: File): Promise<Document> => {
    // Create a new document
    const newDocument: Document = {
      id: `doc${Date.now()}`,
      name: file.name,
      type: getDocumentType(file.name),
      size: file.size,
      content: '',
      createdAt: new Date(),
      file,
      processingStatus: 'pending',
    };
    
    setDocuments(prev => [...prev, newDocument]);
    
    try {
      // Update status to processing
      const processingDocument = { ...newDocument, processingStatus: 'processing' as const };
      setDocuments(prev => 
        prev.map(doc => doc.id === newDocument.id ? processingDocument : doc)
      );
      
      // Extract text from the document
      const extractedText = await extractTextFromDocument(newDocument);
      
      // Update the document with the extracted text
      const completedDocument = { 
        ...processingDocument, 
        content: extractedText,
        processingStatus: 'completed' as const 
      };
      
      setDocuments(prev => 
        prev.map(doc => doc.id === newDocument.id ? completedDocument : doc)
      );
      
      return completedDocument;
    } catch (error) {
      console.error('Error processing document:', error);
      
      // Update document with error status
      const errorDocument = { 
        ...newDocument, 
        processingStatus: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
      
      setDocuments(prev => 
        prev.map(doc => doc.id === newDocument.id ? errorDocument : doc)
      );
      
      throw error;
    }
  };

  const getDocumentById = (id: string): Document | undefined => {
    return documents.find(doc => doc.id === id);
  };

  const createNoteFromDocument = (document: Document, notebookId: string) => {
    if (document.processingStatus !== 'completed') {
      throw new Error('Cannot create note from a document that has not been processed');
    }
    
    const note = createNote(
      notebookId,
      document.name,
      document.content
    );
    
    // Update the note to include a reference to the source document
    updateNote({
      ...note,
      sourceDocumentId: document.id,
    });
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        notebooks,
        documents,
        activeNote,
        activeNotebook,
        setActiveNote,
        setActiveNotebook,
        createNote,
        updateNote,
        deleteNote,
        createNotebook,
        updateNotebook,
        deleteNotebook,
        uploadDocument,
        getDocumentById,
        createNoteFromDocument,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
