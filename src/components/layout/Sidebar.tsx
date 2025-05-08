import React, { useState } from 'react';
import { useNotes } from '../../context/NotesContext';

const Sidebar: React.FC = () => {
  const { 
    notebooks, 
    notes, 
    activeNotebook, 
    activeNote, 
    setActiveNote, 
    setActiveNotebook, 
    createNote, 
    createNotebook,
    documents
  } = useNotes();
  
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');

  const handleCreateNotebook = () => {
    if (newNotebookTitle.trim()) {
      createNotebook(newNotebookTitle);
      setNewNotebookTitle('');
      setIsCreatingNotebook(false);
    }
  };

  const handleCreateNote = () => {
    if (activeNotebook) {
      createNote(activeNotebook.id);
    } else if (notebooks.length > 0) {
      createNote(notebooks[0].id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">OpenbookLM</h1>
      </div>
      
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-medium text-gray-700 dark:text-gray-300">Notebooks</h2>
        <button 
          onClick={() => setIsCreatingNotebook(true)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </button>
      </div>
      
      {isCreatingNotebook && (
        <div className="px-4 mb-2 flex">
          <input
            type="text"
            value={newNotebookTitle}
            onChange={(e) => setNewNotebookTitle(e.target.value)}
            placeholder="Notebook name"
            className="flex-1 p-2 text-sm border rounded-l dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            autoFocus
          />
          <button 
            onClick={handleCreateNotebook}
            className="bg-blue-500 text-white px-3 rounded-r"
          >
            Add
          </button>
        </div>
      )}
      
      <div className="overflow-y-auto flex-1">
        {notebooks.map(notebook => (
          <div key={notebook.id} className="mb-2">
            <div 
              className={`px-4 py-2 flex items-center justify-between cursor-pointer ${
                activeNotebook?.id === notebook.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveNotebook(notebook)}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-600 dark:text-gray-400">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span className="text-gray-800 dark:text-gray-200">{notebook.title}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{notebook.notes.length}</span>
            </div>
            
            {activeNotebook?.id === notebook.id && notebook.notes.length > 0 && (
              <div className="ml-6 border-l border-gray-300 dark:border-gray-700">
                {notebook.notes.map(noteId => {
                  const note = notes.find(n => n.id === noteId);
                  if (!note) return null;
                  
                  return (
                    <div 
                      key={note.id}
                      className={`pl-4 pr-2 py-1 cursor-pointer ${
                        activeNote?.id === note.id ? 'bg-blue-50 dark:bg-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setActiveNote(note)}
                    >
                      <div className="text-sm truncate text-gray-700 dark:text-gray-300">{note.title}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleCreateNote}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center"
          disabled={notebooks.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          New Note
        </button>
      </div>
      
      {documents.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Documents</h2>
          <div className="max-h-40 overflow-y-auto">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center py-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-600 dark:text-gray-400">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span className="text-sm truncate text-gray-700 dark:text-gray-300">{doc.name}</span>
                {doc.processingStatus === 'pending' && (
                  <span className="ml-2 text-xs text-yellow-500">Pending</span>
                )}
                {doc.processingStatus === 'processing' && (
                  <span className="ml-2 text-xs text-blue-500">Processing</span>
                )}
                {doc.processingStatus === 'error' && (
                  <span className="ml-2 text-xs text-red-500">Error</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
