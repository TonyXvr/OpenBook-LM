import React from 'react';
import { useNotes } from '../../context/NotesContext';

const NoteEditor: React.FC = () => {
  const { activeNote, updateNote } = useNotes();

  if (!activeNote) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote({
      ...activeNote,
      content: e.target.value
    });
  };

  return (
    <div className="h-full p-6 dark:bg-gray-800">
      <textarea
        value={activeNote.content}
        onChange={handleContentChange}
        className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="Start writing..."
      />
    </div>
  );
};

export default NoteEditor;
