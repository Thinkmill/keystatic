import { useTextField } from '@react-aria/textfield';
import { useObjectRef } from '@react-aria/utils';
import { forwardRef, ForwardRefExoticComponent, Ref } from 'react';

import { TextFieldPrimitive } from './TextFieldPrimitive';
import { TextFieldProps } from './types';
import { validateTextFieldProps } from './validateTextFieldProps';

/** Text fields allow users to input text with a keyboard. */
export const TextField: ForwardRefExoticComponent<
  TextFieldProps & { ref?: Ref<HTMLInputElement> }
> = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, forwardedRef) {
    props = validateTextFieldProps(props);
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
