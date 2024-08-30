import { useCheckboxGroup } from '@react-aria/checkbox';
import { useCheckboxGroupState } from '@react-stately/checkbox';
import React, {
  ForwardedRef,
  ForwardRefExoticComponent,
  forwardRef,
} from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive, validateFieldProps } from '@keystar/ui/field';
import { classNames, css, toDataAttributes } from '@keystar/ui/style';

import { CheckboxGroupContext } from './context';
import { CheckboxGroupProps } from './types';

/**
 * A checkbox group allows users to select one or more items from a list of
 * choices.
 */
export const CheckboxGroup: ForwardRefExoticComponent<CheckboxGroupProps> =
  forwardRef(function CheckboxGroup(
    props: CheckboxGroupProps,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) {
    props = useProviderProps(props);
    props = validateFieldProps(props);
    let { children, orientation = 'vertical', validationState } = props;
    let state = useCheckboxGroupState(props);
    let { labelProps, groupProps, descriptionProps, errorMessageProps } =
      useCheckboxGroup(props, state);

    return (
      <FieldPrimitive
        {...props}
        ref={forwardedRef}
        labelElementType="span"
        labelProps={labelProps}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        supplementRequiredState
      >
        <div
          {...groupProps}
          {...toDataAttributes({ orientation })}
          className={classNames(
            css({
              display: 'flex',

              '&[data-orientation="vertical"]': {
                flexDirection: 'column',
              },
            })
          )}
        >
          <CheckboxGroupContext.Provider value={{ validationState, state }}>
            {children}
          </CheckboxGroupContext.Provider>
        </div>
      </FieldPrimitive>
    );
  });
