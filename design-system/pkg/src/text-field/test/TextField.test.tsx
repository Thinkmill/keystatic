import React from 'react';
import { expect, it, describe, jest, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextField, TextFieldProps } from '..';
import { TestProvider } from '@keystar/ui/core';

let testId = 'test-id';
let inputText = 'Hello world';

function renderTextField(
  props: Partial<TextFieldProps> = {},
  ref?: React.RefObject<HTMLInputElement>
) {
  return render(
    <TextField data-testid={testId} label="Field label" {...props} ref={ref} />,
    { wrapper: TestProvider }
  );
}

describe('text-field/TextField', () => {
  let onBlur = jest.fn();
  let onChange = jest.fn();
  let onFocus = jest.fn();

  afterEach(() => {
    onChange.mockClear();
    onBlur.mockClear();
    onFocus.mockClear();
  });

  it('renders basic elements correctly', () => {
    const { getByLabelText } = renderTextField();
    expect(getByLabelText('Field label')).toHaveAttribute('type', 'text');
  });
  it('supports custom attributes', () => {
    const { getByDisplayValue } = renderTextField({
      name: 'foo',
      value: 'bar',
    });
    expect(getByDisplayValue('bar')).toHaveAttribute('name', 'foo');
  });
  it('supports a ref and data attributes', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { getByTestId } = renderTextField({}, ref);
    const field = getByTestId(testId);

    expect(ref.current).toBe(field);
  });
  it('should render with placeholder, but show warning', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { getByTestId } = renderTextField({ placeholder: inputText });
    const field = getByTestId(testId);

    expect(field).toHaveAttribute('placeholder', inputText);
    expect(console.warn).toHaveBeenCalledWith(
      'Warning: Placeholder text is not accessible. Use the `description` prop to provide information that will aid user input.'
    );

    spy.mockRestore();
  });

  it('calls onChange when text changes', async () => {
    const { getByRole } = renderTextField({ onBlur, onChange, onFocus });
    const field = getByRole('textbox');

    await userEvent.type(field, inputText);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(inputText);
    expect(onChange).toHaveBeenCalledTimes(inputText.length);

    await userEvent.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);

    await userEvent.tab({ shift: true });
    await userEvent.paste('foo');
    expect(onChange).toHaveBeenCalledWith('foo');
    expect(onChange).toHaveBeenCalledTimes(1 + inputText.length);
  });
});
