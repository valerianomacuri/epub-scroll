/**
 * Chapter View - Presentational Component
 * Single Responsibility: Render chapter content with custom styling
 */

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
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
      }}
    >
      <Box
        dangerouslySetInnerHTML={{ __html: content }}
        sx={{
          // box styles
          maxWidth: 800,
          mx: 'auto',
          p: { xs: 3, sm: 4, md: 6 },
          // // default styles
          // fontSize: `${settings.fontSize}px`,
          // lineHeight: settings.lineHeight,
          // fontFamily: settings.fontFamily,
          // '& p': {
          //   marginBottom: 2,
          // },
          // '& h1, & h2, & h3, & h4, & h5, & h6': {
          //   marginTop: 3,
          //   marginBottom: 2,
          //   fontWeight: 600,
          // },
          // '& img': {
          //   maxWidth: '100%',
          //   height: 'auto',
          //   display: 'block',
          //   margin: '2rem auto',
          // },
          // '& a': {
          //   color: 'primary.main',
          //   textDecoration: 'none',
          //   '&:hover': {
          //     textDecoration: 'underline',
          //   },
          // },
          // // code styles
          // '& pre': {
          //   backgroundColor: '#1e1e1e',
          //   color: '#f8f8f2',
          //   fontFamily: 'monospace',
          //   padding: '1rem',
          //   borderRadius: '8px',
          //   overflowX: 'auto',
          //   fontSize: '0.9rem',
          //   lineHeight: 1.5,
          //   marginY: 3,
          // },
          // '& code': {
          //   fontFamily: 'monospace',
          //   backgroundColor: 'rgba(0,0,0,0.05)',
          //   padding: '0.2em 0.4em',
          //   borderRadius: '4px',
          //   fontSize: '0.9em',
          // },
          // '& pre code': {
          //   backgroundColor: 'transparent',
          //   padding: 0,
          // },
          // // custom styles
          // textAlign: 'justify',
        }}
      />
    </Box>
  );
};
