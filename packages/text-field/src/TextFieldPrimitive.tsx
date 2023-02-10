import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';

import { FieldPrimitive } from '@voussoir/field';
import {
  FocusRing,
  classNames,
  css,
  tokenSchema,
  transition,
} from '@voussoir/style';

import { TextFieldPrimitiveProps } from './types';

type InputOrTextArea = HTMLInputElement | HTMLTextAreaElement;

/** Internal component for default appearance and behaviour. */
export const TextFieldPrimitive = forwardRef(function TextFieldPrimitive(
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
        // TODO: Needs review, feels hacky.
        // Captures events on itself, so _should_ only trigger when the press is
        // "through" (pointer-events: none) a start/end element.
        onPointerDown={e => {
          if (e.currentTarget === e.target) {
            inputRef?.current?.focus();
            e.preventDefault();
          }
        }}
        {...inputWrapperProps}
        className={classNames(
          css({
            display: 'flex',
            flex: '1 1 auto', // !!(isMultiline && props.height)
            position: 'relative',
            zIndex: 0,
          }),
          inputWrapperProps?.className
        )}
      >
        {startElement}
        <FocusRing autoFocus={autoFocus} isTextInput>
          <InputElement
            {...mergeProps(hoverProps, inputProps)}
            // FIXME: replace class variants with data attributes, for consistency.
            className={classNames(
              { isHovered, isMultiline },
              inputClassName,
              inputProps?.className
            )}
            data-adornment={getAdornmentType(props)}
            // @ts-ignore FIXME: not sure how to properly resolve this type
            ref={inputRef}
            rows={isMultiline ? 1 : undefined}
          />
        </FocusRing>
        <InputStateIndicator inputClassName={inputClassName} />
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
        inset: 0,
        position: 'absolute',
        transition: transition(['border-color', 'box-shadow']),
        zIndex: -1,

        [s('.isHovered')]: {
          borderColor: tokenSchema.color.alias.borderHovered,
        },
        // [s('[data-focus=visible]')]: {
        //   boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
        // },

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
          backgroundColor: tokenSchema.color.background.surfaceSecondary,
          borderColor: 'transparent',
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
    fontSize: tokenSchema.fontsize.text.regular.size,
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

    '&:disabled, &[aria-disabled]': {
      color: tokenSchema.color.alias.foregroundDisabled,
    },

    /* Remove the inner padding and cancel buttons for input[type="search"] in Chrome and Safari on macOS. */
    '&::-webkit-search-cancel-button, &::-webkit-search-decoration': {
      WebkitAppearance: 'none',
    },

    // TEXTAREA
    // ------------------------------

    '&.isMultiline': {
      height: 'auto',
      minHeight: tokenSchema.size.scale['700'],
      overflow: 'auto',
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
