/**
 * Chapter View - Presentational Component
 * Single Responsibility: Render chapter content with custom styling
 */

import React, { useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import type { ReaderSettings } from '../../core/types/epub.types';

interface ChapterViewProps {
  content: string;
  settings: ReaderSettings;
  onScroll?: (scrollTop: number) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  content,
  settings,
  onScroll,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && onScroll) {
        onScroll(contentRef.current.scrollTop);
      }
    };

    const element = contentRef.current;
    element?.addEventListener('scroll', handleScroll);

    return () => {
      element?.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);

  return (
    <Box
      ref={contentRef}
      sx={{
        height: '100%',
        overflow: 'auto',
        px: { xs: 2, sm: 4, md: 8 },
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: { xs: 3, sm: 4, md: 6 },
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          dangerouslySetInnerHTML={{ __html: content }}
          sx={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            fontFamily: settings.fontFamily,
            '& p': {
              marginBottom: 2,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: 3,
              marginBottom: 2,
              fontWeight: 600,
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: '2rem auto',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
};
