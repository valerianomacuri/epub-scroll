/**
 * Reader Toolbar - Presentational Component
 * Single Responsibility: Display reader controls
 */

import React from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import type { ReaderSettings } from '../../core/types/epub.types';

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, p: 2 },
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

        {/* <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Font Size: {settings.fontSize}px</FormLabel>
          <Slider
            value={settings.fontSize}
            onChange={(_, value) =>
              onSettingsChange({ fontSize: value as number })
            }
            min={14}
            max={32}
            step={2}
            marks
            valueLabelDisplay="auto"
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel>Line Height: {settings.lineHeight}</FormLabel>
          <Slider
            value={settings.lineHeight}
            onChange={(_, value) =>
              onSettingsChange({ lineHeight: value as number })
            }
            min={1.2}
            max={2.4}
            step={0.1}
            marks
            valueLabelDisplay="auto"
          />
        </FormControl> */}
      </Menu>
    </>
  );
};
