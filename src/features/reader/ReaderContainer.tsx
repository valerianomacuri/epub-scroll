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
  console.log({ currentChapter });
  const [tocOpen, setTocOpen] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>(
    StorageService.getSettings()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialScrollPosition, setInitialScrollPosition] = useState<number>();

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
        if (progress?.chapterIdref || progress?.chapterHref) {
          setInitialScrollPosition(progress.scrollPosition);
          const chapter = await epubService.getChapterContent({
            idref: progress.chapterIdref,
            href: progress.chapterHref,
          });
          setCurrentChapter(chapter);
        }
        if (!progress?.chapterIdref && !progress?.chapterHref) {
          const snipeItems = epubService.getSpineItems();
          console.log({ snipeItems });
          const chapter = await epubService.getChapterContent({
            idref: snipeItems[0].idref,
            href: snipeItems[0].href,
          });
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
    ({
      chapterIdref,
      chapterHref,
      scrollPosition,
    }: {
      chapterIdref: string;
      chapterHref: string;
      scrollPosition: number;
    }) => {
      StorageService.saveProgress({
        bookId,
        chapterHref,
        chapterIdref,
        scrollPosition,
        lastReadDate: new Date().toISOString(),
      });
    },
    [bookId]
  );

  // Handle chapter change
  const handleChapterSelect = useCallback(
    async ({ href, idref }: { href: string; idref: string }) => {
      try {
        const chapter = await epubService.getChapterContent({ href, idref });
        setCurrentChapter(chapter);
        saveProgress({
          chapterIdref: idref,
          chapterHref: href,
          scrollPosition: 0,
        });
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
      if (!currentChapter?.idref) return;
      saveProgress({
        chapterIdref: currentChapter.idref,
        chapterHref: currentChapter.href,
        scrollPosition: scrollTop,
      });
    },
    [currentChapter?.idref, currentChapter?.href, saveProgress]
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
