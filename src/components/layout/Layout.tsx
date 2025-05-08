import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useNotes } from '../../context/NotesContext';
import NoteEditor from '../notes/NoteEditor';
import AiChat from '../ai/AiChat';

const Layout: React.FC = () => {
  const { activeNote } = useNotes();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-gray-50">
            {activeNote ? (
              <NoteEditor />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to OpenbookLM</h2>
                  <p className="text-gray-600 mb-6">
                    Upload documents or create notes to get started. Use the AI assistant to analyze your content.
                  </p>
                  <div className="flex flex-col space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-800">Upload Documents</h3>
                        <p className="text-sm text-gray-600">Upload PDF and PowerPoint files to extract and analyze content.</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-full text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-800">Create Notes</h3>
                        <p className="text-sm text-gray-600">Organize your thoughts in notebooks with rich text editing.</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-full text-purple-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-800">AI-Powered Analysis</h3>
                        <p className="text-sm text-gray-600">Ask questions about your documents and get intelligent insights.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
        <div className="w-80 border-l border-gray-200 bg-white">
          <AiChat />
        </div>
      </div>
    </div>
  );
};

export default Layout;
