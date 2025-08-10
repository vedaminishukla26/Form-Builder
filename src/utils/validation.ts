import { FormField, ValidationRule, FormData } from '../types/form.types';

export const validateField = (field: FormField, value: any): string | null => {
  for (const rule of field.validationRules) {
    const error = validateRule(rule, value);
    if (error) return error;
  }
  return null;
};

export const validateRule = (rule: ValidationRule, value: any): string | null => {
  switch (rule.type) {
    case 'required':
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return rule.message || 'This field is required';
      }
      break;
      
    case 'minLength':
      if (typeof value === 'string' && value.length < (rule.value as number)) {
        return rule.message || `Minimum ${rule.value} characters required`;
      }
      break;
      
    case 'maxLength':
      if (typeof value === 'string' && value.length > (rule.value as number)) {
        return rule.message || `Maximum ${rule.value} characters allowed`;
      }
      break;
      
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return rule.message || 'Please enter a valid email address';
      }
      break;
      
    case 'password':
      if (value) {
        const errors = [];
        
        if (value.length < 8) {
          errors.push('at least 8 characters');
        }
        
        if (!/[a-z]/.test(value)) {
          errors.push('one lowercase letter');
        }
        
        if (!/[A-Z]/.test(value)) {
          errors.push('one uppercase letter');
        }
        
        if (!/\d/.test(value)) {
          errors.push('one number');
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
          errors.push('one symbol');
        }
        
        if (errors.length > 0) {
          return rule.message || `Password must contain ${errors.join(', ')}`;
        }
      }
      break;
      
    default:
      return null;
  }
  return null;
};

export const validateForm = (fields: FormField[], formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  fields.forEach(field => {
    if (!field.isDerived) {
      const error = validateField(field, formData[field.id]);
      if (error) {
        errors[field.id] = error;
      }
    }
  });
  
  return errors;
};

export const calculateDerivedValue = (field: FormField, formData: FormData): string => {
  if (!field.isDerived || !field.derivedFormula || !field.derivedFrom) {
    return '';
  }

  let formula = field.derivedFormula;
  
  field.derivedFrom.forEach(parentId => {
    const parentValue = formData[parentId] || '';
    formula = formula.replace(new RegExp(`\\{${parentId}\\}`, 'g'), String(parentValue));
  });

  try {
    if (formula.includes('+')) {
      const parts = formula.split('+').map(p => parseFloat(p.trim()) || 0);
      return parts.reduce((a, b) => a + b, 0).toString();
    }
    if (formula.includes('-')) {
      const parts = formula.split('-').map(p => parseFloat(p.trim()) || 0);
      return parts.reduce((a, b) => a - b).toString();
    }
    if (formula.includes('*')) {
      const parts = formula.split('*').map(p => parseFloat(p.trim()) || 0);
      return parts.reduce((a, b) => a * b, 1).toString();
    }
    if (formula.includes('/')) {
      const parts = formula.split('/').map(p => parseFloat(p.trim()) || 0);
      return parts.reduce((a, b) => b !== 0 ? a / b : a).toString();
    }
    
    return formula;
  } catch (error) {
    console.error('Error calculating derived value:', error);
    return formula;
  }
};