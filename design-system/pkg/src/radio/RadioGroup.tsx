import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
} from 'react-aria-components/RadioGroup';
import { ForwardRefExoticComponent, ForwardedRef, forwardRef } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { validateFieldProps } from '@keystar/ui/field';
import {
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import { RadioGroupProps } from './types';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

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
      <AriaRadioGroup
        {...(filterStyleProps(otherProps) as AriaRadioGroupProps)}
        ref={forwardedRef}
        isInvalid={validationState === 'invalid' || Boolean(errorMessage)}
        isRequired={isRequired}
        orientation={orientation}
        className={classNames(fieldRootClassName, styleProps.className)}
        style={styleProps.style}
      >
        <FieldLabelElement
          contextualHelp={contextualHelp}
          isRequired={isRequired}
          label={label}
        />
        <FieldDescriptionElement>{description}</FieldDescriptionElement>
        <div
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
          {children}
        </div>
        <FieldErrorElement>{errorMessage}</FieldErrorElement>
      </AriaRadioGroup>
    );
  });
