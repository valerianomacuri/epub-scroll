/**
 * Main Application Page
 * Container for upload and reader functionality
 */

import React, { useState } from 'react';
import { FileUploader } from '../features/uploader/FileUploader';
import { ReaderContainer } from '../features/reader/ReaderContainer';
import { ThemeProvider } from '../components/ThemeProvider';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    
    // Small delay to show loading state
    setTimeout(() => {
      setSelectedFile(file);
      setLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {!selectedFile ? (
          <FileUploader
            onFileSelect={handleFileSelect}
            loading={loading}
            error={error || undefined}
          />
        ) : (
          <ReaderContainer file={selectedFile} onClose={handleClose} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
