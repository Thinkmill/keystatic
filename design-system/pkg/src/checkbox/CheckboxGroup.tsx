import {
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
} from 'react-aria-components/CheckboxGroup';
import { ForwardedRef, ForwardRefExoticComponent, forwardRef } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { validateFieldProps } from '@keystar/ui/field';
import {
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  useStyleProps,
} from '@keystar/ui/style';

import { CheckboxGroupProps } from './types';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

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
    let {
      children,
      contextualHelp,
      description,
      errorMessage,
      isRequired,
      label,
      orientation = 'vertical',
      validationState,
      ...otherProps
    } = props;
    let styleProps = useStyleProps(props);

    return (
      <AriaCheckboxGroup
        {...(filterStyleProps(otherProps) as AriaCheckboxGroupProps)}
        ref={forwardedRef}
        isInvalid={validationState === 'invalid' || Boolean(errorMessage)}
        isRequired={isRequired}
        className={classNames(fieldRootClassName, styleProps.className)}
        style={styleProps.style}
      >
        <FieldLabelElement
          contextualHelp={contextualHelp}
          isRequired={isRequired}
          label={label}
          supplementRequiredState
        />
        <FieldDescriptionElement>{description}</FieldDescriptionElement>
        <div
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
          {children}
        </div>
        <FieldErrorElement>{errorMessage}</FieldErrorElement>
      </AriaCheckboxGroup>
    );
  });
