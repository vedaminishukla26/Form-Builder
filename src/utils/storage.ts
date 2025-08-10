import { type FormSchema } from '../types/form.types';

const STORAGE_KEY = 'formBuilder_forms';

export const getStoredForms = (): FormSchema[] => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load forms from localStorage:', error);
    return [];
  }
};

export const saveForm = (form: FormSchema): void => {
  try {
    const forms = getStoredForms();
    const existingIndex = forms.findIndex(f => f.id === form.id);
    
    if (existingIndex >= 0) {
      forms[existingIndex] = form;
    } else {
      forms.push(form);
    }
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Failed to save form to localStorage:', error);
    throw new Error('Failed to save form. Please try again.');
  }
};

export const deleteFormById = (formId: string): void => {
  try {
    const forms = getStoredForms();
    const updatedForms = forms.filter(f => f.id !== formId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Failed to delete form from localStorage:', error);
    throw new Error('Failed to delete form. Please try again.');
  }
};

export const getFormById = (formId: string): FormSchema | null => {
  const forms = getStoredForms();
  return forms.find(f => f.id === formId) || null;
};