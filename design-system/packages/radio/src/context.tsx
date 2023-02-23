import { RadioGroupState } from '@react-stately/radio';
import { ValidationState } from '@react-types/shared';
import React, { useContext } from 'react';

interface RadioGroupContext {
  name?: string;
  validationState?: ValidationState;
  state: RadioGroupState;
}

export const RadioContext = React.createContext<RadioGroupContext | null>(null);

export function useRadioProvider(): RadioGroupContext {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error(
      'useRadioProvider must be used within a RadioGroupProvider'
    );
  }
  return context;
}
