import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FormSchema } from './types/form.types';
import Navigation from './components/common/Navigation';
import CreateForm from './components/form-builder/CreateForm';
import './styles/animations.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState('create');
  const [currentForm, setCurrentForm] = useState<FormSchema | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleRouteChange = (route: string) => {
    if (route === 'create' && !editMode) {
      setCurrentForm(null);
    }
    if (route !== 'create') {
        setEditMode(false);
      }
    setCurrentRoute(route);
  };

  const handleFormUpdate = (form: FormSchema) => {
    setCurrentForm(form);
  };

  const handleLoadForm = (form: FormSchema) => {
    setCurrentForm(form);
  };

  const handleEditForm = (form: FormSchema) => {
    setCurrentForm(form);
    setEditMode(true);
    setCurrentRoute('create');
  };

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'create':
        return (
          <CreateForm
            currentForm={currentForm}
            onFormUpdate={handleFormUpdate}
            isEditMode={editMode}
          />
        );
      default:
        return (
          <CreateForm
            currentForm={currentForm}
            onFormUpdate={handleFormUpdate}
            isEditMode={editMode}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navigation
          currentRoute={currentRoute}
          onRouteChange={handleRouteChange}
        />
        
        <Box sx={{ flex: 1, mt: '64px', }}>
          {renderCurrentRoute()}
        </Box>

        <Box
          component="footer"
          sx={{
            py: 2,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderTopColor: 'divider',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              Form Builder - Built for upliance.ai
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
