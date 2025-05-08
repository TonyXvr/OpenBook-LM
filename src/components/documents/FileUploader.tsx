import React, { useState } from 'react';
import { useNotes } from '../../context/NotesContext';

const FileUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument, notebooks, activeNotebook, createNoteFromDocument } = useNotes();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    
    try {
      for (const file of files) {
        // Check if file is PDF or PPT
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (fileExt === 'pdf' || fileExt === 'ppt' || fileExt === 'pptx') {
          const document = await uploadDocument(file);
          
          // If document was processed successfully and we have a notebook, create a note
          if (document.processingStatus === 'completed') {
            const notebookId = activeNotebook?.id || (notebooks.length > 0 ? notebooks[0].id : null);
            if (notebookId) {
              createNoteFromDocument(document, notebookId);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" x2="12" y1="3" y2="15"></line>
          </svg>
        </div>
        <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PDF, PPT, PPTX (MAX. 20MB)
        </p>
        
        <input
          type="file"
          className="hidden"
          accept=".pdf,.ppt,.pptx"
          onChange={handleFileChange}
          id="file-upload"
          multiple
        />
        
        <label 
          htmlFor="file-upload"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>Select Files</>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
