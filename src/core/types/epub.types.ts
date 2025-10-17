/**
 * Core EPUB domain types
 * Following Single Responsibility Principle - each type has one clear purpose
 */

export interface EpubMetadata {
  title: string;
  creator: string;
  description?: string;
  language?: string;
  publisher?: string;
  pubdate?: string;
}

export interface TocItem {
  id: string;
  label: string;
  href: string;
  subitems?: TocItem[];
}

export interface ChapterContent {
  content: string;
  href: string;
}

export interface ReadingProgress {
  bookId: string;
  chapterHref: string;
  scrollPosition: number;
  lastReadDate: string;
}

export interface ReaderSettings {
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
  lineHeight: number;
  fontFamily: string;
  align: string;
}
