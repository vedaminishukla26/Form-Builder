import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { FormField, FormSchema, FieldType } from '../../types/form.types';
import { fieldTypeConfig } from '../../constants/fieldTypes';
import { saveForm } from '../../utils/storage';
import FieldConfiguration from './FieldConfiguration';

interface CreateFormProps {
  currentForm: FormSchema | null;
  onFormUpdate: (form: FormSchema) => void;
  isEditMode?: boolean;
}

const CreateForm: React.FC<CreateFormProps> = ({ currentForm, onFormUpdate, isEditMode = false }) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (isEditMode && currentForm) {
      setFields(currentForm.fields || []);
      setFormName(currentForm.name|| '');
    }
    else if (!isEditMode && !currentForm) {
      setFields([]);
      setFormName('');
    }
  }, [currentForm, isEditMode]);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: '',
      defaultValue: type === 'checkbox' ? false : '',
      validationRules: [],
      options: (type === 'select' || type === 'radio' || type === 'checkbox') ? [] : undefined
    };
    setFields(prev => [...prev, newField]);
  };

  const updateField = (fieldId: string, updatedField: FormField) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? updatedField : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setNotification({message: 'Please enter a form name', type: 'error'});
      return;
    }

    try {
      const form: FormSchema = {
        id: currentForm?.id || `form_${Date.now()}`,
        name: formName,
        fields,
        createdAt: currentForm?.createdAt || new Date().toISOString()
      };

      saveForm(form);
      onFormUpdate(form);
      setSaveDialogOpen(false);
      setNotification({message: 'Form saved successfully!', type: 'success'});
    } catch (error) {
      setNotification({message: 'Failed to save form. Please try again.', type: 'error'});
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Container maxWidth="lg">
      {notification && (
        <Alert severity={notification.type} sx={{ mb: 2 }} onClose={() => setNotification(null)}>
          {notification.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
        {isEditMode ? 'Edit Form' : 'Create New Form'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => setSaveDialogOpen(true)}
          disabled={fields.length === 0}
        >
          Save Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Field Types
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(fieldTypeConfig).map(([type, config]) => (
                <Button
                  key={type}
                  variant="outlined"
                  startIcon={config.icon}
                  onClick={() => addField(type as FieldType)}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {config.label}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box>
            {fields.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Start Building Your Form
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Click on any field type from the left panel to add it to your form
                </Typography>
              </Paper>
            ) : (
              <Box>
                {fields.map((field) => (
                  <FieldConfiguration
                    key={field.id}
                    field={field}
                    onUpdate={(updatedField) => updateField(field.id, updatedField)}
                    onDelete={() => deleteField(field.id)}
                    availableFields={fields}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            autoFocus
            margin="dense"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateForm;