/**
 * Storage Service - Single Responsibility Principle
 * Handle all localStorage operations
 */

import type { ReadingProgress, ReaderSettings } from '../types/epub.types';

const STORAGE_KEYS = {
  PROGRESS: 'epub_reader_progress',
  SETTINGS: 'epub_reader_settings',
} as const;

export class StorageService {
  /**
   * Save reading progress
   */
  static saveProgress(progress: ReadingProgress): void {
    try {
      const existing = this.getAllProgress();
      existing[progress.bookId] = progress;
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  }

  /**
   * Get reading progress for a book
   */
  static getProgress(bookId: string): ReadingProgress | null {
    try {
      const all = this.getAllProgress();
      return all[bookId] || null;
    } catch (error) {
      console.error('Failed to get reading progress:', error);
      return null;
    }
  }

  /**
   * Get all reading progress
   */
  private static getAllProgress(): Record<string, ReadingProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Save reader settings
   */
  static saveSettings(settings: ReaderSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Get reader settings
   */
  static getSettings(): ReaderSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to get settings:', error);
    }

    // Default settings
    return {
      fontSize: 18,
      theme: 'sepia',
      lineHeight: 1.6,
      fontFamily: 'Georgia, serif',
      align: 'left',
    };
  }

  /**
   * Clear all data
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
