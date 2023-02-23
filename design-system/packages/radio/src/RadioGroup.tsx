import { useRadioGroup } from '@react-aria/radio';
import { useRadioGroupState } from '@react-stately/radio';
import React, { ForwardedRef } from 'react';

import { classNames, css, tokenSchema } from '@voussoir/style';
import { FieldPrimitive, validateFieldProps } from '@voussoir/field';
import { useProviderProps } from '@voussoir/core';

import { RadioContext } from './context';
import { RadioGroupProps } from './types';
import { toDataAttributes } from '@voussoir/utils';

function RadioGroup(
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
}

/**
 * Radio groups allow users to select a single option from a list of mutually exclusive options.
 * All possible options are exposed up front for users to compare.
 */
const _RadioGroup = React.forwardRef(RadioGroup);
export { _RadioGroup as RadioGroup };
