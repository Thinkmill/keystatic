import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, jest, afterEach } from '@jest/globals';

import { SearchField, SearchFieldProps } from '..';

let testId = 'test-id';
let inputText = 'Hello world';

function renderSearchField(
  props: Partial<SearchFieldProps> = {},
  ref?: React.RefObject<HTMLInputElement>
) {
  return render(
    <SearchField
      data-testid={testId}
      label="Field label"
      {...props}
      ref={ref}
    />
  );
}

describe('search-field/SearchField', () => {
  let onChange = jest.fn();
  let onFocus = jest.fn();
  let onSubmit = jest.fn();
  let onClear = jest.fn();

  afterEach(() => {
    onChange.mockClear();
    onFocus.mockClear();
    onSubmit.mockClear();
    onClear.mockClear();
  });

  it('renders basic elements correctly', () => {
    const { getByLabelText } = renderSearchField();
    expect(getByLabelText('Field label')).toHaveAttribute('type', 'search');
  });

  it('renders the clear button when there is text content', async () => {
    const { queryByLabelText, getByRole } = renderSearchField({
      defaultValue: inputText,
    });
    const field = getByRole('searchbox');

    expect(queryByLabelText('Clear search')).toBeTruthy();

    await userEvent.clear(field);
    expect(queryByLabelText('Clear search')).toBeNull();

    await userEvent.type(field, inputText);
    expect(queryByLabelText('Clear search')).toBeTruthy();
  });

  it('clears the value when the clear button is pressed', async () => {
    const { getByRole, getByTestId } = renderSearchField({
      defaultValue: inputText,
      onClear,
      onChange,
    });
    const field = getByTestId(testId);
    expect(field).toHaveValue(inputText);

    await userEvent.click(getByRole('button', { hidden: true }));
    expect(field).toHaveValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // FIXME: can't get this test to work
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('clears the value when the escape key is pressed', async () => {
  //   const { getByTestId } = renderSearchField({
  //     defaultValue: inputText,
  //     onClear,
  //     onChange,
  //   });
  //   const field = getByTestId(testId);
  //   expect(field).toHaveValue(inputText);

  //   await userEvent.type(field, '{esc}');
  //   expect(field).toHaveValue('');
  //   expect(onClear).toBeCalledTimes(1);
  //   expect(onChange).toBeCalledTimes(1);
  // });

  it('submits the value when enter is pressed', async () => {
    const { getByRole } = renderSearchField({
      defaultValue: inputText,
      onSubmit,
    });
    const field = getByRole('searchbox');

    await userEvent.type(field, '{enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith(inputText);

    await userEvent.clear(field);
    await userEvent.keyboard('{enter}');
    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(onSubmit).toHaveBeenLastCalledWith('');
  });
});
