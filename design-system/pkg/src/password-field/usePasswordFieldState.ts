import { useControlledState } from '@react-stately/utils';
import React from 'react';

import { PasswordFieldProps, PasswordFieldState } from './types';

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
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const toggleSecureTextEntry = React.useCallback(() => {
    setSecureTextEntry(isSecure => !isSecure);
  }, []);

  return {
    value,
    setValue,
    secureTextEntry,
    setSecureTextEntry,
    toggleSecureTextEntry,
  };
}

function toString(val: any) {
  if (val == null) {
    return;
  }

  return val.toString();
}
