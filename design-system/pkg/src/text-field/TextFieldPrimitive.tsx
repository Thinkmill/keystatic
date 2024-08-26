import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  Ref,
} from 'react';
import { useHover, usePress } from '@react-aria/interactions';
import { useObjectRef } from '@react-aria/utils';

import { FieldPrimitive } from '@keystar/ui/field';
import {
  FocusRing,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
} from '@keystar/ui/style';

import { TextFieldPrimitiveProps } from './types';

type InputOrTextArea = HTMLInputElement | HTMLTextAreaElement;

/** Internal component for default appearance and behaviour. */
export const TextFieldPrimitive: ForwardRefExoticComponent<
  TextFieldPrimitiveProps & { ref?: Ref<InputOrTextArea> }
> = forwardRef(function TextFieldPrimitive(
  props: TextFieldPrimitiveProps,
  forwardedRef: ForwardedRef<InputOrTextArea>
) {
  const {
    autoFocus,
    description,
    descriptionProps,
    endElement,
    errorMessage,
    errorMessageProps,
    id,
    inputProps,
    inputWrapperProps,
    isDisabled,
    isMultiline = false,
    isRequired,
    label,
    labelProps,
    startElement,
    ...otherProps
  } = props;
  const InputElement = isMultiline ? 'textarea' : 'input';
  let { hoverProps, isHovered } = useHover({ isDisabled });
  let inputClassName = useTextFieldStyles();
  let inputRef = useObjectRef(forwardedRef);

  // Sits behind everything, should only trigger when the press is "through"
  // (e.g. `pointer-events: none`) a start or end element.
  // NOTE: When CSS supports the `:has()` selector, we can detect interactive
  // children and automatically apply pointer-event styles.
  let onIndicatorPressStart = () => {
    if (document.activeElement === inputRef.current) {
      return;
    }

    inputRef.current?.focus();
  };
  let { pressProps } = usePress({
    isDisabled,
    onPressStart: onIndicatorPressStart,
    preventFocusOnPress: true,
  });

  return (
    <FieldPrimitive
      isRequired={isRequired}
      description={description}
      descriptionProps={descriptionProps}
      errorMessage={errorMessage}
      errorMessageProps={errorMessageProps}
      label={label}
      labelProps={labelProps}
      {...otherProps}
    >
      <div
        {...inputWrapperProps}
        {...hoverProps}
        className={classNames(
          css({
            display: 'flex',
            flex: '1 1 auto',
            position: 'relative',
            zIndex: 0,
          }),
          inputWrapperProps?.className
        )}
      >
        {startElement}
        <FocusRing autoFocus={autoFocus} isTextInput>
          <InputElement
            {...inputProps}
            {...toDataAttributes({
              adornment: getAdornmentType(props),
              hovered: isHovered || undefined,
              multiline: isMultiline || undefined,
            })}
            className={classNames(inputClassName, inputProps?.className)}
            data-adornment={getAdornmentType(props)}
            // @ts-ignore FIXME: not sure how to properly resolve this type
            ref={inputRef}
            rows={isMultiline ? 1 : undefined}
          />
        </FocusRing>
        <InputStateIndicator inputClassName={inputClassName} {...pressProps} />
        {endElement}
      </div>
    </FieldPrimitive>
  );
});

// Styled components
// ----------------------------------------------------------------------------

function makeSiblingSelector(base: string) {
  return function siblingSelector(...selectors: string[]) {
    return selectors.map(s => `.${base}${s} + &`).join(', ');
  };
}

type InputStateIndicatorProps = {
  inputClassName: string;
} & HTMLAttributes<HTMLElement>;
const InputStateIndicator = ({
  inputClassName,
  ...props
}: InputStateIndicatorProps) => {
  const s = makeSiblingSelector(inputClassName);

  return (
    <div
      role="presentation"
      {...props}
      className={css({
        backgroundColor: tokenSchema.color.background.canvas,
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
        borderRadius: tokenSchema.size.radius.regular,
        cursor: 'text',
        inset: 0,
        position: 'absolute',
        transition: transition(['border-color', 'box-shadow']),
        zIndex: -1,

        [s('[data-hovered]')]: {
          borderColor: tokenSchema.color.alias.borderHovered,
        },

        [s(':invalid', '[aria-invalid]')]: {
          borderColor: tokenSchema.color.alias.borderInvalid,
        },
        [s(':focus')]: {
          borderColor: tokenSchema.color.alias.borderFocused,
        },
        [s(':focus:not([readonly])')]: {
          boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
        },
        [s(':disabled', '[aria-disabled]')]: {
          backgroundColor: tokenSchema.color.alias.backgroundDisabled,
          // borderColor: tokenSchema.color.alias.borderDisabled,
          borderColor: 'transparent',
          cursor: 'auto',
        },
      })}
    />
  );
};

function useTextFieldStyles() {
  return css({
    color: tokenSchema.color.foreground.neutral,
    flex: 1,
    fontFamily: tokenSchema.typography.fontFamily.base,
    fontSize: tokenSchema.typography.text.regular.size,
    fontWeight: tokenSchema.typography.fontWeight.regular,
    height: tokenSchema.size.element.regular,
    lineHeight: tokenSchema.typography.lineheight.small,
    outline: 0,
    overflow: 'visible',
    paddingBlock: tokenSchema.size.space.small,
    paddingInline: tokenSchema.size.space.medium,
    position: 'relative',
    textIndent: 0,
    textOverflow: 'ellipsis',
    verticalAlign: 'top',
    width: '100%',
    MozOsxFontSmoothing: 'auto',
    WebkitFontSmoothing: 'auto',

    '::placeholder': {
      color: tokenSchema.color.foreground.neutralTertiary,
    },

    '&:disabled, &[aria-disabled]': {
      color: tokenSchema.color.alias.foregroundDisabled,
      '::placeholder': {
        color: tokenSchema.color.alias.foregroundDisabled,
      },
    },

    /* Remove the inner padding and cancel buttons for input[type="search"] in Chrome and Safari on macOS. */
    '&::-webkit-search-cancel-button, &::-webkit-search-decoration': {
      WebkitAppearance: 'none',
    },

    // TEXTAREA
    // ------------------------------

    '&[data-multiline]': {
      height: 'auto',
      lineHeight: tokenSchema.typography.lineheight.medium,
      // min: 3 lines
      minHeight: `calc(${tokenSchema.size.space.regular} * 2 + ${tokenSchema.typography.text.regular.size} * ${tokenSchema.typography.lineheight.medium} * 3)`,
      overflow: 'auto',
      paddingBlock: tokenSchema.size.space.regular,
      resize: 'none',
    },
  });
}

// Utils
// ----------------------------------------------------------------------------

function getAdornmentType(props: TextFieldPrimitiveProps) {
  if (props.startElement && props.endElement) {
    return 'both';
  } else if (props.startElement) {
    return 'start';
  } else if (props.endElement) {
    return 'end';
  }

  return 'none';
}
