export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
    value?: number | string;
    message: string;
  }
  
  export interface FormField {
    id: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
    label: string;
    defaultValue: string | number | boolean;
    validationRules: ValidationRule[];
    options?: string[]; 
    isDerived?: boolean;
    derivedFrom?: string[];
    derivedFormula?: string;
  }
  
  export interface FormSchema {
    id: string;
    name: string;
    fields: FormField[];
    createdAt: string;
  }
  
  export type FieldType = FormField['type'];
  
  export interface FormData {
    [fieldId: string]: any;
  }
  
  export interface FormErrors {
    [fieldId: string]: string;
  }