import { RadioGroupState } from '@react-stately/radio';
import { ValidationState } from '@react-types/shared';
import React from 'react';

type RadioGroupContext = {
  validationState?: ValidationState;
  state: RadioGroupState;
};

export const RadioContext = React.createContext<RadioGroupContext | null>(null);

export function useRadioProvider(): RadioGroupContext {
  const context = React.useContext(RadioContext);
  if (!context) {
    throw new Error(
      'useRadioProvider must be used within a RadioGroupProvider'
    );
  }
  return context;
}
