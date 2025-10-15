/**
 * Table of Contents Panel - Presentational Component
 * Single Responsibility: Display TOC navigation
 */

import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { TocItem } from '../../core/types/epub.types';

interface TocPanelProps {
  open: boolean;
  onClose: () => void;
  toc: TocItem[];
  currentChapter: string;
  onChapterSelect: (href: string, index: number) => void;
  bookTitle?: string;
}

export const TocPanel: React.FC<TocPanelProps> = ({
  open,
  onClose,
  toc,
  currentChapter,
  onChapterSelect,
  bookTitle,
}) => {
  console.log({ currentChapter });
  const renderTocItem = (item: TocItem, index: number, level: number = 0) => (
    <React.Fragment key={item.id}>
      <ListItemButton
        selected={item.href === currentChapter}
        onClick={() => {
          console.log({ toc, currentChapter, item, index, level });
          onChapterSelect(item.href, index);
          onClose();
        }}
        sx={{ pl: 2 + level * 2 }}
      >
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            variant: level === 0 ? 'body1' : 'body2',
            fontWeight: item.href === currentChapter ? 600 : 400,
          }}
        />
      </ListItemButton>
      {item.subitems?.map((subitem, subIndex) =>
        renderTocItem(subitem, subIndex, level + 1)
      )}
    </React.Fragment>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      keepMounted
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '80%', sm: 320 },
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" noWrap>
          {bookTitle || 'Contents'}
        </Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List>{toc.map((item, index) => renderTocItem(item, index))}</List>
      </Box>
    </Drawer>
  );
};
