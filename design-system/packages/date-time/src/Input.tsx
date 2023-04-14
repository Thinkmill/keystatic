import { mergeProps, mergeRefs } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';
import { ReactNode, forwardRef, useRef } from 'react';

import { classNames, css, tokenSchema } from '@voussoir/style';
import { toDataAttributes } from '@voussoir/utils';

const datepickerStyles = {};
const textfieldStyles = {};

type InputProps = {
  autoFocus?: boolean;
  isDisabled?: boolean;
  inputClassName?: string;
  validationState?: 'valid' | 'invalid';
  children?: ReactNode;
  fieldProps?: any;
  className?: string;
  style?: any;
  disableFocusRing?: boolean;
};

export const Input = forwardRef<HTMLDivElement, InputProps>(function Input(
  props,
  ref
) {
  let inputRef = useRef(null);
  let {
    isDisabled,
    inputClassName,
    validationState,
    children,
    fieldProps,
    className,
    style,
    disableFocusRing,
  } = props;

  let { focusProps, isFocusVisible, isFocused } = useFocusRing({
    isTextInput: true,
    within: true,
  });

  let isInvalid = validationState === 'invalid' && !isDisabled;
  let textfieldClass = classNames(
    textfieldStyles,
    'spectrum-Textfield',
    {
      'spectrum-Textfield--invalid': isInvalid,
      'spectrum-Textfield--valid': validationState === 'valid' && !isDisabled,
      'focus-ring': isFocusVisible && !disableFocusRing,
    },
    classNames(datepickerStyles, 'react-spectrum-Datepicker-field'),
    className
  );

  let inputStyles = useInputStyles(inputClassName, {
    isDisabled,
    isInvalid,
    isFocused,
    isFocusVisible: isFocusVisible && !disableFocusRing,
  });

  return (
    <div
      role="presentation"
      {...mergeProps(fieldProps, focusProps)}
      className={textfieldClass}
      style={style}
    >
      <div role="presentation" {...inputStyles}>
        <div
          role="presentation"
          className={css({
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          })}
          ref={mergeRefs(ref, inputRef)}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

type InputState = {
  isDisabled?: boolean;
  isInvalid: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
};
function useInputStyles(inputClassName: string | undefined, state: InputState) {
  let { isDisabled, isInvalid, isFocused, isFocusVisible } = state;
  let className = classNames(
    inputClassName,
    css({
      backgroundColor: tokenSchema.color.background.canvas,
      border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
      borderRadius: tokenSchema.size.radius.regular,
      height: tokenSchema.size.element.regular,
      lineHeight: tokenSchema.typography.lineheight.small,
      outline: 0,
      overflow: 'visible',
      paddingBlock: tokenSchema.size.space.small,
      paddingInline: tokenSchema.size.space.medium,
      position: 'relative',
      textIndent: 0,
      verticalAlign: 'top',

      minWidth: tokenSchema.size.scale[2000],
      width: '100%',

      '&[data-invalid=true]': {
        borderColor: tokenSchema.color.alias.borderInvalid,
      },
      '&[data-focus=true]': {
        borderColor: tokenSchema.color.alias.borderFocused,
        boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
      },
      '&[data-disabled=true]': {
        backgroundColor: tokenSchema.color.background.surfaceSecondary,
        borderColor: 'transparent',
      },
    })
  );

  return {
    ...toDataAttributes({
      disabled: isDisabled || undefined,
      invalid: isInvalid || undefined,
      focus: isFocusVisible ? 'visible' : isFocused || undefined,
    }),
    className,
  };
}
