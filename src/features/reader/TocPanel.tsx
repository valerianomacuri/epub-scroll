/**
 * Table of Contents Panel - Presentational Component
 * Single Responsibility: Display TOC navigation
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import {
  Bookmark,
  PenTool,
  ChevronDown,
  ChevronUp,
  List,
} from 'lucide-react';
import type { TocItem } from '../../core/types/epub.types';

interface TocPanelProps {
  open: boolean;
  onClose: () => void;
  toc: TocItem[];
  currentHref: string;
  onChapterSelect: (href: string, index: number) => void;
  bookTitle?: string;
}

interface TocItemProps {
  item: TocItem;
  level?: number;
  selected: (item: TocItem) => boolean;
  onClick: (item: TocItem) => void;
}

const TocItem = ({ item, level = 0, selected, onClick }: TocItemProps) => {
  const [open, setOpen] = useState(false);

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <React.Fragment key={item.id}>
      <button
        className={`w-full text-left px-2 py-2 hover:bg-accent transition-colors ${
          selected(item) ? 'bg-accent text-accent-foreground' : 'text-foreground'
        } ${level > 0 ? `pl-${4 + level * 4}` : 'pl-2'}`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => onClick(item)}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              selected(item) ? 'font-semibold' : 'font-normal'
            }`}
          >
            {item.label}
          </span>
          {(item.subitems?.length || -1) > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleExpand}
            >
              {open ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </button>
      {open &&
        item.subitems?.map((subitem) => (
          <TocItem
            key={subitem.id}
            item={subitem}
            level={level + 1}
            selected={selected}
            onClick={onClick}
          />
        ))}
    </React.Fragment>
  );
};

export const TocPanel: React.FC<TocPanelProps> = ({
  open,
  onClose,
  toc,
  currentHref,
  onChapterSelect,
}) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 sm:w-80 p-0">
        <SheetHeader className="p-0">
          <Tabs defaultValue="toc" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="toc" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                TOC
              </TabsTrigger>
              <TabsTrigger value="highlights" disabled className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="bookmarks" disabled className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Marks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="toc" className="mt-0">
              <div className="h-[calc(100vh-60px)] overflow-auto">
                {toc.map((item, index) => (
                  <TocItem
                    key={item.id}
                    item={item}
                    selected={(item) => item.href === currentHref}
                    onClick={(item) => {
                      onChapterSelect(item.href, index);
                      onClose();
                    }}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
