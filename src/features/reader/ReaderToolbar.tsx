/**
 * Reader Toolbar - Presentational Component
 * Single Responsibility: Display reader controls
 */

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useScrollTrigger,
  Slide,
  Paper,
  Dialog,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Circle,
} from '@mui/icons-material';
import type { ReaderSettings } from '../../core/types/epub.types';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SEPIA = 'sepia',
}

interface HideOnScrollProps {
  children?: React.ReactElement<unknown>;
}

const HideOnScroll = (props: HideOnScrollProps) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    target: document.getElementById('epub-container-view'),
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
};

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

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuClick}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1, ml: 2, overflow: 'hidden' }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {bookTitle}
            </Typography>
          </Box>

          <IconButton color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon />
          </IconButton>

          <IconButton color="inherit" onClick={onHomeClick} edge="end">
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog
        keepMounted
        open={open}
        onClose={handleClose}
        sx={{ top: 0, left: 0 }}
        slotProps={{
          paper: {
            elevation: 1,
            sx: {
              width: 320,
              px: 3,
              py: 2,
              m: 1,
            },
            style: {
              position: 'absolute',
              top: 0,
              right: 0,
            },
          },
        }}
      >
        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel>Theme</FormLabel>
          <RadioGroup
            row
            value={settings.theme}
            onChange={(e) =>
              onSettingsChange({
                theme: e.target.value as ReaderSettings['theme'],
              })
            }
          >
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel value="sepia" control={<Radio />} label="Sepia" />
          </RadioGroup>
        </FormControl>
      </Dialog>
    </>
  );
};
