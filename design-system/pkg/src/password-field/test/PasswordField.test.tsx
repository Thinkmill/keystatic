import React from 'react';
import { jest, it, describe, expect, afterEach } from '@jest/globals';
import { renderWithProvider } from '#test-utils';
import userEvent from '@testing-library/user-event';

import { PasswordField, PasswordFieldProps } from '..';

let testId = 'test-id';
let inputText = 'Hello world';

function renderPasswordField(
  props: Partial<PasswordFieldProps> = {},
  ref?: React.RefObject<HTMLInputElement>
) {
  return renderWithProvider(
    <PasswordField data-testid={testId} label="Password" {...props} ref={ref} />
  );
}

describe('password-field/PasswordField', () => {
  let onChangeSpy = jest.fn();
  let user = userEvent.setup();

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  it('renders basic elements correctly', () => {
    let { getByLabelText } = renderPasswordField();
    let input = getByLabelText('Password');

    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
  });

  it('renders the reveal button', () => {
    let { getByLabelText } = renderPasswordField({
      defaultValue: inputText,
    });

    expect(getByLabelText('Show Password')).toBeVisible();
  });
  it('hides the reveal button when requested', () => {
    let { queryByLabelText } = renderPasswordField({
      defaultValue: inputText,
      allowTextReveal: false,
    });

    expect(queryByLabelText('Show Password')).toBeNull();
  });
  it('handles input change', async () => {
    let { getByTestId } = renderPasswordField({ onChange: onChangeSpy });

    let input = getByTestId(testId);
    await user.type(input, 'super secret');

    expect(onChangeSpy).toHaveBeenCalledWith('super secret');
  });
  it('toggles the input type on reveal button click', async () => {
    let { getByLabelText, getByTestId } = renderPasswordField({
      defaultValue: inputText,
    });
    let field = getByTestId(testId);
    let revealButton = getByLabelText('Show Password');

    expect(field).toHaveAttribute('type', 'password');
    expect(revealButton).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(revealButton);
    expect(field).toHaveAttribute('type', 'text');
    expect(revealButton).toHaveAttribute('aria-pressed', 'true');
  });
});
