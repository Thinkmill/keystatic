import { useRadioGroup } from '@react-aria/radio';
import { useRadioGroupState } from '@react-stately/radio';
import React, {
  ForwardRefExoticComponent,
  ForwardedRef,
  forwardRef,
} from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive, validateFieldProps } from '@keystar/ui/field';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';

import { RadioContext } from './context';
import { RadioGroupProps } from './types';

/**
 * Radio groups allow users to select a single option from a list of mutually
 * exclusive options.
 */
export const RadioGroup: ForwardRefExoticComponent<RadioGroupProps> =
  forwardRef(function RadioGroup(
    props: RadioGroupProps,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) {
    props = useProviderProps(props);
    props = validateFieldProps(props);
    let { validationState, children, orientation = 'vertical' } = props;

    let state = useRadioGroupState(props);
    let { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
      useRadioGroup(props, state);

    return (
      <FieldPrimitive
        {...props}
        ref={forwardedRef}
        labelProps={labelProps}
        labelElementType="span"
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
      >
        <div
          {...radioGroupProps}
          {...toDataAttributes({ orientation })}
          className={classNames(
            css({
              display: 'flex',
              gap: tokenSchema.size.space.large,

              '&[data-orientation="vertical"]': {
                flexDirection: 'column',
              },
            })
          )}
        >
          <RadioContext.Provider value={{ validationState, state }}>
            {children}
          </RadioContext.Provider>
        </div>
      </FieldPrimitive>
    );
  });
