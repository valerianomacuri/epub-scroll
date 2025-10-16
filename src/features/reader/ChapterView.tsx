/**
 * Chapter View - Presentational Component
 * Single Responsibility: Render chapter content with custom styling
 */

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import type { ReaderSettings } from '../../core/types/epub.types';

interface ChapterViewProps {
  href: string;
  content: string;
  settings: ReaderSettings;
  initialScrollPosition?: number;
  onScroll?: (scrollTop: number) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  href,
  content,
  settings,
  initialScrollPosition,
  onScroll,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialScrollPosition) return;
    const element = contentRef.current;
    if (!element) return;
    const timeoutId = setTimeout(() => {
      element.scrollTo({
        top: initialScrollPosition,
      });
    });
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (!content) return;
    if (!href) return;
    const element = contentRef.current;
    if (!element) return;
    if (href.includes('#')) {
      const index = href.indexOf('#');
      const hashUrl = href.substring(index);
      element.scrollTop = 0;
      window.location.hash = hashUrl;
      return;
    }
    element.scrollTop = 0;
  }, [content, href]);

  // useEffect(() => {
  //   if (!href) return;
  //   if (!href.includes('#')) return;
  //   const index = href.indexOf('#');
  //   const hashUrl = href.substring(index);
  //   window.location.hash = hashUrl;
  // }, [content, href]);

  // useEffect(() => {
  //   if (!content) return;
  //   const element = contentRef.current;
  //   if (!element) return;
  //   element.scrollTop = 0;
  // }, [content]);

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
          maxWidth: 800,
          mx: 'auto',
          p: { xs: 3, sm: 4, md: 6 },
        }}
      />
    </Box>
  );
};
