/**
 * Reader Toolbar - Presentational Component
 * Single Responsibility: Display reader controls
 */

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Menu,
  Settings,
  Home,
} from 'lucide-react';
import type { ReaderSettings } from '../../core/types/epub.types';

interface HideOnScrollProps {
  children?: React.ReactElement<unknown>;
}

interface ReaderToolbarProps {
  bookTitle: string;
  onMenuClick: () => void;
  onHomeClick: () => void;
  settings: ReaderSettings;
  onSettingsChange: (settings: Partial<ReaderSettings>) => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  bookTitle,
  onMenuClick,
  onHomeClick,
  settings,
  onSettingsChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleSettingsClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 ml-2 overflow-hidden">
            <h2 className="text-sm font-semibold truncate">
              {bookTitle}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onHomeClick}
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup
                value={settings.theme}
                onValueChange={(value) =>
                  onSettingsChange({
                    theme: value as ReaderSettings['theme'],
                  })
                }
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sepia" id="sepia" />
                  <Label htmlFor="sepia">Sepia</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
