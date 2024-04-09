import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useTextField } from '@react-aria/textfield';
import { useId } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { RefObject } from 'react';

import localizedMessages from './l10n';
import {
  PasswordFieldAria,
  PasswordFieldProps,
  PasswordFieldState,
} from './types';

/**
 * Provides the behavior and accessibility implementation for a password field.
 * @param props - Props for the password field.
 * @param state - State for the password field, as returned by `usePasswordFieldState`.
 * @param inputRef - A ref to the input element.
 */
export function usePasswordField(
  props: PasswordFieldProps,
  state: PasswordFieldState,
  inputRef: RefObject<HTMLInputElement>
): PasswordFieldAria {
  let { autoComplete = 'current-password', isDisabled } = props;

  let type = state.secureTextEntry ? 'password' : 'text';
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(
      {
        ...props,
        value: state.value,
        onChange: state.setValue,
        type,
        autoComplete,
      },
      inputRef
    );

  // Determine the label for the increment and decrement buttons. There are 4 cases:
  //
  // 1. With a visible label that is a string: aria-label: `Increase ${props.label}`
  // 2. With a visible label that is JSX: aria-label: 'Increase', aria-labelledby: '${revealButtonId} ${labelId}'
  // 3. With an aria-label: aria-label: `Increase ${props['aria-label']}`
  // 4. With an aria-labelledby: aria-label: 'Increase', aria-labelledby: `${revealButtonId} ${props['aria-labelledby']}`
  //
  // (1) and (2) could possibly be combined and both use aria-labelledby. However, placing the label in
  // the aria-label string rather than using aria-labelledby gives more flexibility to translators to change
  // the order or add additional words around the label if needed.
  let fieldLabel =
    props['aria-label'] || (typeof props.label === 'string' ? props.label : '');
  let ariaLabelledby: string | undefined;
  if (!fieldLabel) {
    ariaLabelledby =
      props.label != null ? labelProps.id : props['aria-labelledby'];
  }

  let formatter = useLocalizedStringFormatter(localizedMessages);
  let revealButtonId = useId();
  let revealButtonProps: AriaButtonProps = {
    'aria-label': formatter.format('show', { fieldLabel }).trim(),
    id: ariaLabelledby ? revealButtonId : undefined,
    'aria-labelledby': ariaLabelledby
      ? `${revealButtonId} ${ariaLabelledby}`
      : undefined,
    'aria-pressed': !state.secureTextEntry,
    isDisabled,
    onPress: state.toggleSecureTextEntry,
  };

  return {
    labelProps,
    inputProps,
    revealButtonProps,
    errorMessageProps,
    descriptionProps,
  };
}
