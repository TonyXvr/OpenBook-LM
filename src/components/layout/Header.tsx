import React from 'react';
import { 
  Search, 
  Settings, 
  HelpCircle, 
  User,
  MessageSquare,
  Share2,
  Sparkles
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';

const Header: React.FC = () => {
  const { activeNote, activeNotebook } = useNotes();

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center">
        {activeNotebook && (
          <h1 className="text-lg font-medium text-gray-800">
            {activeNotebook.title}
            {activeNote && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {activeNote && (
              <span className="font-normal">{activeNote.title}</span>
            )}
          </h1>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Search className="h-5 w-5" />
        </button>
        
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <MessageSquare className="h-5 w-5" />
        </button>
        
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Share2 className="h-5 w-5" />
        </button>
        
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <HelpCircle className="h-5 w-5" />
        </button>
        
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Settings className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Powered by Gemini</span>
        </div>
        
        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
