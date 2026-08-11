import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
} from 'react-aria-components/NumberField';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react';

import { useProvider, useProviderProps } from '@keystar/ui/core';
import {
  css,
  classNames,
  filterStyleProps,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import { StepButton } from './StepButton';
import { NumberFieldProps } from './types';
import { TextFieldContent } from '../text-field/TextFieldBase';
import { fieldRootClassName } from '../field/FieldElements';

/**
 * Number fields let users enter a numeric value and incrementally increase or
 * decrease the value with a step-button control.
 */
export const NumberField: ForwardRefExoticComponent<
  NumberFieldProps & { ref?: Ref<HTMLInputElement> }
> = forwardRef(function NumberField(
  props: NumberFieldProps,
  forwardedRef: ForwardedRef<HTMLInputElement>
) {
  props = useProviderProps(props);
  let {
    contextualHelp,
    description,
    errorMessage,
    hideStepper,
    isRequired,
    label,
    labelElementType: _labelElementType,
    validationState,
    ...otherProps
  } = props;
  let inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => inputRef.current!);
  let inputWrapperStyleProps = useInputWrapperStyleProps();
  let styleProps = useStyleProps({ width: 'alias.singleLineWidth', ...props });

  return (
    <AriaNumberField
      {...(filterStyleProps(otherProps) as AriaNumberFieldProps)}
      isInvalid={validationState === 'invalid' || Boolean(errorMessage)}
      isRequired={isRequired}
      className={classNames(fieldRootClassName, styleProps.className)}
      style={styleProps.style}
    >
      <TextFieldContent
        contextualHelp={contextualHelp}
        description={description}
        endElement={
          !hideStepper && (
            <>
              <StepButton direction="up" />
              <StepButton direction="down" />
            </>
          )
        }
        errorMessage={errorMessage}
        inputRef={inputRef}
        inputWrapperClassName={inputWrapperStyleProps.className}
        inputWrapperElement="group"
        isRequired={isRequired}
        label={label}
      />
    </AriaNumberField>
  );
});

function useInputWrapperStyleProps() {
  let { scale } = useProvider();
  let className = css({
    display: 'grid',
    gap: tokenSchema.size.border.regular,
    gridTemplateColumns: `1fr calc(${tokenSchema.size.element.regular} - ${tokenSchema.size.border.regular} * 2) ${tokenSchema.size.border.regular}`,
    gridTemplateRows: `${tokenSchema.size.border.regular} auto auto ${tokenSchema.size.border.regular}`,
    gridTemplateAreas:
      '"field . ." "field increment ." "field decrement ." "field . ."',

    '&[data-scale="large"]': {
      gridTemplateColumns: `${tokenSchema.size.element.regular} 1fr ${tokenSchema.size.element.regular}`,
      gridTemplateRows: 'auto',
      gridTemplateAreas: '"decrement field increment"',
    },

    input: {
      gridArea: 'field',
    },
  });

  return { ...toDataAttributes({ scale }), className };
}
