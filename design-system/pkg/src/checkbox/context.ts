import { CheckboxGroupState } from '@react-stately/checkbox';
import { ValidationState } from '@react-types/shared';
import React from 'react';

export type CheckboxGroupContext = {
  validationState?: ValidationState;
  state: CheckboxGroupState;
};

export const CheckboxGroupContext =
  React.createContext<CheckboxGroupContext | null>(null);
