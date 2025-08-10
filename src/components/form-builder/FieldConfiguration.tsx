import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Button,
  Card,
  IconButton,
  Chip,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

import { type FormField, type ValidationRule } from '../../types/form.types';
import { fieldTypeConfig } from '../../constants/fieldTypes';

interface FieldConfigurationProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
  availableFields: FormField[];
}

const FieldConfiguration: React.FC<FieldConfigurationProps> = ({ 
  field, 
  onUpdate, 
  onDelete, 
  availableFields 
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const addValidationRule = (type: ValidationRule['type']) => {
    const newRule: ValidationRule = {
      type,
      message: `Please provide a valid ${type}`,
      ...(type === 'minLength' || type === 'maxLength' ? { value: 1 } : {})
    };
    handleFieldUpdate({
      validationRules: [...field.validationRules, newRule]
    });
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...field.validationRules];
    newRules[index] = { ...newRules[index], ...updates };
    handleFieldUpdate({ validationRules: newRules });
  };

  const removeValidationRule = (index: number) => {
    handleFieldUpdate({
      validationRules: field.validationRules.filter((_, i) => i !== index)
    });
  };

  return (
    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {fieldTypeConfig[field.type].icon}
            <Typography variant="h6">
              {field.label || `New ${fieldTypeConfig[field.type].label}`}
            </Typography>
            <Chip label={fieldTypeConfig[field.type].label} size="small" />
          </Box>
          <Box>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {expanded ? 'Collapse' : 'Configure'}
            </Button>
            <IconButton onClick={onDelete} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {expanded && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Field Label"
                  value={field.label}
                  onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.required}
                      onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                    />
                  }
                  label="Required Field"
                />
              </Grid>

              {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Options (comma-separated)"
                    value={field.options?.join(', ') || ''}
                    onChange={(e) => handleFieldUpdate({ 
                      options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                    })}
                    placeholder="Option 1, Option 2, Option 3"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.isDerived || false}
                      onChange={(e) => handleFieldUpdate({ isDerived: e.target.checked })}
                    />
                  }
                  label="Derived Field"
                />
              </Grid>

              {field.isDerived && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <FormLabel>Parent Fields</FormLabel>
                      <Select
                        multiple
                        value={field.derivedFrom || []}
                        onChange={(e) => handleFieldUpdate({ 
                          derivedFrom: typeof e.target.value === 'string' ? [e.target.value] : e.target.value 
                        })}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {availableFields
                          .filter(f => f.id !== field.id && !f.isDerived)
                          .map(f => (
                            <MenuItem key={f.id} value={f.id}>
                              {f.label}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Derivation Formula"
                      value={field.derivedFormula || ''}
                      onChange={(e) => handleFieldUpdate({ derivedFormula: e.target.value })}
                      placeholder="e.g., {field1} + {field2}"
                      size="small"
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Validation Rules
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {['required', 'minLength', 'maxLength', 'email', 'password'].map(type => (
                    <Button
                      key={type}
                      size="small"
                      variant="outlined"
                      onClick={() => addValidationRule(type as ValidationRule['type'])}
                      disabled={field.validationRules.some(rule => rule.type === type)}
                    >
                      Add {type}
                    </Button>
                  ))}
                </Box>

                {field.validationRules.map((rule, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    <Chip label={rule.type} size="small" />
                    {(rule.type === 'minLength' || rule.type === 'maxLength') && (
                      <TextField
                        type="number"
                        size="small"
                        value={rule.value || ''}
                        onChange={(e) => updateValidationRule(index, { value: parseInt(e.target.value) })}
                        sx={{ width: 80 }}
                      />
                    )}
                    <TextField
                      size="small"
                      placeholder="Error message"
                      value={rule.message}
                      onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => removeValidationRule(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Card>
  );
};

export default FieldConfiguration;