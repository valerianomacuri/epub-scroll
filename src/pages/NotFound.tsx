import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        href="/"
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default NotFound;
