import React, { useState } from 'react';
import { useNotes } from '../../context/NotesContext';

const AiChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {role: 'assistant', content: 'Hello! I can help you analyze your documents and notes. What would you like to know?'}
  ]);
  const { activeNote } = useNotes();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const newChatHistory = [
      ...chatHistory,
      {role: 'user', content: message}
    ];
    setChatHistory(newChatHistory);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm analyzing your request. In a real implementation, this would use the Gemini API to provide a relevant response based on your documents and notes.";
      
      if (activeNote) {
        response += " I see you're currently working on a note titled '" + activeNote.title + "'.";
      }
      
      setChatHistory([
        ...newChatHistory,
        {role: 'assistant', content: response}
      ]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-medium text-gray-800 dark:text-white">AI Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                chat.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {chat.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something about your documents..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg"
            disabled={!message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChat;
