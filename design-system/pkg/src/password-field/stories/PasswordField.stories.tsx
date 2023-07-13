import { chain } from '@react-aria/utils';
import { action } from '@keystar/ui-storybook';
import { useState } from 'react';

import { PasswordField, PasswordFieldProps } from '..';

export default {
  title: 'Components/PasswordField',
};

export const Default = () => render({});

Default.storyName = 'default';

export const Disabled = () => render({ isDisabled: true });

Disabled.storyName = 'disabled';

export const Readonly = () =>
  render({ defaultValue: 'keystar-ui', isReadOnly: true });

Readonly.storyName = 'readonly';

export const ErrorMessage = () =>
  render({ errorMessage: 'Some validation message.' });

ErrorMessage.storyName = 'errorMessage';

export const AutoFocus = () => render({ autoFocus: true });

AutoFocus.storyName = 'autoFocus';

export const HideRevealButton = () => render({ allowTextReveal: false });

HideRevealButton.storyName = 'allowTextReveal=false';

export const Required = () => render({ isRequired: true });

Required.storyName = 'required';

export const NoVisibleLabel = () => renderNoLabel({ 'aria-label': 'Password' });

NoVisibleLabel.storyName = 'no visible label';

export const ComplexLabel = () =>
  render({
    label: (
      <div>
        <strong>API</strong> key
      </div>
    ),
  });

ComplexLabel.storyName = 'complex label';

export const AriaLabelledby = () => (
  <>
    <label htmlFor="password-field" id="label">
      Password
    </label>
    {renderNoLabel({
      isRequired: true,
      id: 'password-field',
      'aria-labelledby': 'label',
    })}
  </>
);

AriaLabelledby.storyName = 'aria-labelledby';

export const WithDescriptionNoVisibleLabel = () =>
  renderNoLabel({
    'aria-label': 'Password',
    description: 'Please enter your password.',
  });

WithDescriptionNoVisibleLabel.storyName = 'with description, no visible label';

export const CustomWidth = () => render({ width: 'container.xsmall' });

CustomWidth.storyName = 'custom width';

export const CustomWidthNoVisibleLabel = () =>
  renderNoLabel({
    width: 'container.xsmall',
    isRequired: true,
    'aria-label': 'Width',
  });

CustomWidthNoVisibleLabel.storyName = 'custom width no visible label';

export const Controlled = () => <PasswordFieldControlled />;

Controlled.storyName = 'controlled';

export const FocusEvents = () =>
  render({
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
    onFocusChange: action('onFocusChange'),
    onKeyDown: action('onKeyDown'),
    onKeyUp: action('onKeyUp'),
  });

FocusEvents.storyName = 'focus events';

export const InputDomEvents = () =>
  render({
    onCopy: action('onCopy'),
    onCut: action('onCut'),
    onPaste: action('onPaste'),
    onCompositionStart: action('onCompositionStart'),
    onCompositionEnd: action('onCompositionEnd'),
    onCompositionUpdate: action('onCompositionUpdate'),
    onSelect: action('onSelect'),
    onBeforeInput: action('onBeforeInput'),
    onInput: action('onInput'),
  });

InputDomEvents.storyName = 'input dom events';

function render(props: PasswordFieldProps = {}) {
  return (
    <PasswordField
      onChange={action('onChange')}
      UNSAFE_className="custom_classname"
      label="Password"
      {...props}
    />
  );
}

function renderNoLabel(props: any = {}) {
  return (
    <PasswordField
      {...props}
      onChange={action('onChange')}
      UNSAFE_className="custom_classname"
    />
  );
}

function PasswordFieldControlled(props: PasswordFieldProps) {
  let [value, setValue] = useState('keystar-ui');
  return (
    <PasswordField
      {...props}
      value={value}
      onChange={chain(setValue, action('onChange'))}
      label="Password"
    />
  );
}
