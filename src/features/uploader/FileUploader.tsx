/**
 * File Uploader - Presentational Component
 * Single Responsibility: Render file upload UI
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  loading = false,
  error,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.epub')) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="bg-card rounded-lg shadow-lg p-8 text-center max-w-md w-full border">
        <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
        
        <h1 className="text-3xl font-semibold mb-2">
          EPUB Reader
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Upload an EPUB file to start reading
        </p>

        {loading ? (
          <Progress value={undefined} className="w-full" />
        ) : (
          <Button
            asChild
            size="lg"
            className="w-full"
          >
            <label className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Select EPUB File
              <input
                type="file"
                accept=".epub"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </Button>
        )}

        {error && (
          <p className="text-destructive mt-2 text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
