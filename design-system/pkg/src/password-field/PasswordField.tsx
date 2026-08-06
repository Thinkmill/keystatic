import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useState,
} from 'react';

import { ActionButton, ActionButtonProps } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { eyeIcon } from '@keystar/ui/icon/icons/eyeIcon';
import { eyeOffIcon } from '@keystar/ui/icon/icons/eyeOffIcon';
import { ClassList, css, tokenSchema } from '@keystar/ui/style';
import { validateTextFieldProps } from '@keystar/ui/text-field';

import { PasswordFieldProps } from './types';
import localizedMessages from './l10n';
import { TextFieldBase } from '../text-field/TextFieldBase';

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
  let { allowTextReveal = true, isDisabled, ...otherProps } = props;
  let [secureTextEntry, setSecureTextEntry] = useState(true);
  let formatter = useLocalizedStringFormatter(localizedMessages);
  let fieldLabel =
    props['aria-label'] || (typeof props.label === 'string' ? props.label : '');

  return (
    <TextFieldBase
      {...otherProps}
      ref={forwardedRef}
      autoComplete={props.autoComplete ?? 'current-password'}
      inputClassName={classList.element('input')}
      isDisabled={isDisabled}
      type={secureTextEntry ? 'password' : 'text'}
      endElement={
        allowTextReveal && (
          <RevealButton
            isDisabled={isDisabled}
            secureTextEntry={secureTextEntry}
            aria-label={formatter.format('show', { fieldLabel }).trim()}
            aria-pressed={!secureTextEntry}
            onPress={() => setSecureTextEntry(isSecure => !isSecure)}
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
