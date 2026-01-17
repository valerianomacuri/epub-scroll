/**
 * Table of Contents Panel - Presentational Component
 * Single Responsibility: Display TOC navigation
 */

import React, { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
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
  expandedItems: Set<string>;
  onToggleExpand: (itemId: string) => void;
}

const TocItem = ({ 
  item, 
  level = 0, 
  selected, 
  onClick, 
  expandedItems,
  onToggleExpand 
}: TocItemProps) => {
  const hasChildren = item.subitems && item.subitems.length > 0;
  const isExpanded = expandedItems.has(item.id);
  const isSelected = selected(item);

  const handleClick = () => {
    if (hasChildren && level === 0) {
      onToggleExpand(item.id);
    }
    onClick(item);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(item.id);
  };

  return (
    <React.Fragment key={item.id}>
      <div
        className={`
          group cursor-pointer transition-all duration-200
          ${level === 0 ? 'py-3 px-4 border-b border-border/50' : 'py-2'}
          ${isSelected ? 'bg-primary/10 border-l-4 border-primary' : ''}
          hover:bg-accent/50
        `}
        style={{ 
          paddingLeft: level === 0 ? '16px' : `${16 + level * 24}px`,
          marginLeft: level > 0 ? '8px' : '0'
        }}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Icon for chapters vs subchapters */}
            {level === 0 ? (
              <BookOpen className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            ) : (
              <FileText className={`h-3 w-3 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            )}
            
            {/* Chapter/Section title */}
            <span className={`
              truncate
              ${level === 0 
                ? 'font-semibold text-base' 
                : 'font-normal text-sm text-muted-foreground'
              }
              ${isSelected ? 'text-primary' : ''}
            `}>
              {item.label}
            </span>
          </div>

          {/* Expand/Collapse icon for main chapters */}
          {hasChildren && (
            <button
              onClick={handleExpandClick}
              className="p-1 rounded-md hover:bg-accent transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded children */}
      {isExpanded && hasChildren && (
        <div className="bg-muted/20">
          {item.subitems?.map((subitem) => (
            <TocItem
              key={subitem.id}
              item={subitem}
              level={level + 1}
              selected={selected}
              onClick={onClick}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

export const TocPanel: React.FC<TocPanelProps> = ({
  open,
  onClose,
  toc,
  currentHref,
  onChapterSelect,
  bookTitle,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand current chapter and its parents
  const autoExpandedItems = useMemo(() => {
    const expanded = new Set(expandedItems);
    
    const findAndExpandParents = (items: TocItem[], targetHref: string): string[] => {
      for (const item of items) {
        if (item.href === targetHref) {
          return [item.id];
        }
        if (item.subitems) {
          const path = findAndExpandParents(item.subitems, targetHref);
          if (path.length > 0) {
            return [item.id, ...path];
          }
        }
      }
      return [];
    };

    const pathToCurrent = findAndExpandParents(toc, currentHref);
    pathToCurrent.forEach(id => expanded.add(id));
    
    return expanded;
  }, [toc, currentHref, expandedItems]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[22rem] p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Table of Contents
          </SheetTitle>
          {bookTitle && (
            <p className="text-sm text-muted-foreground truncate mt-1">
              {bookTitle}
            </p>
          )}
        </SheetHeader>
        
        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          {toc.length > 0 ? (
            toc.map((item, index) => (
              <TocItem
                key={item.id}
                item={item}
                level={0}
                selected={(item) => item.href === currentHref}
                onClick={(item) => {
                  onChapterSelect(item.href, index);
                  onClose();
                }}
                expandedItems={autoExpandedItems}
                onToggleExpand={handleToggleExpand}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <BookOpen className="h-8 w-8 mb-2" />
              <p className="text-sm">No table of contents available</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
