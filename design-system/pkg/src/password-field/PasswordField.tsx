import { useObjectRef } from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { ActionButton, ActionButtonProps } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { eyeIcon } from '@keystar/ui/icon/icons/eyeIcon';
import { eyeOffIcon } from '@keystar/ui/icon/icons/eyeOffIcon';
import { ClassList, css, tokenSchema } from '@keystar/ui/style';
import {
  TextFieldPrimitive,
  validateTextFieldProps,
} from '@keystar/ui/text-field';

import { PasswordFieldProps } from './types';
import { usePasswordField } from './usePasswordField';
import { usePasswordFieldState } from './usePasswordFieldState';

const classList = new ClassList('PasswordField', ['input']);

/**
 * Password fields are text fields for entering secure text.
 */
export const PasswordField: ForwardRefExoticComponent<
  PasswordFieldProps & { ref?: Ref<HTMLInputElement> }
> = forwardRef(function PasswordField(
  props: PasswordFieldProps,
  forwardedRef: ForwardedRef<HTMLInputElement>
) {
  props = validateTextFieldProps(props);
  let {
    description,
    allowTextReveal = true,
    isDisabled,
    isReadOnly,
    isRequired,
    label,
    ...styleProps
  } = props;

  let inputRef = useObjectRef(forwardedRef);
  let state = usePasswordFieldState(props);
  let {
    labelProps,
    inputProps,
    revealButtonProps,
    descriptionProps,
    errorMessageProps,
  } = usePasswordField(props, state, inputRef);

  return (
    <TextFieldPrimitive
      {...styleProps}
      label={label}
      description={description}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      labelProps={labelProps}
      ref={inputRef}
      inputProps={{
        ...inputProps,
        className: classList.element('input'),
      }}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      endElement={
        allowTextReveal && (
          <RevealButton
            isDisabled={isDisabled}
            secureTextEntry={state.secureTextEntry}
            {...revealButtonProps}
          />
        )
      }
    />
  );
});

/**
 * @private the reveal button is used to show and hide input text.
 */
export function RevealButton(
  props: ActionButtonProps & { secureTextEntry: boolean }
) {
  let { secureTextEntry, ...otherProps } = props;
  return (
    <ActionButton
      {...otherProps}
      UNSAFE_className={css({
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
        [`${classList.selector('input')}[aria-invalid] ~ &`]: {
          borderColor: tokenSchema.color.alias.borderInvalid,
        },

        [`${classList.selector('input')}[readonly] ~ &`]: {
          borderColor: tokenSchema.color.alias.borderIdle,
        },

        [`${classList.selector('input')}:focus ~ &`]: {
          borderColor: tokenSchema.color.alias.borderFocused,
        },
      })}
    >
      <Icon src={secureTextEntry ? eyeIcon : eyeOffIcon} />
    </ActionButton>
  );
}
