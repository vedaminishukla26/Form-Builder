import {
    TextFields as TextIcon,
    Numbers as NumberIcon,
    Subject as TextAreaIcon,
    ExpandMore as ExpandMoreIcon,
    RadioButtonChecked as RadioIcon,
    CheckBox as CheckboxIcon,
    DateRange as DateIcon,
  } from '@mui/icons-material';
  import { FieldType } from '../types/form.types';
  import { ReactElement } from 'react';
  
  export interface FieldTypeConfig {
    icon: ReactElement;
    label: string;
  }
  
  export const fieldTypeConfig: Record<FieldType, FieldTypeConfig> = {
    text: { icon: <TextIcon />, label: 'Text Input' },
    number: { icon: <NumberIcon />, label: 'Number Input' },
    textarea: { icon: <TextAreaIcon />, label: 'Text Area' },
    select: { icon: <ExpandMoreIcon />, label: 'Select Dropdown' },
    radio: { icon: <RadioIcon />, label: 'Radio Buttons' },
    checkbox: { icon: <CheckboxIcon />, label: 'Checkboxes' },
    date: { icon: <DateIcon />, label: 'Date Picker' }
  };