import React, { useState } from 'react';
import { 
  Book, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Trash2, 
  Edit,
  Sparkles,
  Upload,
  File
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { Note, Notebook, Document } from '../../types';
import FileUploader from '../documents/FileUploader';

const Sidebar: React.FC = () => {
  const { 
    notebooks, 
    notes, 
    documents,
    activeNotebook, 
    activeNote, 
    setActiveNotebook, 
    setActiveNote,
    createNotebook,
    createNote,
    deleteNotebook,
    deleteNote,
    createNoteFromDocument
  } = useNotes();
  
  const [expandedNotebooks, setExpandedNotebooks] = useState<Record<string, boolean>>(
    notebooks.reduce((acc, notebook) => ({ ...acc, [notebook.id]: true }), {})
  );
  
  const [showDocuments, setShowDocuments] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  const toggleNotebook = (notebookId: string) => {
    setExpandedNotebooks(prev => ({
      ...prev,
      [notebookId]: !prev[notebookId]
    }));
  };

  const handleNotebookClick = (notebook: Notebook) => {
    setActiveNotebook(notebook);
    // If notebook has notes, select the first one
    if (notebook.notes.length > 0) {
      const firstNote = notes.find(note => note.id === notebook.notes[0]) || null;
      setActiveNote(firstNote);
    } else {
      setActiveNote(null);
    }
  };

  const handleNoteClick = (note: Note) => {
    setActiveNote(note);
  };

  const handleCreateNotebook = () => {
    if (newNotebookTitle.trim()) {
      createNotebook(newNotebookTitle.trim());
      setNewNotebookTitle('');
      setIsCreatingNotebook(false);
    }
  };

  const handleCreateNote = (notebookId: string) => {
    createNote(notebookId);
  };

  const handleCreateNoteFromDocument = (document: Document) => {
    if (!activeNotebook) {
      alert('Please select a notebook first');
      return;
    }
    
    try {
      createNoteFromDocument(document, activeNotebook.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create note from document');
    }
  };

  const filteredNotebooks = notebooks.filter(notebook => 
    notebook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNotesForNotebook = (notebookId: string) => {
    return notes.filter(note => 
      notebooks.find(nb => nb.id === notebookId)?.notes.includes(note.id)
    ).filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">OpenbookLM</h1>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {/* Documents Section */}
        <div className="mb-4">
          <div 
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded"
            onClick={() => setShowDocuments(!showDocuments)}
          >
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Documents</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUploader(true);
                }}
                className="p-1 hover:bg-gray-200 rounded-full"
                title="Upload document"
              >
                <Upload className="h-4 w-4 text-gray-500" />
              </button>
              {showDocuments ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>
          
          {showUploader && (
            <div className="p-3 bg-gray-50 rounded-lg mb-2">
              <FileUploader onClose={() => setShowUploader(false)} />
            </div>
          )}
          
          {showDocuments && (
            <div className="ml-2 space-y-1">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(document => (
                  <div 
                    key={document.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <File className={`h-4 w-4 ${document.type === 'pdf' ? 'text-red-500' : 'text-orange-500'}`} />
                      <div className="flex flex-col">
                        <span className="text-sm truncate">{document.name}</span>
                        <span className="text-xs text-gray-500">
                          {document.processingStatus === 'completed' ? 'Processed' : 
                           document.processingStatus === 'processing' ? 'Processing...' : 
                           document.processingStatus === 'error' ? 'Error' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    {document.processingStatus === 'completed' && (
                      <button 
                        onClick={() => handleCreateNoteFromDocument(document)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Create note from document"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500 italic">
                  No documents found
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Notebooks Section */}
        <div className="flex items-center justify-between p-2">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Notebooks</h2>
          <button 
            onClick={() => setIsCreatingNotebook(true)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        {isCreatingNotebook && (
          <div className="p-2 mb-2 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Notebook title"
              className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newNotebookTitle}
              onChange={(e) => setNewNotebookTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsCreatingNotebook(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateNotebook}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          {filteredNotebooks.map(notebook => (
            <div key={notebook.id} className="rounded-lg overflow-hidden">
              <div 
                className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 ${
                  activeNotebook?.id === notebook.id ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleNotebookClick(notebook)}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNotebook(notebook.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    {expandedNotebooks[notebook.id] ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <Book className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium truncate">{notebook.title}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateNote(notebook.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200"
                    title="Add note"
                  >
                    <Plus className="h-3 w-3 text-gray-500" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this notebook?')) {
                        deleteNotebook(notebook.id);
                      }
                    }}
                    className="p-1 rounded-full hover:bg-gray-200"
                    title="Delete notebook"
                  >
                    <Trash2 className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {expandedNotebooks[notebook.id] && (
                <div className="ml-6 space-y-1 mt-1">
                  {getNotesForNotebook(notebook.id).map(note => (
                    <div 
                      key={note.id}
                      className={`flex items-center justify-between p-2 cursor-pointer rounded-lg hover:bg-gray-100 ${
                        activeNote?.id === note.id ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                      onClick={() => handleNoteClick(note)}
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate">{note.title}</span>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this note?')) {
                              deleteNote(note.id);
                            }
                          }}
                          className="p-1 rounded-full hover:bg-gray-200"
                          title="Delete note"
                        >
                          <Trash2 className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getNotesForNotebook(notebook.id).length === 0 && (
                    <div className="p-2 text-sm text-gray-500 italic">
                      No notes in this notebook
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {filteredNotebooks.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No notebooks found
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowUploader(true)}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
