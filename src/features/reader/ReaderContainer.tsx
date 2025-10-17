/**
 * Reader Container - Container Component
 * Single Responsibility: Handle reader state and business logic
 * Follows Container/Presentation pattern
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, CircularProgress, Link, Typography } from '@mui/material';
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
  const [tocOpen, setTocOpen] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>(
    StorageService.getSettings()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialScrollPosition, setInitialScrollPosition] = useState<number>();

  const snipeItems = useMemo(() => {
    if (!epubService.isReady) return null;
    return epubService.getSpineItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epubService, epubService.isReady]);
  const currentSnipeItem = useMemo(() => {
    if (!currentChapter?.href || !snipeItems) return null;
    return snipeItems.find(
      (item) =>
        currentChapter.href.includes(item.href) ||
        item.href.includes(currentChapter.href)
    );
  }, [currentChapter?.href, snipeItems]);

  const nextChapter = async () => {
    if (!snipeItems || !currentSnipeItem) return;
    if (currentSnipeItem.index === snipeItems.length - 1) return;
    const chapter = await epubService.getChapterContent(
      snipeItems[currentSnipeItem.index + 1].href
    );
    setCurrentChapter(chapter);
  };
  const prevChapter = async () => {
    if (!snipeItems || !currentSnipeItem) return;
    if (currentSnipeItem.index === 0) return;
    const chapter = await epubService.getChapterContent(
      snipeItems[currentSnipeItem.index - 1].href
    );
    setCurrentChapter(chapter);
  };

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

        setToc(tocData);

        // Load saved progress or start from beginning
        const progress = StorageService.getProgress(bookId);
        if (progress) {
          setInitialScrollPosition(progress.scrollPosition);
          const chapter = await epubService.getChapterContent(
            progress.chapterHref
          );
          setCurrentChapter(chapter);
        }
        if (!progress) {
          const snipeItems = epubService.getSpineItems();
          const chapter = await epubService.getChapterContent(
            snipeItems[0].href
          );
          setCurrentChapter(chapter);
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
    (chapterHref: string, scrollPosition: number) => {
      StorageService.saveProgress({
        bookId,
        chapterHref,
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
        const chapter = await epubService.getChapterContent(href);
        setCurrentChapter(chapter);
        saveProgress(href, 0);
      } catch (err) {
        console.error('Failed to load chapter:', err);
      }
    },
    [epubService, saveProgress]
  );

  // Handle scroll position save
  const handleScroll = useCallback(
    (scrollTop: number) => {
      if (!currentChapter?.href) return;
      saveProgress(currentChapter.href, scrollTop);
    },
    [currentChapter?.href, saveProgress]
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
            initialScrollPosition={initialScrollPosition}
            href={currentChapter.href}
            content={currentChapter.content}
            footer={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  maxWidth: 800,
                  mx: 'auto',
                  p: { xs: 3, sm: 4, md: 6 },
                  pb: { xs: 6, sm: 8, md: 12 },
                }}
              >
                <Link
                  component="button"
                  color="inherit"
                  variant="body2"
                  sx={{
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    verticalAlign: 'baseline',
                    '*': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={prevChapter}
                >
                  Prev page
                </Link>
                <Link
                  component="button"
                  color="inherit"
                  variant="body2"
                  sx={{
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    verticalAlign: 'baseline',
                    '*': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={nextChapter}
                >
                  Next page
                </Link>
              </Box>
            }
            settings={settings}
            onScroll={handleScroll}
          />
        )}
      </Box>

      {currentChapter && (
        <TocPanel
          open={tocOpen}
          onClose={() => setTocOpen(false)}
          toc={toc}
          currentHref={currentChapter.href}
          onChapterSelect={handleChapterSelect}
          bookTitle={metadata?.title}
        />
      )}
    </Box>
  );
};
