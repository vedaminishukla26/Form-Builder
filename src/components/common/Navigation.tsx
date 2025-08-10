import React from 'react';
import { Box, Container, Typography, Button, AppBar, Toolbar } from '@mui/material';
import {
  Add as AddIcon,
  Preview as PreviewIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface NavigationProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentRoute,
  onRouteChange
}) => {
  const routes = [
    { path: 'create', label: 'Create Form', icon: <AddIcon /> },
    { path: 'preview', label: 'Preview', icon: <PreviewIcon /> },
    { path: 'myforms', label: 'My Forms', icon: <VisibilityIcon /> }
  ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            upliance.ai Form Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {routes.map((route) => (
              <Button
                key={route.path}
                variant={currentRoute === route.path ? 'contained' : 'outlined'}
                startIcon={route.icon}
                onClick={() => onRouteChange(route.path)}
                size="small"
              >
                {route.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;