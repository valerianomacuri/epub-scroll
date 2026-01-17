/**
 * Reader Toolbar - Presentational Component
 * Single Responsibility: Display reader controls
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Home,
  BookOpen,
} from 'lucide-react';
import type { ReaderSettings } from '../../core/types/epub.types';

interface ReaderToolbarProps {
  bookTitle: string;
  onMenuClick: () => void;
  onHomeClick: () => void;
  settings: ReaderSettings;
  onSettingsChange: (settings: Partial<ReaderSettings>) => void;
  progress?: number; // 0-100
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  bookTitle,
  onMenuClick,
  onHomeClick,
  settings,
  onSettingsChange,
  progress = 0,
}) => {
  return (
    <>
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="table of contents"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 mx-4 overflow-hidden">
            <h2 className="text-sm font-semibold truncate mb-1">
              {bookTitle}
            </h2>
            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onHomeClick}
            aria-label="home"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};
