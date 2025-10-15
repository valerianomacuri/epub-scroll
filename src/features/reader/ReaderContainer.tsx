/**
 * Reader Container - Container Component
 * Single Responsibility: Handle reader state and business logic
 * Follows Container/Presentation pattern
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { EpubService } from '../../core/epub/EpubService';
import { StorageService } from '../../core/storage/StorageService';
import type {
  EpubMetadata,
  TocItem,
  ChapterContent,
  ReaderSettings,
} from '../../core/types/epub.types';
import { ChapterView } from './ChapterView';
import { TocPanel } from './TocPanel';
import { ReaderToolbar } from './ReaderToolbar';

interface ReaderContainerProps {
  file: File;
  onClose: () => void;
}

export const ReaderContainer: React.FC<ReaderContainerProps> = ({
  file,
  onClose,
}) => {
  const [epubService] = useState(() => new EpubService());
  const [metadata, setMetadata] = useState<EpubMetadata | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [currentChapter, setCurrentChapter] = useState<ChapterContent | null>(
    null
  );
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>(
    StorageService.getSettings()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate book ID from filename
  const bookId = file.name.replace('.epub', '');

  // Load EPUB file
  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      try {
        setLoading(true);
        await epubService.loadFromFile(file);

        if (!isMounted) return;

        const [meta, tocData] = await Promise.all([
          epubService.getMetadata(),
          epubService.getToc(),
        ]);

        setMetadata(meta);
        console.log({ tocData });
        setToc(tocData);

        // Load saved progress or start from beginning
        const progress = StorageService.getProgress(bookId);
        // const startIndex = progress?.currentChapter || 0;
        const startIndex = 0;
        console.log({ progress });
        const spineItems = epubService.getSpineItems();
        if (spineItems.length > 0) {
          const chapter = await epubService.getChapterContent(
            spineItems[startIndex].href,
            startIndex
          );
          console.log({ chapter });
          setCurrentChapter(chapter);
          // setCurrentIndex(startIndex);
        }

        setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load book');
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
      epubService.destroy();
    };
  }, [file, epubService, bookId]);

  // Save reading progress
  const saveProgress = useCallback(
    (chapterIndex: number, scrollPosition: number) => {
      StorageService.saveProgress({
        bookId,
        currentChapter: chapterIndex,
        scrollPosition,
        lastReadDate: new Date().toISOString(),
      });
    },
    [bookId]
  );

  // Handle chapter change
  const handleChapterSelect = useCallback(
    async (href: string, index: number) => {
      try {
        const chapter = await epubService.getChapterContent(href, index);
        console.log('handle_chapter_select', { chapter });
        setCurrentChapter(chapter);
        // setCurrentIndex(index);
        saveProgress(index, 0);
      } catch (err) {
        console.error('Failed to load chapter:', err);
      }
    },
    [epubService, saveProgress]
  );

  // Handle scroll position save
  const handleScroll = useCallback(
    (scrollTop: number) => {
      // saveProgress(currentIndex, scrollTop);
    },
    [
      // currentIndex
      saveProgress,
    ]
  );

  // Handle settings change
  const handleSettingsChange = useCallback(
    (newSettings: Partial<ReaderSettings>) => {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      StorageService.saveSettings(updated);
    },
    [settings]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          p: 3,
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Error loading book
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ReaderToolbar
        bookTitle={metadata?.title || 'Unknown Book'}
        onMenuClick={() => setTocOpen(true)}
        onHomeClick={onClose}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {currentChapter && (
          <ChapterView
            content={currentChapter.content}
            settings={settings}
            onScroll={handleScroll}
          />
        )}
      </Box>

      <TocPanel
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        toc={toc}
        currentChapter={currentChapter.href}
        onChapterSelect={handleChapterSelect}
        bookTitle={metadata?.title}
      />
    </Box>
  );
};
