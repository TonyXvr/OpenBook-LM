import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Bot, User, X, Maximize2, Minimize2, Loader } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { Message } from '../../types';
import { queryGemini } from '../../services/geminiService';

const AiChat: React.FC = () => {
  const { activeNote } = useNotes();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant powered by Google Gemini. I can help you analyze your documents and notes. Ask me anything!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from localStorage
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('aiChatMessages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        });
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('aiChatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response using Gemini API
      const aiResponse = await queryGemini(
        input, 
        activeNote ? activeNote.content : undefined
      );
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: `ai-${Date.now()}`,
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([{
        id: '1',
        content: "Hello! I'm your AI assistant powered by Google Gemini. I can help you analyze your documents and notes. Ask me anything!",
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className={`h-full flex flex-col ${isMinimized ? 'h-auto' : 'h-full'}`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="font-medium text-gray-800">Gemini Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={clearChat}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Clear chat"
          >
            <X className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'ai' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs">
                      {message.sender === 'ai' ? 'Gemini' : 'You'}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{message.content}</p>
                  <div className="text-right mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs">Gemini</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Gemini about your documents..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-full ${
                  input.trim() && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiChat;
