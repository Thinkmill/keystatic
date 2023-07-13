import { useControlledState } from '@react-stately/utils';
import React from 'react';

import {
  PasswordFieldProps,
  PasswordFieldState,
  PasswordFieldType,
} from './types';

/**
 * Provides state management for a password field.
 */
export function usePasswordFieldState(
  props: PasswordFieldProps
): PasswordFieldState {
  let [value, setValue] = useControlledState(
    toString(props.value),
    toString(props.defaultValue) || '',
    props.onChange!
  );
  const [type, setType] = React.useState<PasswordFieldType>('password');

  const toggleType = React.useCallback(() => {
    setType(type => (type === 'password' ? 'text' : 'password'));
  }, []);

  return {
    value,
    setValue,
    type,
    setType,
    toggleType,
  };
}

function toString(val: any) {
  if (val == null) {
    return;
  }

  return val.toString();
}
