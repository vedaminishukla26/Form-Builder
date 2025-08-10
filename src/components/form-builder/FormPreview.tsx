import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  Checkbox,
  Button,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import { FormSchema, FormData, FormErrors } from '../../types/form.types';
import { validateField, validateForm, calculateDerivedValue } from '../../utils/validation';

interface FormPreviewProps {
  form: FormSchema | null;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }

    const field = form?.fields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [fieldId]: error || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    setIsSubmitting(true);
    const validationErrors = validateForm(form.fields, formData);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(error => error !== '');

    if (hasErrors) {
      setIsSubmitting(false);
      const firstErrorField = Object.keys(validationErrors).find(
        fieldId => validationErrors[fieldId] !== ''
      );
      if (firstErrorField) {
        const element = document.getElementById(`field-${firstErrorField}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        setFormData({});
        setErrors({});
      }, 1000);
    }
  };

  const renderField = (field: any) => {
    const value = field.isDerived
      ? calculateDerivedValue(field, formData)
      : (formData[field.id] || field.defaultValue || '');
    const error = errors[field.id];

    const commonProps = {
      id: `field-${field.id}`,
      fullWidth: true,
      label: field.label,
      error: !!error,
      helperText: error,
      required: field.required,
      disabled: field.isDerived,
      sx: { mb: 2 }
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={4}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps}>
            <Typography component="label" sx={{ mb: 1 }}>
              {field.label} {field.required && '*'}
            </Typography>
            <Select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              error={!!error}
            >
              {field.options?.map((option: string) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl {...commonProps}>
            <Typography component="legend" sx={{ mb: 1 }}>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option: string) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        const checkboxValue = Array.isArray(value) ? value : [];
        return (
          <FormControl {...commonProps}>
            <Typography component="legend" sx={{ mb: 1 }}>
              {field.label} {field.required && '*'}
            </Typography>
            {field.options?.map((option: string) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={checkboxValue.includes(option)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...checkboxValue, option]
                        : checkboxValue.filter((v: string) => v !== option);
                      handleFieldChange(field.id, newValue);
                    }}
                  />
                }
                label={option}
              />
            ))}
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          <Typography variant="h6">No Form to Preview</Typography>
          <Typography>Create a form first to see the preview</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Preview: {form.name}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {form.fields.map((field) => (
            <Box key={field.id}>
              {renderField(field)}
            </Box>
          ))}
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Form submitted successfully! 🎉
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FormPreview;
