import {
  useLayoutEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { TextFieldBase } from './TextFieldBase';
import { TextAreaProps } from './types';
import { validateTextFieldProps } from './validateTextFieldProps';

/** Text areas allow users to input multiple lines of text with a keyboard. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ onChange, ...props }, forwardedRef) {
    props = validateTextFieldProps(props);
    let domRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(forwardedRef, () => domRef.current!);
    let [uncontrolledValue, setUncontrolledValue] = useState(
      props.defaultValue ?? ''
    );
    let inputValue = props.value ?? uncontrolledValue;

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

    return (
      <TextFieldBase
        {...props}
        ref={domRef}
        isMultiline
        onChange={value => {
          setUncontrolledValue(value);
          onChange?.(value);
        }}
      />
    );
  }
);
