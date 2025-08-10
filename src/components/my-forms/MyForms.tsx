import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Preview as PreviewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { FormSchema } from '../../types/form.types';
import { getStoredForms, deleteFormById } from '../../utils/storage';
import { fieldTypeConfig } from '../../constants/fieldTypes';

interface MyFormsProps {
  onLoadForm: (form: FormSchema) => void;
  onRouteChange: (route: string) => void;
  onEditForm: (form: FormSchema) => void;
}

const MyForms: React.FC<MyFormsProps> = ({ onLoadForm, onRouteChange, onEditForm }) => {
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    setForms(getStoredForms());
  }, []);

  const handlePreviewForm = (form: FormSchema) => {
    onLoadForm(form);
    onRouteChange('preview');
  };

  const handleEditForm = (form: FormSchema) => {
    onEditForm(form);
  };

  const deleteForm = async (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        deleteFormById(formId);
        setForms(getStoredForms());
        setNotification({message: 'Form deleted successfully!', type: 'success'});
      } catch (error) {
        console.error('Failed to delete form:', error);
        setNotification({message: 'Failed to delete form!', type: 'error'});
      }
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (forms.length === 0) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h5" gutterBottom>
            No Forms Created Yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Start by creating your first form
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onRouteChange('create')}
          >
            Create Your First Form
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {notification && (
        <Alert severity={notification.type} sx={{ mb: 2 }} onClose={() => setNotification(null)}>
          {notification.message}
        </Alert>
      )}

      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        My Forms ({forms.length})
      </Typography>

      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} key={form.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {form.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`${form.fields.length} fields`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={form.fields.filter(f => f.isDerived).length > 0 ? 'Has derived fields' : 'Standard form'}
                    color={form.fields.filter(f => f.isDerived).length > 0 ? 'secondary' : 'default'}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Field Types:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.from(new Set(form.fields.map(f => f.type))).map(type => (
                      <Box key={type} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '0.75rem',
                        p: 0.5,
                        borderRadius: 1,
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        gap: 0.5
                      }}>
                        {fieldTypeConfig[type].icon}
                        <Typography variant="caption">
                          {fieldTypeConfig[type].label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Box>
                  <IconButton
                    onClick={() => handlePreviewForm(form)}
                    color="primary"
                    title="Preview Form"
                  >
                    <PreviewIcon />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => handleEditForm(form)}
                    color="secondary"
                    title="Edit Form"
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                
                <IconButton
                  onClick={() => deleteForm(form.id)}
                  color="error"
                  title="Delete Form"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onRouteChange('create')}
          size="large"
        >
          Create New Form
        </Button>
      </Box>
    </Container>
  );
};

export default MyForms;