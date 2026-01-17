/**
 * Reader Container - Container Component
 * Single Responsibility: Handle reader state and business logic
 * Follows Container/Presentation pattern
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
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

  // Calculate progress percentage
  const progress = useMemo(() => {
    if (!snipeItems || !currentSnipeItem) return 0;
    return ((currentSnipeItem.index + 1) / snipeItems.length) * 100;
  }, [snipeItems, currentSnipeItem]);

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
      <div className="flex items-center justify-center h-screen">
        <Progress value={undefined} className="w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Error loading book
        </h3>
        <p className="text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ReaderToolbar
        bookTitle={metadata?.title || 'Unknown Book'}
        onMenuClick={() => setTocOpen(true)}
        onHomeClick={onClose}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        progress={progress}
      />
      <div className="flex-1 overflow-hidden">
        {currentChapter && (
          <ChapterView
            initialScrollPosition={initialScrollPosition}
            href={currentChapter.href}
            content={currentChapter.content}
            footer={
              <div className="flex justify-center gap-12 max-w-2xl mx-auto p-4 md:p-6 pb-8 md:pb-12">
                <button
                  className="text-sm underline hover:no-underline text-foreground"
                  onClick={prevChapter}
                >
                  Prev page
                </button>
                <button
                  className="text-sm underline hover:no-underline text-foreground"
                  onClick={nextChapter}
                >
                  Next page
                </button>
              </div>
            }
            settings={settings}
            onScroll={handleScroll}
          />
        )}
      </div>

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
    </div>
  );
};
