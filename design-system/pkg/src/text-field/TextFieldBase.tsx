import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components/TextField';
import { Input as AriaInput } from 'react-aria-components/Input';
import { TextArea as AriaTextArea } from 'react-aria-components/TextArea';
import { Group as AriaGroup } from 'react-aria-components/Group';
import {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  RefObject,
  useImperativeHandle,
  useRef,
} from 'react';

import {
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { TextAreaProps, TextFieldProps } from './types';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

type InputOrTextArea = HTMLInputElement | HTMLTextAreaElement;
type TextFieldBaseProps = (TextFieldProps | TextAreaProps) & {
  endElement?: TextFieldProps['endElement'];
  inputClassName?: string;
  isMultiline?: boolean;
  startElement?: TextFieldProps['startElement'];
};

/** Shared RAC composition for text inputs and text areas. */
export const TextFieldBase = forwardRef(function TextFieldBase(
  props: TextFieldBaseProps,
  forwardedRef: ForwardedRef<InputOrTextArea>
) {
  let {
    contextualHelp,
    description,
    endElement,
    errorMessage,
    inputClassName,
    isMultiline = false,
    isRequired,
    label,
    labelElementType: _labelElementType,
    startElement,
    validationState,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(props);
  let inputRef = useRef<InputOrTextArea>(null);
  useImperativeHandle(forwardedRef, () => inputRef.current!);

  return (
    <AriaTextField
      {...(filterStyleProps(otherProps) as AriaTextFieldProps)}
      isInvalid={validationState === 'invalid' || Boolean(errorMessage)}
      isRequired={isRequired}
      className={classNames(fieldRootClassName, styleProps.className)}
      style={styleProps.style}
    >
      <TextFieldContent
        contextualHelp={contextualHelp}
        description={description}
        endElement={endElement}
        errorMessage={errorMessage}
        inputClassName={inputClassName}
        inputRef={inputRef}
        isMultiline={isMultiline}
        isRequired={isRequired}
        label={label}
        startElement={startElement}
      />
    </AriaTextField>
  );
});

type TextFieldContentProps = Pick<
  TextFieldProps,
  | 'contextualHelp'
  | 'description'
  | 'endElement'
  | 'errorMessage'
  | 'isRequired'
  | 'label'
  | 'startElement'
> & {
  inputClassName?: string;
  inputRef: RefObject<InputOrTextArea | null>;
  inputWrapperClassName?: string;
  inputWrapperElement?: 'div' | 'group';
  isMultiline?: boolean;
};

/** Presentational field contents that consume behavior from a surrounding RAC field root. */
export function TextFieldContent({
  contextualHelp,
  description,
  endElement,
  errorMessage,
  inputClassName: inputClassNameProp,
  inputRef,
  inputWrapperClassName,
  inputWrapperElement = 'div',
  isMultiline = false,
  isRequired,
  label,
  startElement,
}: TextFieldContentProps) {
  let inputClassName = classNames(useTextFieldStyles(), inputClassNameProp);
  let InputElement = isMultiline ? AriaTextArea : AriaInput;
  let WrapperElement = inputWrapperElement === 'group' ? AriaGroup : 'div';
  let adornment = getAdornmentType({ startElement, endElement });

  return (
    <>
      <FieldLabelElement
        contextualHelp={contextualHelp}
        isRequired={isRequired}
        label={label}
      />
      <FieldDescriptionElement>{description}</FieldDescriptionElement>
      <WrapperElement
        className={classNames(
          css({
            display: 'flex',
            flex: '1 1 auto',
            position: 'relative',
            zIndex: 0,
          }),
          inputWrapperClassName
        )}
        onPointerDown={event => {
          if (event.target === event.currentTarget) inputRef.current?.focus();
        }}
      >
        {startElement}
        <InputElement
          {...toDataAttributes({
            adornment,
            multiline: isMultiline || undefined,
          })}
          className={inputClassName}
          data-adornment={adornment}
          ref={inputRef as never}
          rows={isMultiline ? 1 : undefined}
        />
        <InputStateIndicator inputClassName={inputClassName} />
        {endElement}
      </WrapperElement>
      <FieldErrorElement>{errorMessage}</FieldErrorElement>
    </>
  );
}

function makeSiblingSelector(base: string) {
  return function siblingSelector(...selectors: string[]) {
    return selectors.map(selector => `.${base}${selector} + &`).join(', ');
  };
}

type InputStateIndicatorProps = {
  inputClassName: string;
} & HTMLAttributes<HTMLElement>;

const InputStateIndicator = ({
  inputClassName,
  ...props
}: InputStateIndicatorProps) => {
  let sibling = makeSiblingSelector(inputClassName);

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

        [sibling('[data-hovered]')]: {
          borderColor: tokenSchema.color.alias.borderHovered,
        },
        [sibling(':invalid', '[aria-invalid]', '[data-invalid]')]: {
          borderColor: tokenSchema.color.alias.borderInvalid,
        },
        [sibling(':focus')]: {
          borderColor: tokenSchema.color.alias.borderFocused,
        },
        [sibling(':focus:not([readonly])')]: {
          boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
        },
        [sibling(':disabled', '[aria-disabled]')]: {
          backgroundColor: tokenSchema.color.alias.backgroundDisabled,
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
    '&::-webkit-search-cancel-button, &::-webkit-search-decoration': {
      WebkitAppearance: 'none',
    },
    '&[data-multiline]': {
      height: 'auto',
      lineHeight: tokenSchema.typography.lineheight.medium,
      minHeight: `calc(${tokenSchema.size.space.regular} * 2 + ${tokenSchema.typography.text.regular.size} * ${tokenSchema.typography.lineheight.medium} * 3)`,
      overflow: 'auto',
      paddingBlock: tokenSchema.size.space.regular,
      resize: 'none',
    },
  });
}

function getAdornmentType(
  props: Pick<TextFieldBaseProps, 'startElement' | 'endElement'>
) {
  if (props.startElement && props.endElement) return 'both';
  if (props.startElement) return 'start';
  if (props.endElement) return 'end';
  return 'none';
}
