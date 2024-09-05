import { chain, useLayoutEffect, useObjectRef } from '@react-aria/utils';
import { useControlledState } from '@react-stately/utils';
import { forwardRef, useCallback } from 'react';

import { TextFieldPrimitive } from './TextFieldPrimitive';
import { TextAreaProps } from './types';
import { validateTextFieldProps } from './validateTextFieldProps';
import { useTextField } from '@react-aria/textfield';

/** Text areas allow users to input multiple lines of text with a keyboard. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ onChange, ...props }, forwardedRef) {
    props = validateTextFieldProps(props);
    let domRef = useObjectRef(forwardedRef);
    let [inputValue, setInputValue] = useControlledState(
      props.value,
      props.defaultValue ?? '',
      () => {}
    );

    let onHeightChange = useCallback(() => {
      let input = domRef.current;
      // Auto-grow unless an explicit height is set.
      if (!props.height && input) {
        let prevOverflow = input.style.overflow;
        // Firefox scroll position fix https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
        let isFirefox = 'MozAppearance' in input.style;
        if (!isFirefox) {
          // eslint-disable-next-line react-compiler/react-compiler
          input.style.overflow = 'hidden';
        }
        input.style.height = 'auto';
        // offsetHeight - clientHeight accounts for the border/padding.
        input.style.height = `${
          input.scrollHeight + (input.offsetHeight - input.clientHeight)
        }px`;
        input.style.overflow = prevOverflow;
      }
    }, [domRef, props.height]);

    useLayoutEffect(() => {
      if (domRef.current) {
        onHeightChange();
      }
    }, [onHeightChange, inputValue, domRef]);

    let { labelProps, inputProps, descriptionProps, errorMessageProps } =
      useTextField(
        {
          ...props,
          onChange: chain(onChange, setInputValue),
          inputElementType: 'textarea',
        },
        domRef
      );

    return (
      <TextFieldPrimitive
        {...props}
        ref={domRef}
        labelProps={labelProps}
        inputProps={inputProps}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        isMultiline
      />
    );
  }
);
