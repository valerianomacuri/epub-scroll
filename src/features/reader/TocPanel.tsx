/**
 * Table of Contents Panel - Presentational Component
 * Single Responsibility: Display TOC navigation
 */

import React, { MouseEventHandler, useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tabs,
  Tab,
  AppBar,
} from '@mui/material';
import {
  Bookmark,
  Close as CloseIcon,
  Create,
  ExpandLess,
  ExpandMore,
  Toc,
} from '@mui/icons-material';
import type { TocItem } from '../../core/types/epub.types';

interface TocPanelProps {
  open: boolean;
  onClose: () => void;
  toc: TocItem[];
  currentChapter: string;
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

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <React.Fragment key={item.id}>
      <ListItemButton
        selected={selected(item)}
        onClick={() => onClick(item)}
        sx={{ pl: 2 + level * 2 }}
      >
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            variant: 'body2',
            fontWeight: selected ? 600 : 400,
          }}
        />
        {item.subitems.length > 0 &&
          (open ? (
            <IconButton onClick={handleClick}>
              <ExpandLess />
            </IconButton>
          ) : (
            <IconButton onClick={handleClick}>
              <ExpandMore />
            </IconButton>
          ))}
      </ListItemButton>
      {open &&
        item.subitems?.map((subitem, subIndex) => (
          // renderTocItem(subitem, subIndex, level + 1)
          <TocItem
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
  currentChapter,
  onChapterSelect,
}) => {
  console.log({ currentChapter, toc });
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
          padding: '0px !important',
        }}
      >
        <Box width={'100%'}>
          <Tabs aria-label="icon tabs" value="toc" variant="fullWidth">
            <Tab value="toc" icon={<Toc />} aria-label="table of content" />
            <Tab icon={<Create />} aria-label="highlighted" />
            <Tab icon={<Bookmark />} aria-label="markers" />
          </Tabs>
        </Box>
      </Toolbar>
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ marginLeft: '0px !important', padding: '0px' }}>
          {toc.map((item, index) => (
            <TocItem
              item={item}
              selected={(item) => item.href === currentChapter}
              onClick={(item) => {
                onChapterSelect(item.href, index);
                onClose();
              }}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
