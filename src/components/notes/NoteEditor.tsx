import React, { useState, useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';
import { Tag, Plus, Save, Clock } from 'lucide-react';

const NoteEditor: React.FC = () => {
  const { activeNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setTags(activeNote.tags);
      setLastSaved(activeNote.updatedAt);
    }
  }, [activeNote]);

  const handleSave = () => {
    if (!activeNote) return;
    
    setIsSaving(true);
    
    const updatedNote = {
      ...activeNote,
      title,
      content,
      tags,
      updatedAt: new Date(),
    };
    
    updateNote(updatedNote);
    setLastSaved(new Date());
    
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      
      if (activeNote) {
        updateNote({
          ...activeNote,
          tags: updatedTags,
        });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    
    if (activeNote) {
      updateNote({
        ...activeNote,
        tags: updatedTags,
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!activeNote) return null;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>
            {lastSaved ? `Last saved: ${formatDate(lastSaved)}` : 'Not saved yet'}
          </span>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isSaving 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="text-3xl font-bold mb-4 p-2 w-full bg-transparent border-none focus:outline-none focus:ring-0"
      />
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tags.map(tag => (
          <div 
            key={tag} 
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            <Tag className="h-3 w-3" />
            <span>{tag}</span>
            <button 
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        ))}
        <div className="flex items-center">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              }
            }}
            placeholder="Add tag..."
            className="px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTag}
            className="ml-1 p-1 text-gray-500 hover:text-gray-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-full p-4 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
