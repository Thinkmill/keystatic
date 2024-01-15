import React from 'react';
import { afterEach, expect, jest, describe, it } from '@jest/globals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextArea, TextAreaProps } from '..';

let testId = 'test-id';
let inputText = 'Hello world';

function renderTextArea(
  props: Partial<TextAreaProps> = {},
  ref?: React.RefObject<HTMLTextAreaElement>
) {
  return render(
    <TextArea data-testid={testId} label="Field label" {...props} ref={ref} />
  );
}

describe('text-field/TextArea', () => {
  let onBlur = jest.fn();
  let onChange = jest.fn();
  let onFocus = jest.fn();

  afterEach(() => {
    onChange.mockClear();
    onBlur.mockClear();
    onFocus.mockClear();
  });

  it('renders basic elements correctly', () => {
    const { getByLabelText } = renderTextArea();
    expect(getByLabelText('Field label')).not.toHaveAttribute('type', 'text');
  });
  it('supports custom attributes', () => {
    const { getByDisplayValue } = renderTextArea({
      name: 'foo',
      value: 'bar',
    });
    expect(getByDisplayValue('bar')).toHaveAttribute('name', 'foo');
  });
  it('supports a ref and data attributes', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const { getByTestId } = renderTextArea({}, ref);
    const field = getByTestId(testId);

    expect(ref.current).toBe(field);
  });

  it('calls onChange when text changes', async () => {
    const { getByRole } = renderTextArea({ onBlur, onChange, onFocus });
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
