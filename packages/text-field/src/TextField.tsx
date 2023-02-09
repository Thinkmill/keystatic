import { useTextField } from '@react-aria/textfield';
import { useObjectRef } from '@react-aria/utils';
import { forwardRef } from 'react';

import { TextFieldPrimitive } from './TextFieldPrimitive';
import { TextFieldProps } from './types';
import { validateProps } from './validateProps';

/** Text fields allow users to input text with a keyboard. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, forwardedRef) {
    validateProps(props);
    let domRef = useObjectRef(forwardedRef);
    let { labelProps, inputProps, descriptionProps, errorMessageProps } =
      useTextField(props, domRef);

    return (
      <TextFieldPrimitive
        ref={domRef}
        {...props}
        labelProps={labelProps}
        inputProps={inputProps}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
      />
    );
  }
);
