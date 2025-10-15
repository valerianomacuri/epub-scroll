/**
 * File Uploader - Presentational Component
 * Single Responsibility: Render file upload UI
 */

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
        }}
      >
        <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          EPUB Reader
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Upload an EPUB file to start reading
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            component="label"
            size="large"
            startIcon={<UploadIcon />}
          >
            Select EPUB File
            <input
              type="file"
              accept=".epub"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
