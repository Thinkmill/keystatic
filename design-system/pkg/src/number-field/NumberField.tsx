import { useLocale } from '@react-aria/i18n';
import { useNumberField } from '@react-aria/numberfield';
import { filterDOMProps, useObjectRef } from '@react-aria/utils';
import { useNumberFieldState } from '@react-stately/numberfield';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { useProvider, useProviderProps } from '@keystar/ui/core';
import {
  css,
  onlyStyleProps,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';
import { TextFieldPrimitive } from '@keystar/ui/text-field';

import { StepButton } from './StepButton';
import { NumberFieldProps } from './types';

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
    hideStepper,
    isDisabled,
    isReadOnly,
    isRequired,
    label,
  } = props;

  let { locale } = useLocale();
  let state = useNumberFieldState({ ...props, locale });
  let inputRef = useObjectRef(forwardedRef);
  let {
    groupProps,
    labelProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
    descriptionProps,
    errorMessageProps,
  } = useNumberField(props, state, inputRef);
  let inputWrapperStyleProps = useInputWrapperStyleProps();

  return (
    <TextFieldPrimitive
      ref={inputRef}
      width="alias.singleLineWidth"
      {...filterDOMProps(props)}
      {...onlyStyleProps(props)}
      label={label}
      labelProps={labelProps}
      contextualHelp={contextualHelp}
      description={description}
      descriptionProps={descriptionProps}
      errorMessage={props.errorMessage}
      errorMessageProps={errorMessageProps}
      inputWrapperProps={{
        ...groupProps,
        ...inputWrapperStyleProps,
      }}
      inputProps={inputProps}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      // NOTE: step buttons must be a sibling of the `<input/>` AND after it
      // in the DOM, so we can respond to pseudo-classes.
      endElement={
        !hideStepper && (
          <>
            <StepButton direction="up" {...incrementButtonProps} />
            <StepButton direction="down" {...decrementButtonProps} />
          </>
        )
      }
    />
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
