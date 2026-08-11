import { forwardRef, ForwardRefExoticComponent, Ref } from 'react';

import { TextFieldBase } from './TextFieldBase';
import { TextFieldProps } from './types';
import { validateTextFieldProps } from './validateTextFieldProps';

/** Text fields allow users to input text with a keyboard. */
export const TextField: ForwardRefExoticComponent<
  TextFieldProps & { ref?: Ref<HTMLInputElement> }
> = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, forwardedRef) {
    props = validateTextFieldProps(props);
    return <TextFieldBase ref={forwardedRef} {...props} />;
  }
);
