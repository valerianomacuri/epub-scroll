/**
 * EPUB Service - Dependency Inversion Principle
 * Abstract away epub.js implementation details
 * Single Responsibility: Handle EPUB parsing and content extraction
 */

import ePub, { Book, NavItem } from 'epubjs';
import type {
  EpubMetadata,
  TocItem,
  ChapterContent,
} from '../types/epub.types';

export class EpubService {
  private book: Book | null = null;

  /**
   * Load EPUB from file
   * @param file - EPUB file from input
   */
  async loadFromFile(file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    this.book = ePub(arrayBuffer);
    await this.book.ready;
  }

  /**
   * Extract metadata from loaded book
   */
  async getMetadata(): Promise<EpubMetadata> {
    if (!this.book) throw new Error('Book not loaded');

    const metadata = await this.book.loaded.metadata;

    return {
      title: metadata.title || 'Unknown Title',
      creator: metadata.creator || 'Unknown Author',
      description: metadata.description,
      language: metadata.language,
      publisher: metadata.publisher,
      pubdate: metadata.pubdate,
    };
  }

  /**
   * Get table of contents
   */
  async getToc(): Promise<TocItem[]> {
    if (!this.book) throw new Error('Book not loaded');

    const navigation = await this.book.loaded.navigation;
    return this.mapNavItems(navigation.toc);
  }

  /**
   * Get chapter content by href
   */
  async getChapterContent(href: string): Promise<ChapterContent> {
    if (!this.book) throw new Error('Book not loaded');

    const section = this.book.spine.get(href);
    if (!section) throw new Error(`Chapter not found: ${href}`);

    const content = await section.render(this.book.load.bind(this.book));
    const htmlContent = content as string;
    return {
      id: section.idref || href,
      content: htmlContent,
      href,
    };
  }

  /**
   * Get all spine items (chapters in reading order)
   */
  getSpineItems(): Array<{ href: string; index: number }> {
    if (!this.book) throw new Error('Book not loaded');

    const items: Array<{ href: string; index: number }> = [];
    this.book.spine.each((item: any, index: number) => {
      items.push({ href: item.href, index });
    });
    return items;
  }

  /**
   * Destroy book instance and free memory
   */
  destroy(): void {
    if (this.book) {
      this.book.destroy();
      this.book = null;
    }
  }

  /**
   * Map epub.js NavItem to our TocItem type
   */
  private mapNavItems(items: NavItem[]): TocItem[] {
    return items.map((item) => ({
      id: item.id || item.href,
      label: item.label,
      href: item.href,
      subitems: item.subitems ? this.mapNavItems(item.subitems) : undefined,
    }));
  }
}
