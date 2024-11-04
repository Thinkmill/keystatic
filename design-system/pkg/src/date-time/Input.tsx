import { mergeProps, useObjectRef } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';
import { CSSProperties, DOMAttributes, ReactNode, forwardRef } from 'react';

import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';

type InputProps = {
  autoFocus?: boolean;
  children?: ReactNode;
  className?: string;
  disableFocusRing?: boolean;
  fieldProps?: DOMAttributes<HTMLElement>;
  isDisabled?: boolean;
  style?: CSSProperties;
  validationState?: 'valid' | 'invalid';
};

export const Input = forwardRef<HTMLDivElement, InputProps>(
  function Input(props, forwardedRef) {
    let inputRef = useObjectRef(forwardedRef);
    let {
      children,
      disableFocusRing,
      fieldProps,
      isDisabled,
      validationState,
    } = props;

    let { focusProps, isFocused } = useFocusRing({
      isTextInput: true,
      within: true,
    });

    let isInvalid = validationState === 'invalid' && !isDisabled;
    let styleProps = useInputStyles(props, {
      isDisabled,
      isInvalid,
      isFocused,
      // prefer focusring appearance, regardless of input modality. otherwise it looks like a read-only field
      isFocusVisible: isFocused && !disableFocusRing,
    });

    return (
      <div
        role="presentation"
        {...mergeProps(fieldProps, focusProps)}
        {...styleProps}
      >
        <div
          role="presentation"
          className={css({
            alignItems: 'center',
            display: 'inline-flex',
            height: '100%',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          })}
          ref={inputRef}
        >
          {children}
        </div>
      </div>
    );
  }
);

type InputState = {
  isDisabled?: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isInvalid: boolean;
};

function useInputStyles(props: InputProps, state: InputState) {
  let className = classNames(
    css({
      backgroundColor: tokenSchema.color.background.canvas,
      border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
      borderRadius: tokenSchema.size.radius.regular,
      cursor: 'text',
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

      '&[data-invalid]': {
        borderColor: tokenSchema.color.alias.borderInvalid,
      },
      '&[data-focused]': {
        borderColor: tokenSchema.color.alias.borderFocused,
        boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
      },
      // '&[data-focus-visible]': {
      //   boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
      // },
      '&[data-disabled]': {
        backgroundColor: tokenSchema.color.alias.backgroundDisabled,
        borderColor: 'transparent',
      },
    }),
    props.className
  );

  return {
    ...toDataAttributes(state, {
      omitFalsyValues: true,
      trimBooleanKeys: true,
    }),
    className,
    style: props.style,
  };
}
